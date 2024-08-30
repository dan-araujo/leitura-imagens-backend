CREATE TABLE IF NOT EXISTS measures (
    measure_uuid VARCHAR(255) PRIMARY KEY,
    customer_code VARCHAR(255) NOT NULL,
    measure_datetime DATETIME,
    measure_type VARCHAR(10),
    measure_value INT,
    image LONGTEXT,
    has_confirmed BOOLEAN DEFAULT FALSE
);