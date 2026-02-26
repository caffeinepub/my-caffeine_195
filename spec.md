# Specification

## Summary
**Goal:** Fix the VillagesSection ("हमसे जुड़े गाँव") not showing district/village data in the production (live) build, while it works correctly in the draft build.

**Planned changes:**
- Ensure backend stable variables for districts and villages use `stable var` declarations so data is preserved across canister upgrades
- Verify VillagesSection is included and rendered in App.tsx for the production route
- Investigate and fix any data sync/migration issue causing the production canister to show empty district state while draft has populated data
- Ensure no silent data reset occurs on canister upgrade in production

**User-visible outcome:** The "हमसे जुड़े गाँव" section on the live site displays the same district and village data (e.g., जौनपुर, भदोही, प्रयागराज, etc.) that is visible in the draft build, with accordion cards and village chips rendering correctly.
