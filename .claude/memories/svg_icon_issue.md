---
name: svg_icon_issue
description: SVG navigation icons render as dots instead of proper icon shapes
metadata:
  type: project
---

# SVG Icon Rendering Issue

**Status:** Unresolved — icons still rendering as dots despite matching design specifications

**Problem:**
- Left navigation icons (Inbox, Messages, Calendar, Contacts, Notes, Agents) display as small dots instead of proper icon shapes
- Screenshot: ~/Pictures/Screenshots/Screenshot_20260628_080048.png shows dots in nav

**Investigation:**
1. ✅ SVG paths verified against design/Relay Client.dc.html — paths are correct
2. ✅ Fixed relay icon dimensions (16x11 → 18x12) — did not resolve issue
3. ✅ Icons use `stroke="currentColor"` correctly — should inherit button color
4. ✅ Button styling uses `display:flex; align-items:center; justify-content:center` — should center SVGs

**What's NOT the issue:**
- SVG paths themselves (verified against design)
- SVG dimensions/viewBox (match design exactly)
- Stroke color or width settings
- Accessibility attributes (tested both with/without xmlns)

**Likely causes:**
- React rendering issue with inline SVGs
- CSS collapsing SVG dimensions
- Browser dev tools rendering artifacts
- Bun dev server asset injection interfering with SVG display

**Next steps:**
1. Inspect actual rendered DOM in browser (open DevTools, check SVG markup)
2. Check if `stroke-width` attribute is being applied correctly
3. Verify button element sizing (may be collapsing SVG)
4. Test with different browser or force page reload
5. Consider rendering SVGs as separate files vs inline

**Design reference:**
- Main design: `design/Relay Client.dc.html` (262KB, imported 2026-06-28)
- Project ID: b1269346-a37e-43af-89d2-76529faacf9d
- All icon SVG paths verified correct at lines 322-347 of design file

**Related:**
- commit 914e5f3: Attempted fix (relay icon dimensions)
- Tailwind + postcss added to devDependencies (may interact with SVG rendering)

---

*Updated: 2026-06-28*
