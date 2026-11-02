# 🎨 Graphic Designer Portfolio — Complete Beginner Guide

A clean, minimal, fully responsive portfolio website for a graphic designer.
**Front-end only** (just HTML, CSS and JavaScript — no backend, no database, nothing to install to *run* it).
Your work is shown as **pictures you put in a folder**; clicking a project opens a full-size gallery.

**What makes it unique**
- A design-app **ruler** along the top whose marker moves as you scroll
- A floating **coordinates readout** (`X 0412  Y 1530`) that follows your mouse, plus an "Artboard 02 · Work" label, like a design app
- **Crop marks** (like the corner marks on a print proof) appear when you hover a picture
- A **click-to-copy colour palette** in the About section
- Smooth scroll animations: headline line-reveal, staggered fade-ups, featured image zoom, counting numbers, a "filling" process line, and a scrolling tools strip
- A **"VIEW" cursor** on desktop, light/dark theme switch, category filters, and a gallery pop-up (arrow keys and swipe work)

---

## 1. Folder structure

```
designer-portfolio/
├── index.html               ← The page structure and your text (headline, About, Services…)
├── css/
│   └── style.css            ← All colours, fonts, spacing, animations
├── js/
│   ├── config.js            ← ⭐ YOUR CONTENT: name, email, socials, projects, numbers, colours
│   └── main.js              ← The behaviour (animations, gallery pop-up, menu). You rarely edit this
├── assets/
│   ├── favicon.svg          ← The small icon in the browser tab
│   ├── images/
│   │   └── profile-placeholder.svg   ← Replace with your own photo
│   └── projects/            ← ⭐ PUT YOUR DESIGN IMAGES HERE (one sub-folder per project)
├── .gitignore               ← Tells Git which files NOT to upload (you can ignore this file)
└── README.md                ← This guide
```

**The golden rule — where do I change things?**

| I want to change…                                   | Open this file          |
|-----------------------------------------------------|-------------------------|
| My name, email, social links, location              | `js/config.js`          |
| Project titles, categories, which images to show    | `js/config.js`          |
| The big featured image                              | `js/config.js`          |
| The numbers (120+ projects…), colours, software     | `js/config.js`          |
| Headline, About paragraphs, Services, Process steps | `index.html`            |
| My design images                                    | `assets/projects/`      |
| My photo                                            | `assets/images/`        |
| Website colours, fonts, spacing                     | `css/style.css` (top)   |

---

## 2. Install what you need (one time only)

You do **not** need Node.js, npm, or any build tools. You need three things:

1. **VS Code** (the editor) → https://code.visualstudio.com → download and install.
2. **Git** (sends your code to GitHub) → https://git-scm.com/downloads → install with all the default options.
   - Check it worked: open VS Code → menu **Terminal → New Terminal** → type `git --version` and press Enter. You should see a version number.
3. Two free accounts:
   - **GitHub** → https://github.com (Sign up)
   - **Vercel** → https://vercel.com (Sign up → choose **Continue with GitHub**)

---

## 3. Set up the project in VS Code

1. Unzip the downloaded `designer-portfolio.zip`. Put the **`designer-portfolio`** folder somewhere easy (e.g. `Documents`).
2. Open VS Code → **File → Open Folder…** → choose the `designer-portfolio` folder → **Select Folder** (click "Yes, I trust the authors" if asked).
3. On the left (**Explorer** panel) you'll see all the files from the folder structure above. Click a file to open it.
4. Install helpful extensions — click the **Extensions** icon (four squares, left bar) and search for:
   - **Live Server** (by Ritwick Dey) → click **Install**. *Required for step 4 below.*
   - **Prettier – Code formatter** *(optional, keeps code tidy)*.

---

## 4. Run the website on your computer

**Use Live Server (don't just double-click `index.html`)** — it is the most reliable way to preview, and it matches how the site behaves online.

1. In VS Code, open `index.html`.
2. Click **Go Live** at the bottom-right of the window (or right-click inside `index.html` → **Open with Live Server**).
3. Your browser opens at an address like `http://127.0.0.1:5500` — that's your site!
4. Now edit any file and press **Ctrl+S** (Mac: **Cmd+S**). The page **refreshes by itself**.
5. To stop: click **Port: 5500** at the bottom-right.

---

## 5. Add your own projects (pictures)

### Step A — Prepare your images
Export each design from Photoshop / Illustrator / Figma as an image:
- **JPG** for most work (mockups, posters, photos). **PNG or WebP** for flat graphics or anything with a transparent background.
- About **1600 px** on the longest side is plenty. The featured image: **1920 px** wide.
- Keep each file **under ~400 KB** so the site loads fast. Shrink them for free at **https://squoosh.app** (drag in the image, choose *MozJPEG* or *WebP*, quality ~80, download).
- **Name files** in lowercase with no spaces: `01.jpg` ✅ — `My Logo FINAL (2).JPG` ❌

### Step B — Put them in the project
In `assets/projects/`, make **one folder per project** and drag the images in (in VS Code you can drag files straight into the Explorer panel on the left):
```
assets/projects/coffee-brand/01.jpg
assets/projects/coffee-brand/02.jpg
assets/projects/coffee-brand/03.jpg
```

### Step C — Tell the website about them
Open **`js/config.js`** and edit the project's block:

```js
{
  title: "Coffee brand identity",
  category: "Branding",
  year: "2026",
  client: "Fresh Roast Coffee",
  tools: "Illustrator, Photoshop",
  description: "Logo, colour system, typography and packaging for a coffee roaster.",
  images: [
    "assets/projects/coffee-brand/01.jpg",   // ← the FIRST image is the card picture
    "assets/projects/coffee-brand/02.jpg",
    "assets/projects/coffee-brand/03.jpg",
  ],
  ratio: "4 / 5",     // shape of the card: "4 / 5" tall, "1 / 1" square, "4 / 3" normal, "16 / 9" wide
  wide: true,         // optional: the card is twice as wide
},
```
Save → the placeholder becomes your project. Click it to flip through all its images (arrow buttons, ← → keys, or swipe on a phone).

**If a card still says "Placeholder":** the file name or folder in `images:` doesn't match the real file. Check spelling, capital letters, and the extension (`.jpg` vs `.jpeg` vs `.png`).

### The big featured image (under the intro)
```js
featured: "assets/projects/featured.jpg",
```

### Add, remove, reorder projects
- **Add:** copy one whole `{ … },` block and paste it under the last one.
- **Remove:** delete one whole `{ … },` block (and delete its images too, to keep the project small).
- **Reorder:** cut and paste blocks (first = shown first).
- **Categories:** the filter buttons (All / Branding / Poster…) are created from the `category` words you use. Spell them identically for projects in the same group.
- **Only one image?** Use `images: ["assets/projects/logo/01.jpg"]` — the arrows hide automatically.

### Size tips
GitHub blocks any file over 100 MB, but images are tiny — the real limit is speed. Keep the **whole project under ~100 MB** and every image under ~400 KB.

---

## 6. Upload the project to GitHub

### Create the (empty) repository
1. Go to https://github.com → click **+** (top-right) → **New repository**.
2. **Repository name:** `designer-portfolio` (any name is fine). Keep **Public**.
3. **Do NOT** tick "Add a README", ".gitignore" or license (you already have them).
4. Click **Create repository**. Keep this page open — it shows your repository address, like `https://github.com/YOUR-USERNAME/designer-portfolio.git`.

### Send your code (in the VS Code terminal)
Open **Terminal → New Terminal** (it opens inside your project folder) and run these one at a time, pressing Enter after each.

**First time only — tell Git who you are:**
```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```
(Use the same email as your GitHub account.)

**Upload:**
```bash
git init
git add .
git commit -m "First version of my portfolio"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/designer-portfolio.git
git push -u origin main
```
- Replace `YOUR-USERNAME` with your real GitHub username.
- On `git push`, a window opens asking you to **sign in to GitHub** in the browser — approve it.
- Refresh your GitHub repository page: your files are there ✅

### Uploading future changes (every time you edit something)
```bash
git add .
git commit -m "Describe what you changed"
git push
```
*(Prefer clicking? In VS Code open the **Source Control** icon (branch symbol), type a message, click **Commit**, then **Sync Changes**.)*

---

## 7. Deploy to Vercel (free `.vercel.app` address)

1. Go to https://vercel.com and log in (**Continue with GitHub**).
2. Click **Add New… → Project**.
3. Under **Import Git Repository**, find **designer-portfolio** → **Import**.
   *(If you don't see it, click "Adjust GitHub App Permissions" and allow access to that repository.)*
4. On the configuration screen, set:
   - **Framework Preset:** `Other`
   - **Root Directory:** leave as `./`
   - **Build Command / Output Directory / Install Command:** leave **empty** (this site needs no build)
5. Click **Deploy** and wait ~30 seconds. 🎉
6. You'll get a live address like `https://designer-portfolio-abc123.vercel.app`. Click the preview to open it, and send the link to anyone.

**Choose a nicer address:** Project → **Settings → Domains** → edit the default domain to something like `yourname-edits.vercel.app` (if it's free).

**Updating the live site:** just run the 3 Git commands from section 6 (`add`, `commit`, `push`). Vercel automatically re-deploys within a minute. No other steps.

---

## 8. Common changes (cheat sheet)

### Change text
- **Name / email / location / socials / numbers / software:** `js/config.js`.
- **Headline:** in `index.html`, search for `I design brands`. Each `<span class="line">` is one line of the headline.
- **About paragraphs:** search for `id="about"` in `index.html` and edit the `<p>` text.
- **Browser tab title & Google description:** the `<title>` and `<meta name="description">` at the top of `index.html` (also change `og:title` / `og:description`).
- **Hide a social link:** set it to `""` in `config.js`.
- **Hide the colour palette:** delete the whole `palette: [ … ],` list in `config.js`.

### Change images
- **Your photo:** put your image in `assets/images/` (e.g. `me.jpg`, about 800×1000 px, under 300 KB), then in `index.html` change
  `src="assets/images/profile-placeholder.svg"` → `src="assets/images/me.jpg"`.
- **Favicon (tab icon):** replace `assets/favicon.svg`.
- **Project images:** see section 5.

### Change colours
Open `css/style.css`. At the very top, section **"1. DESIGN TOKENS"**:
```css
--accent: #22c55e;     /* green highlight  → try #3b82f6 (blue), #a3e635 (lime) or #ff4d2e (orange) */
--bg: #0b0b0c;         /* page background (dark theme) */
--text: #f3f1ec;       /* main text */
```
The light theme has its own values under `[data-theme="light"]` just below.
Fonts: change `--font-display`, `--font-body` (and the Google Fonts `<link>` in `index.html`).
Your own **palette swatches** (About section) are separate: edit `palette` in `config.js`.

### Change which theme opens first
Dark is the default. To default to light, add `data-theme="light"` to the opening `<html lang="en">` tag.

### Change / add / remove sections
Each section in `index.html` is one `<section id="…">` block with clear comment banners.
- **Remove a section:** delete its whole `<section>…</section>` block *and* its link in the `<ul class="nav__links">` menu.
- **Add a Service:** copy one `<li class="service reveal">…</li>` and edit it.
- **Add a Process step:** copy one `<li class="step reveal">…</li>`; also change `repeat(4, 1fr)` to `repeat(5, 1fr)` in `style.css` (section 10).
- **New section:** copy an existing section, change its `id` and `data-scene="…"`, then add `<li><a href="#your-id">Name</a></li>` to the menu.
- **Reorder sections:** cut/paste whole `<section>` blocks (and reorder the menu links).
- **Animate anything on scroll:** add `class="reveal"` to the element. Add `style="--delay:.1s"` to stagger it.

### Make the contact form send emails directly
The form currently opens the visitor's email app (that's all a front-end-only site can do). Later, if you want it to send without opening an app, a free service like **Formspree** (https://formspree.io) works with plain HTML — ask me and I'll show you how.

---

## 9. How the code works (so you're not just copy-pasting)

### `index.html` — the skeleton
- Top `<head>`: title, description, fonts, and the link to `style.css`.
- `<header class="nav">` — the menu bar. Links like `href="#work"` jump to `<section id="work">`.
- `<main>` holds 6 sections: **Hero → Work → About → Services → Process → Contact**.
- `data-config="name"` on an element means *"JavaScript, fill this with `SITE.name` from config.js."* That's how your name appears in many places from one edit.
- `class="reveal"` marks things that fade up when scrolled into view.
- The `<div class="modal">` near the bottom is the gallery pop-up (empty until a project is clicked).
- Last lines load `config.js` **first**, then `main.js`.

### `js/config.js` — your content
One JavaScript object called `SITE`. `main.js` reads it to build the project cards, filter buttons, stats, colour swatches, tools strip and links.

### `js/main.js` — the behaviour (each block is numbered & commented)
| Part | What it does |
|------|--------------|
| 2. Image helpers | Loads each card picture. If the file isn't found, the card shows the placeholder look. |
| 3. Fill from config | Writes your name/email/socials/stats/colour swatches into the page. |
| 4. Project grid | Builds a card for each project, and the category filter buttons. |
| 5. Lightbox | On click, shows the project's images in a pop-up. Arrows / ← → keys / swipe change the picture. Esc closes. |
| 7. Navigation | Mobile menu, menu hides when scrolling down / returns when scrolling up, highlights the current section. |
| 8. Scroll effects | One function updates the ruler, the Y coordinate, the featured image zoom and the process line (efficiently, once per frame). |
| 9. Reveal + counters | `IntersectionObserver` watches elements and adds `is-visible` when they appear; numbers count up. |
| 10. Cursor | The custom dot / "VIEW" cursor and the X / Y readout (mouse devices only). |

### `css/style.css` — the look
Numbered sections with a table of contents at the top. Key ideas:
- **CSS variables** (`--accent`, `--bg`…) hold colours so one change updates everything.
- **Responsive design:** the layout is built for phones first; `@media (min-width: …)` blocks add 2 columns on tablets (640px+) and 3 columns / desktop navigation on larger screens (900px / 1024px+).
- **Animations** use `transform` and `opacity` (smooth, cheap for the browser). `prefers-reduced-motion` turns them off for people who need that.

---

## 10. Troubleshooting

| Problem | Fix |
|---------|-----|
| My changes don't show | Save the file (Ctrl+S), then hard-refresh: **Ctrl+Shift+R** (Mac: **Cmd+Shift+R**). On the live site, make sure you ran `git add .`, `git commit`, `git push`. |
| Card still shows "placeholder" | The image isn't found. Check the path in `config.js` matches the real file name exactly (capital letters, `.jpg`, no spaces) and that the file is inside `assets/projects/`. |
| Image is blurry | Export it larger (about 1600 px) and compress with squoosh.app at quality ~80. |
| Site loads slowly | Your images are too big. Compress them (section 5, Step A). |
| Whole page looks broken / blank | A comma, quote or bracket in `config.js` was deleted. Press **F12** in the browser → **Console** tab — it shows the line number of the problem. Or undo with **Ctrl+Z**. |
| `git push` is rejected | Run `git pull origin main --allow-unrelated-histories`, then `git push` again (usually happens if you ticked "Add a README" when creating the repo). |
| Vercel shows 404 | In Vercel → Settings → General, make sure **Root Directory** is the folder that contains `index.html`. |

Enjoy your new site! 🎨
