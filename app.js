/**
 * app.js
 * ──────────────────────────────────────────────────────────────
 * Safety Standdown – Torque/Tension Dry Run
 *
 * Flow:
 *   Start → Slides (content-only) → after each quiz-linked slide
 *   show the corresponding question → must answer correctly to
 *   advance → Feedback → Key Reminder → Certificate
 *
 * Quiz questions are interspersed with slides. The user MUST get
 * each question 100% correct before seeing the next slide.
 * ──────────────────────────────────────────────────────────────
 */

/* ── State ──────────────────────────────────────────────────── */
const state = {
  name: "",
  feedbackAnswers: [],   // open-text responses
  currentStep: 0,        // index into STEPS array
  questionAttempts: 0,   // retry counter for current question
  completionDate: ""
};

/* ── Build the step sequence ────────────────────────────────────
   Steps are interleaved: slide → quiz → slide → quiz …
   We map from slide indices to quiz question indices.
   Slides 3,4,5,6 (0-based) each have a quiz question after them.
   ────────────────────────────────────────────────────────────── */

// slide index → quiz question index
const SLIDE_TO_QUIZ = { 3: 0, 4: 1, 5: 2, 6: 3 };

// Build flat step list: { type: "slide"|"quiz"|"feedback"|"result", index }
const STEPS = [];
SLIDES.forEach((_, si) => {
  STEPS.push({ type: "slide", index: si });
  if (SLIDE_TO_QUIZ[si] !== undefined) {
    STEPS.push({ type: "quiz", index: SLIDE_TO_QUIZ[si] });
    STEPS.push({ type: "result", index: SLIDE_TO_QUIZ[si] });
  }
  // After the "Technician Engagement" slide (index 7), insert feedback
  if (si === 7) {
    STEPS.push({ type: "feedback" });
  }
});
// Final step is certificate (handled by showCertificate)

/* ── Section references ─────────────────────────────────────── */
const sections = {
  start:    document.getElementById("section-start"),
  slides:   document.getElementById("section-slides"),
  quiz:     document.getElementById("section-quiz"),
  result:   document.getElementById("section-result"),
  feedback: document.getElementById("section-feedback"),
  cert:     document.getElementById("section-cert")
};

function showSection(id) {
  Object.values(sections).forEach(s => s.classList.remove("active"));
  sections[id].classList.add("active");
}

function animateIn(el) {
  el.classList.remove("fade-in");
  void el.offsetWidth;
  el.classList.add("fade-in");
}

/* ── START SCREEN ───────────────────────────────────────────── */
document.getElementById("btn-start").addEventListener("click", () => {
  const nameInput = document.getElementById("participant-name");
  const name = nameInput.value.trim();
  if (!name) {
    nameInput.classList.add("input-error");
    nameInput.placeholder = "Please enter your full name";
    return;
  }
  nameInput.classList.remove("input-error");
  state.name = name;
  state.currentStep = 0;
  renderStep();
});

document.getElementById("participant-name").addEventListener("keydown", e => {
  if (e.key === "Enter") document.getElementById("btn-start").click();
});

/* ── STEP RENDERER ──────────────────────────────────────────── */
function renderStep() {
  const step = STEPS[state.currentStep];
  if (!step) { showCertificate(); return; }

  if (step.type === "slide")    { renderSlide(step.index); return; }
  if (step.type === "quiz")     { renderQuiz(step.index);  return; }
  if (step.type === "result")   { renderResult(step.index); return; }
  if (step.type === "feedback") { renderFeedback();         return; }
}

function advanceStep() {
  state.currentStep++;
  renderStep();
}

function goBackStep() {
  // Navigate back, skipping result screens
  let target = state.currentStep - 1;
  while (target >= 0 && STEPS[target].type === "result") target--;
  if (target < 0) target = 0;
  state.currentStep = target;
  renderStep();
}

/* ── SLIDES ─────────────────────────────────────────────────── */
function renderSlide(idx) {
  const slide = SLIDES[idx];
  const slideSteps = STEPS.filter(s => s.type === "slide");
  const slidePos = slideSteps.findIndex(s => s.index === idx);
  const total = slideSteps.length;

  document.getElementById("slide-counter").textContent =
    `Slide ${slidePos + 1} of ${total}`;

  const pct = Math.round(((slidePos + 1) / total) * 100);
  document.getElementById("slide-progress-bar").style.width = pct + "%";

  document.getElementById("slide-title").textContent = slide.title;

  const contentEl = document.getElementById("slide-content");
  contentEl.innerHTML = slide.content.map(line => `<p>${escapeHtml(line)}</p>`).join("");

  const noteEl = document.getElementById("slide-note");
  noteEl.textContent = slide.note || "";
  noteEl.style.display = slide.note ? "block" : "none";

  // Back button: hide on very first slide
  document.getElementById("btn-slide-back").disabled = state.currentStep === 0;

  // Next label
  const isLast = state.currentStep === STEPS.length - 1;
  document.getElementById("btn-slide-next").textContent = isLast ? "Finish" : "Next \u2192";

  showSection("slides");
  animateIn(document.getElementById("slide-card"));
}

document.getElementById("btn-slide-next").addEventListener("click", advanceStep);
document.getElementById("btn-slide-back").addEventListener("click", goBackStep);

/* ── QUIZ ───────────────────────────────────────────────────── */
let currentAnswer = [];

function renderQuiz(idx) {
  currentAnswer = [];
  state.questionAttempts = 0;
  const q = QUIZ_QUESTIONS[idx];

  const badge = document.getElementById("quiz-type-badge");
  badge.textContent = "Select all that apply";
  badge.className = "type-badge badge-multi";

  document.getElementById("quiz-question").textContent = q.question;

  // Shuffle options randomly, keeping track of original indices for grading
  const shuffled = q.options
    .map((opt, i) => ({ opt, origIdx: i }))
    .sort(() => Math.random() - 0.5);

  const optionsEl = document.getElementById("quiz-options");
  optionsEl.innerHTML = "";
  shuffled.forEach(({ opt, origIdx }) => {
    const label = document.createElement("label");
    label.className = "option-label";
    const input = document.createElement("input");
    input.type = "checkbox";
    input.name = "quiz-option";
    input.value = origIdx; // store original index so grading still works
    input.addEventListener("change", collectAnswer);
    const span = document.createElement("span");
    span.textContent = opt;
    label.appendChild(input);
    label.appendChild(span);
    optionsEl.appendChild(label);
  });

  document.getElementById("quiz-validation").style.display = "none";
  document.getElementById("btn-quiz-back").disabled = state.currentStep === 0;
  document.getElementById("btn-quiz-next").textContent = "Submit Answer";

  showSection("quiz");
  animateIn(document.getElementById("quiz-card"));
}

function collectAnswer() {
  const inputs = document.querySelectorAll('input[name="quiz-option"]');
  currentAnswer = [];
  // Use input.value (original index) not loop index, so shuffled order doesn't break grading
  inputs.forEach(inp => { if (inp.checked) currentAnswer.push(parseInt(inp.value)); });
}

document.getElementById("btn-quiz-next").addEventListener("click", () => {
  if (currentAnswer.length === 0) {
    const v = document.getElementById("quiz-validation");
    v.style.display = "block";
    animateIn(v);
    return;
  }
  document.getElementById("quiz-validation").style.display = "none";
  state.questionAttempts++;

  const step = STEPS[state.currentStep];
  const q = QUIZ_QUESTIONS[step.index];
  const isCorrect = arraysEqual(currentAnswer.sort(), [...q.correct].sort());

  // Store result for the result screen
  state.lastAnswerCorrect = isCorrect;
  state.lastAnswerSelected = [...currentAnswer];
  state.lastQuizIndex = step.index;

  advanceStep(); // go to result screen
});

document.getElementById("btn-quiz-back").addEventListener("click", goBackStep);

/* ── RESULT SCREEN ──────────────────────────────────────────── */
function renderResult(idx) {
  const q = QUIZ_QUESTIONS[idx];
  const isCorrect = state.lastAnswerCorrect;

  const iconEl = document.getElementById("result-icon");
  const titleEl = document.getElementById("result-title");
  const msgEl = document.getElementById("result-msg");
  const reviewEl = document.getElementById("result-review");
  const nextBtn = document.getElementById("btn-result-next");

  iconEl.textContent = isCorrect ? "\u2705" : "\u274C";
  titleEl.textContent = isCorrect ? "Correct!" : "Incorrect \u2013 Please Try Again";

  if (isCorrect) {
    msgEl.textContent = "Well done! You may proceed to the next section.";
    reviewEl.style.display = "none";
    nextBtn.textContent = "Continue \u2192";
    nextBtn.onclick = advanceStep;
  } else {
    msgEl.textContent = "That\u2019s not quite right. Review the correct answers below, then try again.";

    // Show correct answers
    reviewEl.style.display = "block";
    reviewEl.innerHTML = "<strong>Correct answers:</strong><ul>" +
      q.correct.map(i => `<li>${escapeHtml(q.options[i])}</li>`).join("") +
      "</ul>";

    nextBtn.textContent = "Try Again";
    nextBtn.onclick = () => {
      // Go back to the quiz step (one step before this result step)
      state.currentStep--;
      renderStep();
    };
  }

  showSection("result");
  animateIn(document.getElementById("result-card"));
}

/* ── FEEDBACK ───────────────────────────────────────────────── */
function renderFeedback() {
  const container = document.getElementById("feedback-fields");
  container.innerHTML = "";

  FEEDBACK_QUESTIONS.forEach((q, i) => {
    const label = document.createElement("label");
    label.className = "feedback-label";
    label.textContent = `${i + 1}. ${q}`;

    const textarea = document.createElement("textarea");
    textarea.className = "feedback-textarea";
    textarea.id = `feedback-${i}`;
    textarea.placeholder = "Type your response here\u2026";
    textarea.rows = 3;
    // Restore prior answer if navigating back
    if (state.feedbackAnswers[i]) textarea.value = state.feedbackAnswers[i];

    container.appendChild(label);
    container.appendChild(textarea);
  });

  document.getElementById("btn-feedback-back").disabled = false;
  showSection("feedback");
  animateIn(document.getElementById("feedback-card"));
}

document.getElementById("btn-feedback-next").addEventListener("click", () => {
  // Save answers (optional — not required to fill in)
  state.feedbackAnswers = FEEDBACK_QUESTIONS.map((_, i) => {
    const el = document.getElementById(`feedback-${i}`);
    return el ? el.value.trim() : "";
  });
  advanceStep();
});

document.getElementById("btn-feedback-back").addEventListener("click", goBackStep);

/* ── CERTIFICATE ────────────────────────────────────────────── */
function showCertificate() {
  const now = new Date();
  state.completionDate = now.toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric"
  });

  document.getElementById("cert-name").textContent = state.name;
  document.getElementById("cert-title").textContent = TRAINING_TITLE;
  document.getElementById("cert-date").textContent = state.completionDate;

  // Show feedback on certificate
  const fbEl = document.getElementById("cert-feedback");
  if (state.feedbackAnswers.length > 0) {
    fbEl.innerHTML = "<strong>Technician Feedback:</strong><br>" +
      FEEDBACK_QUESTIONS.map((q, i) =>
        `<em>${q}</em><br>${escapeHtml(state.feedbackAnswers[i] || "(no response)")}`
      ).join("<br><br>");
    fbEl.style.display = "block";
  } else {
    fbEl.style.display = "none";
  }

  showSection("cert");
  animateIn(document.getElementById("certificate-card"));
}

/* ── PDF DOWNLOAD — drawn directly with jsPDF (no html2canvas) ── */
document.getElementById("btn-download-cert").addEventListener("click", async () => {
  const btn = document.getElementById("btn-download-cert");
  btn.textContent = "Generating PDF\u2026";
  btn.disabled = true;

  try {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    const W = 297; // A4 landscape width mm
    const H = 210; // A4 landscape height mm

    // ── Background
    pdf.setFillColor(255, 255, 255);
    pdf.rect(0, 0, W, H, "F");

    // ── Navy border
    pdf.setDrawColor(15, 34, 64);
    pdf.setLineWidth(3);
    pdf.rect(8, 8, W - 16, H - 16, "S");

    // ── Gold inner border line
    pdf.setDrawColor(201, 146, 42);
    pdf.setLineWidth(0.8);
    pdf.rect(11, 11, W - 22, H - 22, "S");

    // ── Navy header band
    pdf.setFillColor(15, 34, 64);
    pdf.rect(8, 8, W - 16, 28, "F");

    // ── "CERTIFICATE OF COMPLETION" in header
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    pdf.setTextColor(201, 146, 42);
    pdf.text("CERTIFICATE OF COMPLETION", W / 2, 25, { align: "center" });

    // ── "This certifies that"
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(13);
    pdf.setTextColor(80, 80, 80);
    pdf.text("This certifies that", W / 2, 52, { align: "center" });

    // ── Participant name
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(28);
    pdf.setTextColor(15, 34, 64);
    pdf.text(state.name, W / 2, 70, { align: "center" });

    // ── Gold rule under name
    pdf.setDrawColor(201, 146, 42);
    pdf.setLineWidth(0.8);
    pdf.line(W / 2 - 50, 74, W / 2 + 50, 74);

    // ── "has successfully completed the"
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(11);
    pdf.setTextColor(80, 80, 80);
    pdf.text("has successfully completed the", W / 2, 83, { align: "center" });

    // ── Training title
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.setTextColor(15, 34, 64);
    pdf.text(TRAINING_TITLE, W / 2, 93, { align: "center" });

    // ── Description
    pdf.setFont("helvetica", "italic");
    pdf.setFontSize(9);
    pdf.setTextColor(100, 100, 100);
    pdf.text("demonstrating understanding of proper equipment inspection, safe use practices, and compliance requirements.", W / 2, 102, { align: "center" });

    // ── Divider
    pdf.setDrawColor(201, 146, 42);
    pdf.setLineWidth(0.5);
    pdf.line(W / 2 - 30, 108, W / 2 + 30, 108);

    // ── Meta boxes
    const boxY = 115;
    // Completion date box
    pdf.setFillColor(244, 248, 251);
    pdf.roundedRect(W / 2 - 70, boxY, 60, 18, 2, 2, "F");
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(7);
    pdf.setTextColor(107, 128, 153);
    pdf.text("COMPLETION DATE", W / 2 - 40, boxY + 6, { align: "center" });
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    pdf.setTextColor(13, 27, 46);
    pdf.text(state.completionDate, W / 2 - 40, boxY + 14, { align: "center" });

    // Result box
    pdf.setFillColor(244, 248, 251);
    pdf.roundedRect(W / 2 + 10, boxY, 60, 18, 2, 2, "F");
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(7);
    pdf.setTextColor(107, 128, 153);
    pdf.text("RESULT", W / 2 + 40, boxY + 6, { align: "center" });
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    pdf.setTextColor(29, 122, 79);
    pdf.text("PASSED", W / 2 + 40, boxY + 14, { align: "center" });

    // ── Feedback section
    if (state.feedbackAnswers && state.feedbackAnswers.some(a => a && a.trim())) {
      let fy = 142;
      pdf.setFillColor(244, 248, 251);
      pdf.roundedRect(20, fy - 4, W - 40, 52, 2, 2, "F");

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(8);
      pdf.setTextColor(15, 34, 64);
      pdf.text("Technician Feedback:", 25, fy + 3);
      fy += 10;

      FEEDBACK_QUESTIONS.forEach((q, i) => {
        const answer = state.feedbackAnswers[i] || "(no response)";
        pdf.setFont("helvetica", "italic");
        pdf.setFontSize(7.5);
        pdf.setTextColor(80, 80, 80);
        pdf.text(q, 25, fy);
        fy += 5;
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(8);
        pdf.setTextColor(13, 27, 46);
        const lines = pdf.splitTextToSize(answer, W - 55);
        pdf.text(lines, 25, fy);
        fy += lines.length * 5 + 4;
      });
    }

    // ── Footer
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(7);
    pdf.setTextColor(150, 150, 150);
    pdf.text("Classification: Public", W / 2, H - 12, { align: "center" });

    const safeName = state.name.replace(/\s+/g, "_");
    pdf.save(`Certificate_${safeName}.pdf`);

  } catch (err) {
    console.error("PDF generation failed:", err);
    alert("Could not generate PDF. Try your browser\u2019s Print function.");
  } finally {
    btn.textContent = "\u2B07 Download Certificate (PDF)";
    btn.disabled = false;
  }
});

/* ── UTILITIES ──────────────────────────────────────────────── */
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function arraysEqual(a, b) {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}
