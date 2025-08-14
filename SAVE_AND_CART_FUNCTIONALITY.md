# Save & Cart Functionality

## Overview
This implementation adds a new workflow for saving designs and adding them to cart. The functionality ensures that users must save their design before they can add it to cart.

## Key Features

### 1. Initial State
- Initially shows "Save & Review" button
- "Add to Cart" button is hidden until design is saved

### 2. Save & Review Process
When user clicks "Save & Review":
- Design is uploaded to Cloudinary
- Data is saved to database (if API succeeds)
- Data is stored in localStorage with keys:
  - `krDesignId`: Database ID or local timestamp
  - `krImageURL`: Cloudinary URL of the design
  - `krDesignArea`: '2d' or '3d'
- All designs are stored in localStorage under `krDesigns` object
- Button changes to "Add to Cart"

### 3. Add to Cart
- Only visible after successful save
- Retrieves saved design data from localStorage
- Can be implemented to add design to actual cart

### 4. Design Modification Detection
- If user makes changes after saving, "Add to Cart" button is hidden
- User must click "Save & Review" again to show "Add to Cart"

## Data Structure

### localStorage Structure
```javascript
// Single design data
localStorage.getItem('krDesignData') = {
  krDesignId: "database_id_or_timestamp",
  krImageURL: "cloudinary_url",
  krDesignArea: "2d" | "3d",
  customizationData: { /* design customization data */ },
  canvas: { /* canvas objects for 2d */ },
  screenshots: [ /* 3d screenshots */ ]
}

// All designs
localStorage.getItem('krDesigns') = {
  "design_id_1": { /* design data */ },
  "design_id_2": { /* design data */ }
}
```

## Implementation Details

### State Management
- Added new state variables in both 2D and 3D contexts:
  - `showAddToCart`: Controls button visibility
  - `isDesignSaved`: Tracks if design has been saved
  - `savedDesignData`: Stores the saved design data

### File Changes
1. **app/context/2DContext.jsx** - Added new state management
2. **app/context/3DContext.jsx** - Added new state management  
3. **app/components/Topbar.jsx** - Updated button logic
4. **app/CustomizerLayout.jsx** - Updated save functionality
5. **app/components/Topbar.css** - Added button styling

### API Integration
- Design uploads to Cloudinary regardless of API success/failure
- Database save is attempted but localStorage is always updated
- **Screenshots are excluded from customizations object to reduce payload size**
- Only Cloudinary URLs are sent in the root-level screenshots array

## Usage Flow

1. User customizes design
2. User clicks "Save & Review"
3. Design is saved to database and localStorage
4. "Add to Cart" button appears
5. User can add design to cart
6. If user makes changes, "Add to Cart" disappears
7. User must save again to show "Add to Cart"

## Error Handling
- If database save fails, design is still stored in localStorage
- Cloudinary upload errors are logged but don't prevent localStorage storage
- User is notified of save success/failure via alerts

## Payload Optimization
- **Screenshots are excluded from the `customizations` object** to reduce payload size
- Only Cloudinary URLs are included in the root-level `screenshots` array
- This prevents large base64 image data from being sent in the request
- The `customizations` object only contains actual customization data (colors, text, etc.)

## Recent Fixes
- **krDesignId now stores actual database ID** from save response instead of local timestamp
- **Add to Cart button visibility fixed** - now properly shows after successful Save & Review
- **Missing state added** - `showBgColorsModal` state added to 2D context to fix runtime errors
- **Enhanced error handling** - Added try-catch blocks and console logging for better debugging
- **State management improved** - Better synchronization between save success and button visibility
