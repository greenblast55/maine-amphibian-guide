// Additional UX improvements for the amphibian guide
// This file contains enhancements that can be added to the fixed_script.js

// Add swipe gesture support for mobile devices
function addSwipeSupport() {
  const flashcard = document.getElementById('flashcard');
  let touchStartX = 0;
  let touchEndX = 0;
  let touchStartY = 0;
  let touchEndY = 0;
  
  // Track touch start position
  flashcard.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }, false);
  
  // Track touch end position and determine if it was a swipe
  flashcard.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
  }, false);
  
  function handleSwipe() {
    // Calculate horizontal and vertical distance
    const horizontalDist = touchEndX - touchStartX;
    const verticalDist = touchEndY - touchStartY;
    
    // Only register as swipe if horizontal movement is greater than vertical
    // and exceeds minimum threshold (to avoid accidental swipes)
    if (Math.abs(horizontalDist) > Math.abs(verticalDist) && Math.abs(horizontalDist) > 50) {
      if (horizontalDist > 0) {
        // Swipe right - go to previous amphibian
        previousAmphibian();
      } else {
        // Swipe left - go to next amphibian
        nextAmphibian();
      }
    }
  }
}

// Add keyboard accessibility improvements
function enhanceKeyboardAccessibility() {
  // Add tabindex to make elements focusable
  document.querySelectorAll('.filter-btn, .nav-btn, #amphibian-select, #search-input, #about-link')
    .forEach((el, index) => {
      el.setAttribute('tabindex', index + 1);
    });
  
  // Add keyboard shortcut info to the about modal
  const aboutModal = document.querySelector('.modal-content');
  const keyboardShortcutsInfo = document.createElement('div');
  keyboardShortcutsInfo.innerHTML = `
    <h3>Keyboard Shortcuts</h3>
    <ul>
      <li><strong>Left Arrow:</strong> Previous amphibian</li>
      <li><strong>Right Arrow:</strong> Next amphibian</li>
      <li><strong>Space or Enter:</strong> Flip card</li>
      <li><strong>Escape:</strong> Close modal</li>
    </ul>
  `;
  aboutModal.appendChild(keyboardShortcutsInfo);
  
  // Add escape key to close modal
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      const modal = document.getElementById('about-modal');
      if (modal.style.display === 'flex') {
        modal.style.display = 'none';
      }
    }
  });
}

// Add visual feedback for card interactions
function addVisualFeedback() {
  const flashcard = document.getElementById('flashcard');
  
  // Add a subtle highlight effect when hovering over the card
  flashcard.addEventListener('mouseenter', function() {
    if (!this.classList.contains('flipped')) {
      this.style.boxShadow = '0 8px 16px var(--shadow-color)';
      this.style.transform = 'translateY(-5px)';
    }
  });
  
  flashcard.addEventListener('mouseleave', function() {
    if (!this.classList.contains('flipped')) {
      this.style.boxShadow = '';
      this.style.transform = '';
    }
  });
  
  // Add a ripple effect for buttons
  const buttons = document.querySelectorAll('.nav-btn, .filter-btn');
  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      ripple.classList.add('ripple-effect');
      
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size/2}px`;
      ripple.style.top = `${e.clientY - rect.top - size/2}px`;
      
      this.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
}

// Add a "tap to flip" hint for first-time users
function addFlipHint() {
  // Check if this is the first visit
  if (!localStorage.getItem('amphibianGuideVisited')) {
    const flashcard = document.getElementById('flashcard');
    const hint = document.createElement('div');
    hint.classList.add('flip-hint');
    hint.innerHTML = `
      <div class="hint-content">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M8 3H5a2 2 0 0 0-2 2v3"></path>
          <path d="M21 8V5a2 2 0 0 0-2-2h-3"></path>
          <path d="M3 16v3a2 2 0 0 0 2 2h3"></path>
          <path d="M16 21h3a2 2 0 0 0 2-2v-3"></path>
        </svg>
        <span>Tap card to flip</span>
      </div>
    `;
    
    document.querySelector('.flashcard-container').appendChild(hint);
    
    // Remove hint after first flip
    flashcard.addEventListener('click', function() {
      if (hint.parentNode) {
        hint.classList.add('hint-fade-out');
        setTimeout(() => {
          hint.parentNode.removeChild(hint);
        }, 500);
        localStorage.setItem('amphibianGuideVisited', 'true');
      }
    }, { once: true });
    
    // Auto-remove hint after 5 seconds
    setTimeout(() => {
      if (hint.parentNode) {
        hint.classList.add('hint-fade-out');
        setTimeout(() => {
          if (hint.parentNode) {
            hint.parentNode.removeChild(hint);
          }
        }, 500);
      }
    }, 5000);
  }
}

// Add a loading indicator
function addLoadingIndicator() {
  const cardContainer = document.querySelector('.flashcard-container');
  const loadingIndicator = document.createElement('div');
  loadingIndicator.classList.add('loading');
  loadingIndicator.innerHTML = '<div class="loading-spinner"></div>';
  
  cardContainer.appendChild(loadingIndicator);
  
  // Remove loading indicator when data is loaded
  window.addEventListener('load', function() {
    setTimeout(() => {
      loadingIndicator.classList.add('fade-out');
      setTimeout(() => {
        if (loadingIndicator.parentNode) {
          loadingIndicator.parentNode.removeChild(loadingIndicator);
        }
      }, 500);
    }, 500);
  });
}

// Initialize all UX improvements
function initializeUXImprovements() {
  // Wait for DOM to be fully loaded
  document.addEventListener('DOMContentLoaded', function() {
    addSwipeSupport();
    enhanceKeyboardAccessibility();
    addVisualFeedback();
    addFlipHint();
    addLoadingIndicator();
    // Image zoom functionality removed to prioritize card flip
  });
}

// Call the initialization function
initializeUXImprovements();
