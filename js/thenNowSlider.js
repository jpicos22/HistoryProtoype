/**
 * Interactive Architectural Comparison Control Engine
 */

const sliderDataPairs = [
  {
    title: "The Uplands Mansion Exterior Facade",
    desc: "Compare the iconic Gilded Age architectural exterior lines captured shortly after construction to the extensive structural preservation and masonry cleaning executed across the 2024–2026 campus campaign.",
    historicalImg: "assets/image/Old Mansion.png",
    presentImg: "assets/image/New Mansion Back.jpeg"
  },
  {
    title: "The Historic Courtyard Framework",
    desc: "Witness the revitalization of our central community gathering space, balancing original Gilded Age flagstone pathways with advanced modern infrastructure upgrades.",
    historicalImg: "assets/image/Old Mansion.png", 
    presentImg: "assets/image/New Mansion Back.jpeg"
  },
  {
    title: "The Great Ballroom Restoration",
    desc: "A direct look at the interior restoration project, showing how historical wood carvings and ceiling elements were preserved alongside structural integrations.",
    historicalImg: "assets/image/Book.jpeg",
    presentImg: "assets/image/Past Students.png"
  }
];

let activePairIndex = 0;
let isTrackingSlider = false;

function initSliderComparisonEngine() {
  const container = document.getElementById('sliderContainer');
  const handle = document.getElementById('sliderHandle');
  const historyLayer = document.getElementById('historyLayer');

  if (!container || !handle || !historyLayer) return;

  function processSliderMovement(clientX) {
    const boundingBox = container.getBoundingClientRect();
    const cursorOffset = clientX - boundingBox.left;
    
    let positioningPercentage = (cursorOffset / boundingBox.width) * 100;
    if (positioningPercentage < 0) positioningPercentage = 0;
    if (positioningPercentage > 100) positioningPercentage = 100;

    // Use task batches with hardware acceleration parameters
    requestAnimationFrame(() => {
      handle.style.left = `${positioningPercentage}%`;
      historyLayer.style.clipPath = `polygon(0 0, ${positioningPercentage}% 0, ${positioningPercentage}% 100%, 0 100%)`;
      historyLayer.style.webkitClipPath = `polygon(0 0, ${positioningPercentage}% 0, ${positioningPercentage}% 100%, 0 100%)`;
    });
  }

  // --- MOUSE PLATFORM CAPABILITIES ---
  handle.addEventListener('mousedown', (e) => {
    isTrackingSlider = true;
    e.preventDefault();
  });

  window.addEventListener('mousemove', (e) => {
    if (!isTrackingSlider) return;
    processSliderMovement(e.clientX);
  });

  window.addEventListener('mouseup', () => {
    isTrackingSlider = false;
  });

  // --- HAPTIC TACTILE TOUCHSCREEN CAPABILITIES ---
  handle.addEventListener('touchstart', () => {
    isTrackingSlider = true;
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (!isTrackingSlider) return;
    if (e.touches.length > 0) {
      processSliderMovement(e.touches[0].clientX);
    }
  }, { passive: true }); /* Explicit passive configuration avoids scroll locking jitter */

  window.addEventListener('touchend', () => {
    isTrackingSlider = false;
  });

  window.addEventListener('resize', () => {
    handle.style.left = '50%';
    historyLayer.style.clipPath = 'polygon(0 0, 50% 0, 50% 100%, 0 100%)';
    historyLayer.style.webkitClipPath = 'polygon(0 0, 50% 0, 50% 100%, 0 100%)';
  });
}

function switchSliderPair(index, tabElement) {
  if (index < 0 || index >= sliderDataPairs.length) return;
  activePairIndex = index;

  document.querySelectorAll('.switcher-tab').forEach(btn => btn.classList.remove('active'));
  if (tabElement) tabElement.classList.add('active');

  const pair = sliderDataPairs[index];

  const presentImg = document.getElementById('presentImage');
  const historyImg = document.getElementById('historyImage');
  const captionTitle = document.getElementById('captionTitle');
  const captionDesc = document.getElementById('captionDesc');

  if (presentImg) presentImg.src = pair.presentImg;
  if (historyImg) historyImg.src = pair.historicalImg;
  
  if (captionTitle) captionTitle.textContent = pair.title;
  if (captionDesc) captionDesc.textContent = pair.desc;

  const handle = document.getElementById('sliderHandle');
  const historyLayer = document.getElementById('historyLayer');
  if (handle && historyLayer) {
    handle.style.left = '50%';
    historyLayer.style.clipPath = 'polygon(0 0, 50% 0, 50% 100%, 0 100%)';
    historyLayer.style.webkitClipPath = 'polygon(0 0, 50% 0, 50% 100%, 0 100%)';
  }
}

window.addEventListener('DOMContentLoaded', initSliderComparisonEngine);