/**
 * HackCoach.ai — Warm Beige & Brown Engine Frontend Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initShelfNavigation();
  initProjectEvaluator();
  initApprovalModal();
  initPPTGenerator();
  initJudgeQASimulator();
  initProjectRoadmap();
  initChatbot();
});

/* ----------------------------------------------------
   1. Light Mode / Dark Mode Switcher
---------------------------------------------------- */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle-btn');
  const icon = document.getElementById('theme-icon');
  const text = document.getElementById('theme-text');
  const body = document.body;

  toggleBtn.addEventListener('click', () => {
    if (body.classList.contains('theme-light')) {
      body.classList.remove('theme-light');
      body.classList.add('theme-dark');
      icon.textContent = '☀️';
      text.textContent = 'Light Mode';
    } else {
      body.classList.remove('theme-dark');
      body.classList.add('theme-light');
      icon.textContent = '🌙';
      text.textContent = 'Dark Mode';
    }
  });
}

/* ----------------------------------------------------
   2. Left Sidebar Shelf Navigation
---------------------------------------------------- */
function initShelfNavigation() {
  const shelfBtns = document.querySelectorAll('.shelf-btn');
  const panels = document.querySelectorAll('.workspace-panel');

  shelfBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetShelf = btn.getAttribute('data-shelf');
      shelfBtns.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPanel = document.getElementById(`view-${targetShelf}`);
      if (targetPanel) targetPanel.classList.add('active');

      if (targetShelf === 'ppt') loadPPTDeck();
      if (targetShelf === 'qa') loadJudgeQA();
      if (targetShelf === 'roadmap') loadProjectRoadmap();
    });
  });
}

/* ----------------------------------------------------
   3. Project Evaluator & Autonomous Web Research Agent
---------------------------------------------------- */
function initProjectEvaluator() {
  const runBtn = document.getElementById('run-evaluator-btn');
  if (runBtn) {
    runBtn.addEventListener('click', runIdeaEvaluation);
  }
  runIdeaEvaluation();
}

async function runIdeaEvaluation() {
  const idea = document.getElementById('eval-idea-input').value;

  const scoreNum = document.getElementById('eval-score-num');
  const statusText = document.getElementById('eval-status-text');
  const researchBox = document.getElementById('eval-research-box');
  const strengthsBox = document.getElementById('eval-strengths-box');
  const risksBox = document.getElementById('eval-risks-box');
  const suggestionsBox = document.getElementById('eval-suggestions-box');
  const changesBox = document.getElementById('eval-changes-box');
  const scheduleBox = document.getElementById('eval-schedule-box');

  scoreNum.textContent = "⏳";
  statusText.textContent = "AI Agent Coach researching web & evaluating project idea...";
  researchBox.innerHTML = "<p>🌐 Executing live web research scan for competitors & market snippets...</p>";

  try {
    const resp = await fetch('/api/evaluator', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idea: idea })
    });
    const data = await resp.json();
    const evalData = data.evaluation;

    scoreNum.textContent = evalData.evaluation_score;
    statusText.textContent = evalData.feasibility;

    // Render Web Research Findings & Competitor Analysis
    if (evalData.web_research) {
      const wr = evalData.web_research;
      let researchHtml = `
        <div style="font-size:12px; margin-bottom:8px;">
          <strong>Competitors & Existing Tools Identified on Web:</strong> ${wr.competitors_identified.map(c => `<span class="badge-accent" style="margin-right:6px;">${c}</span>`).join('')}
        </div>
        <div style="font-size:12px; font-weight:700; color:var(--accent-gold); margin-bottom:6px;">
          🎯 Market Gap Discovered: ${wr.market_gap}
        </div>
        <div style="font-size:11px; color:var(--text-muted);">
          <strong>Live Web Research Snippets:</strong>
          <ul style="margin-left:16px; margin-top:4px; line-height:1.4;">
            ${wr.web_snippets.map(s => `<li>${s}</li>`).join('')}
          </ul>
        </div>
      `;
      researchBox.innerHTML = researchHtml;
    }

    // Render Strengths
    strengthsBox.innerHTML = evalData.analysis.strengths.map(s => `<div class="bullet-item">✓ ${s}</div>`).join('');
    // Render Risks
    risksBox.innerHTML = evalData.analysis.risks_to_mitigate.map(r => `<div class="bullet-item" style="border-left:3px solid #EF4444;">⚠️ ${r}</div>`).join('');
    // Render Suggestions
    suggestionsBox.innerHTML = evalData.analysis.ai_suggested_features.map(f => `<div class="bullet-item" style="border-left:3px solid #D97706;">💡 ${f}</div>`).join('');
    // Render Architectural Changes
    changesBox.innerHTML = evalData.analysis.recommended_changes.map(c => `<div class="bullet-item">🛠️ ${c}</div>`).join('');

    // Render 24-Hour Schedule
    scheduleBox.innerHTML = evalData.schedule_24h.map(s => `
      <div class="time-slot-card">
        <div class="slot-time">${s.hour}</div>
        <div class="slot-title">${s.task}</div>
      </div>
    `).join('');

  } catch (err) {
    console.error(err);
  }
}

/* ----------------------------------------------------
   4. "Are You Sure You Want to Update This?" Approval Popup Modal
---------------------------------------------------- */
function initApprovalModal() {
  const modal = document.getElementById('approval-modal');
  const triggerBtn = document.getElementById('trigger-approval-modal-btn');
  const closeBtn = document.getElementById('close-approval-modal-btn');
  const cancelBtn = document.getElementById('cancel-approval-btn');
  const confirmBtn = document.getElementById('confirm-approval-btn');

  if (triggerBtn) triggerBtn.addEventListener('click', () => modal.classList.add('open'));
  if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.remove('open'));
  if (cancelBtn) cancelBtn.addEventListener('click', () => modal.classList.remove('open'));

  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      alert('✅ Project evaluation and schedule locked successfully!');
      modal.classList.remove('open');
    });
  }
}

/* ----------------------------------------------------
   5. Complete 7-Slide Presentation Deck Generator (250+ Word Presenter Script)
---------------------------------------------------- */
function initPPTGenerator() {
  const autoBtn = document.getElementById('generate-auto-project-ppt-btn');
  const customBtn = document.getElementById('generate-custom-ppt-btn');

  if (autoBtn) autoBtn.addEventListener('click', () => loadPPTDeck());
  if (customBtn) customBtn.addEventListener('click', () => {
    const topic = document.getElementById('custom-ppt-topic-input').value.trim();
    loadPPTDeck(topic);
  });
}

async function loadPPTDeck(customTopic = "") {
  const container = document.getElementById('ppt-slides-container');
  const scriptBox = document.getElementById('ppt-script-body');

  container.innerHTML = "<p style='grid-column: span 2; padding:20px; font-weight:700;'>⏳ AI Agent Coach synthesizing complete 7-slide presentation deck & 250+ word presenter script...</p>";

  try {
    const resp = await fetch('/api/ppt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic: customTopic })
    });
    const data = await resp.json();
    const ppt = data.ppt;

    let slidesHtml = "";
    ppt.slides.forEach(slide => {
      slidesHtml += `
        <div class="ppt-slide-card">
          <div class="slide-header-num">SLIDE ${slide.slide_num} • ${slide.slide_type}</div>
          <h4>${slide.title}</h4>
          <div class="slide-sub">${slide.subtitle}</div>
          <ul class="ppt-bullets">
            ${slide.bullets.map(b => `<li>${b}</li>`).join('')}
          </ul>
          <div class="visual-card-box">${slide.visual_card}</div>
          <div style="font-size:10px; color:var(--text-dim); margin-top:8px; border-top:1px solid var(--border-color); padding-top:6px;">
            🗣️ Presenter Script: ${slide.speaker_notes}
          </div>
        </div>
      `;
    });
    container.innerHTML = slidesHtml;
    
    // Calculate word count
    const words = ppt.full_script.split(/\s+/).length;
    scriptBox.innerHTML = `
      <div style="margin-bottom:10px; font-weight:800; color:var(--accent-gold);">
        🎙️ Full Presenter Pitch Script (${words} Words):
      </div>
      <div style="white-space: pre-wrap; font-size:13px; line-height:1.6;">${ppt.full_script}</div>
    `;

  } catch (err) {
    console.error(err);
  }
}

/* ----------------------------------------------------
   6. Judge Q&A Simulator & Strategic Defense Advice
---------------------------------------------------- */
function initJudgeQASimulator() {
  const refreshBtn = document.getElementById('refresh-qa-btn');
  if (refreshBtn) refreshBtn.addEventListener('click', loadJudgeQA);
  loadJudgeQA();
}

async function loadJudgeQA() {
  const container = document.getElementById('qa-list-box');
  container.innerHTML = "<p>⏳ AI Agent Coach predicting judge questions & compiling defense strategies...</p>";

  try {
    const resp = await fetch('/api/qa');
    const data = await resp.json();
    const qaPairs = data.qa.qa_pairs;

    let html = "";
    qaPairs.forEach(pair => {
      html += `
        <div class="qa-card">
          <div class="qa-question">${pair.question}</div>
          <div class="qa-answer">🤖 <strong>AI Recommended Answer:</strong> ${pair.ai_answer}</div>
          <div class="qa-strategy">${pair.ai_suggestions}</div>
        </div>
      `;
    });
    container.innerHTML = html;

  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>⚠️ Unable to load Judge Q&A pairs. Please try clicking refresh.</p>";
  }
}

/* ----------------------------------------------------
   7. Interactive Roadmap with 3 Glide Toggle Buttons (Completed, In Progress, Incomplete)
---------------------------------------------------- */
function initProjectRoadmap() {
  loadProjectRoadmap();
}

async function loadProjectRoadmap() {
  const container = document.getElementById('roadmap-phases-box');
  if (!container) return;

  try {
    const resp = await fetch('/api/roadmap');
    const data = await resp.json();

    let html = "";
    data.phases.forEach((p, index) => {
      const isCompleted = p.status === 'COMPLETED';
      const isInProgress = p.status === 'IN_PROGRESS';
      const isIncomplete = p.status === 'INCOMPLETE';

      html += `
        <div class="card phase-card" style="margin-bottom:16px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
            <h4 style="font-size:16px; font-weight:800;">${p.title}</h4>
            
            <!-- 3 Interactive Glide Toggle Buttons -->
            <div class="glide-status-bar" data-phase-index="${index}">
              <button class="glide-btn completed ${isCompleted ? 'active' : ''}" data-status="COMPLETED">
                <span>🟢</span> Completed
              </button>
              <button class="glide-btn in-progress ${isInProgress ? 'active' : ''}" data-status="IN_PROGRESS">
                <span>🟡</span> In Progress
              </button>
              <button class="glide-btn incomplete ${isIncomplete ? 'active' : ''}" data-status="INCOMPLETE">
                <span>🔴</span> Incomplete
              </button>
            </div>

          </div>
          <p style="font-size:13px; color:var(--text-muted);">${p.desc}</p>
        </div>
      `;
    });
    container.innerHTML = html;

    // Attach Click Event Handlers to Glide Status Toggle Buttons
    const glideBars = container.querySelectorAll('.glide-status-bar');
    glideBars.forEach(bar => {
      const btns = bar.querySelectorAll('.glide-btn');
      btns.forEach(btn => {
        btn.addEventListener('click', () => {
          btns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
        });
      });
    });

  } catch (err) {
    console.error(err);
  }
}

/* ----------------------------------------------------
   8. AI Agent Coach Chatbot
---------------------------------------------------- */
function initChatbot() {
  const shelfInput = document.getElementById('shelf-chat-input');
  const shelfSendBtn = document.getElementById('shelf-send-btn');
  const shelfMessages = document.getElementById('shelf-chat-messages');

  if (shelfSendBtn) {
    shelfSendBtn.addEventListener('click', () => {
      const msg = shelfInput.value.trim();
      if (msg) {
        appendChatMessage(shelfMessages, 'user', msg);
        shelfInput.value = '';
        sendChatToBackend(msg, shelfMessages);
      }
    });
  }
}

function appendChatMessage(container, sender, text) {
  const div = document.createElement('div');
  div.className = `chat-msg ${sender}`;
  const avatar = sender === 'user' ? '👤' : '🤖';
  const formattedText = text.replace(/\n/g, '<br>');

  div.innerHTML = `
    <div class="msg-avatar">${avatar}</div>
    <div class="msg-content">${formattedText}</div>
  `;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

async function sendChatToBackend(userMessage, targetContainer) {
  const loadingDiv = document.createElement('div');
  loadingDiv.className = 'chat-msg bot';
  loadingDiv.innerHTML = `<div class="msg-avatar">🤖</div><div class="msg-content">⏳ Processing with AI Agent Coach...</div>`;
  targetContainer.appendChild(loadingDiv);

  try {
    const resp = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage })
    });
    const data = await resp.json();
    targetContainer.removeChild(loadingDiv);
    appendChatMessage(targetContainer, 'bot', data.reply);
  } catch (err) {
    targetContainer.removeChild(loadingDiv);
    appendChatMessage(targetContainer, 'bot', '⚠️ Error reaching AI Agent Coach.');
  }
}
