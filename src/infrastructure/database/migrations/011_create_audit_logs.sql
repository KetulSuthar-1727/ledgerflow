CREATE TABLE audit_logs (
    id UUID PRIMARY KEY,
    actor_type TEXT NOT NULL,
    actor_id UUID,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id UUID,
    before_state JSONB,
    after_state JSONB,
    correlation_id UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX audit_logs_resource_idx
    ON audit_logs(resource_type, resource_id);

CREATE INDEX audit_logs_actor_idx
    ON audit_logs(actor_type, actor_id);

CREATE INDEX audit_logs_created_idx
    ON audit_logs(created_at);