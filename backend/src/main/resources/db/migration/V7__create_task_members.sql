CREATE TABLE task_members (
    id         UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id    UUID      NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    user_id    UUID      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    
    CONSTRAINT uq_task_member UNIQUE (task_id, user_id)
);