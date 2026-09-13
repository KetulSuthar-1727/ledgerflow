CREATE TYPE transaction_type AS ENUM (
    'deposit',
    'withdrawal',
    'transfer',
    'capture',
    'refund',
    'adjustment'
);

CREATE TYPE transaction_status AS ENUM (
    'pending',
    'posted',
    'failed',
    'reversed'
);

CREATE TABLE transactions (
    id UUID PRIMARY KEY,
    type transaction_type NOT NULL,
    status transaction_status NOT NULL DEFAULT 'pending',
    reference TEXT,
    correlation_id UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);