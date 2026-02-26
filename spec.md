# Specification

## Summary
**Goal:** Replace the four existing Admin Meet gallery images in the GallerySection with real photos from the September 21, 2025 Admin Meet event.

**Planned changes:**
- Save the four uploaded photos as static assets at `frontend/public/assets/generated/` with filenames `gallery-admin-meet-1.png` through `gallery-admin-meet-4.png`
- Update `GallerySection.tsx` to reference the new images
- Set the event card title to 'एडमिन पैनल मीटिंग – 21 सितंबर 2025' and subtitle to 'मुंबरा (ठाणे), महाराष्ट्र, भारत'
- Retain the existing 'गैलेरी' section heading and decorative gold divider
- Remove all old placeholder gallery images

**User-visible outcome:** The Gallery section now displays the four real photos from the September 21, 2025 Admin Meet event with the correct Hindi title and location subtitle.
