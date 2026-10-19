# Persistence boundary

The runnable demo uses `frontend/storage.js` and a single versioned JSON snapshot in browser localStorage. `commit()` applies each transaction to a clone and only replaces in-memory state after the storage write succeeds. Finalized invoice lines and shop details are snapshots. No live payment gateway is connected.

`server.mjs` serves static files only, bound to loopback, with an allowlist. It does not receive customer data. XAMPP Apache may serve the same frontend. There is no PHP API enabled in this demo. The supplied MySQL schema is a migration foundation, not an active database integration.

For production, replace the storage adapter with authenticated PHP 8 endpoints. Enforce roles on the server; use password_hash/password_verify, secure HttpOnly sessions, CSRF protection, prepared statements, and MySQL transactions for invoice + payment writes. Allocate invoice numbers with a locked sequence, enforce unique constraints, and reject client-calculated totals. Restrict access to cost prices and customer data. The demo's hardcoded credentials and client role checks are not a security boundary.

Suggested endpoints: products GET/POST/PATCH/DELETE; invoices GET/POST; invoices/:id/payments POST; invoices/:id/credits POST; invoices/:id/refunds POST; purchases GET/POST; purchases/:id/payments POST; expenses GET/POST; reports GET; settings GET/PATCH; backup GET. Do not support destructive deletion of finalized transactions. Inventory, GST filing, gateway integrations and multi-branch synchronization remain out of scope.
