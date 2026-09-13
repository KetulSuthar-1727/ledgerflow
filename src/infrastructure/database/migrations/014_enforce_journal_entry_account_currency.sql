CREATE OR REPLACE FUNCTION validate_journal_entry_currency()
RETURNS TRIGGER AS $$
DECLARE
    account_currency CHAR(3);
BEGIN
    SELECT currency_code
    INTO account_currency
    FROM accounts
    WHERE id = NEW.account_id;

    IF account_currency IS NULL THEN
        RAISE EXCEPTION 'Account does not exist';
    END IF;

    IF account_currency <> NEW.currency_code THEN
        RAISE EXCEPTION 'Journal entry currency does not match account currency';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER journal_entry_currency_validation
BEFORE INSERT ON journal_entries
FOR EACH ROW
EXECUTE FUNCTION validate_journal_entry_currency();