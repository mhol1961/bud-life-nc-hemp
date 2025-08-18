CREATE TABLE newsletter_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    source VARCHAR(100),
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    unsubscribed_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'active',
    preferences JSONB DEFAULT '{}'
);