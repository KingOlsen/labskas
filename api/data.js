const { sql, DATE, send, fail } = require('../lib/db');

// GET /api/data?from=YYYY-MM-DD  ->  { users, classes, bookings }
module.exports = async (req, res) => {
  if (req.method !== 'GET') return send(res, 405, { error: 'method not allowed' });
  const from = DATE.test(req.query.from || '') ? req.query.from : new Date().toISOString().slice(0, 10);
  try {
    const [users, classes, bookings] = await Promise.all([
      sql.query('SELECT id::text AS id, name FROM lab_users ORDER BY name'),
      sql.query('SELECT id::text AS id, name FROM lab_classes ORDER BY name'),
      sql.query(
        `SELECT b.id::text AS id,
                to_char(b.booking_date, 'YYYY-MM-DD') AS date,
                to_char(b.start_time, 'HH24:MI') AS start,
                to_char(b.end_time, 'HH24:MI') AS "end",
                u.id::text AS "userId", u.name AS "userName",
                c.id::text AS "classId", c.name AS "className"
           FROM lab_bookings b
           JOIN lab_users u ON u.id = b.user_id
           JOIN lab_classes c ON c.id = b.class_id
          WHERE b.booking_date >= $1
          ORDER BY b.booking_date, b.start_time`,
        [from]
      ),
    ]);
    send(res, 200, { users, classes, bookings });
  } catch (e) { fail(res, e); }
};
