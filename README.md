# Kaorium Contract Website

Software Development Agreement for Kaorium CRM MVP

## Deployment

### Option 1: Push with GitHub Token
1. Go to https://github.com/settings/tokens
2. Generate a new token (classic) with 'repo' scope
3. Run: `git push -u origin main`
4. Username: your GitHub username (mattboostkit)
5. Password: paste your token

### Option 2: Push with GitHub Desktop
1. Open GitHub Desktop
2. Add existing repository
3. Select this folder
4. Publish/Push changes

### Option 3: Use SSH
```bash
git remote set-url origin git@github.com:mattboostkit/kaoriumcontract.git
git push -u origin main
```

## Deploy to Netlify

1. Visit https://app.netlify.com
2. Import from Git
3. Select the kaoriumcontract repository
4. Deploy

## Deploy to GitHub Pages

1. Go to repository Settings
2. Navigate to Pages
3. Source: Deploy from branch (main)
4. Save

Site will be available at: https://mattboostkit.github.io/kaoriumcontract