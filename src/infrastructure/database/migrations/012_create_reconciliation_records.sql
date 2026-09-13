CREATE TYPE reconciliation_status AS ENUM (
    'ok',
    'mismatch'
);

CREATE TABLE reconciliation_records (
    id UUID PRIMARY KEY,
    run_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    scope TEXT NOT NULL,
    expected BIGINT NOT NULL,
    actual BIGINT NOT NULL,
    status reconciliation_status NOT NULL,
    notes TEXT
);

CREATE INDEX reconciliation_records_run_at_idx
    ON reconciliation_records(run_at);