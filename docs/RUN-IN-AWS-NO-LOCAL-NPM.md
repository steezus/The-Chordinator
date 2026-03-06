# Run The Chordinator in AWS (no npm on your machine)

You don’t need Node or npm on your Windows PC. The app is **built inside Docker on an EC2 instance** in AWS. Follow these steps.

---

## 1. Get your code into AWS

**Option A – GitHub (simplest)**  
Push your project to GitHub (from Cursor: Source Control → commit → push, or use GitHub Desktop). You don’t need npm for that. Then on EC2 you’ll clone the repo.

**Option B – Zip and upload**  
Zip the project folder on Windows (exclude `node_modules` and `.git` to keep it small). Upload the zip to the EC2 instance (e.g. with SCP, or upload to S3 and download from EC2). No npm required to create the zip.

---

## 2. Launch an EC2 instance

1. **AWS Console** → **EC2** → **Launch instance**.
2. **Name:** e.g. `chordinator`
3. **AMI:** **Amazon Linux 2023** (or Ubuntu 22.04).
4. **Instance type:** **t3.micro** (free tier eligible).
5. **Key pair:** Create or select a key so you can SSH in. Download the `.pem` and keep it safe.
6. **Security group:** Create a new security group and add these **inbound** rules:

   | Type        | Port | Source        | Description   |
   |------------|------|---------------|---------------|
   | SSH        | 22   | **173.73.96.124/32** | Your IP only |
   | Custom TCP | 8080 | 0.0.0.0/0     | App (browser) |

   So only your IP can SSH; anyone can open the app on port 8080 (PC, iPad, phone). To use port 80 instead, add **HTTP** port **80** from **0.0.0.0/0** and use `ports: "80:80"` in `docker-compose.yml`.
7. **Storage:** 8 GB is enough.
8. Launch the instance. Note the **public IPv4** address.

---

## 3. Install Docker (and Compose) on EC2

SSH into the instance (replace with your key path and public IP):

```bash
ssh -i "C:\path\to\your-key.pem" ec2-user@<PUBLIC_IP>
```

**Amazon Linux 2023:**

```bash
sudo yum update -y
sudo yum install -y docker
sudo systemctl enable docker && sudo systemctl start docker
sudo usermod -aG docker ec2-user
```

Install Docker Compose (V2 plugin). If it’s not in the default repo:

```bash
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

Log out and back in so the `docker` group applies (or use `newgrp docker`), then check:

```bash
docker --version
docker-compose --version
```

**Ubuntu 22.04:** use `ubuntu` instead of `ec2-user`, and:

```bash
sudo apt-get update && sudo apt-get install -y docker.io docker-compose-plugin
sudo systemctl enable docker && sudo systemctl start docker
sudo usermod -aG docker ubuntu
```

Then `docker compose version` (with a space) should work.

---

## 4. Get the project and run (build happens on EC2)

**If you used GitHub:**

```bash
sudo yum install -y git   # Amazon Linux; Ubuntu: sudo apt install -y git
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git the-chordinator
cd the-chordinator
```

**If you uploaded a zip:**

```bash
cd ~
# After you upload chordinator.zip (e.g. via scp from Windows):
unzip -o chordinator.zip -d the-chordinator
cd the-chordinator
```

Then build and run (npm runs **inside** the container; you never run npm on the host):

```bash
docker compose up -d --build
```

If the shell says `docker compose` is not found, use the standalone command instead: `docker-compose up -d --build`.

The first run will take a few minutes (downloads Node image, runs `npm install` and `npm run build`). When it’s done, the app is serving.

---

## 5. Open the app

In your browser (PC, iPad, or phone) go to:

**http://\<EC2-PUBLIC-IP\>:8080**

Use the **public IPv4** from the EC2 console. If you opened port **80** instead of 8080, change `docker-compose.yml` to `ports: "80:80"` and use **http://\<EC2-PUBLIC-IP\>**.

---

## 6. Updating the app later

After you change code and push to GitHub (or upload a new zip):

**GitHub:**

```bash
cd ~/the-chordinator
git pull
docker compose up -d --build
```

**Zip:** upload the new zip, unzip over the folder, then run `docker compose up -d --build` again.

---

## Summary

| Where        | What runs                          |
|-------------|-------------------------------------|
| Your Windows| No npm. You only push code or zip.  |
| EC2         | Docker runs `npm install` + `npm run build` inside the image, then nginx serves the built app. |

So the app **runs entirely in AWS**; you only need a browser to use it (including on iPad or phone).
