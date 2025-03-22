// Global variables
let amphibians = [];
let currentIndex = 0;
let filteredAmphibians = [];
let isSearchOpen = false;

// Amphibian categories mapping
const amphibianCategories = {
    "Spring Peeper": "frog",
    "Wood Frog": "frog",
    "American Toad": "toad",
    "Green Frog": "frog",
    "American Bullfrog": "frog",
    "Gray Treefrog": "frog",
    "Pickerel Frog": "frog",
    "Leopard Frog": "frog",
    "Mink Frog": "frog",
    "Spotted Salamander": "salamander",
    "Blue-spotted Salamander/Unisexual Salamander Complex": "salamander",
    "Eastern Newt/Red Eft": "newt",
    "Eastern Red-backed Salamander": "salamander",
    "Northern Two-lined Salamander": "salamander",
    "Northern Dusky Salamander": "salamander",
    "Four-toed Salamander": "salamander",
    "Northern Spring Salamander": "salamander"
};

// Function to load the JSON data
async function loadAmphibianData() {
    try {
        // Try to load from JSON file
        const response = await fetch('amphibian_data.json');
        const data = await response.json();
        amphibians = data.amphibians;
    } catch (error) {
        console.error('Error loading amphibian data:', error);
        // Fallback to hardcoded data
        amphibians = getHardcodedData();
    }
    
    // Initialize with all amphibians
    filteredAmphibians = [...amphibians];
    
    // Set total cards count
    document.getElementById('total-cards').textContent = filteredAmphibians.length;
    
    // Create dropdown options
    populateDropdown();
    
    // Initialize the progress bar
    updateProgressBar();
    
    // Load the first amphibian
    loadCurrentAmphibian();
    
    // Initialize category filter
    initializeFilterButtons();
}

// Fallback function with hardcoded data
function getHardcodedData() {
    return [
        {
            "name": "Spring Peeper",
            "image": "images/amphibian-000.jpg",
            "size": "1in long",
            "identifying_characteristics": "Very small size. Usually has an x-shaped mark on the back. Tan to brownish color. Calls a high-pitched peep.",
            "big_night_rarity": "Common",
            "fun_fact": "Males have a dark colored throat, females do not. See if you can identify any!"
        },
        {
            "name": "Wood Frog",
            "image": "images/amphibian-001.jpg",
            "size": "2-3in long",
            "identifying_characteristics": "Fairly plain mid-size frog, usually has a black or dark brown \"facemask\". Can be light to dark brown, or even red. Call sounds like a \"quacking\" or \"clucking\".",
            "big_night_rarity": "Common",
            "fun_fact": "Wood Frogs have the northernmost range of any frog in the world; this is partially due to their ability to freeze solid!"
        },
        {
            "name": "American Toad",
            "image": "images/amphibian-002.jpg",
            "size": "3-4 in long",
            "identifying_characteristics": "Dry, bumpy skin. Two large glands directly behind eyes. Call is a long, drawn out trill.",
            "big_night_rarity": "Uncommon",
            "fun_fact": "Toads produce toxin from glands all over their skin, which comes out as a white, sticky substance. It's fine if it touches your hands, but expect foaming and stomach aches if it's ingested!"
        },
        {
            "name": "Green Frog",
            "image": "images/amphibian-003.jpg",
            "size": "2-4in long",
            "identifying_characteristics": "A larger frog that can be green, yellow, black, brown, and even blue. Appearance is often somewhat \"messy\". A distinct line of skin running down the back distinguishes it from bullfrogs. Call a twangy, single note.",
            "big_night_rarity": "Common",
            "fun_fact": "Their twangy-call has earned them the nickname of the \"Banjo Frog\"."
        },
        {
            "name": "American Bullfrog",
            "image": "images/amphibian-004.jpg",
            "size": "Up to 8in long",
            "identifying_characteristics": "Usually large, greenish-yellow to dark green. To separate from Green Frog, look for lack of ridge just behind eardrum (tympanum). Call a bellowing, mooing sound.",
            "big_night_rarity": "Uncommon",
            "fun_fact": "Bullfrogs are very adaptable and have begun invading other areas in the United States—to the point of becoming a problem!"
        },
        {
            "name": "Gray Treefrog",
            "image": "images/amphibian-005.jpg",
            "size": "1-3in long",
            "identifying_characteristics": "Appearance resembles lichen or tree bark. Has large, sticky toe-pads used for climbing. Can be gray or have large patches of green—especially in juveniles. Call a short, bird-like trill. Males have bright yellow inner thighs, only visible when legs are extended.",
            "big_night_rarity": "Rare",
            "fun_fact": "Their scientific name, versicolor, refers to their ability to change their color from dark grays, to white, to green!"
        },
        {
            "name": "Pickerel Frog",
            "image": "images/amphibian-006.jpg",
            "size": "1-3in long",
            "identifying_characteristics": "Overall bronze color with square/rectangular spots, usually in two rows down the back. Bright yellow patches on underside of thighs. Call sounds like a door creaking open.",
            "big_night_rarity": "Uncommon",
            "fun_fact": "Pickerel Frogs produce a nasty toxin capable of killing other amphibians; make sure you wash your hands after handling one to prevent hurting others!"
        },
        {
            "name": "Leopard Frog",
            "image": "images/amphibian-007.jpg",
            "size": "1-3in long",
            "identifying_characteristics": "Lime green to light tan with circular spots surrounded by light halos. Differentiated from Pickerel Frog by rounder spots and greener overall color. Call a short snore.",
            "big_night_rarity": "Uncommon",
            "fun_fact": "Leopard Frogs produce enzymes that are being tested as cures for mesothelioma, brain cancer, and lung cancer."
        },
        {
            "name": "Mink Frog",
            "image": "images/amphibian-008.jpg",
            "size": "1-3in long",
            "identifying_characteristics": "Green with black and brown splotching over the entire body, otherwise similar in appearance to Green Frog. Smells musty. Webbing on rear foot usually extends the tip of the outermost toe.",
            "big_night_rarity": "Rare",
            "fun_fact": "Mink Frogs are named for their smell—apparently smelling like mink, or rotten onions. Mink frogs are also highly resistant to a modern, very deadly frog disease called Ranavirus—this may be due to bacteria that lives on their skin."
        },
        {
            "name": "Spotted Salamander",
            "image": "images/amphibian-009.jpg",
            "size": "Up to 8in",
            "identifying_characteristics": "Unmistakable black body with yellow spots. Large salamander overall.",
            "big_night_rarity": "Common",
            "fun_fact": "Spotted Salamanders are the only known vertebrate animals capable of photosynthesis due to a mutualism with algae."
        },
        {
            "name": "Blue-spotted Salamander/Unisexual Salamander Complex",
            "image": "images/amphibian-010.jpg",
            "size": "Up to 6in long",
            "identifying_characteristics": "Can be all gray to black, usually with blue flecking on the belly. Almost as large as Spotted Salamanders.",
            "big_night_rarity": "Uncommon",
            "fun_fact": "Blue-spotted Salamanders regularly steal genetic information from other salamanders, making them an endlessly complex salamander to study."
        },
        {
            "name": "Eastern Newt/Red Eft",
            "image": "images/amphibian-011.jpg",
            "size": "1.5-3in long",
            "identifying_characteristics": "Usually a bright red with small black halos running down either side of the back. Can have dulled brown or gray backs. Adults (fully aquatic) brown/olive green on top with yellow belly and black spots.",
            "big_night_rarity": "Uncommon",
            "fun_fact": "The Red Eft stage is what you're likely to find on a Big Night; this is the juvenile stage, which can take several years to complete. When they're ready to become adults, they enter the water for the rest of their lives!"
        },
        {
            "name": "Eastern Red-backed Salamander",
            "image": "images/amphibian-012.jpg",
            "size": "2-3in long",
            "identifying_characteristics": "Single red stripe running down the back, with a dark gray metallic body. Occasionally, individuals may be lacking the red stripe, called \"lead-backs\".",
            "big_night_rarity": "Uncommon",
            "fun_fact": "Eastern Redbacks are some of the most common vertebrates in the woods; some say they even outweigh all the other vertebrates in a patch of woods combined!"
        },
        {
            "name": "Northern Two-lined Salamander",
            "image": "images/amphibian-013.jpg",
            "size": "2-4in long",
            "identifying_characteristics": "Tan color with two faintly separated yellowish lines running down the back. Tail flat and paddle-like.",
            "big_night_rarity": "Rare",
            "fun_fact": "Found commonly around streams, these salamanders will wiggle wildly until they reach water to escape predators."
        },
        {
            "name": "Northern Dusky Salamander",
            "image": "images/amphibian-014.jpg",
            "size": "2-4in long",
            "identifying_characteristics": "Can be brown or all black. When brown, nondistinct swirling patterns throughout body. Has a short shovel-like nose, and rear legs much thicker/larger than front, and front but somewhat paddle-like tail. Don't confuse with lead-phase Eastern Red-backed Salamanders, which will have all legs similar sized and rounded tails.",
            "big_night_rarity": "Rare",
            "fun_fact": "One of the lungless salamanders, Duskies breathe through their skin instead of through an internal respiratory system."
        },
        {
            "name": "Four-toed Salamander",
            "image": "images/amphibian-015.jpg",
            "size": "2-3in long",
            "identifying_characteristics": "Reddish brown back with belly patterned like a Dalmatian dog. Base of tail has noticeable constriction. Rear foot only has four toes; other salamanders have 5.",
            "big_night_rarity": "Uncommon",
            "fun_fact": "Four-toed salamanders specialize in sphagnum moss swamps. If your site has a nearby moss swamp, keep an eye out for these hard-to-see salamanders!"
        },
        {
            "name": "Northern Spring Salamander",
            "image": "images/amphibian-016.jpg",
            "size": "4-7in",
            "identifying_characteristics": "Bright pinkish red salamander, large in size. Tail as long as body and flat. Squared-off nose.",
            "big_night_rarity": "Unrecorded",
            "fun_fact": "A true habitat specialist, Spring Salamanders are only found in small, cool headwater streams and may become harder to find due to climate change. Keep an eye out for them in mountainous sites. They are yet to be recorded during a spring MBN survey."
        }
    ];
}

// Function to populate the dropdown with amphibian options
function populateDropdown() {
    const selectElement = document.getElementById('amphibian-select');
    
    // Clear existing options
    selectElement.innerHTML = '';
    
    // Add a default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select an amphibian...';
    selectElement.appendChild(defaultOption);
    
    // Add options for each amphibian in the filtered list
    filteredAmphibians.forEach((amphibian, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = amphibian.name;
        selectElement.appendChild(option);
    });
    
    // Add event listener for change
    selectElement.addEventListener('change', handleDropdownChange);
    
    // Reset the dropdown to default
    resetDropdown();
}

// Function to reset dropdown to default empty selection
function resetDropdown() {
    const selectElement = document.getElementById('amphibian-select');
    selectElement.value = '';
}

// Function to handle dropdown selection change
function handleDropdownChange(event) {
    const selectedIndex = parseInt(event.target.value);
    if (!isNaN(selectedIndex)) {
        goToAmphibian(selectedIndex);
        // Reset dropdown after selection
        resetDropdown();
    }
}

// Function to go to a specific amphibian
function goToAmphibian(index) {
    if (index >= 0 && index < filteredAmphibians.length) {
        currentIndex = index;
        loadCurrentAmphibian();
        updateProgressBar();
    }
}

// Function to load the current amphibian
function loadCurrentAmphibian() {
    if (filteredAmphibians.length === 0) {
        // Handle no results case
        document.getElementById('amphibian-image').src = '';
        document.getElementById('amphibian-name').textContent = 'No amphibians found';
        document.getElementById('amphibian-size').textContent = '';
        document.getElementById('amphibian-characteristics').textContent = '';
        document.getElementById('amphibian-rarity').textContent = '';
        document.getElementById('amphibian-fact').textContent = '';
        document.getElementById('amphibian-rarity-front').textContent = '';
        return;
    }
    
    const amphibian = filteredAmphibians[currentIndex];
    
    // Add card entrance animation
    const flashcard = document.getElementById('flashcard');
    flashcard.classList.remove('card-enter');
    void flashcard.offsetWidth; // Trigger reflow
    flashcard.classList.add('card-enter');
    
    // Update the front of the card (image)
    document.getElementById('amphibian-image').src = amphibian.image;
    document.getElementById('amphibian-image').alt = `${amphibian.name} - ${amphibian.identifying_characteristics}`;
    document.getElementById('amphibian-rarity-front').textContent = amphibian.big_night_rarity;
    
    // Update the back of the card (details)
    document.getElementById('amphibian-name').textContent = amphibian.name;
    document.getElementById('amphibian-size').textContent = amphibian.size;
    document.getElementById('amphibian-characteristics').textContent = amphibian.identifying_characteristics;
    document.getElementById('amphibian-rarity').textContent = amphibian.big_night_rarity;
    document.getElementById('amphibian-fact').textContent = amphibian.fun_fact;
    
    // Update the progress indicator
    document.getElementById('current-card').textContent = currentIndex + 1;
    
    // Reset card to front side if it was flipped
    if (flashcard.classList.contains('flipped')) {
        flashcard.classList.remove('flipped');
    }
}

// Function to update the progress bar
function updateProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    const totalAmphibians = filteredAmphibians.length;
    
    if (totalAmphibians > 0) {
        const progress = ((currentIndex + 1) / totalAmphibians) * 100;
        progressBar.style.width = `${progress}%`;
    } else {
        progressBar.style.width = '0%';
    }
}

// Function to flip the card
function flipCard() {
    const flashcard = document.getElementById('flashcard');
    flashcard.classList.toggle('flipped');
}

// Function to go to the next amphibian
function nextAmphibian() {
    if (filteredAmphibians.length > 0) {
        currentIndex = (currentIndex + 1) % filteredAmphibians.length;
        loadCurrentAmphibian();
        updateProgressBar();
        resetDropdown();
    }
}

// Function to go to the previous amphibian
function previousAmphibian() {
    if (filteredAmphibians.length > 0) {
        currentIndex = (currentIndex - 1 + filteredAmphibians.length) % filteredAmphibians.length;
        loadCurrentAmphibian();
        updateProgressBar();
        resetDropdown();
    }
}

// Function to handle search input
function handleSearchInput() {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    const query = searchInput.value.trim().toLowerCase();
    
    // Clear previous results
    searchResults.innerHTML = '';
    
    if (query.length < 2) {
        searchResults.classList.remove('active');
        isSearchOpen = false;
        return;
    }
    
    // Filter amphibians based on search query
    const results = amphibians.filter(amphibian => 
        amphibian.name.toLowerCase().includes(query) || 
        amphibian.identifying_characteristics.toLowerCase().includes(query)
    );
    
    // If there are results, show them
    if (results.length > 0) {
        searchResults.classList.add('active');
        isSearchOpen = true;
        
        results.forEach((result, index) => {
            const resultItem = document.createElement('div');
            resultItem.className = 'search-item';
            resultItem.textContent = result.name;
            resultItem.addEventListener('click', () => {
                // Find the index in the filtered list
                const targetIndex = filteredAmphibians.findIndex(a => a.name === result.name);
                if (targetIndex !== -1) {
                    goToAmphibian(targetIndex);
                } else {
                    // If the amphibian is not in the current filter, reset the filter and go to it
                    resetFilter();
                    const newIndex = filteredAmphibians.findIndex(a => a.name === result.name);
                    if (newIndex !== -1) {
                        goToAmphibian(newIndex);
                    }
                }
                
                // Clear search
                searchInput.value = '';
                searchResults.classList.remove('active');
                isSearchOpen = false;
            });
            searchResults.appendChild(resultItem);
        });
    } else {
        // Show "No results" message
        searchResults.classList.add('active');
        isSearchOpen = true;
        
        const noResults = document.createElement('div');
        noResults.className = 'search-item';
        noResults.textContent = 'No amphibians found';
        searchResults.appendChild(noResults);
    }
}

// Function to initialize category filter buttons
function initializeFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Apply the filter
            const filter = button.getAttribute('data-filter');
            applyFilter(filter);
        });
    });
}

// Function to apply category filter
function applyFilter(filter) {
    // Reset index
    currentIndex = 0;
    
    if (filter === 'all') {
        // Show all amphibians
        filteredAmphibians = [...amphibians];
    } else {
        // Filter amphibians by category
        filteredAmphibians = amphibians.filter(amphibian => 
            amphibianCategories[amphibian.name] === filter
        );
    }
    
    // Update total cards count
    document.getElementById('total-cards').textContent = filteredAmphibians.length;
    
    // Recreate dropdown options
    populateDropdown();
    
    // Update progress bar
    updateProgressBar();
    
    // Load the first amphibian in the filtered list
    loadCurrentAmphibian();
}

// Function to reset filter to "All"
function resetFilter() {
    // Set the "All" button as active
    document.querySelectorAll('.filter-btn').forEach(btn => {
        if (btn.getAttribute('data-filter') === 'all') {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Apply the "all" filter
    applyFilter('all');
}

// Function to toggle theme
function toggleTheme() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    
    if (currentTheme === 'dark') {
        body.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
    } else {
        body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    }
}

// Function to initialize the theme
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
    }
}

// Function to initialize modal
function initializeModal() {
    const modal = document.getElementById('about-modal');
    const aboutLink = document.getElementById('about-link');
    const closeModal = document.getElementById('close-modal');
    
    // Open modal when About link is clicked
    aboutLink.addEventListener('click', (e) => {
        e.preventDefault();
        modal.classList.add('active');
    });
    
    // Close modal when X button is clicked
    closeModal.addEventListener('click', () => {
        modal.classList.remove('active');
    });
    
    // Close modal when clicking outside the content
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
    
    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
        }
    });
}

// Update current year in footer copyright
function updateCopyrightYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Close search results when clicking outside of them
function initializeSearchBlur() {
    document.addEventListener('click', (e) => {
        const searchContainer = document.querySelector('.search-container');
        const searchResults = document.getElementById('search-results');
        
        if (isSearchOpen && !searchContainer.contains(e.target)) {
            searchResults.classList.remove('active');
            isSearchOpen = false;
        }
    });
}

// Keyboard navigation
function initializeKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        const searchInput = document.getElementById('search-input');
        const modal = document.getElementById('about-modal');
        const selectElement = document.getElementById('amphibian-select');
        
        // Skip if focus is in the search input, dropdown, or modal is open
        if (document.activeElement === searchInput || 
            document.activeElement === selectElement ||
            modal.classList.contains('active')) {
            return;
        }
        
        switch (e.key) {
            case 'ArrowLeft':
                previousAmphibian();
                break;
            case 'ArrowRight':
                nextAmphibian();
                break;
            case ' ':
            case 'Enter':
                flipCard();
                break;
        }
    });
}

// Event listeners when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load the amphibian data
    loadAmphibianData();
    
    // Initialize theme
    initializeTheme();
    
    // Add event listener for the flip button and card click
    document.getElementById('flip-btn').addEventListener('click', flipCard);
    document.getElementById('flashcard').addEventListener('click', flipCard);
    
    // Add event listeners for navigation buttons
    document.getElementById('next-btn').addEventListener('click', nextAmphibian);
    document.getElementById('back-btn').addEventListener('click', previousAmphibian);
    
    // Add event listener for theme toggle
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
    
    // Add event listener for search input
    document.getElementById('search-input').addEventListener('input', handleSearchInput);
    
    // Initialize modal
    initializeModal();
    
    // Update copyright year
    updateCopyrightYear();
    
    // Initialize search blur event
    initializeSearchBlur();
    
    // Initialize keyboard navigation
    initializeKeyboardNavigation();
});
