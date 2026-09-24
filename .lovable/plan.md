# Fashion Design & Customization Platform

A complete, lightweight fashion platform with three roles — Owner/Admin, Designer, Customer — built as a fast web app with a built-in cloud database. No 3D, no WebGL, no heavy libraries: 2D layered previews, CSS transitions and soft hover effects only.

Payments go to UPI ID **ananthikaananthika4@oksbi** via a UPI link/QR that opens Google Pay, PhonePe, Paytm or BHIM. No PINs or bank details are ever collected or stored.

## Public site

- Landing page: brand mark, Home / Dresses / Fabrics / Accessories / Search / Login, hero with "Design. Customize. Create.", featured dresses, fabrics, accessories, popular designs.
- Browsable without login: dress, fabric and accessory listings with filters (season, colour, occasion, fabric, dress type).
- Elegant chrome-and-neutral theme, glass-like cards, rounded corners, soft shadows, fully responsive.

## Logins

- Customer/Designer login and signup on one page; role decides the dashboard.
- Separate Owner/Admin login page.
- Roles stored securely server-side; customers and designers cannot reach owner pages.

## Customer dashboard

Home, Search, My Orders, Profile, Help Desk.

- Home: available dresses, fabrics, handmade accessories, featured, new, popular.
- Search with all owner-managed filters.
- Profile: photo, name, email, phone, address, preferences, orders, favourites, recently viewed. Like/favourite from any product card.

### Dress customization (core feature)

Selecting a dress opens a customization page with:

- Fabric choice (only the colours that fabric offers), colour combination, pattern, lace, flower work, back rope and any other owner-defined add-ons.
- Standard size (XS–XXL, owner-configurable) OR custom measurements: shoulder, chest, waist, hip, armhole, sleeve length, dress length and more.
- **2D live preview** with FRONT / BACK toggle: layered flat illustration where fabric colour, pattern, lace, flowers and add-ons update instantly, and the silhouette scales with the chosen size.
- Live price breakdown: stitching + fabric + each add-on = total. All prices come from the owner's settings, nothing hard-coded.
- Booking fee auto-calculated at 10%; total, booking fee and remaining amount shown clearly.

### Booking and tracking

- Pay the booking fee by UPI (deep link on mobile, QR on desktop), then confirm; order appears in My Orders with a tracking ID.
- Timeline tracker: Order Confirmed → Measurements Received → Design Confirmed → Stitching Started → Stitching Completed → Quality Check → Packed → Out for Delivery → Delivered. Updates from the owner appear automatically.

## Designer dashboard

Home, Search, Products/Materials, Bookings, Orders, Profile, Help Desk.

- Materials catalogue managed by the owner: fabrics, beads, needles, threads, laces, buttons, decorative and flower materials, ropes.
- Bookings view showing full customer request: dress, fabric, colours, pattern, add-ons, size or measurements, address, payment and status.
- Designer profile with photo, contact, services, orders, favourites.

## Owner/Admin dashboard

Home, Add Products/Options, Orders, Bookings, Customers, Designers, Profile, Statistics.

- Product grid/table: image, name, code, category, price, availability, stock, target audience (customer / designer / all), edit, delete with confirmation, mark available or out of stock.
- Add/edit products, and for dresses: stitching price, available fabrics with fabric-specific prices, colours, colour combinations, patterns, sizes, add-ons with prices, season, occasion.
- Manage fabrics (name, image, colours, price, availability, season, occasion), colours, sizes, seasons, categories/occasions, add-ons.
- Orders/Bookings with a Customer / Designer / All switch; each row shows order ID, person, product, amount, payment status, booking fee, remaining, address, status, date, delivery info. Status dropdown per order (dress flow and material flow).
- Statistics: total orders, bookings, completed, delivered, cancelled, pending, total sales, earnings, booking fees collected — simple cards plus CSS-drawn bars.
- Owner profile with business info and a stats summary.

## Help Desk

Lightweight rule-based assistant in customer and designer dashboards opening with "How can I help you?" and quick options: order details, track my order, payment help, customization help, delivery information, other. Answers pull from the user's own orders and the site's information — no external AI calls.

## Sample data

Seeded dresses, fabrics with colour sets, patterns, add-ons, accessories, designer materials, seasons, categories, sizes and a few demo orders in different statuses, so every screen is populated immediately. All deletable from the owner dashboard.

## Technical notes

- Stack: React + TanStack Start (the builder's fixed stack) with Tailwind CSS; Lovable Cloud (Postgres) for database, auth and image storage. Your brief named PHP/MySQL — the equivalent relational schema and app structure will be delivered as a written summary document you can reuse for your project report.
- Tables: profiles, user_roles, fabrics, fabric_colors, colors, patterns, sizes, seasons, categories, addons, products, product_fabrics, product_addons, orders, order_items, measurements, payments, order_status_history, favorites, addresses.
- Roles live in a separate `user_roles` table checked by a security-definer function; row-level security on every table so customers see only their own data and owner-only screens are enforced server-side, not just hidden in the UI.
- Pricing and the 10% booking fee are computed server-side from owner-configured values so totals cannot be tampered with.
- 2D preview is layered SVG/CSS with colour and pattern applied via CSS variables — no canvas, no WebGL, negligible memory use.
- Charts are plain CSS bars; no chart library.

## Delivered alongside the app

A summary document covering the database schema with relationships, page/route map, role permissions, and the pricing and booking-fee logic.
