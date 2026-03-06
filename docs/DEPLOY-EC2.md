# Deploy The Chordinator on EC2

You can run the app on EC2 **with Docker** (recommended) or **without** (setup script installs Node + nginx on the host).

---

## Option A: Run with Docker (recommended)

1. **Launch EC2** (Amazon Linux 2023 or Ubuntu 22.04, e.g. `t3.micro`). Security group: **22** (SSH), **80** or **8080** (HTTP).
2. **Install Docker** on the instance (one-time):
   ```bash
   # Amazon Linux 2023
   sudo yum install -y docker && sudo systemctl enable docker && sudo systemctl start docker && sudo usermod -aG docker ec2-user
   # Log out and back in so the group takes effect, or run docker with sudo.
   ```
   ```bash
   # Ubuntu
   sudo apt-get update && sudo apt-get install -y docker.io docker-compose-plugin
   sudo systemctl enable docker && sudo systemctl start docker
   sudo usermod -aG docker ubuntu
   ```
3. **Copy the project** to the instance (zip + scp, or git clone). SSH in.
4. **Build and run:**
   ```bash
   cd the-chordinator
   docker compose up -d --build
   ```
5. Open **http://\<EC2-public-IP\>:8080** (or use port 80 by changing `docker-compose.yml` to `ports: "80:80"` and open port 80 in the security group).

No Node or nginx install on the host; everything runs in the container.

---

## Option B: Run without Docker (setup script)

## 1. Launch an EC2 instance

1. In **AWS Console** → **EC2** → **Launch instance**.
2. **Name:** e.g. `chordinator`
3. **AMI:** Amazon Linux 2023 or Ubuntu 22.04 LTS
4. **Instance type:** `t2.micro` or `t3.micro` (free tier eligible)
5. **Key pair:** Create or select one so you can SSH in.
6. **Network / Security group:** Create or edit to allow:
   - **SSH (22)** from your IP (or 0.0.0.0/0 for any; less secure)
   - **HTTP (80)** from 0.0.0.0/0 so the app is reachable
7. **Storage:** 8 GB is enough.
8. Launch the instance.

## 2. Copy the project to the instance (for Option B)

From your **Windows** machine (PowerShell), with the project folder and your `.pem` key:

```powershell
# Replace with your instance public IP and key path
$IP = "3.xx.xx.xx"
$KEY = "C:\path\to\your-key.pem"

# Zip the project (omit node_modules and dist to keep the zip small)
cd "c:\Users\socce\Vibing\The Chordinator"
Compress-Archive -Path package.json, package-lock.json, index.html, vite.config.ts, tsconfig.json, public, src, scripts -DestinationPath chordinator.zip -Force
# If that fails, zip the whole folder; on EC2 after unzip run: rm -rf node_modules dist

# Copy to EC2 (use scp)
scp -i $KEY chordinator.zip ec2-user@${IP}:~/
# Ubuntu uses "ubuntu" instead of "ec2-user": scp -i $KEY chordinator.zip ubuntu@${IP}:~/
```

Then SSH in and unzip:

```bash
ssh -i "your-key.pem" ec2-user@<PUBLIC_IP>
# Ubuntu: ssh -i "your-key.pem" ubuntu@<PUBLIC_IP>

unzip -o chordinator.zip -d the-chordinator
cd the-chordinator
```

If you use **Git** on the instance instead:

```bash
sudo yum install -y git   # Amazon Linux
# or: sudo apt install -y git   # Ubuntu
git clone <your-repo-url> the-chordinator
cd the-chordinator
```

## 3. Run the setup script (Option B only)

On the EC2 instance (from the project root):

```bash
cd ~/the-chordinator   # or wherever you unzipped/cloned
chmod +x scripts/setup-ec2.sh
bash scripts/setup-ec2.sh
```

The script installs Node 18, nginx, runs `npm install` and `npm run build`, then serves the built app from nginx on port 80.

## 4. Open the app (Option B: port 80; Option A: port 8080 or 80)

In your browser go to:

**http://\<EC2-PUBLIC-IP\>**

Use the instance’s public IPv4 from the EC2 console.

## Optional: Use a different path or domain

To serve the app at a path like `/app` or under a domain, edit `/etc/nginx/conf.d/chordinator.conf` on the instance and run `sudo systemctl reload nginx`. The script configures the default server on port 80 so `http://<public-ip>/` is enough for a single app.

## Troubleshooting

- **502 Bad Gateway:** nginx might not be running. Run `sudo systemctl status nginx` and `sudo systemctl restart nginx`.
- **Blank page:** Check the browser console. If you see 404s for `.js` files, ensure the setup script finished and `dist/` was copied to `/usr/share/nginx/html/chordinator`.
- **Cannot connect:** Security group must allow inbound **HTTP (80)** from `0.0.0.0/0` (or your IP).
