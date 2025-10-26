# Vercel Deployment Guide

## ✅ Configuration Files Created

1. **`vercel.json`** - Vercel deployment configuration
2. **`.vercelignore`** - Files to exclude from deployment
3. **Updated `package.json`** - Build script for monorepo

## 📝 What Was Fixed

### Issue:
Vercel was trying to build the entire monorepo (including contracts and backend) instead of just the frontend.

### Solution:
1. **Root `package.json` build script** now explicitly builds only the frontend:
   ```json
   "build": "cd frontend && pnpm install && pnpm build"
   ```

2. **`vercel.json`** specifies:
   - Build command: `pnpm build` (uses root package.json script)
   - Output directory: `frontend/.next` (Next.js build output)
   - Install command: `pnpm install --no-frozen-lockfile`

3. **`.vercelignore`** excludes:
   - `contracts/` - Smart contract code
   - `backend/` - Node.js automation service
   - Documentation files
   - Environment files

## 🚀 Deployment Steps

### Option 1: Push to GitHub
```bash
git add vercel.json .vercelignore package.json
git commit -m "chore: configure Vercel deployment for frontend"
git push origin development
```

Vercel will automatically detect and deploy from the `development` branch.

### Option 2: Manual Deploy via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

## 🔍 Build Process

When Vercel builds your project:

1. **Install**: `pnpm install --no-frozen-lockfile`
   - Installs all workspace dependencies
   - Includes frontend, contracts, and backend packages

2. **Build**: `pnpm build` (runs root package.json script)
   - Changes to `frontend/` directory
   - Runs `pnpm install` in frontend
   - Runs `pnpm build` to build Next.js app

3. **Output**: `frontend/.next/`
   - Next.js optimized production build
   - Static assets and server functions

## ⚠️ About the Warning

The warning you saw:
```
Ignored build scripts: bufferutil, esbuild, keccak, sharp, unrs-resolver, utf-8-validate
```

**This is NORMAL and NOT an error!** 

- It's a security feature in pnpm v10
- Vercel sandboxes builds to prevent malicious scripts
- These packages (cryptographic and image processing) are safe but have native bindings
- The build will complete successfully despite this warning

## ✅ Expected Behavior

After this configuration:
- ✅ Vercel builds only the frontend
- ✅ Contracts and backend are ignored
- ✅ Build completes successfully
- ✅ Frontend deployed to Vercel URL

## 🌍 Environment Variables

Make sure to set in Vercel dashboard:
1. Go to Project Settings → Environment Variables
2. Add:
   ```
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
   NEXT_PUBLIC_ENABLE_LOCALHOST=false
   ```

## 📊 Monorepo Structure

```
ethonline2025-hackathlon/
├── frontend/           ← DEPLOYED TO VERCEL
│   ├── package.json
│   └── .next/         ← Build output
├── contracts/         ← IGNORED (not deployed)
├── backend/           ← IGNORED (runs separately)
├── vercel.json        ← Vercel config
└── .vercelignore      ← Ignore patterns
```

## 🐛 Troubleshooting

### If build still fails:

1. **Check Vercel logs** for actual errors (not warnings)
2. **Verify environment variables** are set correctly
3. **Try local build**:
   ```bash
   pnpm build
   ```
4. **Clear Vercel cache**:
   - Go to Deployments tab
   - Click "..." menu
   - Select "Redeploy"
   - Check "Use existing Build Cache" = OFF

### If you see "Module not found" errors:

Check that `frontend/.env.local` exists (but don't commit it):
```bash
cd frontend
cp env.local.example .env.local
# Edit with your values
```

## 🎉 Success!

Once deployed, your frontend will be live at:
- **Production**: `https://your-project.vercel.app`
- **Branch**: `https://your-project-git-development.vercel.app`

The frontend can interact with:
- Smart contracts deployed on Arbitrum Sepolia
- Your own backend service (if deployed separately)

---

**Need help?** Check [Vercel Docs](https://vercel.com/docs) or the build logs in Vercel dashboard.

