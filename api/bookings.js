const { sql, TIME, DATE, send, fail } = require('../lib/db');

function parse(body) {
  const b = body || {};
  const userId = parseInt(b.userId, 10), classId = parseInt(b.classId, 10);
  if (!Number.isInteger(userId) || !Number.isInteger(classId)) return null;
  if (!DATE.test(b.date || '') || !TIME.test(b.start || '') || !TIME.test(b.end || '')) return null;
  if (b.end <= b.start) return null;
  return { userId, classId, date: b.date, start: b.start, end: b.end };
}

// POST   /api/bookings            create
// PUT    /api/bookings?id=N       update
// DELETE /api/bookings?id=N       delete
// An overlapping booking on the same date is refused by the database itself (409).
module.exports = async (req, res) => {
  try {
    if (req.method === 'POST') {
      const b = parse(req.body);
      if (!b) return send(res, 400, { error: 'invalid booking' });
      const rows = await sql.query(
        'INSERT INTO lab_bookings (user_id, class_id, booking_date, start_time, end_time) VALUES ($1,$2,$3,$4,$5) RETURNING id::text AS id',
        [b.userId, b.classId, b.date, b.start, b.end]
      );
      return send(res, 201, rows[0]);
    }
    const id = parseInt(req.query.id, 10);
    if (!Number.isInteger(id)) return send(res, 400, { error: 'id required' });
    if (req.method === 'PUT') {
      const b = parse(req.body);
      if (!b) return send(res, 400, { error: 'invalid booking' });
      const rows = await sql.query(
        'UPDATE lab_bookings SET user_id=$1, class_id=$2, booking_date=$3, start_time=$4, end_time=$5 WHERE id=$6 RETURNING id::text AS id',
        [b.userId, b.classId, b.date, b.start, b.end, id]
      );
      return rows.length ? send(res, 200, rows[0]) : send(res, 404, { error: 'not found' });
    }
    if (req.method === 'DELETE') {
      await sql.query('DELETE FROM lab_bookings WHERE id=$1', [id]);
      return send(res, 200, { ok: true });
    }
    send(res, 405, { error: 'method not allowed' });
  } catch (e) { fail(res, e); }
};
