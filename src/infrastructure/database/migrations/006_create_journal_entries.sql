CREATE TYPE journal_entry_direction AS ENUM (
    'debit',
    'credit'
);

CREATE TABLE journal_entries (
    id UUID PRIMARY KEY,
    transaction_id UUID NOT NULL,
    account_id UUID NOT NULL,
    direction journal_entry_direction NOT NULL,
    amount_minor BIGINT NOT NULL,
    currency_code CHAR(3) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT journal_entries_transaction_fk
        FOREIGN KEY (transaction_id)
        REFERENCES transactions(id),

    CONSTRAINT journal_entries_account_fk
        FOREIGN KEY (account_id)
        REFERENCES accounts(id),

    CONSTRAINT journal_entries_currency_fk
        FOREIGN KEY (currency_code)
        REFERENCES currencies(code),

    CONSTRAINT journal_entries_amount_positive
        CHECK (amount_minor > 0)
);

CREATE INDEX journal_entries_account_created_idx
    ON journal_entries(account_id, created_at);

CREATE INDEX journal_entries_transaction_idx
    ON journal_entries(transaction_id);