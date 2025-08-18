CREATE TABLE customer_wishlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL,
    product_id UUID NOT NULL,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(customer_id,
    product_id)
);