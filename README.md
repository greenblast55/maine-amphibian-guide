# maine-amphibian-guide
Maine Big Night Amphibian Training Flashcards!
# Maine Amphibian Guide - Implementation Guide

This document outlines the improvements made to the original Maine Amphibian Flashcards application and provides instructions for implementation.

## Overview of Changes

The application has been completely revamped with the following improvements:

1. **Modern, Responsive Design**
   - Clean, nature-inspired aesthetic with a modern color scheme
   - Mobile-first approach that adapts beautifully to all screen sizes
   - Smooth animations and transitions for better user experience

2. **Enhanced User Interface**
   - Improved card layout with better information hierarchy
   - Added dark/light mode toggle for accessibility and user preference
   - Clear visual indicators for navigation and progress

3. **New Features**
   - Search functionality to quickly find specific amphibians
   - Category filtering (Frogs, Salamanders, Toads, Newts)
   - Progress bar to show position in the collection
   - Improved direct navigation with scrollable interface
   - About modal with information about the application

4. **Accessibility Improvements**
   - Keyboard navigation support
   - ARIA attributes for screen readers
   - Improved color contrast and readability
   - Focus management for interactive elements

5. **Code Improvements**
   - Modern JavaScript with proper async/await pattern
   - Better organization and comments
   - Progressive enhancement approach
   - More robust error handling

## File Structure

```
maine-amphibian-guide/
│
├── index.html            # Main HTML file
├── styles.css            # CSS styles
├── script.js             # JavaScript functionality
├── amphibian_data.json   # Data file (existing)
│
└── images/               # Folder containing amphibian images (existing)
    ├── amphibian-000.jpg
    ├── amphibian-001.jpg
    └── ...
```

## Implementation Instructions

### 1. Replace Existing Files

Replace your existing `index.html`, `styles.css`, and `script.js` files with the new versions provided.

### 2. Image Requirements

The application expects images to be in an `images/` directory with the following naming convention:
- `amphibian-000.jpg` for Spring Peeper
- `amphibian-001.jpg` for Wood Frog
- And so on...

If your images are named differently or located elsewhere, you'll need to update the paths in the `amphibian_data.json` file.

### 3. JSON Data File

The application will attempt to load amphibian data from `amphibian_data.json`. If this fails, it will use a hardcoded backup dataset defined in the JavaScript.

Make sure your JSON file follows this structure:

```json
{
  "amphibians": [
    {
      "name": "Spring Peeper",
      "image": "images/amphibian-000.jpg",
      "size": "1in long",
      "identifying_characteristics": "Very small size...",
      "big_night_rarity": "Common",
      "fun_fact": "Males have a dark colored throat..."
    },
    ...
  ]
}
```

### 4. Fonts

The application uses Google Fonts. Make sure you have an internet connection when first loading the page to download the fonts:
- Montserrat (for headings)
- Poppins (for body text)

## Using the Application

### Basic Navigation

- **Flip Card**: Click the card or the flip button to see details
- **Next/Previous**: Use the arrow buttons or keyboard arrow keys to navigate
- **Direct Navigation**: Click on a number in the quick navigation bar

### Special Features

- **Search**: Type in the search box to find amphibians by name or characteristics
- **Filtering**: Use the category buttons to filter by amphibian type
- **Dark Mode**: Toggle between light and dark themes with the sun/moon button
- **About Modal**: Click "About" in the footer to learn more about the application

### Keyboard Navigation

- **Left/Right Arrow Keys**: Navigate between amphibians
- **Space or Enter**: Flip the current card
- **Escape**: Close modals or dropdown menus

## Browser Compatibility

The application is compatible with modern browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

For older browsers, some visual features may be degrade
