# Only Garments — runnable retail demo

## GitHub → Vercel

Push this source to `prasannab4362/onlygarmentsbilling`, then import that repository in Vercel and deploy. `vercel.json` configures the static build automatically. `node build.mjs` copies only the runnable frontend and vendor assets to `dist/`, including `index.html`, so the deployment opens at its root URL. Clients open the HTTPS link without installing Node.js. Browser-local data is still separate per computer/browser and domain.

## QR stickers on a roll

**Pictured narrow roll (approximate):** The two stickers are consecutive along the backing strip, not side-by-side. The new preset **Narrow roll 50 × 25** uses 50×25 mm landscape artwork, rotated 90° onto **25 mm across × 50 mm feed** paper. Printer Setup → **Use pictured roll: 50 × 25 mm** applies it to existing saved workspaces; new workspaces use it by default. In Sticker Printing, the narrow-roll presets also cover 55×25, 50×20 and 55×20 mm if your ruler measurement differs. Set the driver paper size to the **across × feed dimensions displayed in the app**, not the horizontal artwork dimensions. Each copy is a separate label/page. Margins and app spacing are zero; the physical inter-label gap belongs in the printer driver and is not included in sticker height. These measurements remain approximate until confirmed by a ruler and one physical print.

Measure one sticker's **width across the roll × height in the feed direction**, in millimetres, excluding the backing-paper gap. Choose **Roll**, **1 label per row**, **0 spacing**, and **0 page margin**. The width/height fields describe the readable artwork; **Roll feed orientation** determines whether it rotates for the printer. Use the **Printer paper: across × feed** dimensions displayed on screen in the driver. The artwork has an internal 2 mm inset. Test one label at 100% scale, with headers/footers and added margins disabled. Set the physical gap/media sensor and calibrate in the driver according to the printer manual; the app does not measure or guess the gap. Exact feed alignment and scan quality require a physical test.

**Corrected print sizing:** QR, code, size and price now occupy separate grid cells. Preview and print automatically fit text within each cell. Refresh the app with Ctrl+F5 after updating files. In Printer Setup, enter the actual sticker width/height; for A4 sheets ensure the number of columns fits the paper. Print at 100% scale with headers/footers disabled. Test one label before printing a batch.

**Photo-reference stickers and code lookup:** New garments receive a saved short code (`H1`, `H2`, …). Existing product codes are preserved. In **Products**, scan the QR or type the code (or just its number) into **Show all details**. The saved product record includes name, size, colour, brand, prices, supplier and other details. Codes are read-only so existing printed stickers keep referring to the same product. In **Sticker Printing**, choose **Landscape reference** or **Portrait reference** to match the supplied examples; configure the actual shop name in Shop Settings. Records persist in the same browser/profile and site address. **Download system backup** saves a JSON file to the computer; restoring that file brings the codes and product records to another browser/computer. Clearing browser storage without a backup loses those records. A phone scan displays the code, not the database record; lookup requires this app and its saved data.

**Client QR update:** Product stickers and the printer test label now print QR codes only, with shop, product, size, price and human-readable product code. Go to **QR Code Generator** or **Sticker Printing**, select products, then preview and print. A QR encodes the product code, not a payment request or a web page. POS accepts that code from a keyboard-style 2D QR scanner, or by manual entry. Camera scanning is not built into the app. Physical QR readability must be tested on the client's printer.

A local, modular HTML/CSS/JavaScript billing application for an Indian garment shop. Prices use INR and business dates use Asia/Kolkata. The original prototype is preserved as `garment_billing_original.html`.

## Run on Windows

**Option A — Node.js (recommended)**

1. Install Node.js 20 or newer if necessary.
2. Open PowerShell in this folder.
3. Run `node server.mjs` (or `npm.cmd start`).
4. Open **http://127.0.0.1:8080** in Chrome or Edge.

The bundled `vendor` scripts allow normal use without an internet connection. No npm installation is needed to run the delivered app. Do not open the HTML with `file://`; JavaScript modules need an HTTP server.

**Option B — XAMPP Apache**

1. Copy this project into `C:\xampp\htdocs\onlygarments`.
2. Start Apache in XAMPP.
3. Open `http://localhost/onlygarments/garment_billing_demo.html`.

Apache is only serving files. PHP/MySQL are not required for this browser-storage demo. Browser data is separate for each hostname, port and browser profile; use JSON backup/restore when moving between the two setup options.

## Demo sign-in

| User | Password | Capabilities |
| --- | --- | --- |
| Owner | `owner123` | All workflows, product/cost edits, rate overrides, credits/refunds, accounting entries, settings and backup |
| Cashier | `cashier123` | Billing at saved rates, discounts, customer payment collection, contacts, viewing and printing |

These are demonstration role controls, **not secure authentication**. Anyone with browser developer tools can access or modify local data. Use sample data or an isolated shop test profile. Production use requires the authenticated server integration described in `backend/README.md`.

## Try the complete workflow

1. Sign in as Owner. Set shop details and printer dimensions.
2. Products → Add product. Enter a purchase cost, selling price, size and brand. Leave the generated barcode or enter your own unique Code 128 code.
3. Click Label, choose copies, and Preview labels. Use Print labels to open the operating-system dialog. Select the real printer and 100% scale; turn browser headers/footers off. The saved printer name is informational and cannot select a physical printer automatically.
4. New Bill / POS → scan or type the exact barcode and press Enter. Search by name, brand or size to add other products.
5. Set quantities, per-line rupee discounts, bill discount, and the shop-configured GST rate. Owner can override rates; changes are audited. The demo applies one tax rate across the invoice.
6. Record Cash, UPI, Card, Bank transfer or custom methods. Use multiple rows for split payments. Digital payments must be marked **Manually checked** or **Simulated demo**. This does not contact a gateway. Amounts above the balance are accepted only as cash tender; change is excluded from recorded receipts.
7. For partial payment, enter customer name and phone. Finalize the invoice. Open it from Invoice History, receive the remainder and reprint A4 or thermal output.
8. Record purchases, supplier payments and expenses. Review the cashbook, reconcile physical cash, and print the dated accounting summary.
9. To reverse a sale, create a full Return or Cancellation credit note with a reason. Record actual money returned separately under Record refund. Originals remain available.
10. Shop Settings → Download JSON backup. Restore accepts a versioned JSON backup and asks before replacing local records.

## Printing

- Code 128 and optional QR rendering are provided by locally bundled JsBarcode and qrcode-generator. EAN-13 validates its checksum; the shop must supply a legitimately assigned EAN code.
- Standard, compact and large label presets; custom width/height, margin, gap, columns, orientation, copies and paper type are saved.
- For roll labels use one column and zero gap. For A4 sheets choose dimensions that fit the sheet width. Large labels are recommended for QR codes.
- Labels, A4 invoices, thermal receipts, payment receipts and daily closing reports print through isolated frames. App navigation is excluded.
- Printer Setup has separate label and receipt test prints. The receipt page uses the configured width and a 297 mm page length; long receipts may paginate. Driver-specific continuous-roll behavior is not integrated.
- Physical alignment, barcode scan reliability and actual printer output require testing with the shop's printer and scanner. Browser print-to-PDF checks cannot establish physical scannability.

## Accounting rules

- Invoice totals and original product costs are snapshotted at finalization; later master changes do not rewrite history.
- Gross profit = net taxable sales after credit notes − cost of garments sold. Estimated net profit subtracts recorded operating expenses. Reports are not audited/statutory accounts.
- Sample purchase costs are **unknown**, not inferred from selling prices. Profit displays Incomplete when an invoice lacks costs. Enter correct costs before making test sales for meaningful profit results.
- Cashbook opening balance is the initial configured cash plus earlier cash movements; closing includes receipts, supplier payments, expenses, refunds, deposits and withdrawals. Changing initial opening cash affects all historical cash calculations and is audited.
- Simulated payments are included in this demo's balances and labelled in the ledger and invoice. No payment is externally verified.
- Purchase entries are accounting records only. No stock deduction, stock control, transfers, reordering or warehouse logic is implemented.
- Full-invoice credits/returns are supported. Partial item returns, mixed GST rates, tax filing, gateway integration and multi-user synchronization are not implemented.

## Source layout

| Location | Purpose |
| --- | --- |
| `garment_billing_demo.html` | Entry page |
| `frontend/app.js`, `styles.css` | Screens and interactions |
| `frontend/core.js` | Financial calculations and transactions |
| `frontend/storage.js` | Persistence, validation and exports |
| `printing/print.js` | Barcodes, QR, invoice and isolated print layouts |
| `vendor/` | Offline barcode/QR libraries and licenses |
| `database/schema.sql`, `seed.sql` | MySQL 8 migration schema and sample products; not connected to demo |
| `backend/README.md` | Server migration contract and security requirements |
| `tests/` | Financial unit tests and real-browser workflow checks |

To prepare a future MySQL database, import `database/schema.sql`, then `database/seed.sql`. This does **not** connect the frontend. Never deploy the demo's client-side roles as production authentication. For a future database backup use `mysqldump --single-transaction -u USER -p only_garments > backup.sql`; restore with `mysql -u USER -p only_garments < backup.sql` in Command Prompt, keeping credentials out of files. Local-demo backup/restore is through Shop Settings.

## Development and tests

### TVS LP 45 Lite sticker roll

In **Sticker Printing** or **Printer Setup**, use **Sticker roll printer → Paper for stickers → Sticker roll — one sticker per page**. Choose the approximate sticker size (50 × 25, 55 × 25, 50 × 20, or 55 × 20 mm). These are starting sizes from the supplied measurements, not verified physical dimensions.

For a 50 × 25 mm sticker fed narrow-edge-first, the Windows custom paper size is **25 mm wide × 50 mm feed**. If the roll instead feeds with the 50 mm edge across the printer, select **Artwork width across roll** in Printer Setup; the custom paper size then becomes **50 × 25 mm**. Measure one sticker excluding its gap. Save settings before test printing. Use 100% scale, no page margins, and no browser headers/footers. The physical gap is configured in the printer driver, not added to the website page size. Each sticker is a separate custom-sized print page.

The laptop detects the USB device as `Bar Code Printer T-9650 Pro`; the physical model was confirmed as **TVS Electronics LP 45 Lite**. USB detection alone does not install a printer queue. A matching Windows driver is still required, and physical printing/alignment has not yet been verified.

`npm.cmd install --no-audit --no-fund` installs pinned source dependencies and Playwright. Runtime vendor files are already included. `npm.cmd test` runs financial tests. Start the server, then run `node tests/browser.mjs` to exercise workflows in installed Chrome. See `TESTING.md` for results and limits.

LocalStorage is a single-browser demonstration store, not a transactional server database. Each save writes one complete snapshot, and storage-write failures leave memory unchanged. A stale-state check reduces accidental overwrites across tabs, but use **one active tab** for transactions; there is no cross-process locking. Clearing browser data removes records. Export backups regularly and protect them as customer data. The app stores no card numbers, CVVs, UPI PINs or banking passwords.
