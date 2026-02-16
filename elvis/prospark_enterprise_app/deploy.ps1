# ProSpark Cleaning Hub - Automated Deployment Script
# This script deploys your app to Vercel with one command

# Color output
function Write-Success { Write-Host $args -ForegroundColor Green }
function Write-Info { Write-Host $args -ForegroundColor Cyan }
function Write-Error { Write-Host $args -ForegroundColor Red }

Write-Info "=========================================="
Write-Info "ProSpark Cleaning Hub - Auto Deployment"
Write-Info "=========================================="
Write-Info ""

# Check if Git is installed
Write-Info "Checking Git installation..."
$gitExists = Get-Command git -ErrorAction SilentlyContinue
if (-not $gitExists) {
    Write-Error "❌ Git is not installed!"
    Write-Info "Please install Git from: https://git-scm.com/download/win"
    exit 1
}
Write-Success "✅ Git found"

# Check if Vercel CLI is installed
Write-Info "Checking Vercel CLI..."
$vercelExists = Get-Command vercel -ErrorAction SilentlyContinue
if (-not $vercelExists) {
    Write-Info "Installing Vercel CLI..."
    npm install -g vercel
    Write-Success "✅ Vercel CLI installed"
} else {
    Write-Success "✅ Vercel CLI found"
}

Write-Info ""
Write-Info "Choose deployment method:"
Write-Info "1. GitHub + Vercel (Recommended)"
Write-Info "2. Direct Vercel Deployment"
Write-Info ""
$choice = Read-Host "Enter your choice (1 or 2)"

if ($choice -eq "1") {
    Write-Info ""
    Write-Info "=== GitHub Setup ==="
    
    # Get GitHub credentials
    $githubUsername = Read-Host "Enter your GitHub username"
    $githubToken = Read-Host "Enter your GitHub token (or press Enter to use git credential)" -AsSecureString
    $repoName = "prospark-cleaning-hub"
    
    # Set project directory
    $projectDir = "c:\Users\user\OneDrive\Desktop\elvis\prospark_enterprise_app"
    cd $projectDir
    
    Write-Info "Initializing Git repository..."
    git init
    git config user.email "$githubUsername@users.noreply.github.com"
    git config user.name $githubUsername
    
    Write-Info "Adding files to Git..."
    git add .
    
    Write-Info "Creating initial commit..."
    git commit -m "Initial commit: ProSpark Cleaning Hub Enterprise App"
    
    Write-Info "Setting remote origin..."
    $remoteUrl = "https://$githubUsername@github.com/$githubUsername/$repoName.git"
    git remote add origin $remoteUrl
    
    Write-Info "Pushing to GitHub..."
    git branch -M main
    git push -u origin main
    
    Write-Success "✅ Code pushed to GitHub!"
    Write-Info "Repository: https://github.com/$githubUsername/$repoName"
    
    Write-Info ""
    Write-Info "=== Vercel Deployment ==="
    Write-Info "Deploying with Vercel..."
    
    # Deploy to Vercel
    vercel --prod
    
    Write-Success "✅ Deployment complete!"
    
} elseif ($choice -eq "2") {
    
    Write-Info ""
    Write-Info "=== Direct Vercel Deployment ==="
    
    $projectDir = "c:\Users\user\OneDrive\Desktop\elvis\prospark_enterprise_app"
    cd $projectDir
    
    Write-Info "Deploying directly to Vercel..."
    vercel --prod
    
    Write-Success "✅ Deployment complete!"
    
} else {
    Write-Error "Invalid choice!"
    exit 1
}

Write-Info ""
Write-Success "=========================================="
Write-Success "🎉 Your app is now live!"
Write-Success "=========================================="
Write-Info ""
Write-Info "Next steps:"
Write-Info "1. Check your app at the provided URL"
Write-Info "2. Share the link with customers/team"
Write-Info "3. Monitor from Vercel dashboard"
Write-Info ""
Write-Info "Questions? Email: prosparkcleaninghub@gmail.com"
