# Specification

## Summary
**Goal:** Fix the error in the Admin Panel > Villages tab where attempting to add a district results in a red error message and the district is not saved.

**Planned changes:**
- Diagnose and fix the `addDistrict` mutation failure in the Villages tab (check authorization guards, argument shape, actor initialization, and the `useAddDistrict` hook implementation)
- Ensure a successful district add call refreshes the districts list and shows a success toast notification
- Ensure no red error text appears during or after a successful district add operation
- Display meaningful error messages for genuine backend errors (e.g., duplicate district name) instead of raw JS errors
- Verify the Add Village form also works correctly without errors when a valid district is selected and a village name is entered

**User-visible outcome:** Admin users can add a district in the Villages tab without seeing a red error message; the new district appears in the list immediately and a success toast is shown.
