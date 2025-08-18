CREATE TABLE age_verification_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(255) NOT NULL,
    ip_address INET,
    user_agent TEXT,
    country_code VARCHAR(2),
    state_code VARCHAR(2),
    verification_method VARCHAR(50),
    verification_status VARCHAR(20) DEFAULT 'pending',
    verification_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '24 hours')
);