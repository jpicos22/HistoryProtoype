/**
 * Crystal Springs Uplands School - Global Site Nav Injector Component
 * Centralizes header layouts, touch dropdown binds, and anchor link jumps across all pages.
 */

document.addEventListener('DOMContentLoaded', () => {
  const placeholder = document.getElementById('nav-placeholder');
  if (!placeholder) return;

  // Determine if the current page is the primary homepage landing node
  const isHomepage = window.location.pathname.includes('museumProject.html') || 
                     window.location.pathname.endsWith('/') || 
                     window.location.pathname.includes('index.html');

  // Master Global Navigation HTML Blueprint Markup
  placeholder.innerHTML = `
    <nav id="sitenav">
      <div class="nav-logo" id="navLogoBtn">
        <img src="assets/branding/Crystal-Registered-Logo-White-RGB-4in@72ppi.png" alt="Crystal Springs Uplands School">
      </div>
      <div class="nav-links">
        <button class="nav-link" id="navHomeBtn">Home</button>
        
        <!-- STANDARDIZED CLICK-ACTIVATED DROPDOWN COMPONENT CAPSULE -->
        <div class="nav-dropdown-wrapper">
          <button class="nav-link dropdown-trigger" aria-haspopup="true">History ▼</button>
          <div class="nav-dropdown-menu">
            <button class="dropdown-item" id="navStoryBtn">The Story</button>
            <button class="dropdown-item" id="navTimelineBtn">Timeline Exhibit</button>
            <a href="then-now.html" class="dropdown-item-link">Then &amp; Now Slider</a>
            <a href="yearbook.html" class="dropdown-item-link">Yearbook Catalog</a>
          </div>
        </div>

        <button class="nav-link" id="navInteractiveBtn">Interactive</button>
        <button class="nav-link" id="navMansionBtn">The Mansion</button>
        <a href="donors.html" class="nav-link" style="text-decoration:none;">Donors</a>
        <a href="tour.html" class="nav-link" style="text-decoration:none;">3D Tour</a>
        <button class="nav-link" id="navSpotlightsBtn">Spotlights</button>
      </div>
      <a href="https://www.crystal.org/page/thrive-together" class="nav-cta" target="_blank">Mansion Project</a>
    </nav>
  `;

  // Bind Scrolling Background Shading Transitions
  const sitenav = document.getElementById('sitenav');
  
  // Force a solid background tracking state instantly if browsing a subpage item
  if (!isHomepage) {
    sitenav.classList.add('scrolled');
  } else {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        sitenav.classList.add('scrolled');
      } else {
        sitenav.classList.remove('scrolled');
      }
    });
  }

  // Bind Click Router Handlers 
  document.getElementById('navLogoBtn').addEventListener('click', () => { handleNavRoute('splash'); });
  document.getElementById('navHomeBtn').addEventListener('click', () => { handleNavRoute('splash'); });
  document.getElementById('navStoryBtn').addEventListener('click', () => { handleNavRoute('page-history'); });
  document.getElementById('navTimelineBtn').addEventListener('click', () => { handleNavRoute('page-display'); });
  document.getElementById('navInteractiveBtn').addEventListener('click', () => { handleNavRoute('page-display'); });
  document.getElementById('navMansionBtn').addEventListener('click', () => { handleNavRoute('page-mansion'); });
  document.getElementById('navSpotlightsBtn').addEventListener('click', () => { handleNavRoute('page-spotlights'); });

  // Initialize Touchscreen Dropdown Activation Sequence Loops
  initMobileDropdownHandler();
});

// Intelligent Routing Action Router Target Engine
function handleNavRoute(targetAnchorId) {
  const isHomepage = window.location.pathname.includes('museumProject.html') || 
                     window.location.pathname.endsWith('/') || 
                     window.location.pathname.includes('index.html');

  if (isHomepage) {
    // If on homepage, perform our smooth scrolling element viewport jump animation
    const element = document.getElementById(targetAnchorId);
    if (element) {
      const offset = 68;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      
      const wrapper = document.querySelector('.nav-dropdown-wrapper');
      if (wrapper) wrapper.classList.remove('open');

      window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
    }
  } else {
    // If tracking on a standalone subpage node template file, redirect out back to homepage hash map locations
    window.location.href = `museumProject.html#${targetAnchorId}`;
  }
}

// Touchscreen Open-and-Close Dropdown Mechanics Interceptor
function initMobileDropdownHandler() {
  const trigger = document.querySelector('.dropdown-trigger');
  const wrapper = document.querySelector('.nav-dropdown-wrapper');
  if (!trigger || !wrapper) return;

  trigger.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    wrapper.classList.toggle('open');
  });

  document.addEventListener('click', (e) => {
    if (!wrapper.contains(e.target)) wrapper.classList.remove('open');
  });

  document.addEventListener('touchstart', (e) => {
    if (!wrapper.contains(e.target)) wrapper.classList.remove('open');
  }, { passive: true });
}