# Museum Tracker App - High-Fidelity Prototype

A modern, Material Design-inspired mobile app prototype for tracking museum visits. Built with HTML, Tailwind CSS, and FontAwesome icons.

## 🎯 Overview

This prototype demonstrates a complete mobile app experience for museum enthusiasts to discover, track, and manage their museum visits. The design follows Material Design 3 guidelines and is optimized for Android devices (Pixel 9 frame).

## 📱 Screens Included

### 1. Home Screen (`screens/home.html`)
- **User Stats**: Displays total museums visited and monthly count
- **Recent Visits**: Shows the last 3 museums visited with ratings
- **Quick Overview**: User-friendly dashboard with key metrics

### 2. Visited Screen (`screens/visited.html`)
- **Comprehensive List**: All visited museums with detailed information
- **Filter Options**: Tabs for "All", "This Year", and "Favorites"
- **Rich Cards**: Each museum shows image, rating, visit date, and categories
- **Favorite Toggle**: Heart icons to mark favorite museums

### 3. Search Screen (`screens/search.html`)
- **Prominent Search Bar**: With voice input capability
- **Quick Filters**: Category-based filtering (Art, History, Science, etc.)
- **Discovery Cards**: Large museum cards with images and descriptions
- **Popular Museums**: Curated selection of notable institutions

### 4. Museum Detail Screen (`screens/detail.html`)
- **Hero Image**: Large museum photo with overlay information
- **Quick Actions**: "Mark as Visited" and "Directions" buttons
- **Comprehensive Info**: Hours, admission, contact details
- **Current Exhibitions**: Featured shows and permanent collections
- **Visitor Tips**: Helpful advice for planning visits
- **Reviews**: User feedback and ratings

## 🎨 Design Features

### Material Design 3 Compliance
- **Elevation System**: Consistent shadows and depth
- **Color System**: Primary blue palette with semantic colors
- **Typography**: Clear hierarchy with proper font weights
- **Spacing**: 4px grid system for consistent spacing
- **Rounded Corners**: 16px radius for cards, 24px for buttons

### Interactive Elements
- **Bottom Navigation**: Three-tab structure with active states
- **Floating Action Buttons**: For primary actions
- **Card Interactions**: Hover states and touch feedback
- **Search Functionality**: Voice input and category filters

### Visual Assets
- **High-Quality Images**: From Unsplash for realistic museum photos
- **Icon System**: FontAwesome icons for consistency
- **Status Bar**: Realistic Android status indicators
- **Device Frame**: Pixel 9 styling for authentic mobile experience

## 🛠 Technical Implementation

### Technologies Used
- **HTML5**: Semantic markup structure
- **Tailwind CSS**: Utility-first styling framework
- **FontAwesome**: Comprehensive icon library
- **Responsive Design**: Mobile-first approach

### File Structure
```
prototype/
├── index.html          # Main entry point with device frames
├── screens/
│   ├── home.html       # Home screen
│   ├── visited.html    # Visited museums list
│   ├── search.html     # Search and discovery
│   └── detail.html     # Museum detail view
└── README.md          # This documentation
```

### Key Features
- **Modular Design**: Each screen is self-contained
- **Reusable Components**: Consistent styling across screens
- **Accessibility**: Proper alt text and semantic HTML
- **Performance**: Optimized images and minimal dependencies

## 🚀 Getting Started

### Viewing the Prototype

1. **Open in Browser**: Navigate to `apps/prototype/index.html`
2. **Grid Layout**: All screens displayed simultaneously in device frames
3. **Individual Screens**: Each screen can be viewed separately in `screens/` directory

### Development Setup

1. **Local Server**: Run a local HTTP server for best experience
   ```bash
   cd apps/prototype
   python -m http.server 8000
   # or
   npx serve .
   ```

2. **Browser**: Open `http://localhost:8000` in your browser

### Customization

- **Colors**: Modify the primary color palette in Tailwind config
- **Content**: Update museum data and images as needed
- **Layout**: Adjust spacing and sizing using Tailwind utilities
- **Icons**: Replace FontAwesome icons with custom alternatives

## 📋 Design System

### Color Palette
- **Primary**: Blue (#0ea5e9) - Main brand color
- **Success**: Green (#10b981) - Positive actions
- **Warning**: Yellow (#f59e0b) - Ratings and highlights
- **Error**: Red (#ef4444) - Destructive actions
- **Neutral**: Gray scale for text and backgrounds

### Typography
- **Headings**: Bold weights for hierarchy
- **Body**: Regular weight for readability
- **Captions**: Smaller text for metadata
- **Buttons**: Medium weight for actions

### Spacing Scale
- **4px**: Base unit for all spacing
- **8px**: Small gaps and padding
- **16px**: Standard spacing
- **24px**: Section spacing
- **32px**: Large spacing

## 🎯 Next Steps

### For Development
1. **Convert to React Native**: Use this as a design reference
2. **Add Interactions**: Implement JavaScript for dynamic behavior
3. **Backend Integration**: Connect to museum APIs and user data
4. **Testing**: Add user testing and feedback collection

### For Design
1. **Figma Export**: Use as reference for detailed design system
2. **Animation**: Add micro-interactions and transitions
3. **Dark Mode**: Implement theme switching
4. **Accessibility**: Enhance for screen readers and assistive tech

## 📄 License

This prototype is created for educational and demonstration purposes. Museum images are from Unsplash and used under their license.

---

**Built with ❤️ using Material Design 3 principles** 