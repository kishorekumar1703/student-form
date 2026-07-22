# Student Registration Form — Setup & Deployment Guide

This is a complete, ready-to-deploy web app:
- A public form (`public/index.html`) that anyone in the world can open via a URL
- A Node.js backend (`server.js`) that receives submissions
- A MySQL database that stores every submission permanently

Fields collected: **Name, Age, Address, Email, Pin Code, Phone Number, Hobbies**

You don't need to code anything — just follow the steps below.

---
 
## Part 1 — Create a free Railway account

1. Go to https://railway.app
2. Sign up (GitHub login is easiest)
3. You get free trial credit automatically — enough to run this small app for a good while

---

## Part 2 — Create your MySQL database

1. In Railway, click **New Project**
2. Choose **Provision MySQL** (it's listed under database templates)
3. Wait ~30 seconds for it to spin up
4. Click on the MySQL service box → go to the **Variables** tab
5. You'll see values like `MYSQLHOST`, `MYSQLPORT`, `MYSQLUSER`, `MYSQLPASSWORD`, `MYSQLDATABASE`, and a ready-made `MYSQL_URL` (or `DATABASE_URL`) — **keep this tab open**, you'll need these in Part 4

That's it — your database is live. You don't need to create any tables yourself; the app does that automatically the first time it starts.

---

## Part 3 — Put this project on GitHub

Railway deploys from a GitHub repo, so:

1. Go to https://github.com and create a **New repository** (e.g. `student-form`)
2. Upload all the files from this project into it (drag-and-drop works fine on GitHub's web UI), keeping the folder structure:
   ```
   student-form/
   ├── server.js
   ├── package.json
   ├── .env.example
   ├── schema.sql
   └── public/
       └── index.html
   ```
3. Commit the changes

**Do not upload a real `.env` file with passwords in it** — `.env.example` is just a template.

---

## Part 4 — Deploy the app on Railway

1. Back in your Railway project, click **New** → **GitHub Repo**
2. Select the `student-form` repo you just created
3. Railway will detect it's a Node.js app and start building automatically
4. Once it's deployed, click on the new service → **Variables** tab, and add these (copy values from your MySQL service's Variables tab in Part 2):

   | Variable | Value |
   |---|---|
   | `DATABASE_URL` | paste the `MYSQL_URL` value from your MySQL service |
   | `ADMIN_KEY` | make up any secret password, e.g. `myClassSecret2026` |

5. Go to the **Settings** tab of your app service → **Networking** → click **Generate Domain**
6. Railway gives you a public URL like:
   ```
   https://student-form-production.up.railway.app
   ```

**That link is your Google-Form-style link.** Anyone, anywhere in the world, can open it and submit the form, and it will save straight into your MySQL database.

---

## Part 5 — Test it

1. Open your Railway URL in a browser
2. Fill out the form and click **Submit**
3. You should see "Thanks! Your response has been recorded."
4. To double-check it saved correctly, open:
   ```
   https://your-app-url.up.railway.app/api/submissions?key=YOUR_ADMIN_KEY
   ```
   (use the `ADMIN_KEY` you set in Part 4) — you'll see all responses as raw data.

---

## Viewing your data properly (recommended)

Raw JSON isn't fun to read. Instead:

1. In Railway, click your MySQL service → **Data** tab — Railway has a built-in table browser, so you can see all `students` rows in a spreadsheet-like view directly.
2. Or connect using a free tool like **MySQL Workbench** or **TablePlus**, using the connection details from the MySQL Variables tab.

---

## Running it on your own computer first (optional but recommended)

If you want to test everything before deploying:

```bash
npm install
cp .env.example .env
# edit .env with your DATABASE_URL from Railway
npm start
```

Then open `http://localhost:3000` in your browser.

---

## Notes

- The form validates required fields both in the browser and on the server, so bad data can't sneak through.
- Hobbies are collected as checkboxes and stored as a comma-separated list, but you can easily add/remove hobby options by editing the `.hobby-chip` blocks in `public/index.html`.
- The `/api/submissions` route is protected by your `ADMIN_KEY` so strangers can't view your students' data just by guessing the URL — keep that key private.
- If you ever outgrow Railway's free tier, this exact code also runs unchanged on Render, Railway's paid tier, or any standard Node.js + MySQL host.
