# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **static HTML/CSS/JavaScript** travel planning site for "Memories and Miles", specializing in Disney, Universal, and cruise vacations. The site features a tropical vacation aesthetic designed to inspire users to book their dream vacation.

**Technology Stack:**
- Pure HTML5, CSS3, and vanilla JavaScript (ES6 modules)
- No build process or framework dependencies
- Deployed free on GitHub Pages

## Local Development

**Run locally using any static file server:**

Using Python (simplest):
```bash
python -m http.server 8000
```
Then visit `http://localhost:8000`

Using Node.js http-server:
```bash
npx http-server -p 8000
```

Using VS Code Live Server extension (recommended for development):
- Install "Live Server" extension
- Right-click `index.html` and select "Open with Live Server"

**No build process needed** - just edit HTML/CSS/JS files and refresh the browser.

## Architecture

### File Structure

```
G:\Projects\memoriesandmiles\
├── index.html              # Home page with hero and features
├── questionnaire.html      # Interactive trip finder
├── contact.html            # Contact form
├── css/
│   ├── main.css           # CSS variables, reset, base styles
│   ├── components.css     # Reusable UI components
│   └── pages.css          # Page-specific layouts
└── js/
    ├── nav.js             # Mobile navigation toggle
    ├── questionnaire.js   # Conditional form logic
    ├── contact.js         # Form validation + mailto
    └── animations.js      # Scroll animations
```

### Design System

**Color Palette (Tropical Vacation Theme):**
- Ocean Deep: `#0077BE` (primary buttons, links)
- Sunset Coral: `#FF6B6B` (accents, errors)
- Tropical Teal: `#00C9A7` (highlights, gradients)
- Sand Cream: `#FFF8E7` (body background)
- Palm Green: `#2ECC71` (success states)

**Typography:**
- Headings: Montserrat (bold, adventurous feel)
- Body: Open Sans (friendly, readable)
- Both loaded from Google Fonts

**Responsive Breakpoints:**
- Mobile: < 768px (hamburger menu, stacked layouts)
- Desktop: >= 768px (horizontal nav, grid layouts)

### Key Features

**1. Home Page** (`index.html`)
- Hero section with gradient background and CTA buttons
- Feature cards showcasing Disney, Universal, and cruise expertise
- Floating CTA section with questionnaire link
- Scroll animations for progressive reveal

**2. Questionnaire** (`questionnaire.html`)
- Conditional dropdown logic:
  - Step 1: Select trip type (theme park or cruise)
  - Step 2: Shows relevant options based on selection
- Generates personalized recommendation
- Reset button to start over
- Uses `data-show-when` attributes for conditional visibility

**3. Contact Form** (`contact.html`)
- Client-side validation (name, email format, message length)
- Real-time error messages
- Opens email client with mailto: link to laura@whitneyworldtravel.com
- Subject: "Travel Inquiry from {name}"
- Body includes message and contact email

### JavaScript Architecture

**ES6 Modules:**
- Each JS file is a module (loaded with `type="module"`)
- No global namespace pollution
- Modern browser features (Intersection Observer, FormData, etc.)

**nav.js:**
- Toggles mobile menu on hamburger click
- Closes menu when clicking nav links or outside
- ARIA attributes for accessibility

**questionnaire.js:**
- Listens to trip type dropdown changes
- Shows/hides conditional fields with animations
- Generates recommendations using object literals
- Saves last recommendation to localStorage

**contact.js:**
- Email validation regex
- Shows inline error messages
- Constructs mailto URL with form data
- Displays success message after submission

**animations.js:**
- Intersection Observer for scroll animations
- Animates feature cards and CTA section
- Fade in + slide up effect

### Static Site Deployment

**GitHub Pages Configuration:**
- Base path: `/memoriesandmiles/` (set in `<base href>` in all HTML files)
- Must match repository name for proper routing
- Deployed automatically via GitHub Actions

**GitHub Actions Workflow** (`.github/workflows/static.yml`):
- Triggers on push to `main` branch
- No build step required
- Uploads entire repository to GitHub Pages
- Typically deploys in < 1 minute

## Development Guidelines

- **Performance:** Keep total page weight under 200KB (excluding fonts)
- **Accessibility:** Use semantic HTML, ARIA labels, keyboard navigation
- **Mobile First:** Design for mobile, enhance for desktop
- **CSS:** Use CSS variables for theming, avoid inline styles
- **JavaScript:** Keep modules focused, avoid dependencies
- **Forms:** Validate on client-side, provide clear error messages
- **Images:** If adding images, use WebP format and lazy loading
- When adding new pages, maintain consistent nav/footer structure and base href
