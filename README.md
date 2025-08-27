# Beautiful Admin Portal - Enhanced E-commerce Suite

A comprehensive admin portal with full e-commerce functionality, automated email systems, age verification, and customer management.

![Admin Portal](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![React](https://img.shields.io/badge/React-18.3.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-blue)
![Supabase](https://img.shields.io/badge/Supabase-Backend-green)
![Square](https://img.shields.io/badge/Square-Payments-orange)

## 🚀 Live Demo

**Deployed URL:** https://ukkh9u25pcbe.space.minimax.io

## ✨ Features

### 🛒 **Complete E-commerce System**
- **Shopping Cart**: Full cart functionality with persistent sessions
- **Square Payments**: Production-ready payment processing
- **Product Management**: Admin interface for managing inventory
- **Order Management**: Complete order tracking and fulfillment
- **Storefront**: Beautiful customer-facing store at `/store`

### 🔞 **Age Verification System**
- **21+ Popup**: Automatic age verification on site entry
- **ageverifier.net Integration**: Real API integration (with placeholder support)
- **Compliance Tracking**: Session logging for regulatory compliance
- **Fallback Mode**: Works with placeholder API key during development

### 📧 **Automated Email System**
- **Order Confirmations**: Automatic emails after successful purchases
- **Re-order Reminders**: Daily cron job for 14-day follow-ups
- **Abandoned Cart**: Email sequences for incomplete checkouts
- **Email Logging**: Track all email sends with metrics

### 👥 **Customer Management**
- **CSV/Excel Import**: Bulk upload customer leads
- **Customer Dashboard**: View purchase history and metrics
- **Lead Management**: Track imported vs. organic customers
- **Export Templates**: Downloadable CSV templates for imports

### 🎯 **Marketing Suite**
- **Content Management**: Full CMS capabilities
- **Media Library**: Asset management system
- **Social Hub**: Social media management tools
- **Analytics Dashboard**: Comprehensive reporting

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS + Lucide Icons
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **Payments**: Square Payment API
- **Email**: Resend API
- **Age Verification**: ageverifier.net API
- **Charts**: Recharts
- **Routing**: React Router v6

## 📋 Prerequisites

- Node.js 18+ 
- npm or pnpm
- Supabase project
- Square account (production credentials)
- ageverifier.net API key (optional - uses placeholder)
- Resend API key for emails

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone <repository-url>
cd beautiful-admin-portal
npm install
```

### 2. Environment Setup
Create `.env.local` with your credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SQUARE_APPLICATION_ID=your_square_app_id
VITE_SQUARE_ENVIRONMENT=production
```

### 3. Supabase Setup
Deploy the included Edge Functions:
```bash
# Age verification
supabase functions deploy age-verification

# Cart management  
supabase functions deploy cart-management

# Square payments
supabase functions deploy square-payment

# Email system
supabase functions deploy send-order-confirmation
supabase functions deploy send-reorder-reminders
supabase functions deploy send-abandoned-cart-emails
```

### 4. Environment Variables (Supabase)
Set these in your Supabase project settings:
```env
SQUARE_ACCESS_TOKEN=your_square_access_token
SQUARE_APPLICATION_ID=your_square_app_id
SQUARE_ENVIRONMENT=production
RESEND_API_KEY=your_resend_api_key
AGEVERIFIER_API_KEY=YOUR_AGEVERIFIER_API_KEY_HERE
```

### 5. Database Setup
The following tables are required (auto-created by the application):
- `products`
- `product_variants` 
- `orders`
- `order_items`
- `customers`
- `cart_sessions`
- `age_verification_sessions`
- `email_logs`

### 6. Run Development Server
```bash
npm run dev
```

### 7. Build for Production
```bash
npm run build
npm run preview
```

## 🗺️ Application Routes

### Admin Routes (Main Portal)
- `/` - Dashboard (redirects to `/dashboard`)
- `/dashboard` - Main admin dashboard
- `/products` - Product management
- `/orders` - Order management
- `/customers` - Customer management with CSV import
- `/coas` - Certificate of Analysis management
- `/content` - Content management system
- `/media` - Media library
- `/marketing` - Marketing hub
- `/social` - Social media management
- `/analytics` - Analytics dashboard
- `/settings` - System settings

### Public Routes (Customer-Facing)
- `/store` - Public storefront
- `/checkout` - Checkout process

## 💼 Key Components

### Age Verification System
```typescript
// Automatic popup on site entry
<AgeVerificationModal 
  isOpen={showAgeVerification}
  onVerified={handleAgeVerified}
  onClose={handleCloseAgeVerification}
/>
```

### Shopping Cart
```typescript
// Context-based cart management
const { items, totalAmount, addToCart } = useCart()
```

### Customer Import
```typescript
// CSV/Excel upload with validation
const handleFileUpload = async (file) => {
  const customers = parseCSV(await file.text())
  await importCustomers(customers)
}
```

## 🔧 Configuration

### Square Payments
- Uses production Square environment
- Handles credit card processing
- Automatic order creation and email triggers

### Age Verification
- Set `AGEVERIFIER_API_KEY=YOUR_AGEVERIFIER_API_KEY_HERE` for placeholder mode
- Real API integration ready when key is provided
- Automatic session logging for compliance

### Email Automation
- **Order Confirmation**: Triggered after successful payment
- **Re-order Reminders**: Daily cron job (14-day interval)
- **Abandoned Cart**: Triggered by cart inactivity

### Customer Import Format
CSV Requirements:
```csv
email,first_name,last_name,phone,address,city,state,zip_code,date_of_birth
john@example.com,John,Doe,555-123-4567,123 Main St,Anytown,CA,12345,1990-01-01
```

## 📊 Database Schema

### Core Tables
- **customers**: Customer information with import tracking
- **products**: Product catalog with variants
- **orders**: Order records with payment status
- **cart_sessions**: Persistent cart data
- **age_verification_sessions**: Compliance logging
- **email_logs**: Email delivery tracking

## 🔄 Automated Workflows

### Daily Processes
1. **Re-order Reminder Emails** (Daily at configured time)
   - Finds orders from 14 days ago
   - Sends personalized re-order suggestions
   - Logs email delivery status

### Real-time Processes
1. **Order Confirmation** (Triggered by payment)
2. **Age Verification** (On-demand during checkout)
3. **Cart Management** (Real-time updates)

## 🚀 Deployment

The application is designed for easy deployment:

1. **Frontend**: Static files can be deployed to any CDN/hosting
2. **Backend**: Supabase Edge Functions handle all server-side logic
3. **Database**: Fully managed by Supabase
4. **Payments**: Direct integration with Square API

## 🔐 Security Features

- **Age Verification**: Compliant age checking with session tracking
- **Payment Security**: PCI-compliant Square integration
- **CORS Protection**: Proper cross-origin configuration
- **Input Validation**: All user inputs are sanitized
- **Session Management**: Secure cart and verification sessions

## 📈 Analytics & Reporting

- **Customer Metrics**: Track customer lifetime value
- **Sales Analytics**: Revenue and order tracking
- **Email Performance**: Delivery and engagement metrics
- **Product Performance**: Bestsellers and inventory insights

## 🛟 Support

For issues or questions:
1. Check the browser console for error messages
2. Verify environment variables are set correctly
3. Ensure all Supabase Edge Functions are deployed
4. Check Supabase logs for backend issues

## 📝 License

This project is proprietary software developed for specific business requirements.

## 🚀 Recent Enhancements

- ✅ **Complete E-commerce Integration**: Cart, checkout, and payments
- ✅ **Age Verification System**: 21+ popup with API integration
- ✅ **Automated Email System**: Order confirmations and reminders  
- ✅ **CSV Customer Import**: Bulk lead upload functionality
- ✅ **Production Deployment**: Ready for live use
- ✅ **Comprehensive Testing**: All features validated

---

**Built with ❤️ using React, TypeScript, and modern web technologies**