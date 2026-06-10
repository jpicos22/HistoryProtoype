/**
 * Crystal Springs Uplands School - Kiosk Donor Sorting Engine
 * Automatically reads, alphabetizes, and renders A-Z lists across grid structures.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Select all compact donor grid systems on the page
  const donorGrids = document.querySelectorAll('.compact-donor-grid');

  donorGrids.forEach(grid => {
    // Collect all the individual child card nodes inside this specific grid
    const cardsArray = Array.from(grid.querySelectorAll('.compact-donor-card'));

    // Sort the elements alphabetically based on the inner span text string
    cardsArray.sort((cardA, cardB) => {
      const nameA = cardA.querySelector('span')?.innerText.trim().toLowerCase() || '';
      const nameB = cardB.querySelector('span')?.innerText.trim().toLowerCase() || '';
      
      // Keep "Anonymous" cards at the very end of their respective listings
      if (nameA.includes('anonymous') && !nameB.includes('anonymous')) return 1;
      if (!nameA.includes('anonymous') && nameB.includes('anonymous')) return -1;

      // Standard A-Z sorting string comparison
      return nameA.localeCompare(nameB);
    });

    // Clear the original un-sorted structural nodes from the DOM
    grid.innerHTML = '';

    // Append the newly organized cards back into the grid container layout
    cardsArray.forEach(sortedCard => {
      grid.appendChild(sortedCard);
    });
  });
});