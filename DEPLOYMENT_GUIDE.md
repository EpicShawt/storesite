# Asiur Wear - Deployment Guide

## Quick Deployment Options

### Option 1: Netlify Drop (Easiest - No Account Required)
1. Go to https://app.netlify.com/drop
2. Drag and drop the `frontend/dist` folder to the deployment area
3. Your site will be live in seconds!

### Option 2: Vercel (Free Hosting)
1. Go to https://vercel.com
2. Sign up with GitHub
3. Import your repository: `https://github.com/EpicShawt/storesite.git`
4. Set the root directory to `frontend`
5. Deploy!

### Option 3: Railway (Backend Deployment)
1. Go to https://railway.app
2. Sign up with GitHub
3. Create new project
4. Connect your repository
5. Set the root directory to `backend`
6. Add environment variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Any random string for JWT tokens
   - `NODE_ENV`: production

## Current Status
- ✅ Frontend built successfully
- ✅ Backend configured for deployment
- ✅ CORS configured for production
- ✅ Environment variables set up

## Local Development
- Frontend: http://localhost:3000 (or 3001, 3002)
- Backend: http://localhost:5000

## Features Ready
- ✅ Modern dark theme design
- ✅ Animated logo with "Asiur Wear" / "Mythically Vibey" text
- ✅ Product catalog with t-shirts at ₹499
- ✅ Shopping cart functionality
- ✅ OTP authentication (console-based for testing)
- ✅ Admin panel with hardcoded credentials
- ✅ Responsive design
- ✅ Infinite scrolling banner
- ✅ Footer with social links

## Admin Access
- Email: `akshat@asurwears.com`
- Password: `admin@123`
- Access via: `/admin-login` route

## Testing OTP
- Enter any email in the login form
- Check browser console (F12) for the OTP
- Use that OTP to complete login

## Next Steps
1. Deploy frontend using one of the options above
2. Deploy backend to Railway or similar service
3. Update frontend environment variables with backend URL
4. Share the live URL with your friend!

## Live Demo URLs
Once deployed, your site will be available at:
- Frontend: https://your-project-name.vercel.app
- Backend: https://your-project-name.railway.app 