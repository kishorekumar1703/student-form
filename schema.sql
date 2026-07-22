-- This runs automatically when the server starts (see server.js -> ensureTable()).
-- You don't need to run this manually, but it's here for reference
-- or in case you want to create the table yourself in a MySQL client.

CREATE TABLE IF NOT EXISTS students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  age INT NOT NULL,
  address VARCHAR(255) NOT NULL,
  email VARCHAR(150) NOT NULL,
  pin_code VARCHAR(20) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  hobbies VARCHAR(500),
  submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
