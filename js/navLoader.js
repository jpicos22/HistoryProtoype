/**
 * Crystal Springs Uplands School Mansion Reopening Exhibition
 * Global Streamlined Navigation Injector Script (2026 Campaign)
 */
document.addEventListener("DOMContentLoaded", function() {
  const navPlaceholder = document.getElementById("nav-placeholder");
  
  if (!navPlaceholder) {
    console.warn("Navigation placeholder element '#nav-placeholder' not found on this page.");
    return;
  }

  // Pure semantic row framework layout containing your structural kiosk options
  const navHTML = `
    <nav id="sitenav">
      <div class="nav-logo" onclick="window.location.href='museumProject.html'">
        <img src="assets/branding/Crystal-Registered-Logo-White-RGB-4in@72ppi.png" alt="Crystal Springs Uplands School">
      </div>
      
      <div class="nav-links">
        <a href="museumProject.html" class="nav-link">Home</a>
        <a href="museumProject.html#page-history" class="nav-link">History</a>
        <a href="yearbook.html" class="nav-link">Yearbooks</a>
        <a href="then-now.html" class="nav-link">Then &amp; Now</a>
        <a href="tour.html" class="nav-link">3D Tour</a>
        <a href="donors.html" class="nav-link">Donors</a>
        <a href="videos.html" class="nav-link">Videos</a>
      </div>

      <a href="https://www.crystal.org/page/thrive-together" class="nav-cta" target="_blank">Mansion Project</a>
    </nav>
  `;

  // Inject the element into the page node
  navPlaceholder.innerHTML = navHTML;

  // Active scroll listener setup for the header opacity transition triggers
  const sitenav = document.getElementById("sitenav");
  if (sitenav) {
    window.addEventListener("scroll", function() {
      if (window.scrollY > 60) {
        sitenav.classList.add("scrolled");
      } else {
        sitenav.classList.remove("scrolled");
      }
    });
  }
});