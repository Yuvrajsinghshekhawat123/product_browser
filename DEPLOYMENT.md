# Deployment Guide - AWS EC2 & GitHub Actions CI/CD

This guide provides step-by-step instructions to deploy the **Product Browser** application to an AWS EC2 instance and set up a CI/CD pipeline using GitHub Actions.

---

## Phase 1: Provisioning the AWS EC2 Instance

### 1. Launch a New Instance
1. Log in to the [AWS Management Console](https://aws.amazon.com/console/).
2. Navigate to **EC2** and click **Launch Instance**.
3. Configure the instance details:
   - **Name**: `product-browser-server`
   - **OS (AMI)**: Select **Ubuntu Server 22.04 LTS** (64-bit).
   - **Instance Type**: Select `t2.micro` (or `t3.micro`), which is eligible for the AWS Free Tier.
   - **Key Pair**: Select **Create new key pair**. Set the name to `product-browser-key`, file format to `.pem`, and download it. Store it in a secure folder on your local machine.

### 2. Configure the Security Group (Firewall)
Under **Network settings**, configure firewall rules to allow the following incoming traffic:
- **SSH (Port 22)**: Set Source to `My IP` (for secure administration).
- **HTTP (Port 80)**: Set Source to `Anywhere (0.0.0.0/0)` (for the Nginx Web Server serving the React Frontend and Proxying API requests).

> [!NOTE]
> We **do not** open Port 5000 (Backend API). Nginx acts as a reverse proxy, forwarding API requests to Port 5000 internally. This keeps the backend server isolated and secure from direct external threats!

*Click **Launch Instance** to create and boot the virtual server.*

---

## Phase 2: Configuring the EC2 Instance

### 1. Connect to your EC2 Instance
Open your terminal (PowerShell, Git Bash, or Linux Terminal) on your local machine, navigate to the folder containing your downloaded `.pem` key, and run:
```bash
# Modify key permissions (required on Linux/Mac)
chmod 400 product-browser-key.pem

# SSH into the server
ssh -i "product-browser-key.pem" ubuntu@<YOUR-EC2-PUBLIC-IP>
```
*(Replace `<YOUR-EC2-PUBLIC-IP>` with the public IPv4 address shown in your AWS EC2 Console).*

### 2. Install Docker and Docker Compose
Once connected to the EC2 server, execute these commands to install Docker:
```bash
# Update local packages
sudo apt-get update -y
sudo apt-get upgrade -y

# Install Docker dependencies
sudo apt-get install -y ca-certificates curl gnupg lsb-release

# Add Docker's official GPG key
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Set up the stable repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt-get update -y
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Add ubuntu user to docker group (removes need for 'sudo' with docker commands)
sudo usermod -aG docker $USER

# Close connection and reconnect to apply group permissions
exit
```
Reconnect to EC2:
```bash
ssh -i "product-browser-key.pem" ubuntu@<YOUR-EC2-PUBLIC-IP>
```

### 3. Clone Repository and Setup Env Files
Clone your GitHub repository to the home directory of the instance:
```bash
# Clone the repository
git clone https://github.com/YOUR-GITHUB-USERNAME/YOUR-REPOS-NAME.git ~/product-browser

# Navigate to project folder
cd ~/product-browser
```

Now, create the production `.env` file for the backend. (The frontend does not require a `.env` file because `VITE_API_URL` is automatically configured as `/api` via Docker Compose build arguments).

#### Backend Environment: `Server/.env`
Create the file:
```bash
nano Server/.env
```
Paste your MongoDB Atlas connection string:
```env
PORT=5000
MONGO_URI=mongodb+srv://ys456913_db_user:AWdJquN3fnAQsoeP@cluster0.92pzp2v.mongodb.net/product_browser
NODE_ENV=production
```
*(Press `CTRL + O`, `Enter` to save, and `CTRL + X` to exit nano).*

---

## Phase 3: Setup GitHub CI/CD Secrets

To enable automated deployments on every `git push`, you must connect GitHub Actions to your EC2 instance.

1. Go to your repository on **GitHub.com**.
2. Click **Settings** -> **Secrets and variables** -> **Actions** -> **New repository secret**.
3. Create the following three secrets:
   - **`EC2_HOST`**: Paste your EC2 public IP address (e.g., `54.210.45.18`).
   - **`EC2_USERNAME`**: Type `ubuntu`
   - **`EC2_SSH_KEY`**: Open your downloaded `product-browser-key.pem` file on your computer in a text editor (like Notepad), copy the **entire text** (including `-----BEGIN RSA PRIVATE KEY-----` and `-----END RSA PRIVATE KEY-----`), and paste it here.

---

## Phase 4: Initial Launch & Seeding

Go back to your EC2 SSH session, and launch the application for the first time:
```bash
# Start the containers
docker compose up -d --build
```
Once the containers are running, execute the seeding script to populate the 200,000 products:
```bash
docker exec -it product_browser_backend npm run seed
```

You are all set! Pushing any updates to the `main` branch on GitHub will now automatically trigger GitHub Actions to deploy to your EC2 server. You can visit `http://<YOUR-EC2-PUBLIC-IP>` to see your live product browser!
