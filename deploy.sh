#!/bin/bash

# After creating the repo on GitHub, run this script
# Replace YOUR_GITHUB_USERNAME with your actual GitHub username

echo "Enter your GitHub username:"
read GITHUB_USERNAME

# Add remote origin
git remote add origin https://github.com/$GITHUB_USERNAME/kaoriumcontract.git

# Push to main branch
git branch -M main
git push -u origin main

echo "✅ Code pushed to GitHub!"
echo ""
echo "To deploy with GitHub Pages:"
echo "1. Go to https://github.com/$GITHUB_USERNAME/kaoriumcontract/settings/pages"
echo "2. Under 'Source', select 'Deploy from a branch'"
echo "3. Choose 'main' branch and '/ (root)' folder"
echo "4. Click 'Save'"
echo ""
echo "Your site will be available at: https://$GITHUB_USERNAME.github.io/kaoriumcontract"
echo ""
echo "Alternative - Deploy with Netlify:"
echo "1. Go to https://app.netlify.com/start"
echo "2. Connect your GitHub account"
echo "3. Select the kaoriumcontract repository"
echo "4. Click 'Deploy site'"