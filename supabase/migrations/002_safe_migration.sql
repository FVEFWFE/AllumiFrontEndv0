-- Safe migration script that checks for existing tables

-- Enable extensions if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Drop existing tables if you want a fresh start (OPTIONAL - UNCOMMENT IF NEEDED)
-- DROP TABLE IF EXISTS whop_events CASCADE;
-- DROP TABLE IF EXISTS api_keys CASCADE;
-- DROP TABLE IF EXISTS attribution_reports CASCADE;
-- DROP TABLE IF EXISTS conversions CASCADE;
-- DROP TABLE IF EXISTS clicks CASCADE;
-- DROP TABLE IF EXISTS links CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;
-- DROP TABLE IF EXISTS identities CASCADE;

-- Check and create identities table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'identities') THEN
        CREATE TABLE identities (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            created_at TIMESTAMP DEFAULT NOW(),
            last_seen TIMESTAMP DEFAULT NOW(),
            emails TEXT[] DEFAULT '{}',
            phones TEXT[] DEFAULT '{}',
            device_fingerprints TEXT[] DEFAULT '{}',
            recipient_id TEXT UNIQUE,
            merged_with UUID REFERENCES identities(id),
            confidence_score FLOAT DEFAULT 1.0
        );

        CREATE INDEX idx_identities_emails ON identities USING GIN(emails);
        CREATE INDEX idx_identities_device_fingerprints ON identities USING GIN(device_fingerprints);
        CREATE INDEX idx_identities_recipient_id ON identities(recipient_id);
    END IF;
END $$;

-- Check and update users table (add missing columns if needed)
DO $$
BEGIN
    -- Add columns if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'whop_customer_id') THEN
        ALTER TABLE users ADD COLUMN whop_customer_id TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'skool_group_url') THEN
        ALTER TABLE users ADD COLUMN skool_group_url TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'zapier_webhook_url') THEN
        ALTER TABLE users ADD COLUMN zapier_webhook_url TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'subscription_status') THEN
        ALTER TABLE users ADD COLUMN subscription_status TEXT DEFAULT 'trial';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'subscription_plan') THEN
        ALTER TABLE users ADD COLUMN subscription_plan TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'trial_ends_at') THEN
        ALTER TABLE users ADD COLUMN trial_ends_at TIMESTAMP;
    END IF;
END $$;

-- Check and create links table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'links') THEN
        CREATE TABLE links (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            short_id TEXT UNIQUE NOT NULL,
            user_id UUID REFERENCES users(id) ON DELETE CASCADE,
            destination_url TEXT NOT NULL,
            campaign_name TEXT NOT NULL,
            recipient_id TEXT,
            utm_source TEXT,
            utm_medium TEXT,
            utm_campaign TEXT,
            clicks INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT NOW(),
            last_clicked_at TIMESTAMP,
            is_active BOOLEAN DEFAULT true
        );

        CREATE INDEX idx_links_short_id ON links(short_id);
        CREATE INDEX idx_links_user_id ON links(user_id);
    END IF;
END $$;

-- Check and create clicks table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'clicks') THEN
        CREATE TABLE clicks (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            link_id UUID REFERENCES links(id) ON DELETE CASCADE,
            identity_id UUID REFERENCES identities(id),
            user_id UUID REFERENCES users(id) ON DELETE CASCADE,
            campaign_name TEXT,
            recipient_id TEXT,
            utm_source TEXT,
            utm_medium TEXT,
            utm_campaign TEXT,
            ip_address TEXT,
            user_agent TEXT,
            device_fingerprint TEXT,
            referrer TEXT,
            clicked_at TIMESTAMP DEFAULT NOW()
        );

        CREATE INDEX idx_clicks_identity_id ON clicks(identity_id);
        CREATE INDEX idx_clicks_user_id ON clicks(user_id);
        CREATE INDEX idx_clicks_clicked_at ON clicks(clicked_at);
        CREATE INDEX idx_clicks_campaign_name ON clicks(campaign_name);
    END IF;
END $$;

-- Check and create conversions table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'conversions') THEN
        CREATE TABLE conversions (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            identity_id UUID REFERENCES identities(id),
            user_id UUID REFERENCES users(id) ON DELETE CASCADE,
            skool_email TEXT,
            skool_name TEXT,
            skool_group TEXT,
            membership_level TEXT,
            referral_source TEXT,
            joined_at TIMESTAMP,
            attribution_model TEXT DEFAULT 'time_decay',
            attribution_data JSONB,
            confidence_score FLOAT,
            revenue_tracked DECIMAL(10,2),
            ltv_estimate DECIMAL(10,2),
            created_at TIMESTAMP DEFAULT NOW()
        );

        CREATE INDEX idx_conversions_user_id ON conversions(user_id);
        CREATE INDEX idx_conversions_identity_id ON conversions(identity_id);
        CREATE INDEX idx_conversions_joined_at ON conversions(joined_at);
    END IF;
END $$;

-- Check and create attribution_reports table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'attribution_reports') THEN
        CREATE TABLE attribution_reports (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID REFERENCES users(id) ON DELETE CASCADE,
            report_date DATE NOT NULL,
            campaign_name TEXT,
            total_clicks INTEGER DEFAULT 0,
            total_conversions INTEGER DEFAULT 0,
            conversion_rate FLOAT,
            attributed_revenue DECIMAL(10,2),
            top_sources JSONB,
            created_at TIMESTAMP DEFAULT NOW(),
            UNIQUE(user_id, report_date, campaign_name)
        );

        CREATE INDEX idx_attribution_reports_user_id ON attribution_reports(user_id);
        CREATE INDEX idx_attribution_reports_report_date ON attribution_reports(report_date);
    END IF;
END $$;

-- Check and create api_keys table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'api_keys') THEN
        CREATE TABLE api_keys (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID REFERENCES users(id) ON DELETE CASCADE,
            key_hash TEXT UNIQUE NOT NULL,
            name TEXT,
            last_used_at TIMESTAMP,
            created_at TIMESTAMP DEFAULT NOW(),
            expires_at TIMESTAMP,
            is_active BOOLEAN DEFAULT true
        );
    END IF;
END $$;

-- Check and create whop_events table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'whop_events') THEN
        CREATE TABLE whop_events (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            event_id TEXT UNIQUE,
            event_type TEXT NOT NULL,
            customer_email TEXT,
            whop_customer_id TEXT,
            subscription_status TEXT,
            plan_id TEXT,
            affiliate_code TEXT,
            raw_data JSONB,
            processed_at TIMESTAMP DEFAULT NOW()
        );
    END IF;
END $$;

-- Enable RLS on tables (safe to run multiple times)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE links ENABLE ROW LEVEL SECURITY;
ALTER TABLE clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attribution_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Create or replace RLS policies (safe to run multiple times)
DROP POLICY IF EXISTS "Users can view own data" ON users;
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own data" ON users;
CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can view own links" ON links;
CREATE POLICY "Users can view own links" ON links
    FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own clicks" ON clicks;
CREATE POLICY "Users can view own clicks" ON clicks
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own conversions" ON conversions;
CREATE POLICY "Users can view own conversions" ON conversions
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own conversions" ON conversions;
CREATE POLICY "Users can manage own conversions" ON conversions
    FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own reports" ON attribution_reports;
CREATE POLICY "Users can view own reports" ON attribution_reports
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own API keys" ON api_keys;
CREATE POLICY "Users can manage own API keys" ON api_keys
    FOR ALL USING (auth.uid() = user_id);

-- Create or replace the analytics function
CREATE OR REPLACE FUNCTION get_campaign_stats(
    p_user_id UUID,
    p_start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
    p_end_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE(
    campaign_name TEXT,
    total_clicks BIGINT,
    unique_visitors BIGINT,
    total_conversions BIGINT,
    conversion_rate NUMERIC,
    attributed_revenue NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        c.campaign_name,
        COUNT(DISTINCT cl.id) as total_clicks,
        COUNT(DISTINCT cl.identity_id) as unique_visitors,
        COUNT(DISTINCT conv.id) as total_conversions,
        ROUND(
            CASE
                WHEN COUNT(DISTINCT cl.id) > 0
                THEN (COUNT(DISTINCT conv.id)::NUMERIC / COUNT(DISTINCT cl.id)::NUMERIC) * 100
                ELSE 0
            END, 2
        ) as conversion_rate,
        COALESCE(SUM(conv.revenue_tracked), 0) as attributed_revenue
    FROM clicks cl
    LEFT JOIN conversions conv ON cl.identity_id = conv.identity_id
        AND cl.user_id = conv.user_id
    WHERE cl.user_id = p_user_id
        AND cl.clicked_at::DATE BETWEEN p_start_date AND p_end_date
    GROUP BY c.campaign_name
    ORDER BY total_clicks DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Migration completed successfully!';
END $$;