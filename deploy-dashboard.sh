#!/bin/bash

# Build the application
echo "Building the application..."
npm run build

# Deploy to Vercel
echo "Deploying to Vercel..."
vercel --prod

# Deploy to Netlify
echo "Deploying to Netlify..."
netlify deploy --prod

# Update DNS records
echo "Updating DNS records..."
# Add your DNS update commands here

# Verify deployment
echo "Verifying deployment..."
# Add your verification commands here

# Notify team
echo "Deployment complete!"
# Add your notification commands here
