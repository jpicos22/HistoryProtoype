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
const swipeThreshold = 50; 

// Master Historical Timeline Dataset
const timelineData = [
  {
    year: "1948",
    title: "“We should start a school”",
    desc: "Aylett and MJ Cotton, the parents of current Trustee Kristi Cotton Spence, made Crystal’s first very bold decision: they decided to start a school.",
    img: "assets/image/Kristi Cotton Spence.png"
  },
  { 
    year: "1952", 
    title: "Crystal Springs School for Girls Founded", 
    desc: "Crystal was officially incorporated in December 1952, establishing a new foundation for high-caliber education on the Peninsula.", 
    img: "assets/image/Book.jpeg" 
  },
  { 
    year: "1953", 
    title: "Founding Vision Enacted", 
    desc: "Crystal Springs School for Girls formally opens its doors as a private, non-sectarian day school offering an expansive space for learning, arts, and free thought.", 
    img: "assets/image/Book.jpeg" 
  },
  { 
    year: "1956", 
    title: "Uplands Mansion Acquired", 
    desc: "Not without a challenge, Crystal acquired the historical Uplands Mansion for $100,000 via the Crocker family, securing over 5 acres of estate grounds.", 
    img: "assets/image/Old Mansion.png" 
  },
  {
    year: "1963",
    title: "Uplands Building Constructed",
    desc: "The Upper School Campus grew with demand, introducing dedicated new structural environments to keep pace with a rapidly expanding student body.",
    img: "assets/image/Book.jpeg"
  },
  {
    year: "1965",
    title: "Cafe & Science Labs Constructed",
    desc: "The campus infrastructure expanded further as a dedicated theater, modernized science rooms, and the student Cafe came next.",
    img: "assets/image/Past Students.png"
  },
  { 
    year: "1977", 
    title: "Coeducation Begins: Uplands School for Boys", 
    desc: "Coeducation started with the first class of boys joining the school in 1977, transforming campus life and enriching intellectual class discussions.", 
    img: "assets/image/Past Students.png" 
  },
  {
    year: "1987",
    title: "Bovet Theater Constructed",
    desc: "With more students came more opportunity in co-curricular activities. With a new theater built in 1987, Crystal had a place for all students to gather and for performing artists to be onstage.",
    img: "assets/image/Book.jpeg"
  },
  {
    year: "1989", 
    title: "Athletics Strategic Plan", 
    desc: "A major programmatic push locks in a deep tradition of physical fitness, laying the groundwork for competitive Gryphon league matches.", 
    img: "assets/image/Book.jpeg" 
  },
  {
    year: "2001",
    title: "Gryphon Center Built",
    desc: "Crystal Athletics began to thrive in the early 2000s, especially with a brand new, state-of-the-art gymnasium completed in 2001.",
    img: "assets/image/Past Students.png"
  },
  {
    year: "2009",
    title: "Regulation Athletics Turf Field Created",
    desc: "Completing the co-curricular goals of the 2000s was the creation of a regulation athletics turf field at the entrance of our Upper School campus.",
    img: "assets/image/Past Students.png"
  },
  { 
    year: "2017", 
    title: "New Middle School Campus", 
    desc: "A state-of-the-art, sustainably designed middle school campus opens its doors in Belmont after a decade of thorough neighborhood planning.", 
    img: "assets/image/Past Students.png" 
  },
  { 
    year: "2026", 
    title: "Mansion Reopening", 
    desc: "The fully modernized and beautifully restored Uplands Mansion reopens to the public — honoring our historical heritage while embracing the absolute frontier of modern learning.", 
    img: "assets/image/Mansion Sketch.png" 
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
  // Setup Global Scrolling Event Listener for Header Navigation Bar
  const sitenav = document.getElementById('sitenav');
  if (sitenav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        sitenav.classList.add('scrolled');
      } else {
        sitenav.classList.remove('scrolled');
      }
    });
  }

  // Render Initial Timeline Component Nodes
  initTimelineDots();
  updateTimelineView(0);
  initTouchGestures(); 

  // Render Initial Quiz Card
  loadQuizQuestion(0);
});

// Swipe Gesture Tracking Systems
function initTouchGestures() {
  const evCard = document.getElementById('evcard');
  if (!evCard) return;

  evCard.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  evCard.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipeGesture();
  }, { passive: true });
}

function handleSwipeGesture() {
  const deltaX = touchEndX - touchStartX;
  if (Math.abs(deltaX) > swipeThreshold) {
    if (deltaX < 0) {
      moveTl(1); 
    } else {
      moveTl(-1); 
    }
  }
}

// Smooth Page Scroll Engine Tracker
function goto(targetId) {
  const element = document.getElementById(targetId);
  if (element) {
    const offset = 68; 
    const elementPosition = element.getBoundingClientRect().top + window.scrollY;

    window.scrollTo({
      top: elementPosition - offset,
      behavior: 'smooth'
    });
  } else {
    // If targeted anchor doesn't exist on current page link, redirect natively to hash location
    window.location.href = 'museumProject.html#' + targetId;
  }
}

// Global Tab Panel Controller
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

// Timeline Management Functions
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