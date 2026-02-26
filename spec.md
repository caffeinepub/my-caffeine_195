# Specification

## Summary
**Goal:** Add a UPI payment panel and Bank Details card to the Donation Section of the Gausiya Ashrafia Foundation website.

**Planned changes:**
- Add a UPI payment panel in DonationSection displaying a QR code image with "Scan & Pay" heading, the UPI ID `76800701@ubin` as copyable text with a copy-to-clipboard button, and a note listing supported apps (Paytm, Google Pay, PhonePe, and any UPI app)
- Add a Bank Details card in DonationSection with individual copy-to-clipboard buttons for: Account Name (Gausiya Ashrafiya Foundation), Account No. (353901010037412), and IFSC Code (UBIN0535397), with a bank icon in the card header
- Clicking any copy button copies the respective value to clipboard and shows a toast confirmation
- Style both panels using the existing maroon (#632626) and gold (#dacc96) color palette

**User-visible outcome:** Visitors to the Donation section can view and copy the UPI ID and bank account details, and scan the QR code to make payments directly via UPI apps.
