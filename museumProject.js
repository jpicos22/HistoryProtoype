/**
 * Crystal Springs Uplands School - Interactive Display Logic
 * Reopening Year: 2026
 * Updated Timeline Dataset with Spotlight Navigation Fix
 */

// Smooth scroll function for site navigation
function goto(id) {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}

// Navigation background opacity shift on scroll
window.addEventListener('scroll', () => {
  const nav = document.getElementById('sitenav');
  if (nav) {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }
});

// Interactive Panel Tab Switching
function setEtab(i, btn) {
  document.querySelectorAll('.etab').forEach((b, j) => b.classList.toggle('active', j === i));
  ['ep0', 'ep1', 'ep2'].forEach((id, j) => {
    const panel = document.getElementById(id);
    if (panel) panel.classList.toggle('active', j === i);
  });
}

// --- UPDATED TIMELINE COMPONENT DATA & LOGIC ---
const tlD = [
  { y: '1911', t: 'Building Begins', d: "Driven by a grand vision, Templeton Crocker began construction on a magnificent Hillsborough estate as a lavish wedding gift for his bride. Designed by famed architect Willis Polk, the ambitious project was conceived to reflect Europe’s finest classical traditions. This monumental undertaking laid the physical foundation for a property that would eventually become the heart of the Crystal Springs community." },
  { y: '1917', t: 'Mansion Completed', d: "After six years of meticulous craftsmanship, the opulent Uplands Mansion was finally completed in 1917 as a Gilded Age masterpiece. Archival photographs from this pre-construction era beautifully capture the breathtaking, unaltered scale of the original architecture. The finished estate stood as a triumph on the Peninsula, boasting sprawling layouts and handcrafted details that defined early 20th-century luxury." },
  { y: '1927', t: "The Crockers' Divorce", d: "Following the Crockers' divorce in 1927, the grand mansion saw its first major shift in lifestyle, as Mr. Crocker thereafter occupied the house only periodically. No longer a bustling center of high-society galas, the massive residence was quieted down for the next decade. Instead, it was utilized primarily as a scenic \"summer cottage\" and a private, rustic \"hunting lodge.\"" },
  { y: '1942', t: 'Crocker Sells the Property', d: "In 1942, Templeton Crocker sold the historic property to Romie C. Jacks, signaling a unique new era for the estate. Although Mr. Jacks passed away shortly after moving in, his widow, Mrs. Jacks, continued to live there for nearly a decade. Attended by a dedicated staff of thirteen servants, she maintained the grandeur of the estate while residing in just a few select rooms on the second floor." },
  { y: '1942 – 1953', t: 'Splitting Up the Acres', d: "Following Mrs. Jacks' departure, the main house sat entirely unoccupied for several years while the surrounding land underwent massive changes. During this quiet interim, the majority of the estate’s original sprawling acreage was systematically sold off for residential subdivision. Today, the enduring legacy of the grand borders can still be glimpsed through the original stone gateposts remaining at the foot of Uplands Drive and Stonehedge." },
  { y: '1953', t: 'Founding of the School', d: "On January 1, 1953, the Founders' Committee officially announced the creation of the Crystal Springs School for Girls as a private, non-profit, non-sectarian day school. The institution was built on a rigorous academic mission, aiming to provide a high-caliber education with a faculty and curriculum equal to the nation's finest. From its inception, the school prioritized a holistic student experience by weaving fine arts, music, and competitive athletics into its core identity." },
  { y: '1956', t: 'Acquired Mansion', d: "Once facing the tragic threat of demolition, the Uplands Mansion found its savior when Crystal Springs acquired the grand building and its remaining five acres of land in 1956. This historic acquisition was made possible through the profound generosity of the Crocker family, who provided substantial donations of stock and cash. Because of this strategic philanthropy, the school successfully assumed ownership of the estate while brilliantly preserving its own capital funds." },
  { y: '1977', t: 'Inclusion of Boys', d: "In a landmark evolution of the school’s culture, Crystal Springs officially integrated boys into the student body in 1977. This pivotal transition successfully promoted true gender diversity across the entire campus and enriched daily classroom discussions. By introducing co-education, the school better prepared its graduates to navigate the real-world dynamics of a rapidly changing society." },
  { y: '1982', t: 'The Gryphon Mascot Debut', d: "In 1982, the student body participated in a historic vote to select a brand-new mascot to represent the school's spirit: the mythical Gryphon. The clean, iconic logo design was directly inspired by an elegant architectural detail carved into the woodwork of the historic mansion library. This choice beautifully bridged the gap between modern student pride and the deep physical heritage of the campus itself." },
  { y: '1988', t: 'Loggias Enclosed', d: "Recognizing the crucial need to preserve the mansion's structure, the school invested $174,000 to enclose the building's open loggias in 1988. This protective renovation was deemed essential for maintaining the physical integrity and timeless beauty of the Gilded Age architecture against the elements. The project successfully safeguarded the historic exterior while creating a more functional, climate-controlled indoor environment for students." },
  { y: '2017', t: 'New Middle School Opens', d: "Following nearly a decade of meticulous planning and community-wide dedication, a state-of-the-art middle school campus emerged in nearby Belmont. This eco-friendly educational facility served as a brilliant testament to the community's modern commitment to sustainability and academic excellence. The new campus allowed the school to expand its pedagogical reach while ensuring its facilities met modern green-building standards." },
  { y: '2026', t: 'Mansion Revamp', d: "The grand renovation project of June 2026 brings the story of the Uplands Mansion beautifully full circle, marking the most extensive structural construction the building has undergone since 1917. This sweeping rebirth seamlessly merges the historical fabric of the Gilded Age landmark with the technological needs of the 21st-century learning world. Standing as a proud showcase of resilience, the project provides a breathtaking opportunity to view side-by-side comparisons of the mansion’s historical architecture alongside its stunning, modern upgrades." }
];

let tlI = 0; 
let tlAuto = null;

function renderTl() {
  const d = tlD[tlI];
  const card = document.getElementById('evcard');
  if (!card) return;

  card.style.opacity = '0';
  setTimeout(() => {
    document.getElementById('evyr').textContent = d.y;
    document.getElementById('evttl').textContent = d.t;
    document.getElementById('evdesc').textContent = d.d;
    card.style.opacity = '1'; 
    card.style.transition = 'opacity 0.3s';
  }, 150);
  
  const pct = (tlI / (tlD.length - 1)) * 85 + 5;
  document.getElementById('tlprog').style.width = pct + '%';
  document.getElementById('tldots').innerHTML = tlD.map((item, i) => {
    // Normalizes hyphenation parameters so multiple range types slice and fit inside mini layout indicators
    const hasDash = item.y.includes('–') || item.y.includes('-');
    const separator = item.y.includes('–') ? '–' : '-';
    const shortYear = hasDash ? item.y.split(separator)[1].trim().slice(-2) : item.y.slice(-2);
    
    return `<div class="tl-dot ${i < tlI ? 'past' : i === tlI ? 'active' : ''}" onclick="goTl(${i})">
      <div class="tl-circle">${shortYear}</div>
      <div class="tl-yr">${item.y}</div>
    </div>`;
  }).join('');
}

function goTl(i) { 
  tlI = i; 
  renderTl(); 
}

function moveTl(d) { 
  tlI = Math.max(0, Math.min(tlD.length - 1, tlI + d)); 
  renderTl(); 
}

function toggleAuto() {
  const autoBtn = document.getElementById('autobtn');
  if (tlAuto) {
    clearInterval(tlAuto);
    tlAuto = null;
    if (autoBtn) autoBtn.textContent = '▶ Auto-play';
  } else {
    tlAuto = setInterval(() => { 
      tlI = (tlI + 1) % tlD.length; 
      renderTl(); 
    }, 4000); 
    if (autoBtn) autoBtn.textContent = '❚❚ Pause';
  }
}

// --- QUIZ COMPONENT DATA & LOGIC ---
const tqs = [
  { q: 'In what year did Crystal acquire the Uplands Mansion?', o: ['1948', '1953', '1956', '1960'], a: 2, e: "In 1956, Crystal acquired the Uplands Mansion and 5+ acres, saved from demolition thanks to the Crocker family's donation." },
  { q: 'Who founded Crystal Springs School for Girls?', o: ['The Crocker Family', 'Aylett & Martha Jane Cotton', 'Hillsborough City Council', 'Stanford faculty'], a: 1, e: "Aylett and Martha Jane Cotton envisioned the school in 1948; the Founders' Committee formally announced it January 1, 1953." },
  { q: "What is Crystal's student-to-teacher ratio?", o: ['5:1', '7:1', '9:1', '12:1'], a: 2, e: "Crystal maintains a 9:1 student-to-teacher ratio, ensuring personalized learning and small class sizes." },
  { q: 'When did Crystal begin admitting boys?', o: ['1965', '1970', '1977', '1982'], a: 2, e: "Crystal integrated boys in 1977, promoting gender diversity and enriching classroom life." },
  { q: 'How many sports teams does Crystal offer today?', o: ['8', '12', '15', '18'], a: 3, e: "Crystal fields 18 sports teams — the Gryphons compete across the Bay Area, backed by the 1989 athletics plan." }
];

let tqI = 0;
let tqDone = false;

function renderTq() {
  tqDone = false; 
  const t = tqs[tqI];
  document.getElementById('tqq').textContent = t.q;
  document.getElementById('tqopts').innerHTML = t.o.map((o, i) => `<button class="tq-opt" onclick="answerTq(${i})">${o}</button>`).join('');
  document.getElementById('tqfb').style.display = 'none';
  document.getElementById('tqnext').style.display = 'none';
}

function answerTq(i) {
  if (tqDone) return; 
  tqDone = true; 
  const t = tqs[tqI];
  document.querySelectorAll('.tq-opt').forEach((o, j) => {
    o.disabled = true;
    if (j === t.a) o.classList.add('correct');
    else if (j === i && i !== t.a) o.classList.add('wrong');
  });
  const fb = document.getElementById('tqfb');
  fb.textContent = (i === t.a ? '✓ Correct! ' : '✗ Not quite. ') + t.e;
  fb.style.display = 'block';
  document.getElementById('tqnext').style.display = 'inline-block';
}

function nextTq() { 
  tqI = (tqI + 1) % tqs.length; 
  renderTq(); 
}

// --- INITIALIZE APPLICATION UI & CLICK OVERRIDES ---
document.addEventListener('DOMContentLoaded', () => {
  renderTl();
  renderTq();

  // Binds programmatic location adjustments directly to the layout grid modules
  document.querySelectorAll('.sp-cell').forEach(cell => {
    cell.addEventListener('click', (e) => {
      const destinationUrl = cell.getAttribute('href');
      if (destinationUrl) {
        window.location.href = destinationUrl;
      }
    });
  });
});