CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE roles (
    id UUID     PRIMARY         KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(50)     NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at  TIMESTAMP       NOT NULL DEFAULT now(),
    updated_at  TIMESTAMP       NOT NULL DEFAULT now()
);

INSERT INTO roles (id, name, description, created_at, updated_at) VALUES
    (gen_random_uuid(), 'CAPTAIN', 'Capitão da equipe',     NOW(), NOW()),
    (gen_random_uuid(), 'MANAGER', 'Gestor de operação',    NOW(), NOW()),
    (gen_random_uuid(), 'LEADER',  'Líder de setor',        NOW(), NOW()),
    (gen_random_uuid(), 'MEMBER',  'Membro executor',       NOW(), NOW());