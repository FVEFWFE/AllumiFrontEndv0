# 🚀 Getting Started with Allumi

Welcome to Allumi - your complete attribution tracking system for Skool communities! This guide will help you set up and start tracking your marketing attribution in minutes.

## 📋 Prerequisites

Before you begin, make sure you have:
- A Skool community (or planning to create one)
- Basic knowledge of UTM parameters
- Access to your marketing channels (Facebook, Instagram, YouTube, etc.)

## 🎯 Quick Start (5 Minutes)

### Step 1: Set Up Your Account
1. Sign up at [allumi.com](https://allumi.com)
2. Complete checkout via Whop ($79/month)
3. Access your dashboard immediately

### Step 2: Install the Universal Pixel
Add this single line to your landing pages:
```html
<script src="https://allumi.com/pixel.js" async></script>
```

### Step 3: Create Your First Tracking Link
1. Go to **Dashboard > Links**
2. Click "Create New Link"
3. Enter your destination URL and campaign details
4. Copy your tracking link with UTM parameters

### Step 4: Import Your Existing Members (Optional)
1. Export your Skool members as CSV
2. Go to **Dashboard > Import**
3. Drag & drop your CSV file
4. Watch as attribution is automatically calculated

## 📊 Understanding Your Dashboard

### Analytics Overview (`/dashboard/analytics`)
- **Revenue by Source**: See which channels drive the most revenue
- **Conversion Rates**: Track performance of each campaign
- **Attribution Paths**: Understand customer journeys
- **Confidence Scores**: View accuracy of attribution matching

### Key Metrics Explained:
- **Attribution Accuracy**: Currently at 75-80% accuracy
- **Confidence Score**: Higher scores (>80%) mean more reliable attribution
- **Multi-Touch Attribution**: Credits all touchpoints in the customer journey

## 🔗 Link-in-Bio Feature (`/dashboard/bio`)

Create your own Linktree-style bio page with built-in attribution:

1. **Create Your Bio Page**
   - Choose a unique slug (allumi.to/yourname)
   - Add your bio and profile picture
   - Select a theme

2. **Add Your Links**
   - Add up to 20 links
   - Each link automatically tracks clicks
   - Built-in UTM parameters for attribution

3. **Share Everywhere**
   - Instagram bio
   - TikTok profile
   - YouTube descriptions
   - Email signatures

## 📈 Tracking Campaigns

### Best Practices for UTM Parameters:
```
utm_source: Platform name (facebook, instagram, youtube)
utm_medium: Type of traffic (social, email, video)
utm_campaign: Specific campaign name (black_friday_2024)
```

### Example Tracking Links:
```
Facebook Ad:
https://yoursite.com?utm_source=facebook&utm_medium=cpc&utm_campaign=winter_sale

Instagram Bio:
https://yoursite.com?utm_source=instagram&utm_medium=social&utm_campaign=bio_link

Email Newsletter:
https://yoursite.com?utm_source=email&utm_medium=newsletter&utm_campaign=weekly_tips
```

## ⚡ Zapier Integration

Automate your attribution tracking with Zapier:

1. **Connect Zapier to Allumi**
   - Use webhook URL: `https://allumi.com/api/webhooks/zapier`
   - Send new Skool members automatically

2. **Supported Triggers**:
   - New Skool member joins
   - Payment completed
   - Member upgraded

3. **Data Synced**:
   - Email address
   - Join date
   - Membership type
   - Payment amount

## 📊 CSV Import Guide

### Preparing Your CSV:
Your CSV should include:
- Email (required)
- Name (optional)
- Join Date (optional)
- Membership Type (optional)
- Amount Paid (optional)

### Import Process:
1. Navigate to **Dashboard > Import**
2. Drag & drop your CSV file
3. Map columns to Allumi fields
4. Click "Import Members"
5. View attribution results instantly

## 🎯 Attribution Models

Allumi supports multiple attribution models:

- **Last-Click**: Credits the final touchpoint (default)
- **First-Click**: Credits the initial touchpoint
- **Linear**: Equal credit to all touchpoints
- **Time-Decay**: Recent touches get more credit
- **U-Shaped**: Emphasis on first and last touch

## 🚨 Troubleshooting

### Dashboard Shows No Data?
- Ensure Universal Pixel is installed
- Check that tracking links are being used
- Wait 5-10 minutes for data to process
- Run test data generator: `npm run generate-test-data`

### Low Attribution Accuracy?
- Ensure email capture forms are on landing pages
- Use consistent email addresses in Skool
- Enable cross-device tracking
- Current target: 80% accuracy (currently at 75%)

### Webhook Not Working?
- Verify webhook URL in Zapier
- Check API authentication
- Test with webhook tester tool
- Contact support if issues persist

## 📚 Advanced Features

### Affiliate Program Dashboard
- Generate unique affiliate links
- Track commissions (40% revenue share)
- View leaderboard
- Manage payouts

### A/B Testing
- Test different landing pages
- Compare attribution models
- Optimize conversion paths

### Real-time Alerts
- High-converting source notifications
- Budget depletion warnings
- Spike detection

## 🔧 Developer Setup

For self-hosting or development:

```bash
# Clone the repository
git clone https://github.com/yourusername/allumi.git
cd allumi

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Run development server
npm run dev

# Generate test data
npm run generate-test-data

# Run end-to-end tests
npm run test:e2e
```

## 📞 Support

- **Documentation**: This guide
- **Email**: support@allumi.com
- **Response Time**: Within 24 hours

## 🎉 Next Steps

1. ✅ Create your first tracking link
2. ✅ Import your existing members
3. ✅ Set up your Link-in-Bio page
4. ✅ Connect Zapier for automation
5. ✅ Monitor your attribution dashboard

Welcome to better attribution tracking with Allumi! 🚀