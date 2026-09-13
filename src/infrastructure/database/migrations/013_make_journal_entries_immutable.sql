REVOKE UPDATE, DELETE
ON journal_entries
FROM PUBLIC;

CREATE OR REPLACE FUNCTION prevent_journal_entry_modification()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'Journal entries are immutable';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER journal_entries_immutable
BEFORE UPDATE OR DELETE
ON journal_entries
FOR EACH ROW
EXECUTE FUNCTION prevent_journal_entry_modification();