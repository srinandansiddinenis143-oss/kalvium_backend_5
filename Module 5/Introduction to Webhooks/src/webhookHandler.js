'use strict';

// Verifies, de-duplicates, and acknowledges incoming webhooks.
// Order matters: verify the signature first, then parse, then check idempotency,
// then respond 200 and process the event after the response has been sent.

const crypto = require('crypto');
const { handleEvent } = require('./eventHandlers');

const _processedIds = new Set();

function secret() {
  return process.env.WEBHOOK_SECRET || 'supersecretkey';
}

function isValidSignature(req) {
  const header = req.headers['x-webhook-signature'];
  if (!header || typeof header !== 'string' || !header.startsWith('sha256=')) return false;

  const received = header.slice('sha256='.length);
  const expected = crypto.createHmac('sha256', secret()).update(req.body).digest('hex');

  const a = Buffer.from(expected, 'hex');
  const b = Buffer.from(received, 'hex');
  // timingSafeEqual throws on length mismatch, so check lengths first.
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

async function handleWebhook(req, res) {
  // 1. Verify over the raw Buffer (express.raw() runs before JSON parsing).
  if (!isValidSignature(req)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  // 2. Parse only after the signature has been verified.
  let event;
  try {
    event = JSON.parse(req.body.toString('utf8'));
  } catch (err) {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  // 3. Idempotency: providers retry deliveries, so the same event id can arrive twice.
  if (_processedIds.has(event.id)) {
    return res.status(200).json({ status: 'already_processed' });
  }

  // 4. Mark before acknowledging so a concurrent retry is also caught.
  _processedIds.add(event.id);

  // 5. Acknowledge quickly, then do the slow work after the response is sent.
  res.status(200).json({ status: 'received' });
  setImmediate(() => {
    handleEvent(event).catch((err) => console.error('[webhook] handler failed:', err));
  });
}

module.exports = { handleWebhook, _processedIds };
