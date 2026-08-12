# FreshFind - Full System Architecture & Production Deployment Blueprint

## Executive Overview
FreshFind is an enterprise-grade food rescue marketplace designed to process surplus food transactions from restaurants, bakeries, supermarkets, hotels, and cafes. Built with **Clean Architecture** and **Domain-Driven Design (DDD)** principles, the platform connects budget-conscious & eco-minded customers with merchants offering 50–70% discounted food packages before store closing.

---

## 1. Full System Architecture Diagram

```
                                ┌─────────────────────────────────────────────────────────┐
                                │                    Client Experience                    │
                                │   Next.js 15 App Router / Tailwind CSS / Mobile Frame   │
                                └────────────────────────────┬────────────────────────────┘
                                                             │ HTTPS / REST / WebSockets
                                ┌────────────────────────────▼────────────────────────────┐
                                │                 Security & API Gateway                  │
                                │    NestJS Throttler / JWT Auth Guard / RBAC / CORS      │
                                └────────────────────────────┬────────────────────────────┘
                                                             │
                 ┌───────────────────────────────────────────┼───────────────────────────────────────────┐
                 │                                           │                                           │
   ┌─────────────▼─────────────┐               ┌─────────────▼─────────────┐               ┌─────────────▼─────────────┐
   │     Customer Context      │               │     Merchant Context      │               │      Admin Context        │
   │  Search, Geolocation Map, │               │ Offer Builder, Inventory, │               │ Merchant Approvals,       │
   │ Cart, Checkout, QR Lock   │               │ QR Scanner, Daily Revenue │               │ Dispute Audit, GMV Analytics│
   └─────────────┬─────────────┘               └─────────────┬─────────────┘               └─────────────┬─────────────┘
                 │                                           │                                           │
                 └───────────────────────────────────────────┼───────────────────────────────────────────┘
                                                             │
                                ┌────────────────────────────▼────────────────────────────┐
                                │             FreshFind Intelligence Engine               │
                                │  AI Demand Predictor / Dynamic Price Advisor / Waste    │
                                └────────────────────────────┬────────────────────────────┘
                                                             │ Prisma ORM
                                ┌────────────────────────────▼────────────────────────────┐
                                │             Data Layer & Cloud Services                 │
                                │  PostgreSQL DB / Redis / AWS S3 / Stripe / MTN MoMo     │
                                └─────────────────────────────────────────────────────────┘
```

---

## 2. Comprehensive Database Schema (`prisma/schema.prisma`)
The platform uses PostgreSQL with Prisma ORM supporting 14 domain models:
- **User & UserWallet**: Auth credentials, JWT tokens, loyalty balances.
- **Business & BusinessLocation**: Geolocation coordinates (`latitude`, `longitude`) for radius search.
- **Offer & OfferImage**: Original price, discounted price, pickup schedule window, dietary badges.
- **Order & OrderItem**: 15-minute reservation locks, checkout payment status.
- **QRPickupCode**: Dynamic token generation & scanning audit log.
- **Payment**: Stripe cards, MTN MoMo, Airtel Money, Eco Wallet balances.
- **EnvironmentalImpact**: Automatic tracking of CO₂ avoided (kg) and food saved (kg).
- **AIPredictionLog**: Machine learning score logs for demand forecasts.

---

## 3. Production Folder Structure
```
FreshFind/
├── app/                        # Next.js 15 App Router Frontend
│   ├── globals.css             # Glassmorphism tokens & custom CSS
│   ├── layout.tsx              # Root HTML & AppProvider wrapper
│   └── page.tsx                # Interactive multi-role portal page
├── components/                 # UI Component Layer
│   ├── Navbar.tsx              # Role switcher & mobile emulator toggle
│   ├── CustomerView.tsx        # Customer offer discovery & map simulation
│   ├── OfferCard.tsx           # Offer display card with discount tags
│   ├── OfferDetailModal.tsx    # Reservation countdown clock modal
│   ├── CheckoutModal.tsx       # Multi-payment gateway (Stripe/MoMo/Wallet)
│   ├── QRScannerModal.tsx      # Merchant QR code verification tool
│   ├── BusinessView.tsx       # Store management & AI offer builder
│   ├── AdminView.tsx           # Super-admin command center
│   ├── AIDemandForecastWidget.tsx # AI prediction charts & analytics
│   └── MobileFrameContainer.tsx# Mobile emulator viewport frame
├── lib/
│   ├── mockData.ts             # Initial domain models & mock datasets
│   └── store.tsx               # React Context state engine
├── backend/                    # NestJS Backend Microservices
│   ├── src/
│   │   ├── offers/             # Geolocation spatial queries & offers service
│   │   ├── orders/             # Order transactions & QR generation service
│   │   ├── payments/           # Stripe & MTN MoMo payment service
│   │   └── swagger/            # OpenAPI 3.0 specs (openapi.json)
├── prisma/
│   └── schema.prisma           # Production PostgreSQL database schema
└── package.json
```

---

## 4. API Specifications (OpenAPI / Swagger)
Key REST API endpoints provided:
- `POST /v1/auth/register` & `POST /v1/auth/login`: JWT Bearer authentication.
- `GET /v1/offers/nearby`: Radial search filter by distance, rating, and dietary tags.
- `POST /v1/orders/reserve`: Locks inventory for 15 minutes and issues QR pickup code.
- `POST /v1/orders/verify-qr`: Merchant QR verification endpoint.
- `POST /v1/payments/momo`: MTN MoMo / Airtel Money push notification trigger.
- `POST /v1/ai/predict-demand`: AI demand scoring & markdown optimization.

---

## 5. Authentication Flow

```
[Customer / Merchant] ──► Enter Email / Social Login ──► NestJS Auth Controller
                                                                 │
                                                       Validates Credentials
                                                                 │
                                            ┌────────────────────┴────────────────────┐
                                            ▼                                         ▼
                                Generate Signed JWT Token                 Set HttpOnly Cookie
                                (Payload: userId, role)                   (Refresh Token)
```

---

## 6. Payment Flow (Stripe & Mobile Money)

```
1. Customer clicks "Reserve Offer" -> Inventory locked for 15 mins.
2. Selects Payment Method:
   ├── MTN MoMo / Airtel Money: Phone prompt sent -> User enters USSD PIN -> Webhook callback updates Order to PAID.
   ├── Stripe Card / Apple Pay: Stripe Elements tokenized -> Direct API charge -> Order updated to PAID.
   └── Eco Wallet: Balance debited atomically -> Order updated to PAID.
3. System generates dynamic QRPickupCode (QR-FF-XXXXXX).
4. Customer visits store during pickup window -> Merchant scans QR -> Status updated to COMPLETED.
```

---

## 7. Scaling & Deployment Guide (1M+ Users)

### AWS / Cloud Infrastructure Architecture
1. **Frontend Hosting**: Deploy Next.js 15 application to **Vercel** or **AWS Amplify** with Global CDN Edge distribution.
2. **Backend Services**: Deploy NestJS containers on **AWS ECS Fargate** with Auto-Scaling Policy (scale from 2 to 20 instances based on CPU/Memory load).
3. **Database**: Managed **AWS Aurora PostgreSQL** multi-AZ cluster with Read Replicas.
4. **Cache & Queues**: **AWS ElastiCache Redis** for fast spatial queries, session management, and rate limiting.
5. **Storage**: **AWS S3** with CloudFront CDN for store logos and product images.

### Zero-Downtime Deployment Command
```bash
# 1. Validate Prisma Schema
npx prisma validate

# 2. Run Database Migrations
npx prisma migrate deploy

# 3. Build Next.js 15 Production Bundle
npm run build

# 4. Containerize NestJS Backend
docker build -t freshfind-backend:latest ./backend
```
