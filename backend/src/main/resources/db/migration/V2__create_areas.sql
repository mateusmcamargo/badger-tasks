CREATE TABLE areas (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR     NOT NULL UNIQUE,
    description VARCHAR,
    created_at  TIMESTAMP   NOT NULL,
    updated_at  TIMESTAMP   NOT NULL
);