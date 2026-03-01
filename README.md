# ShopManager Pro

A full-featured **Shop Management System** web application built with Next.js + React, following Flutter's clean architecture patterns with Material 3 design. Integrates with Firebase for authentication and real-time data.

---

## 🚀 Features

| Module | Features |
|--------|----------|
| **Authentication** | Email/password login, form validation, demo mode |
| **Dashboard** | KPI cards, bar chart, area chart, pie chart, recent sales |
| **Products** | CRUD, search, category/status filter, table & grid view, auto stock status |
| **Sales** | Create sale, select products, auto-calculate total, invoice generation, stock auto-reduction |
| **Customers** | CRUD, purchase history, contact info, status management |
| **Reports** | Daily/monthly reports, CSV export, revenue trends, payment breakdown |

---

## 🏗️ Architecture (Flutter-Inspired Clean Architecture)

```
src/
├── core/                    # Core utilities (Firebase config, CSV export)
│   ├── firebase.ts          # Firebase initialization
│   └── csv-export.ts        # CSV generation & download
│
├── models/                  # Data models (Firestore document structure)
│   ├── product.model.ts     # Product interface + stock status logic
│   ├── sale.model.ts        # Sale interface + invoice generation
│   └── customer.model.ts    # Customer interface
│
├── services/                # Firebase service layer (Firestore CRUD)
│   ├── auth.service.ts      # Firebase Authentication
│   ├── product.service.ts   # Products Firestore operations
│   ├── sale.service.ts      # Sales + batch stock updates
│   └── customer.service.ts  # Customers + purchase history
│
├── providers/               # State management (equivalent to Flutter Provider)
│   ├── app.provider.ts      # Global Zustand store
│   └── demo-data.ts         # Sample data for demo mode
│
├── screens/                 # Full-page screen components (Flutter Screens)
│   ├── LoginScreen.tsx      # Authentication screen
│   ├── DashboardScreen.tsx  # Overview & analytics
│   ├── ProductsScreen.tsx   # Product management
│   ├── SalesScreen.tsx      # Sales management
│   ├── CustomersScreen.tsx  # Customer management
│   └── ReportsScreen.tsx    # Reports & CSV export
│
├── widgets/                 # Reusable UI components (Flutter Widgets)
│   ├── ui.tsx               # Material 3 component library
│   ├── AppBar.tsx           # Top navigation bar
│   └── Sidebar.tsx          # Collapsible sidebar navigation
│
└── app/                     # Next.js App Router
    ├── page.tsx             # Root app (auth guard + screen router)
    ├── layout.tsx           # HTML layout + fonts
    └── globals.css          # Material 3 CSS variables
```

---

## 🔥 Firebase Setup

### Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** → Enter project name → Continue
3. Disable Google Analytics (optional) → Create project

### Step 2: Enable Authentication

1. In Firebase Console → **Authentication** → **Get started**
2. Click **Sign-in method** → Enable **Email/Password**
3. Go to **Users** tab → **Add user**
   - Email: `admin@yourshop.com`
   - Password: `your-secure-password`

### Step 3: Create Firestore Database

1. In Firebase Console → **Firestore Database** → **Create database**
2. Choose **Start in production mode** → Select region → Done
3. Go to **Rules** tab and set:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Step 4: Get Firebase Config

1. In Firebase Console → **Project Settings** (gear icon)
2. Scroll to **"Your apps"** → Click **Web** icon (`</>`)
3. Register app → Copy the `firebaseConfig` object

### Step 5: Configure Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
```

---

## 📊 Firestore Data Structure

### `/products/{productId}`
```json
{
  "name": "Wireless Headphones",
  "category": "Electronics",
  "price": 79.99,
  "stock": 45,
  "description": "High-quality wireless headphones",
  "sku": "WH-001",
  "status": "in_stock",
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-02-01T12:00:00Z"
}
```

### `/sales/{saleId}`
```json
{
  "invoiceNumber": "INV-2024-0001",
  "customerId": "customer_id",
  "customerName": "Alice Johnson",
  "items": [
    {
      "productId": "product_id",
      "productName": "Wireless Headphones",
      "quantity": 2,
      "unitPrice": 79.99,
      "subtotal": 159.98
    }
  ],
  "subtotal": 159.98,
  "tax": 10,
  "taxAmount": 16.00,
  "total": 175.98,
  "paymentMethod": "credit_card",
  "status": "completed",
  "notes": "",
  "date": "2024-02-28",
  "createdAt": "2024-02-28T14:30:00Z"
}
```

### `/customers/{customerId}`
```json
{
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "phone": "+1 555-0101",
  "address": "123 Main St",
  "city": "New York",
  "country": "USA",
  "totalOrders": 12,
  "totalSpent": 1240.50,
  "status": "active",
  "joinDate": "2023-01-15",
  "notes": "VIP customer"
}
```

---

## 🛠️ Development Setup

### Prerequisites
- [Bun](https://bun.sh/) (package manager)
- Node.js 20+

### Install & Run

```bash
# Install dependencies
bun install

# Start development server
bun dev

# Type checking
bun typecheck

# Lint
bun lint

# Production build
bun build
```

### Demo Mode

The app works **without Firebase** using built-in demo data.

**Demo credentials:**
- Email: `admin@shop.com`
- Password: `admin123`

---

## 🎨 Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js 16 | React framework (App Router) |
| React 19 | UI library |
| TypeScript | Type safety |
| Tailwind CSS 4 | Utility styling |
| Zustand | State management (Provider equivalent) |
| Firebase | Auth + Firestore backend |
| Recharts | Data visualization |
| Lucide React | Icons |

---

## 📱 Responsive Design

- **Desktop (1280px+)**: Full sidebar + content
- **Tablet (768px+)**: Collapsible sidebar
- **Mobile**: Sidebar collapses to icon-only mode

---

## 🔒 Security Notes

1. Never commit `.env.local` to version control
2. Set proper Firestore security rules in production
3. Use Firebase App Check for additional security
4. Restrict API key in Google Cloud Console

---

## 📄 License

MIT License — Free to use for personal and commercial projects.
