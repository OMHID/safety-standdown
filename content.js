/**
 * content.js
 * All training slides, quiz questions, and feedback questions.
 * Edit this file to update training content.
 */

const TRAINING_TITLE = "Safety Standdown \u2013 Torque/Tension Dry Run";

// ── SLIDES ────────────────────────────────────────────────────
const SLIDES = [
  {
    title: "Purpose",
    content: [
      "This Safety Standdown is a proactive (\u201cDry Run\u201d) activity intended to verify critical controls, reinforce expectations, and gather field feedback to prevent injury during torque and tension operations."
    ],
    note: "Classification: Public"
  },
  {
    title: "Scope",
    content: [
      "Applies to all personnel involved in:",
      "\u2022 Hydraulic torque (Hytorq) operations",
      "\u2022 Hydraulic tensioning activities",
      "\u2022 Any work involving torque-related tools and equipment",
      "\u2022 Any work involving tooling that requires installed safeguards"
    ],
    note: "Classification: Public"
  },
  {
    title: "Required Actions (Complete Before Work Begins)",
    content: [
      "All of the following actions must be completed before work begins.",
      "Review each section carefully and answer each quiz question correctly to proceed to the next topic."
    ],
    note: "You must answer every question correctly before you can advance."
  },
  {
    title: "Equipment Verification",
    content: [
      "\u2022 Confirm all torque heads are equipped with properly installed handles",
      "\u2022 Do not use any equipment where handles are missing, damaged, or improperly installed",
      "\u2022 Confirm: Is this the right tool for the job?"
    ],
    note: "Classification: Public"
  },
  {
    title: "PPE Verification",
    content: [
      "\u2022 Ensure all technicians are wearing impact and cut-resistant gloves appropriate for the task \u2013 Impact A1 Cut Resistance & A4 Abrasion Ratings",
      "\u2022 General-purpose gloves (e.g., latex dipped) are NOT acceptable for torque/tension work"
    ],
    note: "Classification: Public"
  },
  {
    title: "JSA / Ready for Work Expectations",
    content: [
      "If clearance, positioning or access issues exist necessitating removal of handles:",
      "\u2022 Work must NOT proceed without mitigation",
      "\u2022 Confirm again: Is this the right tool for the job?",
      "\u2022 Evaluate alternative tools, setups, or methods",
      "\u2022 Document specific mitigation steps within the JSA / Ready for Work process",
      "\u2022 Review and communicate mitigation with the team prior to execution"
    ],
    note: "Classification: Public"
  },
  {
    title: "Supervisor Responsibilities",
    content: [
      "\u2022 Lead and document completion of this Safety Standdown",
      "\u2022 Validate all action items with the crew",
      "\u2022 Reinforce stop work authority if unsafe conditions exist",
      "\u2022 Ensure all concerns are addressed before resuming work"
    ],
    note: "Classification: Public"
  },
  {
    title: "Technician Engagement \u2013 Feedback Required",
    content: [
      "Before completing the training, please answer the following feedback questions.",
      "Your responses will be included on your certificate and shared with your supervisor.",
      "1. What other tools (besides torque and tension tools) can we look at?",
      "2. Was this activity effective? How can we do better?"
    ],
    note: "Your feedback helps improve safety practices across all operations."
  },
  {
    title: "Key Reminder",
    content: [
      "No task proceeds without proper tool configuration, correct PPE, and documented mitigation of hazards."
    ],
    note: "Classification: Public"
  }
];

// ── QUIZ QUESTIONS ────────────────────────────────────────────
// Each question is tied to a content section.
// mustPassToAdvance: true means the user must get it 100% right to move on.
const QUIZ_QUESTIONS = [
  {
    type: "multi",
    question: "Which of the following are correct steps for Equipment Verification? (Select all that apply)",
    options: [
      "Confirm all torque heads are equipped with properly installed handles",
      "Do not use any equipment where handles are missing, damaged, or improperly installed",
      "Confirm: Is this the right tool for the job?",
      "Proceed with equipment if minor handle damage is present and does not affect operation",
      "Only verify the tool if there is a problem or at the end of the job"
    ],
    correct: [0, 1, 2],
    mustPassToAdvance: true
  },
  {
    type: "multi",
    question: "Which of the following are correct steps for PPE Verification? (Select all that apply)",
    options: [
      "Ensure all technicians are wearing impact and cut-resistant gloves appropriate for the task (Impact A1 Cut Resistance & A4 Abrasion Ratings)",
      "General-purpose gloves (e.g., latex dipped) are NOT acceptable for torque/tension work",
      "General-purpose gloves are acceptable as long as they fit properly",
      "Cut resistance rating is optional if only light torque work is being performed"
    ],
    correct: [0, 1],
    mustPassToAdvance: true
  },
  {
    type: "multi",
    question: "Which of the following are correct steps for JSA / Ready for Work Expectations when handle removal is required? (Select all that apply)",
    options: [
      "Work must NOT proceed without mitigation",
      "Confirm again: Is this the right tool for the job?",
      "Evaluate alternative tools, setups, or methods",
      "Document specific mitigation steps within the JSA / Ready for Work process",
      "Review and communicate mitigation with the team prior to execution",
      "Work may proceed without mitigation if the team has prior experience with the task",
      "Documentation of mitigation steps can be completed after the job is finished"
    ],
    correct: [0, 1, 2, 3, 4],
    mustPassToAdvance: true
  },
  {
    type: "multi",
    question: "Which of the following are correct Supervisor Responsibilities? (Select all that apply)",
    options: [
      "Lead and document completion of this Safety Standdown",
      "Validate all action items with the crew",
      "Reinforce stop work authority if unsafe conditions exist",
      "Ensure all concerns are addressed before resuming work",
      "Delegate all safety responsibilities to team members once the job begins",
      "Resume work even if some concerns remain unresolved as long as deadlines must be met"
    ],
    correct: [0, 1, 2, 3],
    mustPassToAdvance: true
  }
];

// ── FEEDBACK QUESTIONS ────────────────────────────────────────
// Open-text responses captured and shown on the certificate PDF.
const FEEDBACK_QUESTIONS = [
  "What other tools (besides torque and tension tools) can we look at?",
  "Was this activity effective? How can we do better?"
];

// Each quiz question must be answered 100% correctly to advance.
const PASS_SCORE_PERCENT = 100;
