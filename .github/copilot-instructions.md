# Lofi FM - AI Agent Instructions

## Project Overview

Lofi FM is an online lofi music player built as a client-side web application. It allows users to play lofi music from YouTube videos, with features like custom theming, background images, draggable controls, starring songs, and background video scaling options. The app is designed for work, study, and relaxation, particularly during coding sessions.

The application uses the YouTube Data API to fetch and play videos, and it's a Progressive Web App (PWA) that can be installed on devices.

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **State Management**: Recoil (global state) and useReducer (local component state)
- **UI Components**: Radix UI (for popover, tabs)
- **HTTP Client**: Axios
- **Analytics**: Mixpanel and Google Analytics (react-ga4)
- **SVG Handling**: SVGR plugin for importing SVGs as React components
- **PWA**: Vite PWA plugin
- **Other Libraries**: OpenReplay for tracking, react-toast-package for notifications, use-container-click for click detection

## Project Structure

The project follows a component-based architecture with organized folders:

```
src/
├── components/          # Reusable UI components
│   ├── AllSongs/        # Component for displaying all songs
│   ├── Overlay/         # Overlay component
│   ├── player/          # Main player component and sub-components
│   │   ├── controls/    # Player controls
│   │   ├── player-info/ # Player information display
│   │   ├── cashtab/     # Cash tab component
│   │   └── reducer/     # Player state reducer
│   ├── Slider/          # Custom slider component
│   └── UpdateApp/      # App update component
├── constants/           # Application constants (songs, giphys)
├── recoil/              # Global state management
│   └── atoms/           # Recoil atoms for state
├── utils/               # Utility functions
├── icons/               # Icon components/assets
├── App.tsx              # Main app component
├── main.tsx             # App entry point
└── index.css            # Global styles
```

### Key Conventions

- **Component Organization**: Each component has its own folder with:
  - `[ComponentName].tsx` - Main component file
  - `[component-name]-style.css` - Component-specific styles
  - `index.ts` - Export file for clean imports
- **State Management**:
  - Global app state uses Recoil atoms (PlayerState, SongsState)
  - Local component state uses useReducer with custom reducers
- **Styling**: CSS modules with component-specific stylesheets
- **Imports**: Relative imports with path aliases not extensively used; prefer relative paths
- **TypeScript**: Strict mode enabled, use interfaces for props and state

## Build and Run Instructions

1. **Install Dependencies**: `npm install`
2. **Start Development Server**: `npm run start` (runs `vite --host`)
3. **Build for Production**: `npm run build` (runs `tsc && vite build`)
4. **Preview Build**: `npm run preview`

The app runs on Vite's dev server with HMR enabled.

## State Management

- **Recoil Atoms**:
  - `PlayerState`: Manages current player data (active song, volume, etc.)
  - `SongsState`: Manages the list of songs (default + user-added)
- **Local State**: Uses `useReducer` for complex component state (e.g., player UI states)
- **Persistence**: User data stored in localStorage (added songs, volume, etc.)

## API Integration

- **YouTube Data API**: Used for fetching video metadata and playing videos
- **Global YouTube Player**: Accessed via `window.YT` and `window.player`
- **HTTP Requests**: Axios for any additional API calls (though most are client-side)

## Coding Conventions

- **TypeScript**: Use strict typing, define interfaces for component props
- **React Hooks**: Prefer functional components with hooks
- **Event Handling**: YouTube player events handled via `onPlayerStateChange`
- **Error Handling**: Basic error handling for API calls and player states
- **Accessibility**: Use semantic HTML and ARIA attributes where applicable
- **Performance**: Lazy loading and efficient re-renders with Recoil

## Key Features to Understand

1. **Song Management**: Default songs from constants, user can add YouTube video IDs
2. **Player Controls**: Play/pause, volume, next/previous with random selection
3. **Theming**: Custom CSS variables for themes
4. **Backgrounds**: GIF backgrounds from Giphy integration
5. **PWA Features**: Service worker, manifest for offline capabilities
6. **Analytics**: Track user interactions with Mixpanel and GA4

## Development Notes

- The app is client-side only, no backend required
- YouTube API key needed for full functionality (stored in environment variables)
- PWA manifest configured for standalone display
- Visualizer plugin used for bundle analysis
- HMR configured for HTTPS in production-like environments

## Common Tasks

- **Adding New Features**: Create components in appropriate folders, update state atoms if needed
- **Styling**: Add styles to component-specific CSS files
- **State Changes**: Modify Recoil atoms or add new ones for global state
- **API Calls**: Use Axios in utility functions
- **Testing**: No formal test setup; manual testing recommended

This instructions file should help AI agents understand the codebase structure, conventions, and how to contribute effectively to the Lofi FM project.
