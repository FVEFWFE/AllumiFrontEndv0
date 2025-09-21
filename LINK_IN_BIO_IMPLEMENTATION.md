# Link-in-Bio Feature Implementation Plan

## Architecture Overview

### 1. Navigation Integration
Add to Sidebar.tsx after "Tracking Links":
```typescript
{
  href: '/dashboard/bio',
  label: 'Link in Bio',
  icon: Grid3x3, // or Link icon
  description: 'Bio page & links',
  badge: 'New'
}
```

### 2. Database Schema

```sql
-- Bio Pages table
CREATE TABLE bio_pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  slug VARCHAR(50) UNIQUE NOT NULL,
  title VARCHAR(100),
  bio TEXT,
  avatar_url TEXT,
  theme VARCHAR(20) DEFAULT 'dark',
  custom_css TEXT,
  is_active BOOLEAN DEFAULT true,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT slug_format CHECK (slug ~ '^[a-z0-9-]+$')
);

-- Bio Links table
CREATE TABLE bio_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id UUID REFERENCES bio_pages(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(100) NOT NULL,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  description TEXT,
  button_style VARCHAR(20) DEFAULT 'filled',
  position INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  clicks INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bio Link Clicks tracking
CREATE TABLE bio_link_clicks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  link_id UUID REFERENCES bio_links(id) ON DELETE CASCADE,
  page_id UUID REFERENCES bio_pages(id) ON DELETE CASCADE,
  clicked_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  country VARCHAR(2)
);

-- Indexes for performance
CREATE INDEX idx_bio_pages_slug ON bio_pages(slug);
CREATE INDEX idx_bio_pages_user_id ON bio_pages(user_id);
CREATE INDEX idx_bio_links_page_id ON bio_links(page_id);
CREATE INDEX idx_bio_links_position ON bio_links(page_id, position);
CREATE INDEX idx_bio_link_clicks_link_id ON bio_link_clicks(link_id);
```

### 3. File Structure

```
app/dashboard/bio/
├── page.tsx                 # Bio dashboard overview
├── edit/page.tsx            # Edit bio page details
└── links/page.tsx           # Manage bio links

app/[slug]/
└── page.tsx                 # Public bio page (allumi.to/username)

components/dashboard/bio/
├── BioPageEditor.tsx        # Main editor component
├── BioLinkCard.tsx          # Individual link card
├── BioPreview.tsx           # Live preview
├── ThemeSelector.tsx        # Theme customization
└── DragDropLinks.tsx        # Reorderable links

api/bio/
├── pages/route.ts           # CRUD for bio pages
├── links/route.ts           # CRUD for links
└── track/route.ts           # Click tracking
```

### 4. UI Components (Following Current Pattern)

#### Bio Dashboard Page (`/dashboard/bio/page.tsx`)
```tsx
'use client';

import { useState, useEffect } from 'react';
import { Plus, ExternalLink, Edit2, BarChart } from 'lucide-react';
import Link from 'next/link';

export default function BioDashboard() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Link in Bio</h1>
          <p className="text-muted-foreground">
            Create a beautiful bio page with all your important links
          </p>
        </div>
        <button className="bg-accent text-accent-foreground px-4 py-2 rounded-lg hover:bg-accent/90">
          <Plus className="w-4 h-4 mr-2 inline" />
          Create Bio Page
        </button>
      </div>

      {/* Stats Cards (matching current dashboard style) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="text-sm text-muted-foreground">Page Views</div>
          <div className="text-2xl font-bold">0</div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="text-sm text-muted-foreground">Link Clicks</div>
          <div className="text-2xl font-bold">0</div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="text-sm text-muted-foreground">CTR</div>
          <div className="text-2xl font-bold">0%</div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="text-sm text-muted-foreground">Active Links</div>
          <div className="text-2xl font-bold">0</div>
        </div>
      </div>

      {/* Bio Page Card */}
      <div className="bg-card border border-border rounded-lg p-6">
        {/* Content here */}
      </div>
    </div>
  );
}
```

### 5. API Endpoints

#### `/api/bio/pages/route.ts`
- GET: Fetch user's bio page
- POST: Create new bio page
- PUT: Update bio page
- DELETE: Delete bio page

#### `/api/bio/links/route.ts`
- GET: Fetch all links for a page
- POST: Add new link
- PUT: Update link (including position)
- DELETE: Remove link

#### `/api/bio/track/route.ts`
- POST: Track link click
- Adds UTM parameters automatically
- Records analytics data

### 6. Public Bio Page Features

#### Route: `allumi.to/[slug]`
- Mobile-first responsive design
- Automatic UTM parameter injection
- Click tracking with attribution
- Theme customization (dark/light/custom)
- SEO optimized meta tags
- Social media preview cards

### 7. Key Features to Match Current UX

1. **Consistent Navigation**: Add to existing sidebar
2. **Similar Layout**: Use same card/table patterns
3. **Action Buttons**: Copy link, edit, delete, preview
4. **Toast Notifications**: Success/error feedback
5. **Loading States**: Skeleton loaders
6. **Empty States**: Guide users to create first bio
7. **Mobile Responsive**: Works on all devices

### 8. Attribution Integration

Each bio link automatically:
- Adds UTM parameters: `utm_source=bio&utm_medium=social&utm_campaign=[username]`
- Tracks in existing attribution system
- Shows up in main analytics dashboard
- Links to conversion tracking

### 9. Implementation Order

1. **Phase 1: Database** (30 min)
   - Create tables
   - Add indexes
   - Test queries

2. **Phase 2: Basic CRUD** (1 hour)
   - API endpoints
   - Basic UI components
   - Create/edit bio page

3. **Phase 3: Link Management** (1 hour)
   - Add/edit/delete links
   - Drag-and-drop ordering
   - Link preview cards

4. **Phase 4: Public Page** (1 hour)
   - Public route setup
   - Mobile-optimized design
   - Click tracking

5. **Phase 5: Analytics** (30 min)
   - Click tracking
   - View analytics
   - Integration with main dashboard

### 10. Design Consistency

Follow existing patterns:
- **Colors**: Use `bg-card`, `border-border`, `text-muted-foreground`
- **Spacing**: `p-6` for pages, `p-4` for cards
- **Buttons**: `bg-accent` for primary, `hover:bg-muted` for secondary
- **Icons**: Lucide icons matching current set
- **Typography**: `text-2xl font-bold` for headers
- **Feedback**: Toast notifications for all actions

### 11. Example Bio Page URL Structure

```
allumi.to/janjen
├── Shows bio page with avatar, title, description
├── Lists all active links
├── Tracks every click
└── Redirects with UTM parameters
```

### 12. Mobile-First Design

```css
/* Bio page mobile layout */
.bio-container {
  max-width: 680px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.bio-link {
  display: block;
  width: 100%;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 0.5rem;
  transition: transform 0.2s;
}

.bio-link:hover {
  transform: translateY(-2px);
}
```

This implementation maintains consistency with the existing dashboard while adding powerful new functionality that directly ties into the attribution system.