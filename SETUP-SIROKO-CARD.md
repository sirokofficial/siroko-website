# Siroko Card setup (Apple Wallet)

Dashboards change, so button names below may differ slightly.

## 1. WalletWallet API key (signs the Apple Wallet pass)
1. Go to https://www.walletwallet.dev and create a free account.
2. Open the dashboard and create an API key. Copy it.
3. Free plan: 1,000 passes/month, dark/blue/green/red/purple/orange presets, no custom logo or colors.
   For the Siroko logo and custom colors you need Pro ($39/month). Then set `PASS_LOGO_URL` (HTTPS PNG, max 1MB, e.g. `https://sirokofficial.com/assets/siroko-icon-silver-crop.png`) and `PASS_COLOR`.

## 2. Upstash Redis (stores members and the member counter)
1. Create a free account at https://upstash.com and create a Redis database (choose a region near Barcelona, e.g. Frankfurt).
2. On the database page, open the REST API section and copy `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.
   (Alternative: add Upstash from the Vercel Marketplace, which fills these variables for you.)
3. Optional: to start numbering at BCN 00029, run `SET member_counter 28` in the Upstash data browser.

## 3. Deploy to Vercel
1. Put this folder in a GitHub repo (do not commit real keys; `.env.example` is only a template).
2. At https://vercel.com, click Add New > Project and import the repo. Framework preset: Other. No build command.
3. Before deploying, open Settings > Environment Variables and add:
   `WALLETWALLET_API_KEY`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` (plus `PASS_LOGO_URL` / `PASS_COLOR` if on Pro).
4. Deploy. Vercel serves the static pages and turns `api/issue-card.js` into `/api/issue-card`.
5. Add your domain `sirokofficial.com` under Settings > Domains and follow the DNS instructions. Do this only when you're ready to move the live site.

## 4. Test on an iPhone
1. Open `https://<your-project>.vercel.app/membership.html` in Safari on the iPhone.
2. Enter a name and email and tap "Get my Siroko Card".
3. Tap "Add to Apple Wallet" and then Add. Check the name, member number and QR code on the pass.
4. Submit the same email again: you should get the same card and number back.
5. Check the Upstash data browser for `member:<email>` and `member_counter`.

## 5. Before launch
- Replace the placeholder venues in `partners.json` with real partners and discounts.
- Decide how partners verify the card (they can read the member number, or scan the QR).
- Send your final card design; the layout is set in `api/_provider.js`.
- Add a privacy notice since you now store names and emails.
