# FundFlow Database Schema

**Last Updated:** November 15, 2025  
**Database Provider:** Firebase (Firestore & Authentication)  
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

FundFlow uses **Firebase Firestore** as its primary database. Firestore is a NoSQL cloud database that stores data in collections and documents.

### Database Structure
- **Database Type:** NoSQL (Document-based)
- **Provider:** Google Cloud Firestore
- **Authentication:** Firebase Authentication
- **Real-time Capabilities:** Firestore listeners
- **Scalability:** Serverless auto-scaling

---

## Collections & Documents

### 1. **Users Collection**
Stores all user account information and profiles.

**Collection Path:** `/users`

#### Document Structure:
```typescript
{
  userId: string;                    // Document ID (Firebase Auth UID)
  email: string;                     // User's email address (unique)
  displayName: string;               // User's display name
  firstName?: string;                // User's first name
  lastName?: string;                 // User's last name
  avatarUrl?: string;                // Profile picture URL
  bio?: string;                      // User biography
  role: "user" | "creator" | "admin" | "superadmin";  // User role
  isVerified: boolean;               // Email verification status
  phoneNumber?: string;              // Contact number
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
  accountStatus: "active" | "inactive" | "suspended"; // Account status
  createdAt: Timestamp;              // Account creation date
  updatedAt: Timestamp;              // Last profile update
  lastLoginAt?: Timestamp;           // Last login timestamp
  preferences?: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    theme: "light" | "dark";
  };
}
```

#### Indexes:
- Primary: `userId` (Document ID)
- Secondary: `email` (Unique, for login)
- Secondary: `role` (for role-based queries)
- Secondary: `createdAt` (for sorting)

---

### 2. **Campaigns Collection**
Stores all crowdfunding campaign information.

**Collection Path:** `/campaigns`

#### Document Structure:
```typescript
{
  campaignId: string;                // Document ID (auto-generated or custom)
  title: string;                     // Campaign title
  slug?: string;                     // URL-friendly slug
  description: string;               // Detailed campaign description
  shortDescription?: string;         // Brief campaign summary (max 160 chars)
  category: string;                  // Campaign category
                                     // Options: "Community", "Arts", "Animals", 
                                     //          "Technology", "Film", "Education"
  creatorId: string;                 // Reference to Users.userId
  creatorName: string;               // Creator's display name (denormalized)
  creatorAvatarUrl?: string;         // Creator's avatar (denormalized)
  
  // Funding Information
  fundingGoal: number;               // Target amount in USD
  currentAmount: number;             // Amount raised so far
  currency: string;                  // Currency code (default: "USD")
  
  // Campaign Media
  imageUrl?: string;                 // Primary campaign image
  images?: string[];                 // Additional campaign images
  videoUrl?: string;                 // Campaign video URL
  
  // Timeline
  startDate: Timestamp;              // Campaign launch date
  endDate: Timestamp;                // Campaign deadline
  
  // Status
  status: "draft" | "pending_review" | "active" | "completed" | "cancelled" | "suspended";
  isApproved: boolean;               // Admin approval status
  approvedBy?: string;               // Admin ID who approved
  approvedAt?: Timestamp;            // Approval timestamp
  
  // Engagement
  totalDonors: number;               // Count of unique donors
  donationCount: number;             // Total number of donations
  viewCount: number;                 // Campaign page views
  
  // Additional Info
  updatesCount: number;              // Number of campaign updates/posts
  commentsCount: number;             // Number of comments
  
  metadata?: {
    location?: string;               // Geographic location
    tags?: string[];                 // Campaign tags
    website?: string;                // External website link
  };
  
  createdAt: Timestamp;              // Campaign creation date
  updatedAt: Timestamp;              // Last update date
}
```

#### Indexes:
- Primary: `campaignId` (Document ID)
- Secondary: `creatorId` (for creator's campaigns)
- Secondary: `category` (for filtering)
- Secondary: `status` (for active campaigns)
- Secondary: `startDate` (for chronological sorting)
- Composite: `status` + `startDate` (for active campaigns sorted by date)
- Composite: `category` + `status` (for filtered browsing)

---

### 3. **Donations Collection**
Records all donations made to campaigns.

**Collection Path:** `/donations`

#### Document Structure:
```typescript
{
  donationId: string;                // Document ID (auto-generated UUID)
  campaignId: string;                // Reference to Campaigns.campaignId
  donorId: string;                   // Reference to Users.userId
  
  // Donation Details
  amount: number;                    // Donation amount in USD
  currency: string;                  // Currency code (default: "USD")
  status: "pending" | "completed" | "failed" | "refunded";  // Payment status
  
  // Payment Information
  paymentMethod?: string;            // "stripe" | "paypal" | "bank_transfer"
  transactionId?: string;            // Payment processor transaction ID
  receiptUrl?: string;               // Payment receipt URL
  
  // Donor Information
  donorName: string;                 // Donor's display name (denormalized)
  donorEmail: string;                // Donor's email (denormalized)
  isAnonymous: boolean;              // Whether donation is anonymous
  
  // Timestamps
  createdAt: Timestamp;              // Donation date
  completedAt?: Timestamp;           // Payment completion date
  refundedAt?: Timestamp;            // Refund date (if applicable)
  
  // Additional
  message?: string;                  // Optional donor message
  rewardTier?: string;               // Associated reward tier (future)
  metadata?: {
    ipAddress?: string;              // Donor IP (for analytics)
    source?: string;                 // Traffic source
  };
}
```

#### Indexes:
- Primary: `donationId` (Document ID)
- Secondary: `campaignId` (for campaign donations)
- Secondary: `donorId` (for donor history)
- Secondary: `status` (for payment reconciliation)
- Secondary: `createdAt` (for sorting donations)
- Composite: `campaignId` + `status` (for campaign revenue)
- Composite: `donorId` + `createdAt` (for donor donation history)

---

### 4. **Campaign Updates Collection**
Stores campaign updates and announcements (future feature).

**Collection Path:** `/campaigns/{campaignId}/updates`

#### Document Structure:
```typescript
{
  updateId: string;                  // Document ID
  campaignId: string;                // Parent campaign ID
  authorId: string;                  // Reference to Users.userId
  
  title: string;                     // Update title
  content: string;                   // Update content (markdown)
  imageUrl?: string;                 // Update image/thumbnail
  
  // Engagement
  likeCount: number;                 // Number of likes
  commentCount: number;              // Number of comments
  
  createdAt: Timestamp;              // Post date
  updatedAt?: Timestamp;             // Last edit date
}
```

#### Indexes:
- Primary: `updateId` (Document ID)
- Secondary: `campaignId` (Parent reference)
- Secondary: `createdAt` (for chronological sorting)

---

### 5. **Campaign Comments Collection**
Stores comments on campaigns (future feature).

**Collection Path:** `/campaigns/{campaignId}/comments`

#### Document Structure:
```typescript
{
  commentId: string;                 // Document ID
  campaignId: string;                // Parent campaign ID
  authorId: string;                  // Reference to Users.userId
  authorName: string;                // Author display name (denormalized)
  authorAvatarUrl?: string;          // Author avatar (denormalized)
  
  content: string;                   // Comment text
  
  // Engagement
  likeCount: number;                 // Number of likes
  replyCount: number;                // Number of replies
  
  // Metadata
  isEdited: boolean;                 // Whether comment was edited
  createdAt: Timestamp;              // Comment date
  updatedAt?: Timestamp;             // Last edit date
}
```

#### Indexes:
- Primary: `commentId` (Document ID)
- Secondary: `campaignId` (Parent reference)
- Secondary: `authorId` (for user's comments)
- Secondary: `createdAt` (for sorting)

---

### 6. **Categories Collection**
Reference data for campaign categories.

**Collection Path:** `/categories`

#### Document Structure:
```typescript
{
  categoryId: string;                // Document ID (category slug)
  name: string;                      // Display name
  slug: string;                      // URL slug
  description?: string;              // Category description
  icon?: string;                     // Icon/emoji
  color?: string;                    // Hex color code
  isActive: boolean;                 // Whether category is available
  displayOrder: number;              // Sort order
  campaignCount: number;             // Count of campaigns (denormalized)
  totalFunded?: number;              // Total amount funded (denormalized)
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### Indexes:
- Primary: `categoryId` (Document ID)
- Secondary: `isActive` (for available categories)
- Secondary: `displayOrder` (for sorting)

---

### 7. **Admin Logs Collection**
Audit trail for administrative actions.

**Collection Path:** `/adminLogs`

#### Document Structure:
```typescript
{
  logId: string;                     // Document ID (auto-generated)
  adminId: string;                   // Reference to Users.userId
  adminEmail: string;                // Admin email (denormalized)
  
  action: string;                    // Action performed
                                     // Examples: "approve_campaign", 
                                     //          "reject_campaign", 
                                     //          "suspend_user", etc.
  
  targetType: string;                // "campaign" | "user" | "donation"
  targetId: string;                  // ID of affected resource
  
  details?: object;                  // Additional action details
  changes?: object;                  // What was changed
  reason?: string;                   // Why action was taken
  
  ipAddress?: string;                // Admin's IP address
  userAgent?: string;                // Admin's browser info
  
  createdAt: Timestamp;              // Action timestamp
}
```

#### Indexes:
- Primary: `logId` (Document ID)
- Secondary: `adminId` (for admin's actions)
- Secondary: `action` (for audit reports)
- Secondary: `targetType` (for filtering)
- Secondary: `createdAt` (for chronological audit)

---

### 8. **Platform Settings Collection**
Global platform configuration.

**Collection Path:** `/settings`

#### Document Structure:
```typescript
{
  settingId: string;                 // Document ID (e.g., "general", "payment")
  
  // General Settings
  platformName: string;              // "FundFlow"
  platformDescription?: string;
  
  // Financial Settings
  platformFeePercentage: number;     // Platform fee as percentage (e.g., 2.5)
  minimumDonation: number;           // Minimum donation amount
  maximumDonation?: number;          // Maximum donation amount
  
  // Feature Flags
  features: {
    campaignCreation: boolean;
    donations: boolean;
    comments: boolean;
    updates: boolean;
    rewards: boolean;
  };
  
  // Payment Providers
  paymentProviders: {
    stripe: { enabled: boolean; apiKeyPublic?: string };
    paypal: { enabled: boolean; clientId?: string };
  };
  
  // Notification Settings
  notifications: {
    emailOnDonation: boolean;
    emailOnUpdate: boolean;
    emailOnComment: boolean;
  };
  
  updatedAt: Timestamp;
  updatedBy: string;                 // Admin ID
}
```

#### Indexes:
- Primary: `settingId` (Document ID)

---

## Data Types & Constraints

### Firestore Data Types

| Type | Description | Example |
|------|-------------|---------|
| String | Text data | `"Help Build Our Community Garden"` |
| Number | Integer or floating-point | `5000`, `99.99` |
| Boolean | True/False | `true` |
| Timestamp | Date/Time (UTC) | `Timestamp.fromDate(new Date())` |
| Array | Ordered list | `["tag1", "tag2"]` |
| Map | Object/Dictionary | `{ twitter: "@username" }` |
| Reference | Link to another document | `db.collection("users").doc(uid)` |
| GeoPoint | Geographic coordinates | `new GeoPoint(latitude, longitude)` |

### Field Constraints

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| **Campaign Title** | String | ✅ | Min 5 chars, Max 200 chars |
| **Campaign Description** | String | ✅ | Min 20 chars, Max 5000 chars |
| **Funding Goal** | Number | ✅ | > 0, ≤ 1,000,000 |
| **Current Amount** | Number | ✅ | ≥ 0, ≤ funding goal |
| **Email** | String | ✅ | Valid email format (RFC 5322) |
| **Donation Amount** | Number | ✅ | ≥ 1, ≤ 100,000 |
| **User Role** | String | ✅ | One of: user, creator, admin, superadmin |
| **Campaign Status** | String | ✅ | One of: draft, pending_review, active, completed, cancelled, suspended |
| **Donation Status** | String | ✅ | One of: pending, completed, failed, refunded |

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

## Security Rules

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check user authentication
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function to check if user is admin
    function isAdmin() {
      return isAuthenticated() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'superadmin'];
    }
    
    // Helper function to check if user is super admin
    function isSuperAdmin() {
      return isAuthenticated() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'superadmin';
    }
    
    // Users Collection
    match /users/{userId} {
      // Users can read their own profile
      allow read: if isAuthenticated() && (request.auth.uid == userId || isAdmin());
      
      // Users can update their own profile
      allow update: if isAuthenticated() && request.auth.uid == userId;
      
      // Only super admin can update user roles
      allow update: if isSuperAdmin() && request.resource.data.role is string;
      
      // New user registration
      allow create: if request.auth.uid == userId;
    }
    
    // Campaigns Collection
    match /campaigns/{campaignId} {
      // Anyone can read active campaigns
      allow read: if resource.data.status == 'active' || isAdmin();
      
      // Creators can create campaigns
      allow create: if isAuthenticated() && 
                       request.resource.data.creatorId == request.auth.uid &&
                       request.resource.data.status == 'draft';
      
      // Creators can update their own campaigns
      allow update: if isAuthenticated() && 
                       resource.data.creatorId == request.auth.uid;
      
      // Only admins can approve campaigns
      allow update: if isAdmin() && 
                       request.resource.data.status in ['active', 'suspended'];
      
      // Subcollections
      match /updates/{updateId} {
        allow read: if parent().data.status == 'active' || isAdmin();
        allow create: if isAuthenticated() && 
                         request.auth.uid == parent().data.creatorId;
      }
      
      match /comments/{commentId} {
        allow read: if parent().data.status == 'active' || isAdmin();
        allow create: if isAuthenticated();
      }
    }
    
    // Donations Collection
    match /donations/{donationId} {
      // Users can read their own donations
      allow read: if isAuthenticated() && 
                     (request.auth.uid == resource.data.donorId || isAdmin());
      
      // Create donation records after successful payment
      allow create: if isAuthenticated() && 
                       request.auth.uid == request.resource.data.donorId;
      
      // Only admins can refund donations
      allow update: if isAdmin() && 
                       request.resource.data.status == 'refunded';
    }
    
    // Admin Logs (admin only)
    match /adminLogs/{logId} {
      allow read: if isAdmin();
      allow create: if isAdmin();
    }
    
    // Settings (admin only)
    match /settings/{settingId} {
      allow read: if isAdmin();
      allow write: if isSuperAdmin();
    }
    
    // Categories (public read)
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if isSuperAdmin();
    }
  }
}
```

---

## Migration & Setup

### Initial Database Setup

#### Step 1: Create Collections
```javascript
// Initialize empty collections
const collections = [
  'users',
  'campaigns',
  'donations',
  'categories',
  'adminLogs',
  'settings'
];

collections.forEach(collection => {
  db.collection(collection).doc('__init__').set({
    initialized: true,
    timestamp: firebase.firestore.Timestamp.now()
  });
});
```

#### Step 2: Seed Categories
```javascript
const categories = [
  {
    categoryId: 'community',
    name: 'Community',
    slug: 'community',
    description: 'Community and social causes',
    displayOrder: 1,
    isActive: true
  },
  {
    categoryId: 'arts',
    name: 'Arts',
    slug: 'arts',
    description: 'Arts and creative projects',
    displayOrder: 2,
    isActive: true
  },
  // ... more categories
];

categories.forEach(cat => {
  db.collection('categories').doc(cat.categoryId).set(cat);
});
```

#### Step 3: Initialize Settings
```javascript
db.collection('settings').doc('general').set({
  platformName: 'FundFlow',
  platformFeePercentage: 2.5,
  minimumDonation: 1,
  features: {
    campaignCreation: true,
    donations: true,
    comments: false,
    updates: false,
    rewards: false
  },
  updatedAt: firebase.firestore.Timestamp.now()
});
```

### Backup & Recovery

#### Firestore Export
```bash
gcloud firestore export gs://your-bucket/backups/$(date +%Y%m%d)
```

#### Firestore Import
```bash
gcloud firestore import gs://your-bucket/backups/20250115/
```

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
