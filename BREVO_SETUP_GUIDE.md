# Brevo Email Setup Guide - Asiur Wear

## 🚀 **Brevo Free Tier Setup**

### **Step 1: Create Brevo Account**
1. Go to https://www.brevo.com/
2. Click "Start for Free"
3. Sign up with your email
4. Verify your email address

### **Step 2: Get Your API Key**
1. **Login to Brevo Dashboard**
2. Go to **Settings** → **API Keys**
3. Click **"Create a new API key"**
4. Name it: `Asiur Wear OTP`
5. Select **"SMTP"** permissions
6. Copy the generated API key

### **Step 3: Update Environment Variables**
1. Open `backend/config.env`
2. Replace `your-brevo-api-key` with your actual API key:
   ```
   BREVO_API_KEY=xkeysib-your-actual-api-key-here
   ```

### **Step 4: Install Dependencies**
```bash
cd backend
npm install axios
```

### **Step 5: Test Email Sending**
1. Start your backend server
2. Try logging in with any email
3. Check your email for the OTP

## 📧 **Email Features**

### **✅ OTP Emails:**
- **Beautiful HTML Template** - Professional design
- **Asiur Wear Branding** - Consistent with your site
- **Security Features** - 10-minute expiration
- **Mobile Responsive** - Works on all devices

### **✅ Welcome Emails:**
- **New User Registration** - Welcome message
- **Brand Introduction** - About Asiur Wear
- **Call-to-Action** - "Start Shopping" button

## 🎨 **Email Template Features**

### **OTP Email Design:**
- **Header**: Asiur Wear logo and "Mythically Vibey"
- **OTP Display**: Large, bold numbers with spacing
- **Security Notice**: 10-minute expiration warning
- **Footer**: Professional disclaimer

### **Welcome Email Design:**
- **Personalized Greeting**: "Hello [Name]!"
- **Brand Introduction**: About Asiur Wear
- **Shopping Link**: Direct to your website
- **Professional Layout**: Clean, modern design

## 🔧 **Backend Integration**

### **Files Updated:**
- ✅ `backend/services/brevoService.js` - Email service
- ✅ `backend/services/otpService.js` - OTP logic
- ✅ `backend/package.json` - Added axios dependency
- ✅ `backend/config.env` - Brevo API key

### **API Endpoints:**
- **POST** `/api/auth/send-otp` - Send OTP email
- **POST** `/api/auth/verify-otp` - Verify OTP
- **POST** `/api/auth/register` - Send welcome email

## 📊 **Brevo Free Tier Limits**

### **✅ What's Included:**
- **300 emails/day** - Perfect for testing and small scale
- **SMTP API** - Full email functionality
- **HTML Templates** - Professional email designs
- **Email Analytics** - Track delivery and opens
- **No Credit Card Required** - Completely free

### **📈 Scaling Options:**
- **Starter Plan**: $25/month for 20,000 emails
- **Business Plan**: $65/month for 100,000 emails
- **Enterprise**: Custom pricing for large volumes

## 🚨 **Troubleshooting**

### **Common Issues:**

#### **1. API Key Not Working:**
- Verify API key is correct
- Check SMTP permissions are enabled
- Ensure account is verified

#### **2. Emails Not Sending:**
- Check server logs for errors
- Verify email address format
- Test with a simple email first

#### **3. OTP Not Received:**
- Check spam folder
- Verify email address
- Check Brevo dashboard for delivery status

### **Debug Steps:**
1. **Check Server Logs**:
   ```bash
   cd backend
   npm start
   # Look for Brevo error messages
   ```

2. **Test API Key**:
   ```bash
   curl -X POST "https://api.brevo.com/v3/smtp/email" \
     -H "api-key: YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"sender":{"name":"Test","email":"test@example.com"},"to":[{"email":"test@example.com"}],"subject":"Test","htmlContent":"<p>Test email</p>"}'
   ```

3. **Check Brevo Dashboard**:
   - Go to **Email** → **Activity**
   - Check delivery status
   - View bounce reports

## 🔒 **Security Best Practices**

### **✅ Implemented Security:**
- **OTP Expiration**: 10-minute timeout
- **One-time Use**: OTP deleted after verification
- **Rate Limiting**: Prevent abuse
- **Secure Storage**: MongoDB with encryption

### **🔐 Additional Recommendations:**
- **Environment Variables**: Never commit API keys
- **HTTPS Only**: Secure email transmission
- **Input Validation**: Sanitize email addresses
- **Logging**: Monitor for suspicious activity

## 📱 **Testing Your Setup**

### **Step 1: Test OTP Sending**
1. Go to your website
2. Navigate to `/login`
3. Enter your email address
4. Click "Send OTP"
5. Check your email for the OTP

### **Step 2: Test OTP Verification**
1. Enter the OTP from your email
2. Click "Verify OTP"
3. Should redirect to dashboard

### **Step 3: Test Registration**
1. Go to `/register`
2. Fill in your details
3. Check for welcome email

## 🎯 **Expected Results**

### **✅ Success Indicators:**
- **OTP emails received** within 30 seconds
- **Professional design** with Asiur Wear branding
- **Mobile responsive** emails
- **No console errors** in server logs
- **Successful login** after OTP verification

### **📊 Monitoring:**
- **Brevo Dashboard**: Track email delivery
- **Server Logs**: Monitor OTP requests
- **User Feedback**: Check login success rate

Your Brevo email integration is now ready! 🎉 