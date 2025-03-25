// Fixed script.js with bug fixes for mobile devices
// This script addresses the freezing issue when tapping on cards

document.addEventListener('DOMContentLoaded', function() {
    // Global variables
    let amphibians = [];
    let filteredAmphibians = [];
    let currentIndex = 0;
    let isFlipping = false; // Flag to prevent multiple rapid flips

    // Fetch amphibian data
    fetch('amphibian_data.json')
        .then(response => response.json())
        .then(data => {
            // Extract the amphibians array from the data object
            amphibians = data.amphibians;
            filteredAmphibians = [...amphibians];
            
            // Initialize the display
            updateAmphibianSelect();
            updateDisplay();
            updateProgressBar();
            
            // Set the current year in the footer
            document.getElementById('current-year').textContent = new Date().getFullYear();
        })
        .catch(error => console.error('Error loading amphibian data:', error));

    // Event listeners for navigation
    document.getElementById('next-btn').addEventListener('click', nextAmphibian);
    document.getElementById('back-btn').addEventListener('click', previousAmphibian);
    document.getElementById('flip-btn').addEventListener('click', flipCard);
    
    // Improved card flip functionality with debounce
    const flashcard = document.getElementById('flashcard');
    flashcard.addEventListener('click', function(e) {
        // Prevent event propagation to avoid double triggering
        e.stopPropagation();
        
        // Only flip if not currently in a flipping animation
        if (!isFlipping) {
            flipCard();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        switch(e.key) {
            case 'ArrowRight':
                nextAmphibian();
                break;
            case 'ArrowLeft':
                previousAmphibian();
                break;
            case ' ':
            case 'Enter':
                // Only flip if not currently in a flipping animation
                if (!isFlipping) {
                    flipCard();
                }
                break;
            case 'Escape':
                const modal = document.getElementById('about-modal');
                if (modal.style.display === 'flex') {
                    modal.style.display = 'none';
                }
                break;
        }
    });

    // Dropdown selection
    document.getElementById('amphibian-select').addEventListener('change', function() {
        const selectedValue = this.value;
        if (selectedValue) {
            const selectedIndex = filteredAmphibians.findIndex(amp => amp.id === parseInt(selectedValue));
            if (selectedIndex !== -1) {
                currentIndex = selectedIndex;
                updateDisplay();
                updateProgressBar();
                
                // Reset card to front side when changing amphibians
                const flashcard = document.getElementById('flashcard');
                if (flashcard.classList.contains('flipped')) {
                    flashcard.classList.remove('flipped');
                }
            }
        }
    });

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            document.querySelector('.filter-btn.active').classList.remove('active');
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            // Apply filter
            if (filter === 'all') {
                filteredAmphibians = [...amphibians];
            } else {
                filteredAmphibians = amphibians.filter(amp => amp.type === filter);
            }
            
            // Reset to first amphibian in filtered list
            currentIndex = 0;
            updateAmphibianSelect();
            updateDisplay();
            updateProgressBar();
            
            // Reset card to front side when changing filters
            const flashcard = document.getElementById('flashcard');
            if (flashcard.classList.contains('flipped')) {
                flashcard.classList.remove('flipped');
            }
        });
    });

    // Search functionality
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        
        if (searchTerm.length < 2) {
            searchResults.innerHTML = '';
            searchResults.style.display = 'none';
            return;
        }
        
        const matches = amphibians.filter(amp => 
            amp.name.toLowerCase().includes(searchTerm) || 
            amp.type.toLowerCase().includes(searchTerm)
        );
        
        if (matches.length > 0) {
            searchResults.innerHTML = '';
            matches.forEach(match => {
                const resultItem = document.createElement('div');
                resultItem.classList.add('search-result-item');
                resultItem.textContent = match.name;
                resultItem.addEventListener('click', function() {
                    // Find the index in the filtered list
                    const matchIndex = filteredAmphibians.findIndex(amp => amp.id === match.id);
                    
                    if (matchIndex !== -1) {
                        currentIndex = matchIndex;
                    } else {
                        // If not in current filter, switch to "All" filter and find there
                        document.querySelector('.filter-btn[data-filter="all"]').click();
                        currentIndex = filteredAmphibians.findIndex(amp => amp.id === match.id);
                    }
                    
                    updateDisplay();
                    updateProgressBar();
                    
                    // Reset card to front side when selecting from search
                    const flashcard = document.getElementById('flashcard');
                    if (flashcard.classList.contains('flipped')) {
                        flashcard.classList.remove('flipped');
                    }
                    
                    // Clear search
                    searchInput.value = '';
                    searchResults.innerHTML = '';
                    searchResults.style.display = 'none';
                });
                searchResults.appendChild(resultItem);
            });
            searchResults.style.display = 'block';
        } else {
            searchResults.innerHTML = '<div class="no-results">No matches found</div>';
            searchResults.style.display = 'block';
        }
    });
    
    // Hide search results when clicking outside
    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.style.display = 'none';
        }
    });

    // About modal
    const aboutLink = document.getElementById('about-link');
    const aboutModal = document.getElementById('about-modal');
    const closeModal = document.getElementById('close-modal');
    
    aboutLink.addEventListener('click', function(e) {
        e.preventDefault();
        aboutModal.style.display = 'flex';
    });
    
    closeModal.addEventListener('click', function() {
        aboutModal.style.display = 'none';
    });
    
    aboutModal.addEventListener('click', function(e) {
        if (e.target === aboutModal) {
            aboutModal.style.display = 'none';
        }
    });

    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    
    // Check for saved theme preference or use device preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.body.classList.add('dark-theme');
    }
    
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        
        // Save theme preference
        if (document.body.classList.contains('dark-theme')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });

    // Functions
    function updateDisplay() {
        if (filteredAmphibians.length === 0) return;
        
        const amphibian = filteredAmphibians[currentIndex];
        
        document.getElementById('amphibian-image').src = amphibian.image;
        document.getElementById('amphibian-image').alt = amphibian.name;
        document.getElementById('amphibian-name').textContent = amphibian.name;
        document.getElementById('amphibian-size').textContent = amphibian.size;
        document.getElementById('amphibian-characteristics').textContent = amphibian.characteristics;
        document.getElementById('amphibian-rarity').textContent = amphibian.rarity;
        document.getElementById('amphibian-rarity-front').textContent = amphibian.rarity;
        document.getElementById('amphibian-fact').textContent = amphibian.fact;
        
        // Update dropdown selection
        document.getElementById('amphibian-select').value = amphibian.id;
        
        // Update card counter
        document.getElementById('current-card').textContent = currentIndex + 1;
        document.getElementById('total-cards').textContent = filteredAmphibians.length;
    }
    
    function updateAmphibianSelect() {
        const select = document.getElementById('amphibian-select');
        
        // Clear existing options except the first placeholder
        while (select.options.length > 1) {
            select.remove(1);
        }
        
        // Add options for filtered amphibians
        filteredAmphibians.forEach(amphibian => {
            const option = document.createElement('option');
            option.value = amphibian.id;
            option.textContent = amphibian.name;
            select.appendChild(option);
        });
    }
    
    function updateProgressBar() {
        const progressBar = document.getElementById('progress-bar');
        const percentage = ((currentIndex + 1) / filteredAmphibians.length) * 100;
        progressBar.style.width = `${percentage}%`;
    }
    
    function nextAmphibian() {
        if (filteredAmphibians.length === 0) return;
        
        currentIndex = (currentIndex + 1) % filteredAmphibians.length;
        updateDisplay();
        updateProgressBar();
        
        // Reset card to front side when changing amphibians
        const flashcard = document.getElementById('flashcard');
        if (flashcard.classList.contains('flipped')) {
            flashcard.classList.remove('flipped');
        }
    }
    
    function previousAmphibian() {
        if (filteredAmphibians.length === 0) return;
        
        currentIndex = (currentIndex - 1 + filteredAmphibians.length) % filteredAmphibians.length;
        updateDisplay();
        updateProgressBar();
        
        // Reset card to front side when changing amphibians
        const flashcard = document.getElementById('flashcard');
        if (flashcard.classList.contains('flipped')) {
            flashcard.classList.remove('flipped');
        }
    }
    
    // Improved flip card function with debounce
    function flipCard() {
        const flashcard = document.getElementById('flashcard');
        
        // Only proceed if not currently flipping
        if (!isFlipping) {
            isFlipping = true;
            
            // Toggle the flipped class
            flashcard.classList.toggle('flipped');
            
            // Reset the flipping flag after animation completes
            setTimeout(() => {
                isFlipping = false;
            }, 600); // Match this to your CSS transition duration
        }
    }
});
