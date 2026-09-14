# TaskFlow – Monetization Architecture & Cost Optimization Strategy (MONETIZATION.md)

## 1. Monetization Strategy & Tier Design

TaskFlow is architected on a high-conversion freemium model with regional pricing optimized for India (and localized for global users).

### Tier Pricing Table

| Plan | India Price (INR) | Global Price (USD) | Target Audience & Value Proposition |
|---|---|---|---|
| **Free Forever** | ₹0 | $0 | Casual daily to-do users, students testing the app. Generous core features to establish habit loops. |
| **Premium Monthly** | ₹99 / mo | $2.99 / mo | Active professionals needing unlimited projects, recurring automations, and AI assist. |
| **Premium Annual** | ₹799 / yr (₹66/mo) | $24.99 / yr | Best value (33% discount). Anchors recurring subscription retention. |
| **Founding Lifetime (Launch)** | ₹1,499 one-time | $49.99 one-time | Limited to first 1,000 customers during initial Play Store launch to front-load seed revenue. |

---

## 2. Unit Economics & Profit Per Paid User (Annual Plan Example: ₹799)

| Cost Component | Percentage / Amount | Notes |
|---|---|---|
| **Gross Revenue** | ₹799.00 | Annual subscription paid via Google Play |
| **Google Play Billing Fee (15%)** | -₹119.85 | Google Play reduced 15% tier for first $1M/yr revenue |
| **GST / Taxes (approx. 18% on fee)**| -₹21.57 | Applicable tax withholding |
| **Supabase Database & Edge Functions**| -₹30.00 | Amortized annual cloud share per active paid user |
| **Gemini AI API (50 req/mo cap)** | -₹48.00 | Gemini Flash token cost (₹4/month avg) |
| **Local Notifications & Storage** | ₹0.00 | Local device storage & notifications = ₹0 cloud cost |
| **Net Profit Per Paid User** | **₹579.58** | **Net margin ~ 72.5%** |

---

## 3. Cost Control Architecture & Scale Projections

Because TaskFlow avoids expensive third-party push notification systems, avoids unnecessary real-time websockets, minimizes Edge Function compute, and caches data locally, operating overhead remains exceptionally low:

| User Base Metric | 100 Users | 1,000 Users | 10,000 Users | 100,000 Users |
|---|---|---|---|---|
| **Active Paid Users (3% conv.)** | 3 users | 30 users | 300 users | 3,000 users |
| **Supabase Tier** | Free Tier ($0) | Free Tier ($0) | Pro Tier ($25/mo) | Pro Tier + Compute Add-on ($75/mo) |
| **Database Storage Used** | ~15 MB | ~150 MB | ~1.5 GB | ~15 GB |
| **AI API Cost (Gemini Flash)** | ~$0.30/mo | ~$3.00/mo | ~$30.00/mo | ~$300.00/mo |
| **Push Notifications** | $0 (Local) | $0 (Local) | $0 (Local) | $0 (Local) |
| **Total Cloud Infra Cost / Mo** | **$0.30** | **$3.00** | **$55.00** | **$375.00** |
| **Monthly Revenue (ARR / 12)** | ₹200 (~$2.4) | ₹2,000 (~$24) | ₹20,000 (~$240) | ₹2,00,000 (~$2,400) |
| **Net Monthly Margin** | **Profitable** | **~87%** | **~77%** | **~84%** |

---

## 4. Google Play Billing Architecture

1. **Client**: Flutter uses `in_app_purchase` to fetch product details and initiate purchasing via Google Play Billing Client 6+.
2. **Purchase Receipt**: Once the user completes payment, Google Play delivers the `purchaseToken` and `orderId`.
3. **Server-Side Verification**:
   - The Flutter client sends `purchaseToken` and `productId` to Supabase Edge Function `/verify-purchase`.
   - The Edge Function queries the Google Play Developer API with service account credentials to verify validity, expiry timestamp, and auto-renew status.
   - Upon verification, the function updates the user's `profiles.tier` to `premium` and records the subscription details in `subscriptions`.
   - The client refreshes the local user profile and unlocks premium features.
4. **Offline Grace Period**: The local SQLite database caches the verified subscription status for up to 7 days offline.
