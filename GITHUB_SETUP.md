# GitHub Setup Guide

## Overview
This guide will help you configure your environment to push your NL_BOM_T project to GitHub.

## Prerequisites
- Git installed (already confirmed)
- GitHub account
- Your project initialized with Git (already confirmed)

## Step 1: Create a GitHub Repository
1. Go to [GitHub](https://github.com/) and sign in to your account
2. Click the '+' icon in the top-right corner and select 'New repository'
3. Name your repository 'NL_BOM_T' to match your local project name
4. Choose whether the repository should be public or private
5. Do NOT initialize the repository with a README, .gitignore, or license as your project already has these files
6. Click 'Create repository'

## Step 2: Update Your Remote Origin URL
Your repository currently has a placeholder URL. You need to update it with your actual GitHub username:

```bash
# Replace YOUR_USERNAME with your actual GitHub username
git remote set-url origin https://github.com/ccmanuelf/NL_BOM_T.git
```

Alternatively, if you prefer to use SSH (recommended for better security):

```bash
# Replace YOUR_USERNAME with your actual GitHub username
git remote set-url origin git@github.com:ccmanuelf/NL_BOM_T.git
```

## Step 3: Verify Your Remote URL
Confirm that your remote URL has been updated correctly:

```bash
git remote -v
```

## Step 4: Commit Your Changes (if needed)
If you have any uncommitted changes:

```bash
# Add all files to staging
git add .

# Commit the changes
git commit -m "Initial commit"
```

## Step 5: Push Your Code to GitHub
Push your code to the GitHub repository:

```bash
# If this is your first push to the repository
git push -u origin main

# For subsequent pushes
git push
```

## Troubleshooting

### Authentication Issues

#### Using Personal Access Token (PAT)
If you're using HTTPS and encountering authentication issues, GitHub no longer accepts password authentication. You'll need to use a Personal Access Token:

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Generate new token
2. Select the necessary scopes (at minimum, select 'repo')
3. Generate the token and copy it
4. Use this token as your password when prompted during git push

#### Setting Up SSH Keys (Recommended)
If you prefer using SSH (more secure and convenient):

1. Check for existing SSH keys: `ls -la ~/.ssh`
2. If you don't have keys, generate them: `ssh-keygen -t ed25519 -C "your_email@example.com"`
3. Start the SSH agent: `eval "$(ssh-agent -s)"`
4. Add your key to the agent: `ssh-add ~/.ssh/id_ed25519`
5. Copy your public key: `cat ~/.ssh/id_ed25519.pub`
6. Go to GitHub → Settings → SSH and GPG keys → New SSH key
7. Paste your key and save
8. Update your remote to use SSH: `git remote set-url origin git@github.com:ccmanuelf/NL_BOM_T.git`

## Additional Resources
- [GitHub Documentation](https://docs.github.com/)
- [Git Documentation](https://git-scm.com/doc)
- [GitHub Authentication Guide](https://docs.github.com/en/authentication)