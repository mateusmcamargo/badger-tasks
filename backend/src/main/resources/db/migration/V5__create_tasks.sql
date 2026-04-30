CREATE TABLE tasks (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR     NOT NULL,
    description VARCHAR,
    category_id UUID        NOT NULL REFERENCES categories(id),
    area_id     UUID        NOT NULL REFERENCES areas(id),
    leader_id   UUID        NOT NULL REFERENCES users(id),
    manager_id  UUID        NOT NULL REFERENCES users(id),
    status      VARCHAR     NOT NULL DEFAULT 'NOT_STARTED',
    active      BOOLEAN     NOT NULL DEFAULT TRUE,
    date_limit  TIMESTAMP,
    created_at  TIMESTAMP   NOT NULL,
    updated_at  TIMESTAMP   NOT NULL,

    CONSTRAINT chk_task_status
        CHECK (status IN ('NOT_STARTED', 'IN_PROGRESS', 'IN_REVISION', 'DONE'))
);