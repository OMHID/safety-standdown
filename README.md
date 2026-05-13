# Equipment Verification Training App

A lightweight, client-side-only online training module.  
No backend, no database, no build step required.

---

## 📁 Folder Structure

```
equipment-training/
├── index.html          ← App shell (all sections)
├── vercel.json         ← Vercel static deployment config
├── css/
│   └── styles.css      ← All styles
└── js/
    ├── content.js      ← ✏️  EDIT THIS: slides + quiz questions
    └── app.js          ← Application logic (routing, quiz, PDF)
```

---

## ✏️ Updating Content

Open **`js/content.js`** — it is the only file you need to edit for content changes.

### Slides
Edit the `SLIDES` array. Each slide has:
```js
{
  title: "Slide Title",
  content: [
    "First paragraph or intro line.",
    "• Bullet point one",
    "• Bullet point two",
  ],
  note: "Optional footer note (leave as empty string \"\" to hide)"
}
```

### Quiz Questions
Edit the `QUIZ_QUESTIONS` array. Two types:

**Single choice** (radio buttons):
```js
{
  type: "single",
  question: "Your question here?",
  options: ["Option A", "Option B", "Option C", "Option D"],
  correct: [1]   // index of the correct option (0-based)
}
```

**Multi-select** (checkboxes):
```js
{
  type: "multi",
  question: "Select all that apply:",
  options: ["Option A", "Option B", "Option C", "Option D"],
  correct: [0, 2]   // indices of ALL correct options
}
```

### Pass Score
Change the `PASS_SCORE_PERCENT` constant at the bottom of `content.js`:
```js
const PASS_SCORE_PERCENT = 80; // change to any number 0–100
```

### Training Title
Change `TRAINING_TITLE` at the top of `content.js`.

---

## 🚀 Deploy to Vercel

### Option A — GitHub + Vercel (recommended)

1. Create a new GitHub repository
2. Push all files in this folder to the repo root:
   ```
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```
3. Go to [vercel.com](https://vercel.com) → **Add New Project**
4. Import your GitHub repository
5. Framework Preset: **Other** (or leave as auto-detected)
6. Click **Deploy** — no environment variables needed

Vercel will automatically redeploy every time you push to `main`.

### Option B — Vercel CLI

```bash
npm i -g vercel
cd equipment-training
vercel --prod
```

---

## 🌐 Run Locally

No build step needed. Just open `index.html` in any modern browser,  
or use a simple local server:

```bash
# Python 3
python -m http.server 3000
# then open http://localhost:3000
```

---

## 📦 External Libraries (CDN)

The app loads two libraries via CDN at runtime — no npm install required:

| Library | Version | Purpose |
|---------|---------|---------|
| [html2canvas](https://html2canvas.hertzen.com/) | 1.4.1 | Renders the certificate card to a canvas image |
| [jsPDF](https://github.com/parallax/jsPDF) | 2.5.1 | Converts the canvas image to a downloadable PDF |

Both are loaded from `cdnjs.cloudflare.com` — reliable and fast globally.

---

## 🔒 Privacy

All data (participant name, answers, score) is held in JavaScript memory only.  
Nothing is stored, transmitted, or persisted anywhere.
