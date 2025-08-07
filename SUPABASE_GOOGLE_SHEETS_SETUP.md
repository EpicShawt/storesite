# 🚀 **Supabase + Google Sheets Setup Guide**

## **Free Backend Solution for Asur Wear**

### **What You Get:**
- ✅ **Free Supabase Database** (50,000 monthly users)
- ✅ **Free Google Sheets Storage** (real-time data sync)
- ✅ **Free File Storage** (Supabase Storage)
- ✅ **Real-time Updates**
- ✅ **Automatic Backups**

---

## **Step 1: Set Up Supabase (Free Database)**

### **1.1 Create Supabase Account**
1. **Go to [supabase.com](https://supabase.com)**
2. **Sign up with GitHub**
3. **Click "New Project"**
4. **Choose your organization**
5. **Set project name**: `asurwears`
6. **Set database password**: `asurwears123` (remember this!)
7. **Choose region**: `Asia Pacific (Singapore)` for best performance
8. **Click "Create new project"**

### **1.2 Get Your Supabase Credentials**
1. **Go to Settings → API**
2. **Copy these values:**
   - **Project URL**: `https://your-project-id.supabase.co`
   - **Anon Key**: `your-anon-key-here`

### **1.3 Create Database Tables**
1. **Go to SQL Editor**
2. **Run this SQL to create tables:**

```sql
-- Products table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  category TEXT,
  description TEXT,
  image_url TEXT,
  product_link TEXT,
  sizes TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  password_hash TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  is_manager BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  items JSONB NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  shipping_address JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **1.4 Set Up Storage Bucket**
1. **Go to Storage**
2. **Click "Create bucket"**
3. **Name**: `product-images`
4. **Public bucket**: ✅ **Yes**
5. **Click "Create bucket"**

---

## **Step 2: Set Up Google Sheets**

### **2.1 Create Google Sheets**
1. **Go to [sheets.google.com](https://sheets.google.com)**
2. **Create 3 new spreadsheets:**

#### **Products Sheet**
- **Name**: `Asur Wear - Products`
- **URL**: Copy this URL for later
- **Add headers**: `ID | Name | Price | Category | Description | Image URL | Created At`

#### **Orders Sheet**
- **Name**: `Asur Wear - Orders`
- **URL**: Copy this URL for later
- **Add headers**: `ID | Customer Name | Customer Email | Total Amount | Status | Created At`

#### **Users Sheet**
- **Name**: `Asur Wear - Users`
- **URL**: Copy this URL for later
- **Add headers**: `ID | Email | Name | Role | Created At`

### **2.2 Get Google Sheets API Credentials**
1. **Go to [Google Cloud Console](https://console.cloud.google.com)**
2. **Create new project**: `asurwears-sheets`
3. **Enable Google Sheets API**
4. **Create Service Account:**
   - **Go to IAM & Admin → Service Accounts**
   - **Click "Create Service Account"**
   - **Name**: `asurwears-sheets`
   - **Description**: `Service account for Asur Wear Google Sheets integration`
   - **Click "Create and Continue"**
   - **Role**: `Editor`
   - **Click "Done"**
5. **Create Key:**
   - **Click on your service account**
   - **Go to "Keys" tab**
   - **Click "Add Key" → "Create new key"**
   - **Choose JSON**
   - **Download the JSON file**
   - **Rename to**: `google-credentials.json`
   - **Upload to your backend folder**

### **2.3 Share Google Sheets**
1. **Open each Google Sheet**
2. **Click "Share"**
3. **Add your service account email** (from the JSON file)
4. **Give "Editor" access**
5. **Click "Send"**

---

## **Step 3: Deploy to Render**

### **3.1 Create Render Account**
1. **Go to [render.com](https://render.com)**
2. **Sign up with GitHub**
3. **Click "New +" → "Web Service"**
4. **Connect your `storesite` repository**

### **3.2 Configure Render Service**
- **Name**: `asurwears-backend`
- **Environment**: `Node`
- **Build Command**: `cd backend && npm install`
- **Start Command**: `cd backend && npm start`

### **3.3 Add Environment Variables**
In Render dashboard, add these:

```
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
JWT_SECRET=your-secret-key-here
GOOGLE_SHEETS_PRODUCTS_ID=your-products-sheet-id
GOOGLE_SHEETS_ORDERS_ID=your-orders-sheet-id
GOOGLE_SHEETS_USERS_ID=your-users-sheet-id
```

**To get Sheet IDs:**
- Open your Google Sheet
- Copy the ID from URL: `https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit`

---

## **Step 4: Update Vercel**

### **4.1 Add Environment Variable**
1. **Go to your Vercel dashboard**
2. **Find your project settings**
3. **Add environment variable:**
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-render-url.onrender.com`

---

## **Step 5: Test Everything**

### **5.1 Test Backend**
Visit: `https://your-render-url.onrender.com/`
Should see:
```json
{
  "message": "Asur Wears Backend is running!",
  "database": "Supabase + Google Sheets"
}
```

### **5.2 Test Your Site**
1. **Wait 2-3 minutes for Vercel to update**
2. **Go to your admin panel**
3. **Try uploading a product image**
4. **Check Google Sheets** - data should appear automatically!

---

## **🎉 Benefits You Get:**

### **✅ Free Storage**
- **Supabase**: 1GB database + 1GB file storage
- **Google Sheets**: Unlimited storage
- **Automatic backups**

### **✅ Real-time Data**
- **Products**: Stored in Supabase + Google Sheets
- **Orders**: Automatic sync to sheets
- **Users**: Complete user management

### **✅ Easy Management**
- **View all data in Google Sheets**
- **Edit products directly in sheets**
- **Track orders in real-time**
- **Customer data management**

### **✅ Reliable & Fast**
- **Global CDN**
- **99.9% uptime**
- **Automatic scaling**

---

## **🔧 Troubleshooting**

### **If Backend Shows "Cannot Get":**
1. **Check Render logs**
2. **Verify environment variables**
3. **Make sure Supabase URL is correct**

### **If Upload Fails:**
1. **Check Supabase Storage bucket exists**
2. **Verify service account has access**
3. **Check file size limits**

### **If Google Sheets Not Updating:**
1. **Verify service account email is added to sheets**
2. **Check sheet IDs are correct**
3. **Ensure sheets are shared with service account**

---

## **📞 Need Help?**

**Tell me:**
1. **Your Supabase URL**
2. **Your Render URL**
3. **Any error messages**

I'll help you fix any issues! 🚀 