# HealthTracker — Web Health Monitoring Dashboard

HealthTracker is a lightweight, beginner-friendly web dashboard to manually track daily health metrics:

- BMI (calculated from weight + height)
- Water intake (ml)
- Sleep hours
- Record any diagnosed disease
- Schedule medicine reminders (notifications)
- Add simple diet plan items (scalable structure)
- View history of entries

Built with plain HTML, CSS, and JavaScript and stores data in the browser's LocalStorage — no backend required.

---

## Features

- Clean, card-based, responsive UI
- Progress bars for water and sleep goals
- BMI calculator with category and tips
- Add one entry per day (replace if you save again)
- Health history with delete per entry
- Medicine reminders with browser notifications (Notification API)
- Simple diet items list you can expand into weekly plans
- Beginner-friendly code with clear separation of concerns

---

## How to use

1. Open `index.html` in a modern browser (Chrome, Edge, Firefox).
2. Fill the "Quick Add Daily Entry" form and click "Save Entry".
3. View latest day metrics on the dashboard cards.
4. Use the "History" panel to review and delete previous entries.
5. Open "Med Reminders", add a medicine name + time and allow notifications when prompted.
6. Add diet items in "Diet Plans" — this area is intentionally simple so it can be expanded later.

Notes:
- Medicine notifications rely on the browser Notification API. The browser will ask permission when needed.
- Data is stored only in your browser LocalStorage — clearing storage or changing browsers will remove data.
- Scheduler checks for reminders every 15 seconds and triggers notifications when the system clock HH:MM matches the reminder time.

---

## Files

- `index.html` — main layout and forms
- `styles.css` — responsive modern styling
- `app.js` — all app logic (storage, rendering, scheduling)
- `README.md` — this file

---

## Extending / Ideas

- Add user preferences (water goal, sleep goal)
- Add charts (Chart.js or custom canvas) for trends
- Export / import data (JSON)
- Sync with backend (Firebase, Supabase) for multi-device
- Add templates for diet plans and macro tracking
- Tighter scheduling (use Service Workers / push notifications for background)

---

## License & Contribution

This example is provided as-is for learning and quick prototyping. Feel free to copy, modify and adapt.

Happy building — stay healthy!