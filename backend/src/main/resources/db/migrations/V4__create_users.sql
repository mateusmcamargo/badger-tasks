CREATE TABLE users (
    id            UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
    name          VARCHAR   NOT NULL,
    ra            VARCHAR   NOT NULL UNIQUE,
    email         VARCHAR   NOT NULL UNIQUE,
    password_hash VARCHAR   NOT NULL,
    role_id       UUID      NOT NULL REFERENCES roles(id),
    area_id       UUID      NOT NULL REFERENCES areas(id),
    created_at    TIMESTAMP NOT NULL,
    updated_at    TIMESTAMP NOT NULL
);

CREATE UNIQUE INDEX uq_one_captain
    ON users (role_id)
    WHERE role_id = (SELECT id FROM roles WHERE name = 'CAPTAIN');