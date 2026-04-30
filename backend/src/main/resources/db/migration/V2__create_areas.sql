CREATE TABLE areas (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR     NOT NULL UNIQUE,
    description VARCHAR,
    created_at  TIMESTAMP   NOT NULL,
    updated_at  TIMESTAMP   NOT NULL
);

INSERT INTO areas (id, name, description, created_at, updated_at) VALUES
    (gen_random_uuid(), 'AERODYNAMICS', 'Aerodinâmica',              NOW(), NOW()),
    (gen_random_uuid(), 'DYNAMICS',     'Dinâmica Veicular',         NOW(), NOW()),
    (gen_random_uuid(), 'TELEMETRY',    'Eletrônica e Telemetria',   NOW(), NOW()),
    (gen_random_uuid(), 'MARKETING',    'Marketing',                 NOW(), NOW()),
    (gen_random_uuid(), 'STRUCTURE',    'Estruturas',                NOW(), NOW());