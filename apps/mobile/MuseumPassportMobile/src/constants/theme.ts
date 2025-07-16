// Material Design inspired theme constants
export const COLORS = {
  // Primary colors
  primary: '#1976D2',
  primaryDark: '#1565C0',
  primaryLight: '#BBDEFB',
  
  // Secondary colors
  secondary: '#FFC107',
  secondaryDark: '#FF8F00',
  secondaryLight: '#FFECB3',
  
  // Surface colors
  surface: '#FFFFFF',
  surfaceVariant: '#F5F5F5',
  background: '#FAFAFA',
  
  // Text colors
  onSurface: '#212121',
  onSurfaceVariant: '#757575',
  onPrimary: '#FFFFFF',
  onSecondary: '#212121',
  
  // Status colors
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FF9800',
  info: '#2196F3',
  
  // Divider
  divider: '#E0E0E0',
  
  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
} as const;

export const DIMENSIONS = {
  // Spacing (multiples of 4)
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  // Border radius
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
    xl: 24,
  },
  
  // Component heights
  buttonHeight: 48,
  inputHeight: 56,
  cardHeight: 200,
  topBarHeight: 64,
  bottomTabHeight: 80,
  
  // Icon sizes
  iconSize: {
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48,
  },
  
  // Avatar sizes
  avatarSize: {
    sm: 32,
    md: 40,
    lg: 56,
  },
} as const;

export const TYPOGRAPHY = {
  // Font sizes
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
  },
  
  // Font weights
  fontWeight: {
    light: '300',
    regular: '400',
    medium: '500',
    bold: '700',
  },
  
  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },
} as const;

export const STRINGS = {
  // App
  appName: 'Museum Passport',
  
  // Navigation
  home: 'Home',
  visited: 'Visited',
  search: 'Search',
  museumDetails: 'Museum Details',
  
  // Actions
  login: 'Sign In',
  logout: 'Sign Out',
  loadMore: 'Load More',
  searchPlaceholder: 'Search museums...',
  
  // Status
  loading: 'Loading...',
  error: 'Error',
  noResults: 'No results found',
  
  // Museum actions
  wishToVisit: 'Wish to Visit',
  markVisited: 'Mark as Visited',
  addNotes: 'Add Notes',
  save: 'Save',
} as const;

export const SHADOWS = {
  // Material Design elevation shadows
  elevation: {
    1: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
      elevation: 3,
    },
    2: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    4: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.30,
      shadowRadius: 4.65,
      elevation: 8,
    },
  },
} as const; 