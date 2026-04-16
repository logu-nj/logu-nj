# Gemini Context: Portfolio (logu-nj)

This file provides instructional context for Gemini CLI when working within the `logu-nj` portfolio project.

## Project Overview
- **Purpose:** A personal portfolio website showcasing sections for About, Education, Experience, Skills, Projects, and Contact.
- **Technologies:** 
  - **Framework:** Angular 19 (Standalone Components)
  - **Styling:** SCSS, Bootstrap (for layout and offcanvas components)
  - **State Management:** RxJS `Subject` patterns in `CommonService`
  - **Icons/Images:** Custom assets stored in `src/assets/icons` and `src/assets/pictures`

## Architecture & Hierarchy
The application follows a simple but nested structure:
1. **AppComponent (`src/app/app.component.ts`)**: Root component that hosts the `HeaderComponent`.
2. **HeaderComponent (`src/app/header/header.component.ts`)**: Manages navigation and hosts the `MainBodyComponent`. It handles responsive navigation (mobile and desktop views).
3. **MainBodyComponent (`src/app/main-body/main-body.component.ts`)**: Contains the primary content sections (About, Skills, Projects, etc.). It uses `IntersectionObserver` for scroll-to-section logic.
4. **CommonService (`src/app/shared/services/common.service.ts`)**: Central hub for state management, specifically for:
   - `$updateCursor`: Triggering UI updates related to custom cursor or element positioning.
   - `$updateSelectedSection`: Syncing the active navigation section between header and body.

## Building and Running
- **Development Server:** `npm start` or `ng serve`
- **Build:** `npm run build` or `ng build`
- **Testing:** `npm test` or `ng test`
- **Output Path:** Build artifacts are generated in `dist/portfolio`.

## Development Conventions
- **Standalone Components:** All new components should be created as `standalone: true`.
- **Styling:** Use SCSS. Shared styles and variables are in `src/styles.scss`.
- **Responsive Design:** The project uses a combination of CSS classes and conditional templates for `mobile-view` and `tab-view`.
- **Service Usage:** Always use `CommonService` for cross-component communication involving navigation state or global UI triggers.
- **Assets:** 
  - Icons: `/assets/icons/`
  - Project/Profile Pictures: `/assets/pictures/`
  - Refer to assets in templates with absolute paths like `/assets/icons/about.png`.

## Important Files
- `angular.json`: Workspace configuration and build targets.
- `package.json`: Project dependencies and scripts.
- `src/app/app.config.ts`: Application providers and configuration.
- `src/app/app.routes.ts`: Routing configuration (currently empty, as it's a single-page scrolling layout).
- `src/app/shared/services/common.service.ts`: Key service for state synchronization.
