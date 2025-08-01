# Vercel Deployment Steps

## Step-by-Step Instructions

### 1. Go to Vercel Dashboard
- Visit: https://vercel.com/dashboard
- Click "New Project"

### 2. Import from GitHub
- Select "Import Git Repository"
- Choose: `EpicShawt/storesite`
- Click "Import"

### 3. Configure Project Settings
- **Root Directory**: Change from `./` to `frontend/`
- **Framework Preset**: Should automatically detect "Vite"
- **Project Name**: `asiur-wear` (or your preferred name)
- **Build Command**: `npm run build` (should auto-detect)
- **Output Directory**: `dist` (should auto-detect)

### 4. Environment Variables (Optional)
- Add if needed for backend connection:
  - `VITE_API_URL`: Your backend URL

### 5. Deploy
- Click "Deploy"
- Wait for build to complete

## Expected Results
- ✅ Framework should show "Vite" (not "Other")
- ✅ Build should complete successfully
- ✅ Site should be live at: `https://your-project-name.vercel.app`

## Troubleshooting
If Vite is still not recognized:
1. Make sure Root Directory is set to `frontend/`
2. Check that `frontend/package.json` has `"build": "vite build"`
3. Verify `frontend/vite.config.js` exists
4. Ensure all files are committed to GitHub

## Live URL
Once deployed, your site will be available at:
`https://asiur-wear.vercel.app` (or your chosen project name) 