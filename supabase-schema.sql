-- Ask In Bio Database Schema for Supabase
-- This SQL creates the complete database schema

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ThemePreset enum
CREATE TYPE theme_preset AS ENUM ('MINIMAL', 'COLORFUL', 'GRADIENT', 'NEON', 'PROFESSIONAL');

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR UNIQUE NOT NULL,
    display_name VARCHAR,
    bio TEXT,
    avatar VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Links table
CREATE TABLE IF NOT EXISTS links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR NOT NULL,
    url VARCHAR NOT NULL,
    description TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    active BOOLEAN NOT NULL DEFAULT true,
    clicks INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Themes table
CREATE TABLE IF NOT EXISTS themes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR NOT NULL,
    preset theme_preset NOT NULL DEFAULT 'MINIMAL',
    primary_color VARCHAR,
    background_color VARCHAR,
    font_family VARCHAR,
    custom_css TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Click events table
CREATE TABLE IF NOT EXISTS click_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    link_id UUID NOT NULL REFERENCES links(id) ON DELETE CASCADE,
    clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT,
    referer TEXT,
    country VARCHAR,
    city VARCHAR,
    device VARCHAR
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_links_user_id ON links(user_id);
CREATE INDEX IF NOT EXISTS idx_links_order ON links("order");
CREATE INDEX IF NOT EXISTS idx_links_active ON links(active);
CREATE INDEX IF NOT EXISTS idx_themes_user_id ON themes(user_id);
CREATE INDEX IF NOT EXISTS idx_click_events_link_id ON click_events(link_id);
CREATE INDEX IF NOT EXISTS idx_click_events_clicked_at ON click_events(clicked_at);

-- Insert sample data
INSERT INTO users (id, username, display_name, bio, avatar) VALUES
    ('550e8400-e29b-41d4-a716-446655440000', 'johndoe', 'John Doe', 'Full stack developer and tech enthusiast. Building the future one line of code at a time.', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400'),
    ('550e8400-e29b-41d4-a716-446655440001', 'demo', 'Demo User', 'This is a demo account showcasing Ask In Bio features.', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400')
ON CONFLICT (id) DO NOTHING;

INSERT INTO links (user_id, title, url, description, "order", active) VALUES
    ('550e8400-e29b-41d4-a716-446655440000', 'My Portfolio', 'https://johndoe.dev', 'Check out my latest projects and work', 0, true),
    ('550e8400-e29b-41d4-a716-446655440000', 'GitHub', 'https://github.com/johndoe', 'My open source contributions', 1, true),
    ('550e8400-e29b-41d4-a716-446655440000', 'Twitter', 'https://twitter.com/johndoe', 'Follow me for tech updates', 2, true),
    ('550e8400-e29b-41d4-a716-446655440000', 'LinkedIn', 'https://linkedin.com/in/johndoe', 'Professional network', 3, true),
    ('550e8400-e29b-41d4-a716-446655440001', 'Company Website', 'https://example.com', 'Our main website', 0, true),
    ('550e8400-e29b-41d4-a716-446655440001', 'Blog', 'https://blog.example.com', 'Latest articles and insights', 1, true),
    ('550e8400-e29b-41d4-a716-446655440001', 'YouTube', 'https://youtube.com/@demo', 'Video content', 2, false)
ON CONFLICT DO NOTHING;

INSERT INTO themes (user_id, name, preset, primary_color, background_color, font_family) VALUES
    ('550e8400-e29b-41d4-a716-446655440000', 'Dark Professional', 'PROFESSIONAL', '#3B82F6', '#1F2937', 'Inter'),
    ('550e8400-e29b-41d4-a716-446655440001', 'Colorful Gradient', 'GRADIENT', '#F59E0B', '#EC4899', 'Poppins')
ON CONFLICT DO NOTHING;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_links_updated_at ON links;
CREATE TRIGGER update_links_updated_at BEFORE UPDATE ON links FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_themes_updated_at ON themes;
CREATE TRIGGER update_themes_updated_at BEFORE UPDATE ON themes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Verify schema creation
SELECT 'Schema created successfully!' as status;