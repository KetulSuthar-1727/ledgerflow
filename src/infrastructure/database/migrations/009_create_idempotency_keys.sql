CREATE TYPE idempotency_status AS ENUM (
    'in_flight',
    'completed',
    'failed'
);

CREATE TABLE idempotency_keys (
    key TEXT NOT NULL,
    endpoint TEXT NOT NULL,
    request_fingerprint TEXT NOT NULL,
    status idempotency_status NOT NULL,
    response_body JSONB,
    response_status INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    PRIMARY KEY (key, endpoint)
);