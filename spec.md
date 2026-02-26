# Specification

## Summary
**Goal:** Build a full-featured Admin Panel with gallery management, village controls, passcode change, and site-wide scroll/hover animations for the Gausiya Ashrafia Foundation app.

**Planned changes:**
- Add a new `AdminPanel.tsx` component with a passcode login gate (default passcode `damin1234`, stored in localStorage under `gaf_admin_passcode`) styled with the cream/maroon palette
- Implement six tabs in the Admin Panel: Donations, Memberships, Assistance Requests, Contact Inquiries, Villages, and Gallery Management
- Add a "Change Passcode" section within the Admin Panel allowing the logged-in admin to update the stored passcode
- Add backend Motoko data model and API for gallery events and images (addGalleryEvent, getGalleryEvents, deleteGalleryEvent, addGalleryImage, getGalleryImagesByEvent, deleteGalleryImage) with stable variable storage and no authorization guards
- Add React Query hooks for all new gallery backend endpoints in `useQueries.ts`
- Update `GallerySection.tsx` to dynamically fetch and display gallery events and images from the backend, with loading and empty states
- Add `#/admin` hash route in `App.tsx` rendering the Admin Panel with Header and Footer
- Add an "Admin" link in the mobile/hamburger menu only in `Header.tsx` navigating to `/#/admin`
- Add scroll-triggered fade-in and slide-up entrance animations to all major page sections using Intersection Observer API
- Add hover/focus animations to buttons (scale, shadow, color transition), CTA buttons (glow/pulse), navigation links (underline slide-in), and cards (lift + shadow)
- Add staggered entrance animations to HeroSection: fade-in-up for text, scale-in for tagline badge, slide-in for CTA buttons, and subtle background shimmer on the hero overlay

**User-visible outcome:** Admins can access a passcode-protected panel at `/#/admin` to manage gallery events/images, view donations/memberships/requests/inquiries, manage villages, and change the panel passcode. The public gallery section dynamically shows admin-uploaded content. The entire site gains smooth scroll-triggered section animations and interactive button/card hover effects.
