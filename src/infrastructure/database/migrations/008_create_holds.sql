CREATE TYPE hold_status AS ENUM (
    'active',
    'released',
    'captured',
    'expired'
);

CREATE TABLE holds (
    id UUID PRIMARY KEY,
    account_id UUID NOT NULL,
    amount_minor BIGINT NOT NULL,
    status hold_status NOT NULL DEFAULT 'active',
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT holds_account_fk
        FOREIGN KEY (account_id)
        REFERENCES accounts(id),

    CONSTRAINT holds_amount_positive
        CHECK (amount_minor > 0)
);

CREATE INDEX holds_account_status_idx
    ON holds(account_id, status);