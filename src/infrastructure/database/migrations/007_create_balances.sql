CREATE TABLE balances (
    account_id UUID PRIMARY KEY,
    balance_minor BIGINT NOT NULL DEFAULT 0,
    version BIGINT NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT balances_account_fk
        FOREIGN KEY (account_id)
        REFERENCES accounts(id),

    CONSTRAINT balances_version_nonnegative
        CHECK (version >= 0)
);