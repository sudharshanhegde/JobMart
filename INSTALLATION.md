# JobMart — Installation & User Guide

> **You do not need any technical knowledge to run this app.**
> Just follow the steps below. The whole setup takes about 5–10 minutes.

---

## What You Need

- A **Windows PC** (Windows 10 or 11)
- An **internet connection**
- That's it. Nothing else needs to be installed manually.

---

## Step 1 — Download the Project

1. Go to the GitHub page for this project
2. Click the green **"Code"** button
3. Click **"Download ZIP"**

   ![Download ZIP](https://i.imgur.com/placeholder.png)

4. Once downloaded, **right-click** the ZIP file → **Extract All**
5. Choose a location you can find easily (like your Desktop or Downloads folder)
6. Click **Extract**

You should now have a folder called **JobMart** (or similar) on your computer.

---

## Step 2 — Run the Setup (One Click)

1. Open the **JobMart** folder you just extracted
2. Look for a file called **`setup.bat`**
3. **Double-click** `setup.bat`

   > If Windows shows a warning saying *"Windows protected your PC"*, click **"More info"** → **"Run anyway"**. This is normal for scripts not downloaded from the Microsoft Store.

4. A black window will open and start running automatically. **Do not close it.**

   It will do the following on its own:
   - Install **Node.js** if it is not already on your PC (may take 2–3 minutes)
   - Set up the database connection (uses cloud — no local install needed)
   - Install all required software packages (may take 3–5 minutes)
   - Open the app in your browser

5. When you see this message, setup is complete:

   ```
   ╔══════════════════════════════════════════╗
   ║           JobMart is starting!           ║
   ║  App  ->  http://localhost:3000          ║
   ╚══════════════════════════════════════════╝
   ```

6. Your browser will automatically open **http://localhost:3000** with the app.

---

## Step 3 — Using the App

Once the app is open in your browser:

### Registering an Account

1. On the home screen, click **"I'm a Worker — Find Jobs"** or **"I'm a Provider — Post Jobs"**
   - **Worker** = someone looking for daily/gig work
   - **Provider** = someone who wants to hire workers
2. Fill in your:
   - **Name**
   - **Phone Number** (10 digits)
   - **Password** (at least 6 characters)
   - **Security Word** — a word you'll remember if you forget your password (like your pet's name or hometown)
3. Click **"Create Account"**
4. You will land on your Dashboard

### Logging In (Next Time)

1. Open the app at **http://localhost:3000**
2. Enter your **Phone Number** and **Password**
3. Click **Sign In**

### If You Forget Your Password

1. On the login screen, click **"Forgot Password?"**
2. Enter your phone number and the **Security Word** you chose during registration
3. Set a new password

---

## Running the App Again (After Setup is Done)

After the first setup, you do **not** need to run `setup.bat` again.

For every subsequent use, simply double-click **`start.bat`** in the JobMart folder.

It will open both server windows and launch the app in your browser.

> Keep the two black windows (titled "JobMart - Backend" and "JobMart - Frontend") open while using the app. Closing them will stop the app.

---

## Stopping the App

To stop the app, simply **close both black windows** (the Backend and Frontend windows).

---

## Troubleshooting

### The browser shows "This site can't be reached"

The backend server is not running. Check that the window titled **"JobMart - Backend"** is still open. If it closed, run `start.bat` again.

### setup.bat finished but the browser didn't open

Manually open your browser and go to: **http://localhost:3000**

### "Windows protected your PC" warning when running setup.bat

This is normal. Click **"More info"** → **"Run anyway"**. The script only installs Node.js and project packages.

### The app opens but login/register shows an error

Make sure both black windows (Backend and Frontend) are open. If only the frontend window is open, the backend is not running — close everything and run `start.bat` again.

### setup.bat fails with a red error message

Take a screenshot of the error and share it. Common fixes:
- Make sure you have an internet connection
- Make sure you extracted the ZIP fully before running setup.bat (don't run it from inside the ZIP)

### Port 3000 or 5000 is already in use

Open **Task Manager** (Ctrl + Shift + Esc) → go to the **Details** tab → look for `node.exe` → right-click → **End Task** → run `start.bat` again.

---

## App Features Overview

| Feature | How to Use |
|---|---|
| **Browse Jobs** | Go to "Jobs" in the bottom navigation |
| **Apply for a Job** | Open a job → tap "Apply" |
| **Post a Job** (Provider) | Go to "Post a Job" in the navigation |
| **View Applications** | Go to "My Applications" |
| **Connect with Workers/Providers** | Go to "Connections" → Discover tab |
| **Find People Nearby** | Go to "Connections" → Nearby tab |
| **Notifications** | Bell icon in the top bar |
| **Change Language (Kannada/English)** | Toggle button in the top bar (EN / ಕನ್ನಡ) |

---

## Tech Stack (For Reference)

| Layer | Technology |
|---|---|
| Frontend | React, Tailwind CSS |
| Backend | Node.js, Express |
| Database | MongoDB Atlas (cloud) |
| Authentication | JWT, Google OAuth |
| Maps | Leaflet |
