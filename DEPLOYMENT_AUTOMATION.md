# Automated Deployment Setup

## 🚀 Auto-Deploy on Git Push

Every time you push to the `main` branch, your code automatically deploys to production.

---

## Setup (One-Time Configuration)

### 1. Add Secrets to GitHub

Go to your repository on GitHub:
1. Click **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add these three secrets:

| Secret Name | Value |
|------------|--------|
| `VPS_HOST` | `72.62.71.250` |
| `VPS_USERNAME` | `root` |
| `VPS_PASSWORD` | Your server password |

### 2. That's It! 🎉

Now every push to `main` triggers automatic deployment.

---

## How to Deploy

### Simple Workflow:

```bash
# 1. Make your changes locally
# Edit files...

# 2. Commit and push
git add .
git commit -m "Your changes"
git push

# 3. Watch GitHub Actions deploy automatically!
# Visit: https://github.com/waliulrayhan/HACKTOLIVE/actions
```

---

## What Happens Automatically

When you push to GitHub:

1. ✅ GitHub Actions triggers
2. ✅ Connects to your VPS via SSH
3. ✅ Stashes local changes
4. ✅ Pulls latest code
5. ✅ Installs dependencies
6. ✅ Builds backend
7. ✅ Builds frontend  
8. ✅ Restarts PM2 services
9. ✅ Your site is live! 🎉

**Time:** ~2-3 minutes from push to live

---

## Monitor Deployments

### View Deployment Status:
https://github.com/waliulrayhan/HACKTOLIVE/actions

### Check Deployment Logs:
- Click on the latest workflow run
- Click "Deploy to VPS"
- View real-time deployment logs

---

## Manual Deployment (If Needed)

You can still deploy manually using PowerShell:

```powershell
.\deploy-production.ps1
```

Or via SSH:

```bash
ssh root@72.62.71.250 "cd /var/www/hacktolive && git pull && cd backend && pnpm run build && pm2 restart all"
```

---

## Troubleshooting

### Deployment Failed?

1. **Check GitHub Actions logs:**
   - Go to Actions tab
   - Click failed workflow
   - Review error messages

2. **Common Issues:**

   - **Authentication failed:** Check VPS_PASSWORD secret
   - **Port 22 connection refused:** VPS might be down
   - **Build failed:** Check if code works locally first

3. **Rollback to Previous Version:**

   ```bash
   ssh root@72.62.71.250 "cd /var/www/hacktolive && git reset --hard HEAD~1 && cd backend && pnpm run build && pm2 restart all"
   ```

---

## Best Practices

✅ **Test locally first** - Run `npm start` before pushing  
✅ **Use descriptive commits** - Makes tracking easier  
✅ **Check Actions tab** - Verify deployment succeeded  
✅ **Monitor PM2** - Occasionally check `pm2 status`  
✅ **Backup database** - Before major changes  

---

## Advanced: Deploy Only on Tag

Want to deploy only when you create a release tag?

Change `.github/workflows/deploy.yml`:

```yaml
on:
  push:
    tags:
      - 'v*'  # Only deploy on version tags like v1.0.0
```

Then deploy:

```bash
git tag v1.0.0
git push origin v1.0.0
```

---

## Deployment Notifications (Optional)

### Add Discord/Slack Notifications:

Add this step to `deploy.yml` after deployment:

```yaml
- name: Notify Discord
  uses: sarisia/actions-status-discord@v1
  if: always()
  with:
    webhook: ${{ secrets.DISCORD_WEBHOOK }}
    status: ${{ job.status }}
    title: "Deployment to Production"
```

Then add `DISCORD_WEBHOOK` secret with your Discord webhook URL.

---

## Summary

**Before:** Manual SSH → Pull → Build → Restart (5+ minutes)  
**Now:** `git push` → ☕ Coffee → Live (2 minutes)

Your workflow is now:

```bash
# Code → Commit → Push → LIVE! 🚀
git add .
git commit -m "Feature: Added new feature"
git push
# Done! Check https://hacktolive.io
```
