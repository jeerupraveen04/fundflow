# FundFlow Database Schema

**Last Updated:** November 15, 2025  
**Database Provider:** PostgreSQL  
**Authentication:** Supabase Auth or JWT  
**Environment:** Development & Production

---

## Table of Contents

1. [Overview](#overview)
2. [Collections & Documents](#collections--documents)
3. [Data Types & Constraints](#data-types--constraints)
4. [Relationships & Indexes](#relationships--indexes)
5. [Security Rules](#security-rules)
6. [Migration & Setup](#migration--setup)

---

## Overview

FundFlow uses PostgreSQL as its primary database. PostgreSQL is a relational SQL database that stores data in tables and rows. The project can use Supabase (managed Postgres + Auth + realtime) or any standard Postgres deployment. Authentication is handled via Supabase Auth or JWT-based tokens.

### Database Structure
- **Database Type:** Relational (SQL)
- **Provider:** PostgreSQL (self-hosted or Supabase)
- **Authentication:** Supabase Auth or JWT-based authentication
- **Real-time Capabilities:** Optional (Supabase Realtime, websockets, or pub/sub)
- **Scalability:** Managed or self-hosted scaling strategies (read replicas, connection pooling)

---

## Tables & Schemas

Below are recommended Postgres table definitions (DDL) and notes that map the previous Firestore collections to relational tables. These are suggested schemas — adjust types, constraints, and indexes to match your application needs.

### 1. users
Stores all user account information and profiles.

DDL (Postgres):
```sql
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  display_name text NOT NULL,
  first_name text,
  last_name text,
  avatar_url text,
  bio text,
  role text NOT NULL DEFAULT 'user', -- enum: user, creator, admin, superadmin
  is_verified boolean NOT NULL DEFAULT false,
  phone_number text,
  social_links jsonb,
  account_status text NOT NULL DEFAULT 'active', -- enum: active, inactive, suspended
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  last_login_at timestamptz,
  preferences jsonb
);

CREATE INDEX idx_users_role ON users (role);
CREATE INDEX idx_users_created_at ON users (created_at);
```

Notes:
- Use Supabase Auth (which manages its own users table) or map auth UIDs to this `users.id` column.
- `social_links` and `preferences` are stored as JSONB for flexibility.

---

### 2. campaigns
Stores all crowdfunding campaign information.

DDL:
```sql
CREATE TABLE campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE,
  description text NOT NULL,
  short_description text,
  category_id text NOT NULL,
  creator_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  creator_name text,
  creator_avatar_url text,
  funding_goal numeric(12,2) NOT NULL,
  current_amount numeric(12,2) NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'USD',
  image_url text,
  images jsonb,
  video_url text,
  start_date timestamptz,
  end_date timestamptz,
  status text NOT NULL DEFAULT 'draft', -- enum
  is_approved boolean NOT NULL DEFAULT false,
  approved_by uuid,
  approved_at timestamptz,
  total_donors integer NOT NULL DEFAULT 0,
  donation_count integer NOT NULL DEFAULT 0,
  view_count integer NOT NULL DEFAULT 0,
  updates_count integer NOT NULL DEFAULT 0,
  comments_count integer NOT NULL DEFAULT 0,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_campaigns_creator ON campaigns (creator_id);
CREATE INDEX idx_campaigns_category_status ON campaigns (category_id, status);
CREATE INDEX idx_campaigns_status_startdate ON campaigns (status, start_date DESC);
```

Notes:
- `images` and `metadata` are JSONB for multiple images/tags.

---

### 3. donations
Records all donations made to campaigns.

DDL:
```sql
CREATE TABLE donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  donor_id uuid REFERENCES users(id),
  amount numeric(12,2) NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  status text NOT NULL DEFAULT 'pending', -- pending|completed|failed|refunded
  payment_method text,
  transaction_id text,
  receipt_url text,
  donor_name text,
  donor_email text,
  is_anonymous boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  refunded_at timestamptz,
  message text,
  reward_tier text,
  metadata jsonb
);

CREATE INDEX idx_donations_campaign_status ON donations (campaign_id, status);
CREATE INDEX idx_donations_donor_created ON donations (donor_id, created_at DESC);
```

---

### 4. campaign_updates
Campaign updates and announcements.

DDL:
```sql
CREATE TABLE campaign_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  author_id uuid REFERENCES users(id),
  title text NOT NULL,
  content text NOT NULL,
  image_url text,
  like_count integer NOT NULL DEFAULT 0,
  comment_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz
);

CREATE INDEX idx_updates_campaign_created ON campaign_updates (campaign_id, created_at DESC);
```

---

### 5. campaign_comments
Comments on campaigns.

DDL:
```sql
CREATE TABLE campaign_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  author_id uuid REFERENCES users(id),
  author_name text,
  author_avatar_url text,
  content text NOT NULL,
  like_count integer NOT NULL DEFAULT 0,
  reply_count integer NOT NULL DEFAULT 0,
  is_edited boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz
);

CREATE INDEX idx_comments_campaign_created ON campaign_comments (campaign_id, created_at DESC);
```

---

### 6. categories
Reference data for campaign categories.

DDL:
```sql
CREATE TABLE categories (
  id text PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  icon text,
  color text,
  is_active boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  campaign_count integer NOT NULL DEFAULT 0,
  total_funded numeric(14,2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_categories_active_order ON categories (is_active, display_order);
```

---

### 7. admin_logs
Audit trail for administrative actions.

DDL:
```sql
CREATE TABLE admin_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES users(id),
  admin_email text,
  action text NOT NULL,
  target_type text,
  target_id text,
  details jsonb,
  changes jsonb,
  reason text,
  ip_address text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_adminlogs_admin ON admin_logs (admin_id);
CREATE INDEX idx_adminlogs_action ON admin_logs (action);
```

---

### 8. settings
Global platform configuration.

DDL:
```sql
CREATE TABLE settings (
  id text PRIMARY KEY,
  platform_name text,
  platform_description text,
  platform_fee_percentage numeric(5,2),
  minimum_donation numeric(12,2),
  maximum_donation numeric(12,2),
  features jsonb,
  payment_providers jsonb,
  notifications jsonb,
  updated_at timestamptz DEFAULT now(),
  updated_by uuid
);
```

---

#### Indexes:
- Primary: `settingId` (Document ID)

---


## Data Types & Constraints

### PostgreSQL Data Types (mapping)

| Logical Type | Postgres Type | Example |
|--------------|---------------|---------|
| String / Text | text | `\'Help Build Our Community Garden\'` |
| Integer / Small | integer, bigint | `5000` |
| Decimal / Money | numeric(12,2) | `99.99` |
| Boolean | boolean | `true` |
| Timestamp | timestamptz | `now()` |
| Array / List | jsonb | `['tag1','tag2']` stored as JSONB |
| Map / Object | jsonb | `{"twitter": "@username"}` |
| Reference / FK | uuid / foreign key | `REFERENCES users(id)` |
| GeoPoint | point / PostGIS (geometry) | `POINT(lon lat)` or PostGIS geometry |

Notes:
- Prefer `jsonb` for flexible nested data (images array, metadata, social links).
- Use `uuid` for primary keys or leverage Supabase auth UIDs (text/uuid) depending on your auth setup.

### Field Constraints (examples)

| Field | SQL Type | Required | Constraint |
|-------|----------|----------|------------|
| campaign.title | text | NOT NULL | CHECK (char_length(title) >= 5 AND char_length(title) <= 200)
| campaign.description | text | NOT NULL | CHECK (char_length(description) >= 20 AND char_length(description) <= 5000)
| campaign.funding_goal | numeric(12,2) | NOT NULL | CHECK (funding_goal > 0 AND funding_goal <= 1000000)
| campaign.current_amount | numeric(12,2) | NOT NULL DEFAULT 0 | CHECK (current_amount >= 0 AND current_amount <= funding_goal)
| users.email | text | NOT NULL UNIQUE | (use application-level or DB constraints + email validation)
| donation.amount | numeric(12,2) | NOT NULL | CHECK (amount >= 1 AND amount <= 100000)
| users.role | text | NOT NULL DEFAULT 'user' | (enforce with CHECK or a Postgres enum)
| campaigns.status | text | NOT NULL DEFAULT 'draft' | (use CHECK or enum for allowed statuses)
| donations.status | text | NOT NULL DEFAULT 'pending' | (use CHECK or enum)


---

## Relationships & Indexes

### Document Relationships

```
Users
├── 1 → M: Campaigns (creatorId)
├── 1 → M: Donations (donorId)
└── 1 → M: AdminLogs (adminId)

Campaigns
├── N → 1: Users (creatorId)
├── 1 → M: Donations (campaignId)
├── 1 → M: Updates (campaignId)
├── 1 → M: Comments (campaignId)
└── N → 1: Categories (category)

Donations
├── N → 1: Users (donorId)
├── N → 1: Campaigns (campaignId)
└── 0 → 1: AdminLogs (related)

Categories
└── 1 → M: Campaigns (category)
```

### Query Patterns & Recommended Indexes

#### 1. **Trending Campaigns**
```
Query: campaigns
  .where("status", "==", "active")
  .orderBy("startDate", "desc")
  .limit(10)

Indexes: {status, startDate}
```

#### 2. **User's Campaigns**
```
Query: campaigns
  .where("creatorId", "==", userId)
  .orderBy("createdAt", "desc")

Indexes: {creatorId, createdAt}
```

#### 3. **Campaigns by Category**
```
Query: campaigns
  .where("category", "==", "Technology")
  .where("status", "==", "active")
  .orderBy("currentAmount", "desc")

Indexes: {category, status, currentAmount}
```

#### 4. **Donor's Donation History**
```
Query: donations
  .where("donorId", "==", userId)
  .orderBy("createdAt", "desc")

Indexes: {donorId, createdAt}
```

#### 5. **Campaign Donations**
```
Query: donations
  .where("campaignId", "==", campaignId)
  .where("status", "==", "completed")

Indexes: {campaignId, status}
```

#### 6. **Campaign Revenue Summary**
```
Query: donations
  .where("campaignId", "==", campaignId)
  .where("status", "==", "completed")

Aggregation: SUM(amount)
```

---

## Security (Supabase / Postgres)

When using Supabase or another Postgres + JWT provider, use Row Level Security (RLS) policies to control access. Below are example policies to get started. Adjust policies to your exact column names and role claims.

Example: enable RLS on a table and create basic policies

```sql
-- Enable RLS
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

-- Policy: allow public read of active campaigns
CREATE POLICY "public_read_active_campaigns" ON campaigns
  FOR SELECT
  USING (status = 'active');

-- Policy: creators can insert campaigns (auth.uid stored in creator_id)
CREATE POLICY "creators_insert_own" ON campaigns
  FOR INSERT
  WITH CHECK (creator_id = auth.uid());

-- Policy: creators can update their own campaigns
CREATE POLICY "creators_update_own" ON campaigns
  FOR UPDATE
  USING (creator_id = auth.uid());

-- Policy: admins (a role claim) can update status and approve
CREATE POLICY "admins_manage_campaigns" ON campaigns
  FOR UPDATE
  USING (auth.role() IN ('admin','superadmin'))
  WITH CHECK (true);
```

Notes:
- Supabase exposes helper functions: `auth.uid()` for the current user UUID and `auth.role()` for role claims if you set them in JWT.
- Use `WITH CHECK` to ensure inserted/updated rows meet invariants.
- Protect sensitive tables like `admin_logs` so only admins can insert/select.

Example policy for donations (users can create a donation row for themselves; donors can see their donations):

```sql
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "donations_insert_own" ON donations
  FOR INSERT
  WITH CHECK (donor_id = auth.uid());

CREATE POLICY "donations_select_owner_or_admin" ON donations
  FOR SELECT
  USING (donor_id = auth.uid() OR auth.role() IN ('admin','superadmin'));
```

For Supabase-specific setup, see: https://supabase.com/docs/guides/auth

---

## Migration & Setup


### Initial Database Setup (Postgres / Supabase)

Below are example SQL DDL and seed steps for Postgres. If using Supabase, you can run these via the SQL editor or `supabase` CLI.

#### Step 1: Create Tables (DDL)

Run the DDL statements shown in the "Tables & Schemas" section above. Example using psql:

```bash
psql $DATABASE_URL -f db/schema.sql
```

#### Step 2: Seed Categories

Example SQL seed:

```sql
INSERT INTO categories (id, name, slug, description, display_order, is_active)
VALUES
  ('community', 'Community', 'community', 'Community and social causes', 1, true),
  ('arts', 'Arts', 'arts', 'Arts and creative projects', 2, true);
```

You can run this via psql or the Supabase SQL editor.

#### Step 3: Initialize Settings

```sql
INSERT INTO settings (id, platform_name, platform_fee_percentage, minimum_donation, features, updated_at)
VALUES (
  'general',
  'FundFlow',
  2.5,
  1.00,
  '{"campaignCreation": true, "donations": true, "comments": false, "updates": false, "rewards": false}',
  now()
);
```

### Backup & Recovery

#### Postgres dump (pg_dump)

```bash
pg_dump --format=custom --file=backups/fundflow-$(date +%Y%m%d).dump $DATABASE_URL
```

#### Restore (pg_restore)

```bash
pg_restore --verbose --clean --no-owner --dbname=$DATABASE_URL backups/fundflow-20250115.dump
```

#### Supabase import/export

Use the Supabase UI or `supabase db dump` / `supabase db restore` commands (see Supabase docs) to manage project snapshots.


---

## Performance Considerations

### Query Optimization

1. **Use Pagination**
   ```javascript
   // Load 20 items per page
   const pageSize = 20;
   let firstQuery = db.collection('campaigns')
     .where('status', '==', 'active')
     .orderBy('startDate', 'desc')
     .limit(pageSize + 1);
   ```

2. **Avoid N+1 Queries**
   - Denormalize frequently accessed data
   - Store creator name and avatar in campaigns
   - Store campaign title in donations

3. **Use Batch Reads**
   ```javascript
   // Read multiple documents efficiently
   const batch = db.batch();
   userIds.forEach(uid => {
     batch.get(db.collection('users').doc(uid));
   });
   ```

4. **Index Hot Queries**
   - Campaigns filtered by category and status
   - Donations grouped by campaign
   - User donation history

### Storage Optimization

- Store file URLs, not actual files in Firestore
- Use Cloud Storage for images and videos
- Archive old admin logs periodically
- Implement document-level compression for large text fields

---

## Scalability Notes

### Firestore Limits

- **Document Size:** Max 1 MB per document
- **Collection Size:** Unlimited documents
- **Write Rate:** Max 1 write/second per document
- **Read Rate:** Unlimited (but billed per read)
- **Transaction Size:** Max 500 documents per transaction
- **Batch Write:** Max 500 operations per batch

### Recommended Practices

1. **Denormalize Data** - Store frequently accessed data in parent documents
2. **Subcollections** - Use for one-to-many relationships (updates, comments)
3. **Array Fields** - Limit to < 100 items per array
4. **Timestamp Queries** - Index timestamp fields for sorting
5. **Sharding** - For high write volume, consider sharding hot documents

---

## Appendix: TypeScript Type Definitions

```typescript
// Users
type User = {
  userId: string;
  email: string;
  displayName: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  bio?: string;
  role: "user" | "admin" | "superadmin";
  isVerified: boolean;
  phoneNumber?: string;
  socialLinks?: Record<string, string>;
  accountStatus: "active" | "inactive" | "suspended";
  createdAt: admin.firestore.Timestamp;
  updatedAt: admin.firestore.Timestamp;
  lastLoginAt?: admin.firestore.Timestamp;
  preferences?: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    theme: "light" | "dark";
  };
};

// Campaigns
type Campaign = {
  campaignId: string;
  title: string;
  slug?: string;
  description: string;
  shortDescription?: string;
  category: string;
  creatorId: string;
  creatorName: string;
  creatorAvatarUrl?: string;
  fundingGoal: number;
  currentAmount: number;
  currency: string;
  imageUrl?: string;
  images?: string[];
  videoUrl?: string;
  startDate: admin.firestore.Timestamp;
  endDate: admin.firestore.Timestamp;
  status: "draft" | "pending_review" | "active" | "completed" | "cancelled" | "suspended";
  isApproved: boolean;
  approvedBy?: string;
  approvedAt?: admin.firestore.Timestamp;
  totalDonors: number;
  donationCount: number;
  viewCount: number;
  updatesCount: number;
  commentsCount: number;
  metadata?: {
    location?: string;
    tags?: string[];
    website?: string;
  };
  createdAt: admin.firestore.Timestamp;
  updatedAt: admin.firestore.Timestamp;
};

// Donations
type Donation = {
  donationId: string;
  campaignId: string;
  donorId: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed" | "refunded";
  paymentMethod?: "stripe" | "paypal" | "bank_transfer";
  transactionId?: string;
  receiptUrl?: string;
  donorName: string;
  donorEmail: string;
  isAnonymous: boolean;
  createdAt: admin.firestore.Timestamp;
  completedAt?: admin.firestore.Timestamp;
  refundedAt?: admin.firestore.Timestamp;
  message?: string;
  rewardTier?: string;
  metadata?: {
    ipAddress?: string;
    source?: string;
  };
};
```

---

**End of Database Schema Document**
