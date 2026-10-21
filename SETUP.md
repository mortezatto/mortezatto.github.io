# Running this locally, and deploying to GitHub Pages

## Running with Docker (recommended, no Ruby install needed)

**One-time / whenever the Gemfile changes:**
```
docker compose build
```

**Run it:**
```
docker compose up
```
Then open **http://localhost:4000**. Your local files are mounted straight
into the container, so editing anything — a `_data/*.json` file, `_config.yml`,
a page in `_includes/` — rebuilds and refreshes the browser automatically.

Stop it with `Ctrl+C`, or `docker compose down` to also remove the container.

## Running without Docker

You need Ruby + Bundler installed. Check if you already have them:
```
ruby -v
gem -v
```
If not:
- **macOS**: `brew install ruby`
- **Windows**: install via [RubyInstaller](https://rubyinstaller.org/) (pick "with DevKit")
- **Linux (Debian/Ubuntu)**: `sudo apt install ruby-full build-essential zlib1g-dev`

Install Bundler once, then this site's dependencies, from inside `site/`:
```
gem install bundler
cd site
bundle install
bundle exec jekyll serve --livereload
```
Open **http://localhost:4000**. Stop the server with `Ctrl+C`.

## Editing content

Everything that repeats — education, experience, awards, skills, projects,
publications, the home-page intro and research-focus bullets — lives in
`_data/*.json`. Edit the JSON, save, and the running server rebuilds
automatically:

- `_data/home.json` — home page intro paragraphs, interests, compact education list
- `_data/research_focus.json` — home page "Research Focus" bullets
- `_data/background.json` — About page "Background" paragraph
- `_data/education.json` — About page "Education" section
- `_data/experience.json` — About page "Experience" accordion (`id`, `open`, `tags`, `bullets` — see `/guide/` for the full field reference)
- `_data/awards.json` — About page "Awards, Honors & Scholarships"
- `_data/skills.json` — About page "Skills" grid
- `_data/publications.json` — Publications page + Projects page publications teaser
- `_data/news.json` — News page timeline (`date`, `type`, `icon`, `html`)
- `_data/teaching.json` — Teaching page grid (`role`, `title`, `description`, `date`)

A new project isn't a JSON entry — add a Markdown file to `_projects/` instead (front matter
for the card + hero + links, Markdown body for the full write-up). See `/guide/` for the field
reference and an example.

**Your name, email, phone, location, socials, hero text** → edit `_config.yml`
(restart `jekyll serve` after changing this file — Jekyll doesn't watch its
own config for live changes).

**Page structure / markup** → the shared chrome (nav, footer, head) lives in
`_includes/header-nav.html`, `_includes/footer.html`, `_includes/head-meta.html`.
Each page's body markup lives in `_includes/home-content.html`,
`cv-content.html`, `projects-content.html`, `blog-content.html` — these
loop over the JSON data above using Liquid, so you shouldn't need to touch
them for routine content updates.

**Styling** → `assets/stylesheets/main.css` is unchanged from the original
clarity-template design. Don't edit it unless you actually want to change
the visual design.

**Rich content features (math, diagrams, code, etc.)** → see `/guide/` for
how the site fits together and `/style-guide/` for a live demo of every
Markdown feature available (KaTeX math, Mermaid diagrams, syntax-highlighted
code with a copy button, code tabs, pseudocode, footnotes, tables, figures,
video). Neither page is linked in the nav — they're private references, so
visit them directly at those URLs.

**Updating your CV** → replace `assets/cv/morteza-abedi-cv.pdf` with a new
file of the same name (or update the path in `cv.md`'s front matter and the
`href` in `_includes/cv-content.html` if you rename it).

## Deploying to GitHub Pages

This repo already includes a GitHub Actions workflow
(`.github/workflows/pages.yml`) that builds and deploys automatically on
every push to `main`.

**Step 1 — Create the repo** on GitHub (any name works, since deployment goes
through Actions rather than the classic Jekyll-on-Pages build).

**Step 2 — Push this folder's contents to it**, with this project's root
(containing `.github/` and `site/`) at the repo root:
```
git init
git add .
git commit -m "Initial portfolio site"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

**Step 3 — Turn on Pages.** In the repo on GitHub: **Settings → Pages** →
under "Build and deployment", set Source to **"GitHub Actions"**. The
workflow will run on the next push (or trigger it manually from the
**Actions** tab via "Run workflow").

**Step 4 — Update `_config.yml`.** Set `url:` to your real GitHub Pages URL.
If the repo is **not** named `<username>.github.io` (i.e. it's a project
site served at `https://<username>.github.io/<repo-name>/`), also set
`baseurl:` to `"/<repo-name>"` — otherwise the CSS/JS/image links will 404.
Swap the placeholder `"#"` values in `socials:` for the real GitHub, LinkedIn,
and Google Scholar URLs.
