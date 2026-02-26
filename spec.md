# Specification

## Summary
**Goal:** Fix the IC0508 "Canister is stopped" error that blocks all district and village add/delete operations in the Admin Panel.

**Planned changes:**
- Investigate and fix the backend `main.mo` for any logic (explicit stop calls, trapping pre/post-upgrade hooks, heartbeat errors) that causes the canister to enter a stopped state.
- Ensure the canister compiles and deploys cleanly, remaining in a "running" state after redeployment/upgrade.
- Remove or fix any pre/post-upgrade hooks that may trap and leave the canister stopped.
- Verify that `addDistrict`, `addVillage`, `deleteDistrict`, and `deleteVillage` calls succeed without IC0508 or Reject code 5 errors.
- End-to-end verify the Admin Panel Villages tab: individual district add, individual village add, Excel/CSV bulk import, and text-paste bulk import all work and show success toasts.

**User-visible outcome:** Admin panel users can successfully add districts and villages individually or via bulk import (Excel/CSV and text-paste) without any IC0508 canister stopped errors. Success toasts appear for all operations and new entries display correctly in the list.
