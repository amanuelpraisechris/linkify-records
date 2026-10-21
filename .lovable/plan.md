# Decluttered, premium app redesign (mobile first)

## What's wrong now (from your screenshots)
- On phones the top bar overlaps itself: the page title "Matching Configuration", the LinkRec logo, an algorithm dropdown, the shield button and the profile circle all sit on the same line.
- The side menu shows two close (X) buttons and has a duplicated "Admin" label plus a separate Logout.
- Admin pages stack big cards, long explanations and full-width dark buttons. Too much text, too little hierarchy.
- Colours are mixed (blue, purple, green, orange tiles, a black/white "About" box) and the font is generic Inter.

## Visual direction: "Clinical calm"
- Warm off-white background, deep teal primary (trust and health), amber accent kept for "Needs review".
- Typography: Sora for headings, Manrope for body, with Noto Sans Ethiopic for Tigrinya/Amharic.
- Fewer borders, soft shadows, generous spacing, one main action per screen.
- Dark mode uses the same tokens.

## Changes

### 1. Top bar (all pages)
- One clean row: menu button, LinkRec logo, profile circle. Nothing else on phones.
- Page titles move below the bar, inside the page, so they never collide.
- The algorithm dropdown and role switch move into the profile menu (desktop keeps the role switch visible).

### 2. Side menu (phones)
- One close button only.
- Groups: Work (Dashboard, New record, Search, Records) and Admin (Admin dashboard, Matching settings, Locations & facilities), shown only to admins.
- Signed-in name and Logout at the bottom, once.

### 3. Dashboard (home)
- Short greeting + two big actions: "New clinic record" and "Search HDSS".
- Four compact figures (records, matched, needs review, match rate) in a 2x2 grid on phones.
- Remove the world map and the long "About this system" box (move to a small "About" link).

### 4. Admin dashboard
- A simple list of settings rows (icon, title, one-line description, arrow) instead of large cards with dark buttons.
- Change password moves into the profile menu.

### 5. Matching settings
- Single page with a segmented control (Thresholds / Field weights / Advanced) that scrolls sideways on phones.
- Sticky "Save" bar at the bottom; algorithm choice shown as two clear option cards (Probabilistic, recommended / Deterministic) with one-line explanations.

### 6. Record entry and review screens
- Step bar becomes a slim progress bar with "Step 2 of 4 · Person" on phones.
- Summary panel collapses into a bottom sheet on phones.
- Buttons fixed at the bottom of the screen (Back / Continue).

## Technical details
- Rewrite tokens in `src/index.css` (HSL) and `tailwind.config.ts` fonts; replace hardcoded colour classes (`bg-white`, `text-gray-*`, `bg-blue-100`, etc.) in navbar, mobile navigation, Index, admin dashboard, MatchingConfiguration and record-entry with semantic tokens.
- `NavbarContainer`/`Navbar`: hide role switch, algorithm select on `<md`; move into `NavbarUserMenu` dropdown.
- `MobileNavigation`: remove the Sheet's built-in duplicate close or the custom one; regroup links.
- `MatchingConfiguration.tsx`: title inside page with `pt-20`, sticky save footer.
- `AdminCardGrid`/`AdminCard`: list-row layout.
- No changes to matching logic, data storage or tests; existing tests rerun to confirm.
- Verify with Playwright at 430px and 1280px widths.
