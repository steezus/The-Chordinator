# Chordinator EC2 — Your instance (run these steps)

Created via AWS CLI. Instance is **running**; you only need to SSH in and run Docker + clone + start.

---

## Instance details

| Item | Value |
|------|--------|
| **Instance ID** | `i-0344dc76adda57b9d` |
| **Public IP** | **98.92.169.165** |
| **Region** | us-east-1 |
| **Key pair** | **MyEC2KeyPair** (use the `.pem` you have for this key) |
| **Security group** | chordinator-sg (SSH 22 from 173.73.96.124/32, TCP 8080 from 0.0.0.0/0) |

---

## 1. SSH in (from your PC)

Use the `.pem` file for **MyEC2KeyPair** (if you use a different key, replace the path):

```powershell
ssh -i "C:\path\to\MyEC2KeyPair.pem" ec2-user@98.92.169.165
```

---

## 2. On the EC2 instance: install Docker + Compose

Paste these in order:

```bash
sudo yum update -y
sudo yum install -y docker
sudo systemctl enable docker && sudo systemctl start docker
sudo usermod -aG docker ec2-user
```

Install Docker Compose:

```bash
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

Start a new shell so the `docker` group applies (or run `newgrp docker`), then:

```bash
docker --version
docker-compose --version
```

---

## 3. Get the app and run it

**If the project is on GitHub** (replace with your repo URL):

```bash
sudo yum install -y git
git clone https://github.com/YOUR_USERNAME/The-Chordinator.git the-chordinator
cd the-chordinator
docker compose up -d --build
```

If `docker compose` is not found, use: `docker-compose up -d --build`

**If you’re uploading a zip:** upload your zip to the instance (e.g. with `scp` from Windows), then:

```bash
cd ~
unzip -o chordinator.zip -d the-chordinator
cd the-chordinator
docker compose up -d --build
```

---

## 4. Open the app

In your browser (PC, iPad, or phone):

**http://98.92.169.165:8080**

---

## Optional: run setup via SSM (no SSH)

The instance has **ChordinatorSSMProfile** attached. In **Systems Manager → Run Command**, run **Chordinator-InstallDocker** once, then **Chordinator-DeployApp** with **GitHubRepoUrl**. See **[docs/ssm/README-SSM.md](ssm/README-SSM.md)**.

## Optional: use a different key pair

If you don’t have **MyEC2KeyPair.pem**, create a new key in EC2 → Key Pairs, download it, then launch a new instance with that key (or attach this security group to it). This runbook uses the instance already launched with MyEC2KeyPair.
