# Verification checklist

Label sizing correction: `node tests/label-sizing.mjs` passed for 12 labels across 60×40, 50×30, 75×50 and portrait 40×50 mm. Verified no overlapping cells, no text overflow, and rendered widths matching millimetre settings. Includes the reported OG1005 / 80 cm combination. Preview and print frame both fit text before printing. Evidence: `test-results/corrected-label-sizes.png` and `.pdf`. Browser workflow and print invocation tests also passed after the correction.

Tested on 19 October 2026 with Node.js 24 and installed Google Chrome on Windows.

## Automated financial tests

`npm.cmd test`: **11 passed, 0 failed**.

`node tests/reference-labels.mjs`: **passed**. Checks automatic read-only short codes, numeric/code lookup, saved full details after reload, QR-only rendering and both photo-reference layouts. Visual preview: `test-results/reference-stickers.png`. Physical label dimensions and print quality still need verification on the client's printer.

- Tax-exclusive GST, item and bill discounts, CGST/SGST split and invoice rounding.
- Tax-inclusive pricing and interstate IGST.
- Paise rounding and tax component reconciliation.
- Invalid quantities, negative prices, excessive discounts and invalid GST rejection.
- Cash tender/change, split and partial payments, digital confirmation requirement, digital overpayment rejection.
- Invoice finalization, subsequent customer collection, full credit note and refunds, duplicate credit/over-refund rejection.
- Purchase payments, expenses, withdrawals and period opening/closing cash.
- Correct sample prices and unknown-cost profit flags.
- Credit sale contact requirement and immutable invoice product snapshots.
- Backup validation: valid snapshots accepted; corrupted totals, duplicate barcodes and orphan payments rejected.

## Real-browser workflow checks

`node tests/browser.mjs`: **passed**.

- Owner sign-in and role restrictions for Cashier.
- Product creation and editing; unique generated internal ID and entered barcode.
- Code 128 label previews, multiple copies and QR generation.
- Barcode entry with Enter, quantity accumulation, line/bill discounts and GST.
- Split Cash + simulated UPI payment, partial balance, subsequent collection and change due.
- Saved invoice survives page reload and reopens.
- Purchase recording, initial and subsequent supplier payments, supplier balance.
- Expense recording and cashbook totals.
- Physical cash reconciliation and accounting reports.
- Full return credit and separate Cash/UPI refunds.
- All navigation screens load with no unhandled JavaScript errors.
- Desktop and mobile screenshots reviewed.

`node tests/printing.mjs`: **passed**.

- Printer settings survive reload.
- Separate label and thermal test-print buttons call the print function.
- Label print frames contain barcodes and exclude application navigation.
- Default label content fits configured height.
- Assigned-format EAN-13 with valid checksum renders; invalid checksum is rejected.
- Saved invoice A4 and thermal print frames contain the correct number and totals.
- JSON backup download and restore through the UI.

The print tests replace `window.print()` with a capture function to inspect the generated print document. They do not send a physical job or verify operating-system dialog interaction. Screenshot evidence is generated in `test-results/` (ignored in Git).

## Shop acceptance checks still required

- Select the actual installed printer and test margins, page size, scale and sheet feed.
- Scan printed Code 128 / EAN-13 labels with the shop's scanner; ensure quiet zones remain intact.
- Test QR scanning on the chosen label size.
- Test A4 and thermal output independently; long thermal invoices may paginate.
- Confirm shop tax configuration, price data, footer and return policy.

## Known demo boundaries

- Local browser storage; no active PHP/MySQL API or secure server authentication. SQL schema/seed are migration deliverables and were not executed against a MySQL server in this environment.
- Single active transaction tab recommended; no multi-user locks or transactional database guarantees.
- No real gateway confirmations; digital entries are manually recorded or simulated.
- Full-invoice returns/cancellations only; no partial item returns or mixed GST rates within one invoice.
- No automatic stock management, advanced statutory accounting or GST filing.
- Sample product costs are unknown. Incomplete cost data prevents reliable profit reporting.
- Browser printing cannot discover/select printers or print silently. Hardware print quality has not been verified.
