-- Already applied to the Neon project "lab-booking". Kept here for reference.
CREATE EXTENSION IF NOT EXISTS btree_gist;
CREATE TABLE IF NOT EXISTS lab_users   (id serial PRIMARY KEY, name text NOT NULL UNIQUE CHECK (length(name) BETWEEN 1 AND 60));
CREATE TABLE IF NOT EXISTS lab_classes (id serial PRIMARY KEY, name text NOT NULL UNIQUE CHECK (length(name) BETWEEN 1 AND 60));
CREATE TABLE IF NOT EXISTS lab_bookings (
  id serial PRIMARY KEY,
  user_id int NOT NULL REFERENCES lab_users(id),
  class_id int NOT NULL REFERENCES lab_classes(id),
  booking_date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (end_time > start_time),
  EXCLUDE USING gist (booking_date WITH =, tsrange(booking_date + start_time, booking_date + end_time) WITH &&)
);
CREATE INDEX IF NOT EXISTS lab_bookings_date_idx ON lab_bookings (booking_date);
