# AuraMart - Modern Lifestyle, Electronics & Beauty (Next.js 16 + Tailwind CSS)

A state-of-the-art e-commerce storefront & administration web application inspired by high-conversion Bangladeshi retail stores (`demo.scaleuper.com`), built with **Next.js 16 (App Router)**, **React 19**, and **Tailwind CSS**.

---

## 🌟 Key Features

### 🛍️ Customer Storefront
1. **Scrolling Special Notice Ticker**: Live top announcement bar with bolt badge, dynamic notice text from Admin, and dismiss button.
2. **Dynamic Hero Banner Slider**: Promotional banner carousel managed from database with discount tags and direct call to actions.
3. **Category Chips Navigation**: Horizontal quick scroll (All, Electronics, Cosmetics, Fashion, Flash Deals).
4. **Flash Sale Section**: Live 24h countdown timer (`[HH : MM : SS]`), discount badges (`-25% OFF`), and quick actions.
5. **High Converting Product Cards**: Hover animations, ratings, prices, 1-Click "অর্ডার করুন" (Cash on Delivery) and "কার্টে যোগ করুন" (Add to cart).
6. **Cart Slide-over Drawer**: Real-time quantity adjustments, subtotal calculation, and direct checkout trigger.
7. **Frictionless Cash on Delivery Checkout**:
   - Customer Full Name, Mobile Number, Delivery Address, Delivery Zone (Dhaka ৳70, Outside Dhaka ৳130).
   - "💰 ক্যাশ অন ডেলিভারি (পণ্য হাতে পেয়ে মূল্য পরিশোধ করুন)".
   - Instant confirmation screen with Order ID (`#AUR-...`) and order receipt.
8. **Live Order Tracking**: Customers can enter phone number or Order ID to view package timeline (Pending ➔ Processing ➔ In Courier ➔ Delivered).

---

### 🛡️ Admin Dashboard & Control Panel (`/admin`)
1. **Admin Login**:
   - **Email**: `afnan@gmail.com`
   - **Password**: `afnan31403140`
2. **Profit & Loss Analytics (`/admin`)**:
   - Time filters: **Last 7 Days**, **Last 30 Days**, **All Time**.
   - Metric cards: **Total Revenue**, **Total Buy Cost** (কতো দিয়ে কেনা), **Net Profit** (নিট লাভ) with Profit Margin %.
   - Category performance breakdown: Electronics vs Cosmetics vs Fashion profit comparison.
   - Daily Sales & Profit table.
3. **Order Management (`/admin/orders`)**:
   - Tabs: **Pending (Default)**, **In Progress**, **In Courier**, **Delivered**, **Cancelled**, **All**.
   - Search by customer name, phone, or order ID.
   - **Large Customer Order Details Modal**:
     - Customer info with click-to-dial phone link.
     - Full ordered items table with Buy Cost, Sell Price, and Profit per item.
     - Interactive Status Updater (Pending ➔ In Progress ➔ In Courier ➔ Delivered ➔ Cancelled).
     - Audit log with timestamps.
4. **Product Management (`/admin/products`)**:
   - Add new products with Buy Price (ক্রয়মূল্য), Sell Price, Original Price, Stock, Category, and Cloudinary image upload.
   - Edit and Delete products.
5. **Offers & Notices Management (`/admin/offers`)**:
   - Create promotional banners and update website scrolling notice ticker.

---

## 🚀 Getting Started

### 1. Environment Configuration
Ensure `.env.local` contains:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) for the storefront and [http://localhost:3000/admin](http://localhost:3000/admin) for the admin panel.
