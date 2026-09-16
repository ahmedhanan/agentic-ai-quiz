// Build-time helper: turns a readable question pool into a hashed pool
// so the deployed index.html never contains plaintext correct answers.
// Run with: node build_questions.mjs  -> prints JSON to paste into index.html
import { createHash } from 'node:crypto';

const SALT = 'agentic-2026-∆loop∆'; // also embedded in the app; raises the bar, not a secret

// answer = the exact correct option string. Options are shuffled at runtime.
const POOL = [
  // ---- Chapter 1: Three Eras + autonomy spectrum ----
  { q: 'Which era gives the system a high-level GOAL plus guardrails — not rules and not a single prompt?',
    options: ['Rules-based software', 'Generative AI', 'Agentic AI', 'Cloud computing'],
    answer: 'Agentic AI', chapter: 1 },
  { q: 'Rules-based software (the "calculator" era) is best described as…',
    options: ['Flexible and tolerant of novel input', 'Predictable and auditable but rigid', 'Goal-driven and self-correcting', 'Passive until spoken to'],
    answer: 'Predictable and auditable but rigid', chapter: 1 },
  { q: 'What is the key LIMITATION of generative AI as described in the talk?',
    options: ['It crashes on any unprogrammed input', 'It is passive — it only reacts when prompted, then stops', 'It cannot handle novel input', 'It needs guardrails and tool access'],
    answer: 'It is passive — it only reacts when prompted, then stops', chapter: 1 },
  { q: 'How does generative AI actually work?',
    options: ['It follows hand-authored IF/THEN branches', 'It predicts the most likely next word/pixel/sound from patterns', 'It loops: plan, act, observe, reflect', 'It looks answers up by key in a database'],
    answer: 'It predicts the most likely next word/pixel/sound from patterns', chapter: 1 },
  { q: 'Scenario: an HR dropdown to request leave that a manager clicks "Approve". Where on the spectrum?',
    options: ['Rules-based code (zero autonomy)', 'Passive generative AI', 'Agentic AI (full autonomy)', 'Long-term memory'],
    answer: 'Rules-based code (zero autonomy)', chapter: 1 },
  { q: 'Scenario: a chatbot answers "What is our parental leave policy?" with a paragraph from a PDF, then stops. This is…',
    options: ['Rules-based code', 'Passive generative AI (basic retrieval)', 'Agentic AI', 'A tool call'],
    answer: 'Passive generative AI (basic retrieval)', chapter: 1 },
  { q: 'Scenario: an assistant spots a calendar clash, proposes times to the client, updates the invite once confirmed, and leaves a note. This is…',
    options: ['Rules-based code', 'Passive generative AI', 'Agentic AI', 'A validation rule'],
    answer: 'Agentic AI', chapter: 1 },
  { q: 'In the agentic era, where does most of the design effort shift to?',
    options: ['Writing more IF/THEN branches', 'Guardrails, tool access and oversight', 'A larger training dataset', 'A faster user interface'],
    answer: 'Guardrails, tool access and oversight', chapter: 1 },

  // ---- Chapter 2: the loop + anatomy ----
  { q: 'What is the correct order of the agent’s cybernetic loop?',
    options: ['Act → Plan → Reflect → Observe', 'Plan → Act → Observe → Reflect', 'Observe → Plan → Act → Reflect', 'Plan → Observe → Act → Reflect'],
    answer: 'Plan → Act → Observe → Reflect', chapter: 2 },
  { q: 'In the "Observe" step of the loop, the agent is doing what?',
    options: ['Choosing its ultimate goal', 'Executing a single micro-step', 'Looking at the result of its action — did it work or error?', 'Deciding what to keep in long-term memory'],
    answer: 'Looking at the result of its action — did it work or error?', chapter: 2 },
  { q: 'What are the four moving parts in the anatomy of an agent?',
    options: ['Core LLM, Planning, Memory, Tools', 'Rules, Prompts, Goals, Guardrails', 'Input, Output, Cache, Network', 'Plan, Act, Observe, Reflect'],
    answer: 'Core LLM, Planning, Memory, Tools', chapter: 2 },
  { q: 'In an agent, the Core LLM is no longer the thing that produces the answer — it is the thing that…',
    options: ['Stores the memory', 'Makes the decision', 'Sends the email', 'Writes the rules'],
    answer: 'Makes the decision', chapter: 2 },
  { q: 'The talk says you evaluate an agent primarily on…',
    options: ['The elegance of a single response', 'The quality of its decisions and its recovery from bad ones', 'How fast it types', 'The size of its context window'],
    answer: 'The quality of its decisions and its recovery from bad ones', chapter: 2 },
  { q: 'What does the Planning framework (e.g. ReAct) actually give you?',
    options: ['A cleverer model', 'A deliberate, human-readable, auditable trail of reasoning', 'Faster tool calls', 'A larger memory store'],
    answer: 'A deliberate, human-readable, auditable trail of reasoning', chapter: 2 },
  { q: 'In a ReAct trace, what always comes immediately before an Action?',
    options: ['An Observation', 'A stated Thought (the reason)', 'A tool error', 'The final answer'],
    answer: 'A stated Thought (the reason)', chapter: 2 },
  { q: 'The "intern with a credit card" who books the first flight they see illustrates what?',
    options: ['A good long-term memory', 'Acting without a planning framework', 'A well-designed tool layer', 'The Observe step working correctly'],
    answer: 'Acting without a planning framework', chapter: 2 },
  { q: 'Short-term memory (the "scratchpad" / context window) mainly exists to…',
    options: ['Remember you across sessions weeks later', 'Stop the agent going round in circles within a session', 'Send real-world actions', 'Replace the Core LLM'],
    answer: 'Stop the agent going round in circles within a session', chapter: 2 },
  { q: 'Long-term memory (the "filing cabinet", often a vector database) is retrieved…',
    options: ['By looking up an exact key', 'By relevance — what resembles the current situation', 'Only when the session ends', 'By the tool layer'],
    answer: 'By relevance — what resembles the current situation', chapter: 2 },
  { q: 'A model can only ever emit text. What turns that text into a real-world change?',
    options: ['The context window', 'The tool layer (the "appendages")', 'Long-term memory', 'The planning step'],
    answer: 'The tool layer (the "appendages")', chapter: 2 },
  { q: 'In the tool flow, what does the runtime do when the model emits e.g. [TRIGGER_EMAIL: send to boss]?',
    options: ['Shows the raw text to the user', 'Intercepts it as a command and stops it reaching the user', 'Stores it in long-term memory', 'Ignores it as prose'],
    answer: 'Intercepts it as a command and stops it reaching the user', chapter: 2 },
  { q: 'The talk’s honest answer to "is it safe?" is that you control…',
    options: ['The model’s thoughts', 'Which tools the model is allowed to reach for', 'The size of the training data', 'The user’s prompt'],
    answer: 'Which tools the model is allowed to reach for', chapter: 2 },
  { q: 'Remove any ONE of the four components and the loop stops. Which pairing is right?',
    options: ['No tools = no eyes', 'No memory = no learning', 'No planning = no hands', 'No LLM = no observation'],
    answer: 'No memory = no learning', chapter: 2 },

  // ---- Chapter 3: being the agent + debrief ----
  { q: 'In the "be the agent" exercise, if something is NOT written on the board, then…',
    options: ['The agent still remembers it', 'The agent does not know it', 'It becomes long-term memory', 'It triggers a tool'],
    answer: 'The agent does not know it', chapter: 3 },
  { q: 'The debrief calls this "the single most common real-world agent failure":',
    options: ['Choosing the cheapest fare', 'Acting without observing — assuming success after an error', 'Writing too many thoughts', 'Using too many tools'],
    answer: 'Acting without observing — assuming success after an error', chapter: 3 },
  { q: 'The talk’s closing point: a "forgotten constraint" or an "unread error" is fixed by…',
    options: ['A cleverer / bigger model', 'Better memory, tighter guardrails and an honest observation step', 'More training data', 'Faster hardware'],
    answer: 'Better memory, tighter guardrails and an honest observation step', chapter: 3 },
  { q: 'An "infinite loop" failure in the exercise happened because…',
    options: ['The goal was too ambitious', 'The same tool was called twice and nobody read the board', 'The model was too small', 'There were too many tools'],
    answer: 'The same tool was called twice and nobody read the board', chapter: 3 },
];

const hash = (s) => createHash('sha256').update(SALT + '|' + s).digest('hex').slice(0, 16);

const out = POOL.map(({ q, options, answer, chapter }) => {
  if (!options.includes(answer)) throw new Error('answer not in options: ' + q);
  return { q, o: options, a: hash(answer), c: chapter };
});

console.log(JSON.stringify(out));
console.error(`Built ${out.length} questions.`);
