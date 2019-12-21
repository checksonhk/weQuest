DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_digest VARCHAR(255) NOT NULL,
  email VARCHAR(355) UNIQUE NOT NULL,
  postal_code VARCHAR(10),
  latitude REAL,
  longtitude REAL
)