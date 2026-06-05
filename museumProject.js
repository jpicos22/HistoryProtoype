/**
 * Crystal Springs Uplands School - Museum Project Core App Scripts
 * Master interactive controllers, timeline engine, state machines & mechanics.
 */

// Global State Variables
let currentTlIndex = 0;
let tlPlaybackInterval = null;
let currentQuizIndex = 0;
let quizScore = 0;

// Touch Gesture Tracking Variables
let touchStartX = 0;
let touchEndX = 0;
const swipeThreshold = 50; // Minimum pixels moved to trigger a swipe change

// Master Historical Timeline Dataset
const timelineData = [
  { 
    year: "1953", 
    title: "Founding Vision", 
    desc: "Crystal Springs School for Girls opens as a private, non-sectarian day school dedicated to the highest caliber of education, free from fear or prejudice.", 
    img: "timeline-1953.jpg" 
  },
  { 
    year: "1956", 
    title: "Acquired Uplands Mansion", 
    desc: "Saved from demolition via the Crocker family donation, the magnificent Uplands Mansion is secured as the permanent home of the school.", 
    img: "timeline-1956.jpg" 
  },
  { 
    year: "1960s", 
    title: "Curriculum Expansion", 
    desc: "Academic and creative arts curricula dramatically broaden, anchoring robust traditions in music, fine arts, and public discussion.", 
    img: "timeline-1960.jpg" 
  },
  { 
    year: "1977", 
    title: "Inclusion of Boys", 
    desc: "Co-education formally commences at Crystal Springs, bringing a wealth of perspectives and deep collaboration across the entire student body.", 
    img: "timeline-1977.jpg" 
  },
  { 
    year: "1989", 
    title: "Athletics Strategic Plan", 
    desc: "A massive foundational push establishes a legacy of physical excellence, paving the way for the 18 elite Gryphon competitive teams active today.", 
    img: "timeline-1989.jpg" 
  },
  { 
    year: "2017", 
    title: "New Middle School Campus", 
    desc: "A state-of-the-art, beautifully sustainable middle school facility opens its doors down the road in Belmont after a decade of careful community planning.", 
    img: "timeline-2017.jpg" 
  },
  { 
    year: "2026", 
    title: "Mansion Reopening", 
    desc: "The fully modernized and lovingly restored Uplands Mansion reopens to the public — honoring our rich heritage while embracing the absolute frontier of modern pedagogy.", 
    img: "timeline-2026.jpg" 
  }
];

// Master Trivia Quiz Dataset
const quizData = [
  {
    q: "In what year was Crystal Springs Uplands School officially incorporated?",
    opts: ["1948", "1952", "1956", "1977"],
    correct: 1,
    fb: "Correct! The school was incorporated on Christmas Eve 1952, and its founding was formally announced to the public on January 1, 1953."
  },
  {
    q: "The Uplands Mansion was saved from demolition via a generous donation from which prominent local family?",
    opts: ["The Hearsts", "The Stanford Family", "The Crocker Family", "The Cottons"],
    correct: 2,
    fb: "Correct! The Crocker family donated the stunning estate in 1956, preserving a beautiful piece of Gilded Age architecture to serve as the heart of our campus."
  },
  {
    q: "When did Crystal Springs welcome boys to the school and transition into co-education?",
    opts: ["1953", "1965", "1977", "1989"],
    correct: 2,
    fb: "Correct! Co-education began in 1977, significantly enriching intelligent discussions, collaborative problem-solving, and general student life."
  }
];

// App Initialization Logic
document.addEventListener('DOMContentLoaded', () => {
  const sitenav = document.getElementById('sitenav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      sitenav.classList.add('scrolled');
    } else {
      sitenav.classList.remove('scrolled');
    }
  });

  initTimelineDots();
  updateTimelineView(0);
  initTouchGestures(); // ADDED: Hook touch engine tracking loops

  loadQuizQuestion(0);
});

// ADDED: Swipe Gesture Listening Engine
function initTouchGestures() {
  const evCard = document.getElementById('evcard');
  if (!evCard) return;

  // Track the initial touch coordinates
  evCard.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  // Track finger lifting coordinates and evaluate vectors
  evCard.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipeGesture();
  }, { passive: true });
}

// ADDED: Swipe Vector Evaluation Mechanic
function handleSwipeGesture() {
  const deltaX = touchEndX - touchStartX;

  if (Math.abs(deltaX) > swipeThreshold) {
    if (deltaX < 0) {
      // Swiped Left -> Load Next Date Milestone
      moveTl(1);
    } else {
      // Swiped Right -> Load Previous Date Milestone
      moveTl(-1);
    }
  }
}

// Smooth Scroll Anchor Link Route Engine
function goto(targetId) {
  const element = document.getElementById(targetId);
  if (element) {
    const offset = 68; 
    const elementPosition = element.getBoundingClientRect().top + window.scrollY;
    
    window.scrollTo({
      top: elementPosition - offset,
      behavior: 'smooth'
    });
  }
}

// Global Tab Manager Switching Engine
function setEtab(panelIndex, buttonElement) {
  clearInterval(tlPlaybackInterval);
  tlPlaybackInterval = null;
  const autoBtn = document.getElementById('autobtn');
  if(autoBtn) autoBtn.innerText = "▶ Auto-play";

  const tabs = buttonElement.parentNode.querySelectorAll('.etab');
  tabs.forEach(tab => tab.classList.remove('active'));
  buttonElement.classList.add('active');

  const sectionParent = buttonElement.closest('#page-display');
  const panels = sectionParent.querySelectorAll('.epanel');
  panels.forEach(panel => panel.classList.remove('active'));
  
  const targetPanel = document.getElementById(`ep${panelIndex}`);
  if(targetPanel) targetPanel.classList.add('active');
}

// Timeline Initialization
function initTimelineDots() {
  const dotsContainer = document.getElementById('tldots');
  if (!dotsContainer) return;
  dotsContainer.innerHTML = '';

  timelineData.forEach((item, index) => {
    const dot = document.createElement('div');
    dot.className = `tl-dot ${index === 0 ? 'active' : ''}`;
    dot.setAttribute('onclick', `jumpToTimelineIndex(${index})`);
    
    dot.innerHTML = `
      <div class="tl-circle">${item.year}</div>
      <div class="tl-yr">${item.year}</div>
    `;
    dotsContainer.appendChild(dot);
  });
}

// Timeline State Renderer
function updateTimelineView(index) {
  currentTlIndex = index;
  
  const evyr = document.getElementById('evyr');
  const evttl = document.getElementById('evttl');
  const evdesc = document.getElementById('evdesc');
  const evImg = document.getElementById('ev-img-element');
  const imgWrapper = document.querySelector('.ev-img-wrapper');
  const tlProg = document.getElementById('tlprog');
  const dots = document.querySelectorAll('.tl-dot');

  if(!evyr || !evttl || !evdesc || !evImg || !imgWrapper) return;

  const currentData = timelineData[index];

  evyr.innerText = currentData.year;
  evttl.innerText = currentData.title;
  evdesc.innerText = currentData.desc;
  
  evImg.src = currentData.img;
  evImg.onerror = function() { this.src = 'Book.jpeg'; };

  imgWrapper.classList.remove('swing-active');
  void imgWrapper.offsetWidth; 
  imgWrapper.classList.add('swing-active');

  const progressPercent = (index / (timelineData.length - 1)) * 100;
  if(tlProg) tlProg.style.width = `${progressPercent}%`;

  dots.forEach((dot, dotIndex) => {
    dot.classList.remove('active', 'past');
    if (dotIndex === index) {
      dot.classList.add('active');
    } else if (dotIndex < index) {
      dot.classList.add('past');
    }
  });
}

// Timeline Navigation Controllers
function moveTl(direction) {
  clearInterval(tlPlaybackInterval);
  tlPlaybackInterval = null;
  const autoBtn = document.getElementById('autobtn');
  if(autoBtn) autoBtn.innerText = "▶ Auto-play";

  let nextIndex = currentTlIndex + direction;
  if (nextIndex >= timelineData.length) nextIndex = 0;
  if (nextIndex < 0) nextIndex = timelineData.length - 1;
  
  updateTimelineView(nextIndex);
}

function jumpToTimelineIndex(index) {
  clearInterval(tlPlaybackInterval);
  tlPlaybackInterval = null;
  const autoBtn = document.getElementById('autobtn');
  if(autoBtn) autoBtn.innerText = "▶ Auto-play";
  
  updateTimelineView(index);
}

// Timeline Automated Loop Playback System Controller
function toggleAuto() {
  const autoBtn = document.getElementById('autobtn');
  
  if (tlPlaybackInterval) {
    clearInterval(tlPlaybackInterval);
    tlPlaybackInterval = null;
    autoBtn.innerText = "▶ Auto-play";
  } else {
    autoBtn.innerText = "⏸ Pause Loop";
    tlPlaybackInterval = setInterval(() => {
      let nextIndex = currentTlIndex + 1;
      if (nextIndex >= timelineData.length) nextIndex = 0;
      updateTimelineView(nextIndex);
    }, 4000);
  }
}

// Trivia Quiz Component Application Methods
function loadQuizQuestion(index) {
  currentQuizIndex = index;
  
  const qText = document.getElementById('tqq');
  const optsContainer = document.getElementById('tqopts');
  const fbBox = document.getElementById('tqfb');
  const nextBtn = document.getElementById('tqnext');

  if(!qText || !optsContainer || !fbBox || !nextBtn) return;

  fbBox.style.display = 'none';
  nextBtn.style.display = 'none';
  optsContainer.innerHTML = '';

  const item = quizData[index];
  qText.innerText = item.q;

  item.opts.forEach((optionText, optIdx) => {
    const btn = document.createElement('button');
    btn.className = 'tq-opt';
    btn.innerText = optionText;
    btn.setAttribute('onclick', `evaluateQuizSelection(${optIdx}, this)`);
    optsContainer.appendChild(btn);
  });
}

function evaluateQuizSelection(selectedIdx, targetButton) {
  const currentItem = quizData[currentQuizIndex];
  const optsContainer = document.getElementById('tqopts');
  const allOptionButtons = optsContainer.querySelectorAll('.tq-opt');
  const fbBox = document.getElementById('tqfb');
  const nextBtn = document.getElementById('tqnext');

  allOptionButtons.forEach(btn => btn.setAttribute('disabled', 'true'));

  if (selectedIdx === currentItem.correct) {
    targetButton.classList.add('correct');
    fbBox.innerText = currentItem.fb;
    fbBox.style.borderLeftColor = '#28a745';
    quizScore++;
  } else {
    targetButton.classList.add('wrong');
    allOptionButtons[currentItem.correct].classList.add('correct');
    fbBox.innerText = `Incorrect. ${currentItem.fb}`;
    fbBox.style.borderLeftColor = '#dc3545';
  }

  fbBox.style.display = 'block';
  nextBtn.style.display = 'block';

  if (currentQuizIndex === quizData.length - 1) {
    nextBtn.innerText = "View Final Results ⟳";
  } else {
    nextBtn.innerText = "Next Question ▶";
  }
}

function nextTq() {
  let nextQuizIndex = currentQuizIndex + 1;
  
  if (nextQuizIndex < quizData.length) {
    loadQuizQuestion(nextQuizIndex);
  } else {
    const qText = document.getElementById('tqq');
    const optsContainer = document.getElementById('tqopts');
    const fbBox = document.getElementById('tqfb');
    const nextBtn = document.getElementById('tqnext');

    fbBox.style.display = 'none';
    optsContainer.innerHTML = '';
    
    qText.innerText = "Exhibition Quiz Complete!";
    optsContainer.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 20px 0;">
        <div style="font-family: 'Cormorant SC', serif; font-size: 56px; color: var(--blue); margin-bottom: 8px;">
          ${quizScore} / ${quizData.length}
        </div>
        <p style="font-family: 'Jost', sans-serif; color: var(--text-muted); font-size: 15px;">
          Thank you for exploring our school archives!
        </p>
      </div>
    `;
    
    nextBtn.innerText = "Restart Quiz ↺";
    nextBtn.setAttribute('onclick', 'resetQuizSystem()');
  }
}

function resetQuizSystem() {
  quizScore = 0;
  const nextBtn = document.getElementById('tqnext');
  if(nextBtn) nextBtn.setAttribute('onclick', 'nextTq()');
  loadQuizQuestion(0);
}