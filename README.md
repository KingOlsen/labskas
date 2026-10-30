# SK All Saints' Computer Lab Booking

Static page (`index.html`) plus small serverless functions (`api/`) that talk to a Neon Postgres database.

## Deploy (Vercel, free plan is enough)
1. Push this folder to a GitHub repository.
2. In Vercel choose **Add New > Project** and import the repository. Leave the build settings as they are.
3. Open **Settings > Environment Variables** and add `DATABASE_URL`.
   Copy its value from the Neon console: project `lab-booking` > **Connect** > connection string.
4. Redeploy. The page now saves every booking to Neon.

If `DATABASE_URL` is missing or the API cannot be reached, the page falls back to saving on that one device only.

Never commit the connection string to GitHub.
