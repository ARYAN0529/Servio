# Servora

QR-based restaurant ordering platform. Customers scan a QR code on their table, browse the menu, order, and pay from their phone. The kitchen sees orders live, and customers get WhatsApp updates as their order progresses.

> Status: 🚧 In active development

---

## Features

- **Table QR ordering**: each table has a unique QR code that opens the menu already tied to that table. No app install, no login needed for customers.
- **Online payments**: Razorpay checkout with webhook-based payment confirmation.
- **Live kitchen dashboard**: new orders show up instantly via Server-Sent Events (SSE).
- **WhatsApp notifications**: order status updates (received, preparing, ready) sent through the WhatsApp Business Cloud API.
- **Staff roles**: `OWNER`, `MANAGER`, `KITCHEN`, `STAFF`, each with different permissions.
- **Menu management**: food images hosted on Cloudinary.

---

## Tech Stack

| Layer | Tech |
| --- | --- |
| Framework | Next.js (App Router) + TypeScript |
| Styling | Tailwind CSS |
| Client state / data | TanStack Query, Zustand |
| Validation | Zod (shared between client and server) |
| Backend | Next.js Route Handlers |
| Database | MongoDB Atlas |
| Auth | Auth.js |
| Payments | Razorpay + webhooks |
| Messaging | WhatsApp Business Cloud API |
| Realtime | Server-Sent Events (SSE) |
| Images | Cloudinary |
| Deployment | Vercel |

---

## How It Works

```
Customer scans QR  →  Menu page (table ID in URL)
        ↓
   Places order  →  Razorpay checkout
        ↓
 Razorpay webhook  →  Order marked PAID
        ↓
   ┌────┴─────────────┐
   ↓                  ↓
Kitchen dashboard   WhatsApp message
(live via SSE)      to customer
```

1. The QR code encodes a URL containing the restaurant and table identifiers.
2. The customer builds a cart and pays through Razorpay.
3. Razorpay calls our webhook. **The webhook, not the browser redirect, is the source of truth for payment status.**
4. Once paid, the order is pushed to the kitchen dashboard over SSE and a WhatsApp notification is sent.
5. Kitchen staff update the order status, which triggers further WhatsApp updates.

---

## Architecture Decisions

**Why Next.js Route Handlers instead of a separate backend?**
One codebase, one deploy, shared TypeScript types and Zod schemas between frontend and API. For an MVP this removes a lot of glue code and CORS/config headaches.

**Why SSE instead of WebSockets?**
The kitchen dashboard only needs server → client updates (new orders, status changes). SSE is simpler, works over plain HTTP, reconnects automatically, and is much easier to run on serverless platforms than a persistent WebSocket server.

**Why trust webhooks for payments?**
A customer can close the tab right after paying, or a redirect can fail. Razorpay webhooks are signed and delivered reliably, so verifying the signature there is the only safe way to confirm payment.

**Why MongoDB Atlas?**
Orders are naturally document-shaped (an order with embedded line items and a price snapshot), and Atlas gives a managed, hosted database with a free tier that fits the MVP.

**Why Zod everywhere?**
Every API input is validated at the boundary, and the same schemas infer the TypeScript types, so there is a single source of truth for data shapes.

**Why Zustand + TanStack Query?**
TanStack Query handles server state (menu, orders, caching, refetching). Zustand handles small bits of client-only state, mainly the cart. Keeping the two separate avoids stuffing server data into a global store.

---

## Getting Started

### Prerequisites

- Node.js 18+
- A MongoDB Atlas cluster
- Razorpay account (test mode is fine)
- Cloudinary account
- WhatsApp Business Cloud API access (Meta developer account)

### Installation

```bash
# clone the repo (update the URL to your actual repo)
git clone https://github.com/ARYAN0529/servora.git
cd servora

# install dependencies
npm install

# copy the example env file and fill in your values
cp .env.example .env.local

# start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

Create a `.env.local` file:

```env
# Database
DATABASE_URL="mongodb+srv://<user>:<password>@<cluster>.mongodb.net/servora"

# Auth.js
AUTH_SECRET="generate-with: npx auth secret"
AUTH_URL="http://localhost:3000"

# Razorpay
RAZORPAY_KEY_ID=""
RAZORPAY_KEY_SECRET=""
RAZORPAY_WEBHOOK_SECRET=""

# WhatsApp Business Cloud API
WHATSAPP_ACCESS_TOKEN=""
WHATSAPP_PHONE_NUMBER_ID=""

# Cloudinary
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
```

### Testing Webhooks Locally

Razorpay needs a public URL to reach your machine. Use a tunnel such as ngrok or Cloudflare Tunnel:

```bash
ngrok http 3000
```

Then set the webhook URL in the Razorpay dashboard to `https://<your-tunnel>/api/webhooks/razorpay`.

---

## Project Structure

```
servora/
├── app/
│   ├── (customer)/        # QR menu, cart, checkout
│   ├── (dashboard)/       # Owner / manager / kitchen views
│   └── api/               # Route Handlers (orders, payments, webhooks, SSE)
├── components/            # Shared UI components
├── lib/                   # DB client, auth config, payment + WhatsApp helpers
├── schemas/               # Zod schemas
├── store/                 # Zustand stores (cart)
└── public/
```

> Adjust this to match your actual folder layout.

---

## Roadmap

- [x] Project setup and core stack
- [ ] Menu management
- [ ] Table QR code generation
- [ ] Order flow and Razorpay payments
- [ ] Kitchen dashboard with live orders (SSE)
- [ ] WhatsApp order status notifications
- [ ] Staff roles and permissions
- [ ] Cloudinary image upload for menu items
- [ ] Production deployment on Vercel

---

## License

MIT (or update to your preferred license)

---

Built by [Aryan](https://github.com/ARYAN0529)