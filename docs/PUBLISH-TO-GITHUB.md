# Publish The Chordinator to your GitHub

Do this once so your code is on GitHub; then you can deploy to EC2 via SSM using the repo URL.

---

## In Cursor (with GitHub connected)

1. **Open Source Control**  
   Click the branch icon in the left sidebar, or press `Ctrl+Shift+G`.

2. **Initialize repo (if needed)**  
   If you see **“Initialize Repository”**, click it. That creates a `.git` folder and makes this folder a git repo.

3. **Stage and commit**  
   - Click **“+”** next to **Changes** to stage all files (or stage the ones you want).  
   - Type a commit message, e.g. `Initial commit: Chordinator chord + lyrics app`.  
   - Click the checkmark **Commit** (or press `Ctrl+Enter`).

4. **Publish to GitHub**  
   - Click **“Publish to GitHub”** (or **“Publish Branch”** / **“Publish to GitHub”** in the status bar).  
   - Choose **Public** (or Private).  
   - Pick the repo name (e.g. `The-Chordinator` or `chordinator`).  
   - Confirm. Cursor will create the repo on your connected GitHub account and push the code.

5. **Note the repo URL**  
   After it finishes, the repo URL will look like:  
   `https://github.com/YOUR_USERNAME/The-Chordinator`  
   or  
   `https://github.com/YOUR_USERNAME/The-Chordinator.git`  
   You’ll need this for the EC2 deploy step below.

---

## Deploy on EC2 via SSM (after publish)

Once the repo is on GitHub, run the SSM document so the Chordinator instance clones and runs the app:

**AWS Console:**  
**Systems Manager** → **Run Command** → document **Chordinator-DeployApp** → Targets: your Chordinator instance → Parameter **GitHubRepoUrl** = `https://github.com/YOUR_USERNAME/The-Chordinator.git` → **Run**.

**AWS CLI:**

```bash
aws ssm send-command \
  --instance-ids "i-0344dc76adda57b9d" \
  --document-name "Chordinator-DeployApp" \
  --parameters "GitHubRepoUrl=https://github.com/YOUR_USERNAME/The-Chordinator.git" \
  --comment "Deploy Chordinator from GitHub"
```

Replace `YOUR_USERNAME` and the repo name if you chose something different. Then open **http://98.92.169.165:8080** (or your instance’s public IP).
