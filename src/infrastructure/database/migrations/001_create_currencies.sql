CREATE TABLE currencies (
    code CHAR(3) PRIMARY KEY,
    minor_unit_precision SMALLINT NOT NULL,
    name TEXT NOT NULL,

    CONSTRAINT currencies_code_format
        CHECK (code ~ '^[A-Z]{3}$'),

    CONSTRAINT currencies_minor_unit_precision_valid
        CHECK (minor_unit_precision >= 0)
);