/**
 * Crystal Springs Uplands School - Then & Now Image Slider Engine
 * Controls drag tracking coordinates, clip path transformations, and data shifting.
 * UNIFIED VERSION: Built for desktop laptops, trackpads, and mobile touchscreens.
 */

// Master Image Pairs Dataset Setup Configuration
const sliderDataset = [
  {
    title: "The Uplands Mansion Exterior Facade",
    desc: "Compare the iconic Gilded Age architectural exterior lines captured shortly after construction to the extensive structural preservation and masonry cleaning executed across the 2024–2026 campus campaign.",
    pastImg: "assets/image/Old Mansion.png",
    presentImg: "assets/image/New Mansion Back.jpeg"
  },
  {
    title: "The Central Courtyard Garden",
    desc: "Witness the evolution of the exterior gathering grounds. Our dataset maps out the conversion from a private family estate lawn into a vibrant co-educational open-air study environment for modern Gryphon students.",
    pastImg: "assets/image/Mansion Front Old.png", 
    presentImg: "assets/image/Mansion Front New.jpg"
  },
  {
    title: "The Historical Great Ballroom Assembly",
    desc: "From formal high-society dining events of old into a hub of student collaboration, advisory meetings, and deep intellectual discussions. Micro-engineered reinforcement preserves the ceiling panels overhead.",
    pastImg: "assets/image/Ballroom Old.png", 
    presentImg: "assets/image/BallroomNew.jpeg"
  }
];

// App Core State Engine Trackers
let isDraggingSlider = false;
let sliderContainerNode = null;
let sliderHandleNode = null;
let historyLayerNode = null;

document.addEventListener('DOMContentLoaded', () => {
  sliderContainerNode = document.getElementById('sliderContainer');
  sliderHandleNode = document.getElementById('sliderHandle');
  historyLayerNode = document.getElementById('historyLayer');

  if (!sliderContainerNode || !sliderHandleNode || !historyLayerNode) return;

  // ==========================================================================
  // AUTOMATED BACKGROUND PRELOADING ENGINE (PREVENTS TRANSITION FREEZES)
  // ==========================================================================
  sliderDataset.forEach((pair) => {
    const imgPastCache = new Image();
    imgPastCache.src = pair.pastImg;
    
    const imgPresentCache = new Image();
    imgPresentCache.src = pair.presentImg;
  });

  // ==========================================================================
  // UNIFIED HARDWARE POINTER LISTENERS (LAPTOP & MOBILE UNIFIED ENGINE)
  // ==========================================================================
  
  // When clicked or tapped, lock the pointer tracking target coordinate matrix
  sliderHandleNode.addEventListener('pointerdown', (e) => {
    isDraggingSlider = true;
    
    // Forces browser layout pipelines to lock target tracking onto the knob,
    // even if a fast cursor or finger strays outside the image box boundaries.
    sliderHandleNode.setPointerCapture(e.pointerId);
  });

  // Release the drag tracking states safely on pointer release
  sliderHandleNode.addEventListener('pointerup', (e) => {
    isDraggingSlider = false;
    sliderHandleNode.releasePointerCapture(e.pointerId);
  });
  
  // Failsafe: Handle system interruptions (like incoming phone alerts or page un-focuses)
  sliderHandleNode.addEventListener('pointercancel', () => {
    isDraggingSlider = false;
  });

  // Track the absolute directional transformations universally
  sliderHandleNode.addEventListener('pointermove', (e) => {
    if (isDraggingSlider) {
      processSliderMovement(e.clientX);
    }
  });
});

/**
 * Calculates current cursor coordinate offsets and updates clip masks
 * @param {number} cursorXCoordinate - Absolute raw pixel position of the cursor
 */
function processSliderMovement(cursorXCoordinate) {
  const containerBounds = sliderContainerNode.getBoundingClientRect();
  const containerWidth = containerBounds.width;
  
  // Calculate relative cursor horizontal location starting from the left edge of the viewer canvas box
  let relativeX = cursorXCoordinate - containerBounds.left;

  // Boundary Guardrails: Restrict tracking values strictly between 0% and 100% of the box width
  if (relativeX < 0) relativeX = 0;
  if (relativeX > containerWidth) relativeX = containerWidth;

  const widthPercentage = (relativeX / containerWidth) * 100;

  // Inject optimized dynamic properties straight into layouts via hardware-accelerated pathways
  sliderHandleNode.style.left = `${widthPercentage}%`;
  historyLayerNode.style.clipPath = `polygon(0 0, ${widthPercentage}% 0, ${widthPercentage}% 100%, 0 100%)`;
  historyLayerNode.style.webkitClipPath = `polygon(0 0, ${widthPercentage}% 0, ${widthPercentage}% 100%, 0 100%)`;
}

/**
 * Seamlessly transitions the active slider image and descriptions
 * @param {number} pairIndex - Targeted dataset dictionary reference node index
 * @param {HTMLElement} tabButtonElement - The click or tap trigger source element
 */
function switchSliderPair(pairIndex, tabButtonElement) {
  const currentPairData = sliderDataset[pairIndex];
  
  const pastImgNode = document.getElementById('historyImage');
  const presentImgNode = document.getElementById('presentImage');
  const captionTitleNode = document.getElementById('captionTitle');
  const captionDescNode = document.getElementById('captionDesc');

  if(!pastImgNode || !presentImgNode || !captionTitleNode || !captionDescNode) return;

  // Strip styling identifiers from previous tabs and apply to targeted selection
  const tabElements = tabButtonElement.parentNode.querySelectorAll('.switcher-tab');
  tabElements.forEach(tab => tab.classList.remove('active'));
  tabButtonElement.classList.add('active');

  // Swap graphic resources and inject descriptive context blocks
  pastImgNode.src = currentPairData.pastImg;
  presentImgNode.src = currentPairData.presentImg;
  captionTitleNode.innerText = currentPairData.title;
  captionDescNode.innerText = currentPairData.desc;

  // Reset slider positions cleanly back to a balanced 50/50 view split upon layout swaps
  sliderHandleNode.style.left = `50%`;
  historyLayerNode.style.clipPath = `polygon(0 0, 50% 0, 50% 100%, 0 100%)`;
  historyLayerNode.style.webkitClipPath = `polygon(0 0, 50% 0, 50% 100%, 0 100%)`;
}