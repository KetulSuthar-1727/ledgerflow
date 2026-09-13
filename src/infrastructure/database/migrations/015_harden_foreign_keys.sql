ALTER TABLE journal_entries
    DROP CONSTRAINT journal_entries_transaction_fk,
    ADD CONSTRAINT journal_entries_transaction_fk
        FOREIGN KEY (transaction_id)
        REFERENCES transactions(id)
        ON DELETE RESTRICT;

ALTER TABLE journal_entries
    DROP CONSTRAINT journal_entries_account_fk,
    ADD CONSTRAINT journal_entries_account_fk
        FOREIGN KEY (account_id)
        REFERENCES accounts(id)
        ON DELETE RESTRICT;

ALTER TABLE journal_entries
    DROP CONSTRAINT journal_entries_currency_fk,
    ADD CONSTRAINT journal_entries_currency_fk
        FOREIGN KEY (currency_code)
        REFERENCES currencies(code)
        ON DELETE RESTRICT;

ALTER TABLE balances
    DROP CONSTRAINT balances_account_fk,
    ADD CONSTRAINT balances_account_fk
        FOREIGN KEY (account_id)
        REFERENCES accounts(id)
        ON DELETE RESTRICT;

ALTER TABLE holds
    DROP CONSTRAINT holds_account_fk,
    ADD CONSTRAINT holds_account_fk
        FOREIGN KEY (account_id)
        REFERENCES accounts(id)
        ON DELETE RESTRICT;