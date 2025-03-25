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

// Add image zoom capability
function addImageZoom() {
  const amphibianImage = document.getElementById('amphibian-image');
  
  amphibianImage.addEventListener('click', function(e) {
    e.stopPropagation(); // Prevent card flip
    
    // Create zoom overlay
    const zoomOverlay = document.createElement('div');
    zoomOverlay.classList.add('zoom-overlay');
    
    // Create zoomed image
    const zoomedImage = document.createElement('img');
    zoomedImage.src = this.src;
    zoomedImage.alt = this.alt;
    zoomedImage.classList.add('zoomed-image');
    
    // Add close button
    const closeButton = document.createElement('button');
    closeButton.classList.add('zoom-close');
    closeButton.innerHTML = '&times;';
    closeButton.setAttribute('aria-label', 'Close zoomed image');
    
    zoomOverlay.appendChild(zoomedImage);
    zoomOverlay.appendChild(closeButton);
    document.body.appendChild(zoomOverlay);
    
    // Close on button click
    closeButton.addEventListener('click', function() {
      document.body.removeChild(zoomOverlay);
    });
    
    // Close on overlay click
    zoomOverlay.addEventListener('click', function(e) {
      if (e.target === zoomOverlay) {
        document.body.removeChild(zoomOverlay);
      }
    });
    
    // Close on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && document.body.contains(zoomOverlay)) {
        document.body.removeChild(zoomOverlay);
      }
    });
  });
}

// Add a share button
function addShareButton() {
  const navControls = document.querySelector('.navigation-controls');
  
  // Create share button
  const shareButton = document.createElement('button');
  shareButton.classList.add('nav-btn', 'share-btn');
  shareButton.setAttribute('aria-label', 'Share this amphibian');
  shareButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="18" cy="5" r="3"></circle>
      <circle cx="6" cy="12" r="3"></circle>
      <circle cx="18" cy="19" r="3"></circle>
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
    </svg>
  `;
  
  // Insert after the flip button
  navControls.insertBefore(shareButton, document.getElementById('next-btn'));
  
  // Add share functionality
  shareButton.addEventListener('click', function() {
    const currentAmphibian = filteredAmphibians[currentIndex];
    
    // Create share modal
    const shareModal = document.createElement('div');
    shareModal.classList.add('modal');
    shareModal.style.display = 'flex';
    
    shareModal.innerHTML = `
      <div class="modal-content share-modal">
        <span class="close-modal">&times;</span>
        <h2>Share ${currentAmphibian.name}</h2>
        <div class="share-options">
          <button class="share-option" data-type="copy">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            <span>Copy Link</span>
          </button>
          <button class="share-option" data-type="email">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            <span>Email</span>
          </button>
        </div>
        <div class="share-message"></div>
      </div>
    `;
    
    document.body.appendChild(shareModal);
    
    // Close modal functionality
    const closeBtn = shareModal.querySelector('.close-modal');
    closeBtn.addEventListener('click', function() {
      document.body.removeChild(shareModal);
    });
    
    // Close when clicking outside
    shareModal.addEventListener('click', function(e) {
      if (e.target === shareModal) {
        document.body.removeChild(shareModal);
      }
    });
    
    // Share options functionality
    const shareOptions = shareModal.querySelectorAll('.share-option');
    const shareMessage = shareModal.querySelector('.share-message');
    
    shareOptions.forEach(option => {
      option.addEventListener('click', function() {
        const shareType = this.getAttribute('data-type');
        const shareUrl = window.location.href;
        const shareText = `Check out the ${currentAmphibian.name} in the Maine Amphibian Guide!`;
        
        if (shareType === 'copy') {
          // Copy to clipboard
          navigator.clipboard.writeText(shareUrl).then(() => {
            shareMessage.textContent = 'Link copied to clipboard!';
            shareMessage.classList.add('success');
            setTimeout(() => {
              shareMessage.textContent = '';
              shareMessage.classList.remove('success');
            }, 2000);
          }).catch(err => {
            shareMessage.textContent = 'Failed to copy link.';
            shareMessage.classList.add('error');
          });
        } else if (shareType === 'email') {
          // Open email client
          window.location.href = `mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`;
        }
      });
    });
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
    addImageZoom();
    addShareButton();
  });
}

// Call the initialization function
initializeUXImprovements();
