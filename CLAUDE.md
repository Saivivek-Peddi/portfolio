# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React-based developer portfolio template built with Create React App. It's a single-page application with routing for a main portfolio page, blog page, and projects page. The portfolio is highly customizable through data files and supports multiple color themes with light/dark variants.

## Common Commands

### Development
```bash
npm start          # Start development server on http://localhost:3000
npm run build      # Create production build in build/
npm test           # Run tests in watch mode
```

### Deployment
```bash
npm run deploy     # Build and deploy to GitHub Pages
```

The `deploy` command automatically runs `predeploy` (which builds the project) before deploying to GitHub Pages via the `gh-pages` branch.

## Architecture

### Component Structure
The app follows a component-based architecture where each section of the portfolio (About, Skills, Experience, etc.) is a separate component. The main page (`src/pages/Main/Main.js`) renders all components in a vertical layout.

**Main Routes:**
- `/` - Main portfolio page with all sections
- `/blog` - Dedicated blog listing page
- `/projects` - Dedicated projects showcase page
- `/project/:id` - Individual project detail page with comprehensive information

### Data-Driven Content
All portfolio content is defined in `src/data/*.js` files. Each component reads from its corresponding data file:
- `headerData.js` - Name, title, description, profile image, resume PDF
- `aboutData.js` - About section content
- `educationData.js` - Education entries
- `experienceData.js` - Work experience entries
- `projectsData.js` - Project showcase items with full detail pages (includes `fullDescription`, `keyFeatures`, `technicalDetails`, `impact`)
- `skillsData.js` - Skills list (must match available icons in `src/utils/skillsImage.js`)
- `achievementData.js` - Achievements and awards
- `blogData.js` - Blog preview cards (links to external GitLab blog site)
- `youtubePlaylistsData.js` - YouTube playlist embeddings (automatically updates when new videos are added to playlists)
- `contactsData.js` - Contact information and form configuration
- `socialsData.js` - Social media links
- `themeData.js` - Active theme selection

### Theming System
The theme system is managed through React Context (`src/contexts/ThemeContext.js`).

**Available themes:** Green, Black & White, Blue, Red, Orange, Purple, Pink, Yellow (each with light/dark variant)

To change the theme, edit `src/data/themeData.js` and set `theme` to one of the imported theme objects from `src/theme/theme.js` (e.g., `blueThemeDark`, `greenThemeLight`, etc.).

Theme objects define:
- Primary/secondary/tertiary colors with opacity variants
- Images for About, Education, Experience, and Contacts sections that match the theme

### Key Dependencies
- **React Router v5** - For page routing (uses `BrowserRouter`, `Switch`, `Route`)
- **Material-UI v4** - UI components and icons
- **react-helmet** - Managing document head (page title, meta tags)
- **axios** - For contact form submission (typically to SheetDB API)
- **react-reveal** - Scroll animations
- **react-slick** - Carousels for testimonials

## Customization Guidelines

1. **Updating Personal Information**: Edit files in `src/data/` directory
2. **Adding Skills**: Add to `skillsData.js` array (ensure icon exists in `src/utils/skillsImage.js`)
3. **Adding Projects**: Add objects to `projectsData.js` with fields: `id`, `projectName`, `projectDesc`, `tags`, `code`, `demo`, `image`, `fullDescription`, `keyFeatures`, `technicalDetails`, `impact`
4. **Adding YouTube Playlists**: Add to `youtubePlaylistsData.js` with `id`, `title`, `description`, and `playlistId` - the component will automatically show new videos when added to the playlist
5. **Changing Theme**: Update `src/data/themeData.js` to select different theme
6. **Resume PDF**: Place in `src/assets/pdf/` and import in `headerData.js`
7. **Profile Image**: Place in `src/assets/png/` and import in `headerData.js`

## Contact Form Setup
The contact form requires configuration to connect with a backend service (typically Google Sheets via SheetDB). Configuration details are in `src/data/contactsData.js` where you set the SheetDB API endpoint.

## Deployment Notes
- The project is configured for GitHub Pages deployment
- The `homepage` field in `package.json` should be set to your GitHub Pages URL or custom domain
- For custom domain: Add a `CNAME` file in `public/` directory with your domain
