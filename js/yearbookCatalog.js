/**
 * Crystal Springs Uplands School - Archival Yearbook Library Kiosk
 * Temporary Live Staging Controller using Direct Google Drive Data Streams.
 */

// Configure PDF.js worker to process document rendering seamlessly
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

// Base direct download stream endpoint prefix for Google Drive
const gdStreamPrefix = "https://docs.google.com/uc?export=download&id=";

// The centralized asset data registry
const specialYearbooks = {
  2026: {
    title: "The Reopening Edition (2026)",
    desc: "Celebrating our rich heritage while stepping into the future of modern learning spaces.",
    fileName: gdStreamPrefix + "1hBXmXBNKBk4U2yq7gpd4zNicdB1giGzw",
    actionText: "Open Native Book ▶"
  },
  2025: {
    title: "Mansion Transition Volume (2025)",
    desc: "Documenting active campus preservation blueprints and student milestones.",
    fileName: gdStreamPrefix + "1h5J2F4vcsApXo-Yig5YbKCOyJRQKDCdH",
    actionText: "Open Native Book ▶"
  },
  2023: {
    title: "70th Anniversary Edition (2023)",
    desc: "A milestone record highlighting seven decades of academic and community excellence.",
    // UPDATED: Live 87MB Optimized Demonstration File Stream
    fileName: gdStreamPrefix + "1U_NIAotERLSpwteNfdmkNOWCw5rcckuT",
    actionText: "Open Native Book ▶"
  },
  1968: {
    title: "The Uplands Chronicle (1968)",
    desc: "Archival memories capturing the early history of learning on the estate hillside.",
    fileName: gdStreamPrefix + "1zG_unvZ30pD9uyrppuaH-uBx66vAD6wp",
    actionText: "Open Native Book ▶"
  },
  1967: {
    title: "The Mid-Century Archive (1967)",
    desc: "Digitized photo layouts showcasing student traditions inside the Gilded Age mansion.",
    fileName: gdStreamPrefix + "1pXsbOvetzC_gC0UR99wZXHyNCKxvECt8",
    actionText: "Open Native Book ▶"
  }
};

let pageFlipInstance = null;

/**
 * Generates the responsive grid portfolio display spanning 1957 to 2026
 */
function generateCatalogGrid() {
  const grid = document.getElementById('yearbookGrid');
  if (!grid) return;
  
  const fragment = document.createDocumentFragment();
  const startYear = 1957; 
  const endYear = 2026;

  for (let year = endYear; year >= startYear; year--) {
    const decadeGroup = Math.floor(year / 10) * 10;
    const card = document.createElement('div');
    card.className = 'yb-card-node';
    card.setAttribute('data-decade', decadeGroup);

    const imgFrame = document.createElement('div');
    const metaInfo = document.createElement('div');
    metaInfo.className = 'yb-meta-info';

    const heading = document.createElement('h3');
    const paragraph = document.createElement('p');
    const button = document.createElement('button');
    button.className = 'yb-trigger-btn';

    if (specialYearbooks[year]) {
      const item = specialYearbooks[year];
      imgFrame.className = 'yb-img-frame';
      
      const img = document.createElement('img');
      img.alt = item.title;
      img.loading = "lazy";
      imgFrame.appendChild(img);

      // Extract and render page 1 thumbnail asynchronously from Google Drive
      pdfjsLib.getDocument(item.fileName).promise.then(async (pdf) => {
        try {
          const page = await pdf.getPage(1); 
          const unscaledViewport = page.getViewport({ scale: 1.0 });
          const targetScale = 400 / unscaledViewport.width;
          const viewport = page.getViewport({ scale: targetScale });
          
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          await page.render({ canvasContext: context, viewport: viewport }).promise;
          img.src = canvas.toDataURL('image/jpeg', 0.85);
        } catch (err) {
          // Fallback image asset if file stream drops
          img.src = "assets/images/Past Students.png"; 
        }
      }).catch(() => {
        img.src = "assets/images/Past Students.png";
      });

      heading.textContent = item.title;
      paragraph.textContent = item.desc;
      button.textContent = item.actionText;
      button.addEventListener('click', () => loadAndRenderPDFBook(item.fileName));
      
      metaInfo.appendChild(heading);
      metaInfo.appendChild(paragraph);
      metaInfo.appendChild(button);
    } else {
      // Configuration for coming-soon placeholder nodes
      card.classList.add('entry-placeholder');
      imgFrame.className = 'yb-img-frame default-placeholder-frame';

      const seal = document.createElement('div');
      seal.className = 'placeholder-graphic-seal';
      seal.textContent = 'CSUS';

      const spineYear = document.createElement('span');
      spineYear.className = 'placeholder-spine-yr';
      spineYear.textContent = year;

      imgFrame.appendChild(seal);
      imgFrame.appendChild(spineYear);

      heading.textContent = `Yearbook Volume — ${year}`;
      paragraph.textContent = `Archival photo records and memories from the ${year} Crystal Springs school term expansion layout.`;
      button.classList.add('placeholder-btn');
      button.disabled = true;
      button.textContent = 'Coming Soon 🔒';

      metaInfo.appendChild(heading);
      metaInfo.appendChild(paragraph);
      metaInfo.appendChild(button);
    }

    card.appendChild(imgFrame);
    card.appendChild(metaInfo);
    fragment.appendChild(card);
  }
  
  grid.innerHTML = '';
  grid.appendChild(fragment);
}

/**
 * Filter mechanism to switch viewable dashboard blocks by era decade group
 */
function filterDecade(decade, clickedButton) {
  document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
  clickedButton.classList.add('active');
  const cards = document.querySelectorAll('.yb-card-node');
  cards.forEach(card => {
    const cardDecade = card.getAttribute('data-decade');
    if (decade === 'all' || cardDecade === decade) {
      card.classList.remove('hidden');
    } else {
      card.classList.add('hidden');
    }
  });
}

/**
 * Pulls raw cloud file packets and renders individual HTML layout canvas objects
 */
async function loadAndRenderPDFBook(targetUrl) {
  const modal = document.getElementById('flipbookModal');
  const container = document.getElementById('nativeBookContainer');
  const loaderMsg = document.getElementById('bookLoadingStatus');
  
  if (pageFlipInstance) {
    pageFlipInstance.destroy();
    pageFlipInstance = null;
  }
  container.innerHTML = "";
  container.style.visibility = 'hidden';
  if (loaderMsg) loaderMsg.style.display = 'block';
  
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  try {
    const loadingTask = pdfjsLib.getDocument(targetUrl);
    const pdf = await loadingTask.promise;
    
    const modalContent = document.querySelector('.fb-modal-content');
    const maxAvailableWidth = modalContent.clientWidth / 2; 
    const maxAvailableHeight = modalContent.clientHeight - 80; 

    // Render every page out inside the DOM stack sequentially
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const unscaledViewport = page.getViewport({ scale: 1.0 });
      
      const scaleX = maxAvailableWidth / unscaledViewport.width;
      const scaleY = maxAvailableHeight / unscaledViewport.height;
      const perfectFitScale = Math.min(scaleX, scaleY) * 0.95; 

      const viewport = page.getViewport({ scale: perfectFitScale });
      
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({ canvasContext: context, viewport: viewport }).promise;
      
      const pageDiv = document.createElement('div');
      pageDiv.className = 'book-page';
      
      if (pageNum === 1 || pageNum === pdf.numPages) {
        pageDiv.classList.add('cover-page');
        pageDiv.setAttribute('data-density', 'hard');
      }

      const img = document.createElement('img');
      img.src = canvas.toDataURL('image/jpeg', 0.85);
      pageDiv.appendChild(img);
      container.appendChild(pageDiv);

      if (pageNum === 1) {
        window.calculatedPageWidth = viewport.width;
        window.calculatedPageHeight = viewport.height;
      }
    }

    if (loaderMsg) loaderMsg.style.display = 'none';

    // Initialize the St.PageFlip interface handler object
    pageFlipInstance = new St.PageFlip(container, {
      width: window.calculatedPageWidth,
      height: window.calculatedPageHeight,
      size: "fixed",                       
      drawShadow: true,                    
      showCover: true,                     
      usePortrait: false,                  
      swipeDistance: 30                    
    });

    pageFlipInstance.loadFromHTML(document.querySelectorAll('.book-page'));
    container.style.visibility = 'visible';

  } catch (error) {
    console.error("PDF data processing error: ", error);
    if (loaderMsg) loaderMsg.textContent = "Error loading document archive.";
  }
}

/**
 * Safely deconstructs active book nodes and yields display viewport lock privileges
 */
function closeFlipbook() {
  const modal = document.getElementById('flipbookModal');
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
  
  if (pageFlipInstance) {
    pageFlipInstance.destroy();
    pageFlipInstance = null;
  }
}

// Global hotkey event capture listeners
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeFlipbook();
});

window.addEventListener('DOMContentLoaded', generateCatalogGrid);