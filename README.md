# Apex Auto Insurance

A modern, responsive, 8-page plain HTML/CSS/JS website for an auto insurance brand (catering to both Two-Wheelers and Cars).

## Design System

- **Primary Color:** Electric Blue (`#0d6efd`)
- **Accent Color:** Punchy Orange (`#fd7e14`)
- **Secondary/Text:** Dark Navy (`#1e293b`)
- **Typography:** 'Outfit' for headings, 'Inter' for body.
- **Icons:** Phosphor Icons (CDN)
- **Theme:** Native Light/Dark mode support via CSS Variables and `localStorage`.

## File Structure

```
.
├── index.html            # Home page
├── plans.html            # Policy listings with Car/Bike filter
├── plan-detail.html      # Coverage details & premium estimate calculator
├── claims.html           # File claim form & mock status tracker
├── about.html            # Company story and leadership
├── contact.html          # Contact form and map
├── auth.html             # Combined tabbed Login/Register interface
├── 404.html              # Custom not found page
├── assets/
│   ├── css/
│   │   └── style.css     # Global styles and CSS variables
│   ├── js/
│   │   ├── main.js       # Navigation, theme toggle, animations
│   │   ├── calculator.js # Logic for premium estimator
│   │   └── claims.js     # Logic for claims tracking and form validation
└── README.md
```

## Features

- **No Frameworks:** Built entirely with plain HTML5, CSS3 (CSS Variables, Flexbox, Grid), and Vanilla ES6+ JavaScript.
- **Responsive:** Fluidly scales down to 360px viewports with a custom hamburger drawer for mobile.
- **Dark Mode:** System default fallback with a manual toggle in the navigation.
- **Forms & Validation:** Client-side validation applied to all forms (Contact, Auth, Claims).
- **Interactive Calculator:** A mock premium estimator on `plan-detail.html` that dynamically calculates costs based on vehicle age, IDV, city, and chosen add-ons. 
- **SEO & Accessibility:** Proper semantic markup, readable contrasting colors, and well-structured heading hierarchies.

## Placeholders

- Forms (`contact.html`, `claims.html`) have their `action` attributes pointing to `https://formspree.io/f/placeholder`.
- Google Maps iframe is represented by a stylized placeholder div in `contact.html`.
- Social media links, privacy policy, and terms links are set to `#`.
- "Continue with Google / Email" on the `auth.html` page are visual buttons.

## Requirements Checklist Addressed
- Exactly 8 pages. No dashboard. Auth is a combined tabbed page.
- Plain HTML/CSS/JS. No libraries (except icon CDN).
- Both Two-Wheeler and Car contexts present but clearly delineated.
- Vibrant-modern aesthetic.
- Forms have strict client-side validation.
- Responsive breakpoints respected, hamburger at 1024px.
- Premium amounts and calculator results properly disclaimed.
