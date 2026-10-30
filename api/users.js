const { sql, clean, send, fail } = require('../lib/db');

// POST /api/users  { name }  ->  { id, name }   (creates, or returns the existing row)
module.exports = async (req, res) => {
  if (req.method !== 'POST') return send(res, 405, { error: 'method not allowed' });
  const name = clean(req.body && req.body.name);
  if (!name) return send(res, 400, { error: 'name required' });
  try {
    const rows = await sql.query(
      'INSERT INTO lab_users (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id::text AS id, name',
      [name]
    );
    send(res, 200, rows[0]);
  } catch (e) { fail(res, e); }
};
