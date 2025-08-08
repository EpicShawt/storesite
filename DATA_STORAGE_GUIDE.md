# 📊 **Data Storage & Management Guide**

## **How to Check Your Data in MongoDB Atlas**

### **🔍 Step 1: Access MongoDB Collections**

**1.1 Go to MongoDB Atlas:**
- Visit: https://cloud.mongodb.com
- Login to your account
- Click on your "asurwear" cluster

**1.2 Browse Collections:**
- Click **"Browse Collections"** button
- You should see these collections:
  - `products` (product data + Cloudinary URLs)
  - `users` (user signups + passwords)
  - `analytics` (tracking data)
  - `orders` (order data)

### **📋 Step 2: Check Product Data**

**2.1 View Products Collection:**
- Click on `products` collection
- You'll see all uploaded products with:
  - Product name, price, description
  - Cloudinary image URLs
  - Product links (admin only)
  - Creation timestamps

**2.2 Sample Product Document:**
```json
{
  "_id": "ObjectId(...)",
  "name": "Vintage T-Shirt",
  "price": 999,
  "category": "Vintage",
  "description": "Comfortable vintage style t-shirt",
  "images": [
    {
      "url": "https://res.cloudinary.com/dqu1xuwye/image/upload/...",
      "publicId": "asurwears/products/abc123",
      "cloudinaryUrl": "https://res.cloudinary.com/dqu1xuwye/image/upload/..."
    }
  ],
  "productLink": "https://example.com/product-link",
  "sizes": ["S", "M", "L", "XL"],
  "inStock": true,
  "featured": false,
  "views": 0,
  "sales": 0,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### **👥 Step 3: Check User Data**

**3.1 View Users Collection:**
- Click on `users` collection
- You'll see all user signups with:
  - Email addresses (unique)
  - Hashed passwords
  - Registration dates
  - User roles

**3.2 Sample User Document:**
```json
{
  "_id": "ObjectId(...)",
  "email": "user@example.com",
  "password": "$2b$10$hashedpassword...",
  "isAdmin": false,
  "isManager": false,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### **📈 Step 4: Check Analytics Data**

**4.1 View Analytics Collection:**
- Click on `analytics` collection
- You'll see daily tracking data:
  - Page views
  - User actions
  - Performance metrics
  - Revenue data

**4.2 Sample Analytics Document:**
```json
{
  "_id": "ObjectId(...)",
  "date": "2024-01-15T00:00:00.000Z",
  "pageViews": {
    "home": 25,
    "products": 15,
    "productDetail": 8,
    "cart": 3,
    "admin": 2
  },
  "userActions": {
    "productViews": 30,
    "addToCart": 5,
    "purchases": 2,
    "imageUploads": 3,
    "adminLogins": 1
  },
  "performance": {
    "averageLoadTime": 1200,
    "totalRequests": 150,
    "errorRate": 0.5,
    "uptime": 99.8
  },
  "revenue": {
    "totalSales": 1998,
    "totalOrders": 2,
    "averageOrderValue": 999
  }
}
```

---

## **🔧 Admin Panel Features**

### **✅ Product Management:**
- **Add Products**: Upload images + product details
- **Edit Products**: Update prices, descriptions, stock
- **Delete Products**: Remove with confirmation
- **View All Products**: See all stored products

### **✅ User Management:**
- **View Users**: See all registered users
- **User Roles**: Admin, Manager, User
- **Unique Emails**: No duplicate email signups

### **✅ Image Management:**
- **Cloudinary Storage**: All images stored on Cloudinary
- **Optimized URLs**: Automatic compression and CDN
- **Product Links**: Admin-only product links stored

---

## **🧪 Testing Your Setup**

### **Test 1: Backend Health**
Visit: `https://asurwears-backend.vercel.app/`
Should show: MongoDB + Cloudinary status

### **Test 2: Admin Login**
- Go to admin panel
- Login: `akshat@asurwear.com` / `admin123`
- Should see dashboard

### **Test 3: Product Upload**
- Upload a product image
- Add product details
- Check MongoDB collections

### **Test 4: User Signup**
- Register a new user
- Check `users` collection
- Verify unique email constraint

### **Test 5: Data Verification**
- Go to MongoDB Atlas
- Browse collections
- Verify data is stored correctly

---

## **📊 What Gets Stored:**

### **Products:**
- ✅ Product name, price, description
- ✅ Category, sizes, stock status
- ✅ Cloudinary image URLs
- ✅ Product links (admin only)
- ✅ Views, sales metrics
- ✅ Creation/update timestamps

### **Users:**
- ✅ Email (unique constraint)
- ✅ Hashed password
- ✅ User role (admin/manager/user)
- ✅ Registration date
- ✅ Last login

### **Analytics:**
- ✅ Page views by page
- ✅ User actions (views, purchases, uploads)
- ✅ Performance metrics (load times, errors)
- ✅ Revenue data (sales, orders)
- ✅ Daily tracking

### **Orders:**
- ✅ Order details
- ✅ Customer information
- ✅ Product information
- ✅ Payment status
- ✅ Order timestamps

---

## **🔍 How to Verify Data Storage:**

**1. Check MongoDB Atlas:**
- Login to MongoDB Atlas
- Click "Browse Collections"
- View each collection's documents

**2. Check Admin Panel:**
- Login as admin
- View products list
- Check user management

**3. Check Cloudinary:**
- Login to Cloudinary dashboard
- View uploaded images
- Check image URLs

**4. Check Analytics:**
- Visit: `/api/admin/analytics`
- View tracking data

**Everything is automatically stored and tracked!** 🚀 