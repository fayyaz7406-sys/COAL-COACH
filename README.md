# COAL Coach — Bilingual Midterm Prep Platform

`COAL Midterm Preparation Guide.docx` (Teacher ke notes, Lectures 1–8) se banaya gaya **interactive, bilingual** study website. Top-right corner se **اردو (Roman Urdu) ↔ English** switch karein — poora course content, quiz, mock aur labs dono zabanon mein.

## Kaise chalayein

1. `index.html` par **double-click** karein (Chrome / Edge / Firefox — koi bhi browser).
2. Internet ki zaroorat **nahi** — sab files local hain, koi CDN/library nahi.
3. Progress (topics, quiz scores, mock best, notes, bookmarks, settings) browser mein automatically save hoti hai.
4. Backup ke liye: **My Workspace → Goals & Backup → Export backup (.json)**.

Agar browser file block kare, to is folder mein PowerShell khol kar chalayein:

```powershell
python -m http.server 8000
```

Phir `http://localhost:8000` kholein.

## Features

| Feature | Detail |
|---|---|
| **🌐 Bilingual** | Roman Urdu (default) aur English — content, questions, options, explanations, labs, sab translate hote hain |
| **7 topic pages** | Definition → Working → Example → Exam Tip flow, tables aur worked examples ke saath |
| **🎬 Visuals** | Interrupt cycle, priority nesting, DMA bus ownership, cache hit/miss, fetch–decode, Booth aur division ke step-by-step players (auto-play) |
| **🧮 Labs** | Cache address fields + access time + CPI, address-bus calculator, 16-bit hex instruction decoder, twos complement / overflow / Booth / restoring division |
| **✅ Topic quizzes** | **Practice mode** (turant feedback) aur **Exam mode** (result par review), bookmark aur read-aloud (🔊) |
| **⚡ Rapid Fire** | 10 random questions ka mixed warm-up drill |
| **🏆 Mock test** | 20 random questions, 20-min timer, palette, marking aur detailed review |
| **🃏 Flashcards** | 46 flip cards with topic filter aur "Samajh gaya / Dobara" tracking |
| **⚡ Quick revision** | Guide ki 14-point revision sheet |
| **📊 Analytics** | Topic-wise progress, accuracy, weak areas, mock history chart aur 8 achievement badges |
| **📝 My Workspace** | Apne topic-wise notes (.txt download), bookmark list, exam countdown, daily goal, JSON backup/import/reset |
| **🎯 Productivity** | Pomodoro timer (25/5), Focus mode (⛶), font-size control (Aa), streak tracking |
| **🔍 Search** | Topic ya question search — seedha quiz par le jata hai |
| **🎨 Theme + print** | Dark/light mode aur print-friendly topic view |

### Keyboard shortcuts

- `1`–`4` — option select karein
- `Space` — flashcard flip karein
- `Esc` — focus mode se bahar / search close

## Files

- `index.html` — app shell
- `styles.css` — design, themes, responsive layout, print styles
- `data.js` — Roman Urdu course content + 69 questions
- `data.en.js` — complete English translation (same IDs, same answer keys)
- `i18n.js` — UI translation layer (Roman Urdu → English)
- `app.js` — routing, quizzes, mock, labs, analytics, workspace, pomodoro

## Exam tip

Pehle topic ka **Padhein** tab, phir **Visual**, phir **Lab** (jahan ho), aur aakhar me **Quiz**. **Rapid Fire** se warm up karein, phir **Mock Test** — target 80%+. Roz thoda revise karein aur streak todne se bachein. 💪📚

---

Banaya gaya: COAL Midterm Preparation Guide ke basis par · Lectures 1–8
