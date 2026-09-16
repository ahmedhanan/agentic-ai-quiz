# Agentic AI — Quick Quiz

A single-file, client-side quiz for the "Agentic AI intro" talk. Attendees take it
three times (before / midway / after). Each round pulls a random 8 questions from a
pool and shuffles the options. Results are a percentage only — correct answers are
never shown, and nothing leaves the device.

- `index.html` — the whole app (open it in any browser).
- `build_questions.mjs` — regenerates the hashed question pool. Edit the pool, run
  `node build_questions.mjs > questions.json`, then paste the JSON into the
  `/*POOL_JSON*/ ... /*END_POOL*/` slot in `index.html`.
