ALTER TABLE idempotency_keys
    ADD CONSTRAINT idempotency_key_not_empty
        CHECK (length(trim(key)) > 0),

    ADD CONSTRAINT idempotency_endpoint_not_empty
        CHECK (length(trim(endpoint)) > 0),

    ADD CONSTRAINT idempotency_fingerprint_not_empty
        CHECK (length(trim(request_fingerprint)) > 0),

    ADD CONSTRAINT idempotency_response_status_valid
        CHECK (
            response_status IS NULL
            OR response_status BETWEEN 100 AND 599
        );


ALTER TABLE outbox_events
    ADD CONSTRAINT outbox_aggregate_type_not_empty
        CHECK (length(trim(aggregate_type)) > 0),

    ADD CONSTRAINT outbox_event_type_not_empty
        CHECK (length(trim(event_type)) > 0);


ALTER TABLE users
    ADD CONSTRAINT users_email_not_empty
        CHECK (length(trim(email)) > 0);