# Chordinator SSM documents

Two SSM Command documents let you install Docker and deploy the app on the Chordinator EC2 instance **without SSH**.

## Prerequisites

- The EC2 instance has the **ChordinatorSSMProfile** IAM instance profile attached (so it can receive SSM commands).
- The instance appears under **Systems Manager → Fleet Manager** (or **Run Command** target list). **After attaching the profile, wait 2–5 minutes** for the instance to register; then refresh. If Run Command says "Instances not in a valid state", wait and try again.

## Documents

| Document | Purpose |
|----------|--------|
| **Chordinator-InstallDocker** | Install Docker and Docker Compose on Amazon Linux. Run **once** per instance. |
| **Chordinator-DeployApp** | Clone the GitHub repo and run `docker compose up -d --build`. Run after InstallDocker. Pass the repo URL as a parameter. |

---

## Run from AWS Console

1. **Systems Manager** → **Run Command**.
2. **Command document**: choose **Chordinator-InstallDocker** (or **Chordinator-DeployApp**).
3. **Targets**: choose **Specify instance tags** or **Specify instance IDs**, then select the Chordinator instance (e.g. `i-0344dc76adda57b9d`).
4. For **Chordinator-DeployApp**, under **Parameters** set **GitHubRepoUrl** to your repo URL (e.g. `https://github.com/yourusername/The-Chordinator.git`).
5. **Run**.

---

## Run from AWS CLI

**1. Install Docker (once per instance)**

```bash
aws ssm send-command \
  --instance-ids "i-0344dc76adda57b9d" \
  --document-name "Chordinator-InstallDocker" \
  --comment "Install Docker on Chordinator"
```

**2. Deploy app (after Docker is installed)**

Replace `YOUR_GITHUB_REPO_URL` with your repo (e.g. `https://github.com/yourusername/The-Chordinator.git`):

```bash
aws ssm send-command \
  --instance-ids "i-0344dc76adda57b9d" \
  --document-name "Chordinator-DeployApp" \
  --parameters "GitHubRepoUrl=https://github.com/YOUR_USERNAME/The-Chordinator.git" \
  --comment "Deploy Chordinator from GitHub"
```

**3. Check command status and output**

```bash
# Replace COMMAND_ID with the id returned by send-command
aws ssm get-command-invocation \
  --command-id COMMAND_ID \
  --instance-id i-0344dc76adda57b9d
```

Or in the console: **Systems Manager** → **Run Command** → **Command history** → select the command → **View output**.

---

## Order of operations

1. Launch EC2 (with chordinator-sg and ChordinatorSSMProfile).
2. Wait until the instance shows as managed in Fleet Manager (or in the Run Command target list).
3. Run **Chordinator-InstallDocker** once.
4. Run **Chordinator-DeployApp** with your **GitHubRepoUrl** (and again whenever you want to pull and redeploy).

App URL: **http://\<instance-public-IP\>:8080**
