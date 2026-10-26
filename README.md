# Photo Wiz (Melbourne): website

Static website for **photowiz.com.au**. Plain HTML/CSS/JS with no build step, hosted on Cloudflare Pages.

```
public/            <- everything Cloudflare publishes
  index.html       main page (all content lives here)
  styles.css       colours, layout, mobile styles
  script.js        mobile menu, before/after slider, copy-email button
  favicon.svg      logo icon
  menno-brandt.jpg photo used in the contact card
  404.html         "page not found" page
  _headers         security + caching headers (Cloudflare reads this)
  robots.txt, sitemap.xml
```

## Editing common things

| What | Where |
|---|---|
| Contact email | `public/index.html`: search for `hello@photowiz.com.au` (appears 3 times) |
| Colour theme | `public/index.html`: `data-theme="green"` on the `<html>` tag (`green`, `blue` or `orange`). Preview any theme by adding `?theme=blue` to the URL |
| Theme colours | `public/styles.css`: the theme blocks at the top |
| Services list | `public/index.html`: the `SERVICES` section |
| FAQ | `public/index.html`: the `FAQ` section |
| Your photo | replace `public/menno-brandt.jpg` (keep the same filename) |
| ABN | `public/index.html`: footer, and `taxID` in the business details near the top |

Preview locally:

```bash
python -m http.server 4317 -d public
```

Then open http://localhost:4317.

---

## Deploying to Cloudflare Pages

### 1. Push this repo to GitHub
```bash
git add .
git commit -m "Initial Photo Wiz website"
git push -u origin main
```

### 2. Create the Pages project
1. Log in at https://dash.cloudflare.com (free account is fine).
2. **Workers & Pages → Create → Pages → Connect to Git**.
3. Pick the `nemobrandt/PhotoWizWebsite` repo.
4. Build settings:
   - Framework preset: **None**
   - Build command: *(leave empty)*
   - Build output directory: **`public`**
5. **Save and Deploy**. You'll get a URL like `photowizwebsite.pages.dev`.

From then on, every push to `main` redeploys automatically.

### 3. Move photowiz.com.au's DNS to Cloudflare
This lets Cloudflare serve the root domain (`photowiz.com.au`, not only `www`) and gives you free email forwarding.

1. In Cloudflare: **Add a domain** → enter `photowiz.com.au` → choose the **Free** plan.
2. Cloudflare scans your existing DNS records. **Check that any existing email records (MX, TXT/SPF) were copied** if you already use email on this domain.
3. Cloudflare gives you two nameservers (e.g. `ana.ns.cloudflare.com`, `bob.ns.cloudflare.com`).
4. In **Crazy Domains**: My Account → Domains → `photowiz.com.au` → **Nameservers** (sometimes under "DNS" / "Manage") → choose custom nameservers → paste the two Cloudflare ones → save.
5. Wait for Cloudflare to email you that the domain is active. Usually under an hour, occasionally up to 24h.

### 4. Attach the domain to the site
1. **Workers & Pages → your project → Custom domains → Set up a custom domain**.
2. Add `photowiz.com.au` and confirm. Cloudflare creates the DNS record for you.
3. Repeat for `www.photowiz.com.au`.
4. (Optional) Send `www` to the main domain: **Rules → Redirect Rules → Create rule → template "Redirect from WWW to root"**.

SSL (the padlock) is set up automatically.

### 5. Set up the email address (free)
The site's contact button uses `hello@photowiz.com.au`. To make it forward to your Gmail:

1. In Cloudflare, open `photowiz.com.au` → **Email → Email Routing → Get started**.
2. Create the address `hello` → destination: your personal Gmail → verify via the email Cloudflare sends you.
3. Let Cloudflare add the MX/TXT records it asks for.

Emails to hello@photowiz.com.au now land in your Gmail. To **reply** as hello@photowiz.com.au from Gmail, search "Gmail send mail as Cloudflare email routing" for a guide. Alternatively, swap the address in `index.html` for any email you already use.
