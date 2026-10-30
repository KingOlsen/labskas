const { neon } = require('@neondatabase/serverless');

// DATABASE_URL is set in the Vercel project settings. Never put it in a file.
const sql = neon(process.env.DATABASE_URL);

const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

function clean(name) {
  return String(name || '').replace(/\s+/g, ' ').trim().slice(0, 60);
}

function send(res, status, body) {
  res.status(status).setHeader('Cache-Control', 'no-store').json(body);
}

function fail(res, err) {
  if (err && err.code === '23P01') return send(res, 409, { error: 'clash' });
  if (err && err.code === '23503') return send(res, 400, { error: 'unknown name or class' });
  console.error(err);
  return send(res, 500, { error: 'database error' });
}

module.exports = { sql, TIME, DATE, clean, send, fail };
