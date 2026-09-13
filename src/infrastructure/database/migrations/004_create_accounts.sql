CREATE TYPE account_owner_type AS ENUM (
    'user',
    'organization',
    'system'
);

CREATE TYPE account_type AS ENUM (
    'user_wallet',
    'merchant_revenue',
    'system_suspense',
    'system_fees',
    'system_external_source',
    'system_external_sink'
);

CREATE TYPE account_normal_balance AS ENUM (
    'debit',
    'credit'
);

CREATE TYPE account_status AS ENUM (
    'active',
    'frozen',
    'closed'
);

CREATE TABLE accounts (
    id UUID PRIMARY KEY,
    owner_type account_owner_type NOT NULL,
    owner_id UUID,
    currency_code CHAR(3) NOT NULL,
    account_type account_type NOT NULL,
    normal_balance account_normal_balance NOT NULL,
    status account_status NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT accounts_currency_fk
        FOREIGN KEY (currency_code)
        REFERENCES currencies(code),

    CONSTRAINT accounts_system_owner_check
        CHECK (
            (owner_type = 'system' AND owner_id IS NULL)
            OR
            (owner_type <> 'system' AND owner_id IS NOT NULL)
        )
);

CREATE INDEX accounts_owner_currency_idx
    ON accounts(owner_type, owner_id, currency_code);