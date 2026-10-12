# Canvas Couture Web

Create a complete, modern, elegant and lightweight fashion designing and customization web application.



IMPORTANT:

This project must be lightweight and suitable for a low-performance government laptop with 8 GB RAM and 64 GB storage. Do NOT use heavy 3D rendering, WebGL, complex animations, or resource-heavy libraries. Use lightweight 2D previews, CSS animations, smooth hover effects and simple transitions only.



The website should have THREE roles:



1. OWNER / ADMIN

2. DESIGNER

3. CUSTOMER



There should be two types of public/login access:

- Owner/Admin login

- Customer/Designer login



After login, the system should identify the user's role and show the appropriate dashboard.



==================================================

PUBLIC LANDING PAGE

==================================================



When the website is opened, show a beautiful but lightweight fashion-themed landing page.



The design should be:

- Elegant

- Premium-looking

- Minimal

- Modern

- Clean

- Responsive

- Smooth

- Not overloaded with animations



Use subtle chrome/metallic visual effects, glass-like cards where appropriate, soft shadows, smooth hover animations and elegant transitions.



Do NOT make it heavy.



Landing page should contain:



- Logo / Brand name

- Home

- Dresses

- Fabrics

- Accessories

- Search

- Login



Hero section with a fashion-related image/visual and a tagline such as:



"Design. Customize. Create."

"Your Style, Your Choice."



Show featured dresses, fabrics, accessories and popular designs.



Customers should be able to browse available products before logging in if appropriate.



==================================================

LOGIN SYSTEM

==================================================



Create role-based authentication.



Customer and Designer should use the same login page but have different dashboards after login.



Owner/Admin should have a separate secure login.



Customer login → Customer Dashboard



Designer login → Designer Dashboard



Owner login → Owner/Admin Dashboard



The menus and content should automatically change according to the logged-in role.



==================================================

CUSTOMER DASHBOARD

==================================================



Customer dashboard should have:



1. Home

2. Search

3. Orders / My Orders

4. Profile

5. Help Desk / Chatbot



The overall layout can be similar to the Designer dashboard, but the content should be different according to the role.



HOME:



Show:

- Available dresses

- Available fabrics

- Handmade accessories

- Featured products

- New products

- Popular designs



SEARCH:



Customer should be able to search for dresses, fabrics, accessories and designs.



Provide filters such as:



- Season:

  - Summer

  - Winter

  - All Season



- Color



- Category / Occasion:

  - Traditional

  - Party Wear

  - Casual

  - Other suitable categories



- Fabric



- Dress type



The owner/admin should be able to create and manage these filter options.



==================================================

DRESS CUSTOMIZATION

==================================================



This is one of the MAIN FEATURES of the project.



When a customer selects a dress/frock design, open a detailed customization page.



For example:



Customer selects a frock.



The customer should be able to customize:



- Fabric

- Fabric color

- Color combination

- Pattern

- Lace

- Flower work

- Back rope

- Other available add-ons

- Size



Available fabrics can include:



- Cotton

- Silk

- Satin

- Other fabrics added by the owner



The owner should be able to add different fabrics and their prices.



Different fabrics can have different prices.



For example:



Cotton → ₹XXX

Silk → ₹XXX

Satin → ₹XXX



The price should automatically change when the customer changes the fabric.



==================================================

2D LIVE PREVIEW

==================================================



Do NOT create a heavy 3D model.



Create a lightweight 2D customization preview.



Show:



- Front view

- Back view



Use a simple 2D mannequin/dress preview.



When the customer changes:



- Fabric

- Color

- Pattern

- Lace

- Flower

- Other add-ons

- Size



the preview should update accordingly.



The customer should be able to switch between:



[ FRONT VIEW ] [ BACK VIEW ]



The preview should also show how the selected design looks on different sizes.



==================================================

SIZES AND CUSTOM MEASUREMENTS

==================================================



Customer should have two options:



OPTION 1:

Select a standard size.



For example:



- XS

- S

- M

- L

- XL

- XXL

- Other sizes configured by Owner



OPTION 2:

Enter custom measurements.



Customer can manually enter their measurements.



For example:



- Shoulder

- Chest

- Waist

- Hip

- Armhole

- Sleeve length

- Dress length

- Other required measurements



The customer should be able to choose either standard size or custom measurements.



Save the selected measurements with the order.



==================================================

ADD-ONS

==================================================



Create an "Add-ons" section.



Owner can add different optional add-ons.



Examples:



- Lace

- Flower work

- Back rope

- Beads

- Extra design work

- Other decorative items



Each add-on must have its own price.



For example:



Lace → ₹100

Flower work → ₹150

Back rope → ₹50



These prices must be configurable from the Owner/Admin dashboard.



When the customer selects an add-on, automatically add its price to the total.



When the customer removes an add-on, automatically subtract its price.



==================================================

AUTOMATIC PRICE CALCULATION

==================================================



The system should automatically calculate:



Base dress/stitching price

+

Fabric price

+

Selected add-ons

+

Other applicable charges

=

Final Total Amount



The customer should clearly see the price breakdown.



Example:



Dress/Stitching: ₹1000

Fabric: ₹300

Lace: ₹100

Flower Work: ₹150

Total: ₹1550



Do not hard-code these prices.



Owner must be able to change them.



==================================================

BOOKING FEE

==================================================



For dress bookings/custom dress orders:



Booking fee = 10% of the final total amount.



Example:



Final order amount = ₹1550



Booking fee = ₹155



The system must automatically calculate this 10%.



Do NOT make the customer manually calculate or enter the booking fee.



Show:



Total Amount

Booking Fee (10%)

Remaining Amount



==================================================

PAYMENT

==================================================



Use UPI payment.



The payment does NOT need to happen inside the website.



The website should calculate the exact amount automatically and initiate/open the customer's available UPI payment application.



The customer may use:



- Google Pay

- PhonePe

- Paytm

- BHIM

- Any supported UPI application



The website should NOT ask for or store:



- UPI PIN

- Bank password

- Card PIN

- Banking credentials



The actual authentication should happen inside the customer's UPI/payment application.



The website should only handle the payment initiation and payment status.



==================================================

BOOKING CONFIRMATION

==================================================



After successful booking/payment:



Show a clear booking confirmation.



Do not create unnecessary complicated confirmation systems.



The customer should be able to see the booking/order inside "My Orders".



==================================================

ORDER TRACKING

==================================================



Each order should have a tracking/order ID.



Customer can open the order and see its current status.



For customized dresses, show progress such as:



1. Order Confirmed

2. Measurements Received

3. Design Confirmed

4. Stitching Started

5. Stitching Completed

6. Quality Check

7. Packed

8. Out for Delivery

9. Delivered



The Owner/Admin should be able to update the status.



When the Owner updates the status, it should automatically appear in the customer's order page.



Use a clean visual progress tracker/timeline.



==================================================

HELP DESK

==================================================



Add a Help Desk section inside Customer and Designer dashboards.



Use a lightweight chatbot/help assistant.



When opened, show:



"How can I help you?"



Provide options such as:



- Order details

- Track my order

- Payment help

- Customization help

- Delivery information

- Other help



The chatbot should answer based on the available project information.



Keep it simple and lightweight.



==================================================

CUSTOMER PROFILE

==================================================



Customer profile page should contain:



- Profile picture

- Name

- Email

- Phone number

- Address

- Saved preferences

- Orders

- Liked/Favorite products

- Previously viewed/ordered products where applicable



Customers should be able to like/favorite products.



Liked products should appear in their profile/favorites section.



==================================================

DESIGNER DASHBOARD

==================================================



Designer dashboard should have a structure similar to the Customer dashboard, but designer-specific content.



Main sections:



1. Home

2. Search

3. Products / Materials

4. Bookings

5. Orders

6. Profile

7. Help Desk



==================================================

DESIGNER HOME

==================================================



Designer should see products/materials required for designing and stitching.



Examples:



- Fabrics

- Beads

- Needles

- Threads

- Laces

- Buttons

- Decorative materials

- Flower materials

- Ropes

- Other tailoring/fashion materials



These products should be managed by Owner/Admin.



Designer should be able to browse, search and filter these products.



==================================================

DESIGNER BOOKINGS

==================================================



Designer should be able to view bookings/orders related to their work.



Show:



- Customer details

- Dress/design details

- Selected fabric

- Selected colors

- Selected pattern

- Selected add-ons

- Size

- Custom measurements

- Customer address

- Payment information

- Booking status

- Order status



Designer should be able to understand exactly what the customer requested.



==================================================

DESIGNER PROFILE

==================================================



Designer profile should contain:



- Profile picture

- Designer name

- Contact information

- Available services/materials

- Orders/bookings

- Favorites

- Other relevant information



==================================================

OWNER / ADMIN DASHBOARD

==================================================



Owner/Admin is the main management side of the website.



Owner dashboard should have:



1. Home

2. Add Products / Add Options

3. Orders

4. Bookings

5. Customers

6. Designers

7. Profile

8. Statistics



==================================================

OWNER HOME

==================================================



Owner should be able to see all products already added.



Show product cards/table with:



- Product image

- Product name

- Product code

- Category

- Price

- Availability

- Stock status

- Target audience

- Edit

- Delete

- Out of Stock / Available status



Add filters.



Owner should be able to filter products for:



- Designers

- Customers

- All



==================================================

ADD PRODUCT

==================================================



Owner should have an "Add Product" option.



When adding a product, allow:



- Product image/photo

- Product name

- Product code

- Description

- Product category

- Fabric

- Available colors

- Available sizes

- Season

- Usage/category

- Price

- Availability

- Stock status



For dresses, allow:



- Dress/stitching price

- Available fabrics

- Fabric-specific price

- Available colors

- Color combinations

- Patterns

- Available sizes

- Add-ons

- Add-on prices

- Season

- Occasion/category



==================================================

FABRIC MANAGEMENT

==================================================



Owner should be able to add/manage fabrics.



Each fabric should contain:



- Fabric name

- Fabric image

- Available colors

- Price

- Availability

- Season

- Suitable category/occasion



Example:



Cotton

- White

- Black

- Pink

- Blue

- etc.



Silk

- Red

- Green

- Gold

- Blue

- etc.



When a customer/designer selects a fabric, show only the colors available for that fabric.



==================================================

COLOR MANAGEMENT

==================================================



Owner should be able to add available colors.



Each fabric can have different available colors.



Customer should see the available colors dynamically based on the selected fabric.



==================================================

SEASON MANAGEMENT

==================================================



Owner should be able to add/manage seasons.



Examples:



- Summer

- Winter

- All Season



Products and fabrics can be assigned to one or more seasons.



==================================================

CATEGORY / OCCASION MANAGEMENT

==================================================



Owner should be able to add/manage categories such as:



- Traditional

- Party Wear

- Casual

- Festival

- Wedding

- Other categories



Customers and Designers should be able to filter products using these categories.



==================================================

ADD-ON MANAGEMENT

==================================================



Owner should be able to add/edit/delete add-ons.



Examples:



- Lace

- Flower Work

- Beads

- Back Rope

- Extra Embroidery

- Other decorative work



Each add-on should have:



- Name

- Image

- Description

- Price

- Availability



==================================================

PRODUCT EDITING

==================================================



Owner must be able to edit every product.



Options:



- Edit product name

- Edit product code

- Change price

- Change fabric

- Change available colors

- Change sizes

- Change season

- Change category

- Change add-ons

- Change image

- Mark Available

- Mark Out of Stock

- Remove product completely



Do not permanently delete immediately.



Show a confirmation before permanent deletion.



==================================================

OWNER ORDERS / BOOKINGS

==================================================



Owner should have an Orders/Bookings section.



There should be separate filters/switches for:



- Customer Orders

- Designer Orders

- All Orders



Owner should be able to switch between Customer and Designer orders easily.



For each order show:



- Order ID

- Customer/Designer name

- Product

- Amount

- Payment status

- Booking fee

- Remaining amount

- Address

- Current status

- Order date

- Delivery information



==================================================

ORDER STATUS MANAGEMENT

==================================================



Owner should be able to update order progress.



For dress orders:



- Order Confirmed

- Measurements Received

- Design Confirmed

- Stitching Started

- Stitching Completed

- Quality Check

- Packed

- Out for Delivery

- Delivered

- Cancelled



For product/material orders:



- Order Confirmed

- Processing

- Packed

- Out for Delivery

- Delivered

- Cancelled



When the Owner changes the status, the customer/designer should automatically see the updated status.



==================================================

OWNER STATISTICS DASHBOARD

==================================================



Owner dashboard should contain simple statistics.



Show:



- Total Orders

- Total Bookings

- Completed Orders

- Delivered Orders

- Cancelled Orders

- Pending Orders

- Total Sales

- Total Earnings

- Booking Fees Collected



Use simple cards and lightweight charts if possible.



Do not use heavy chart libraries.



Keep the statistics clean and easy to understand.



==================================================

OWNER PROFILE

==================================================



Owner profile should contain:



- Profile picture

- Owner name

- Email

- Phone number

- Business information

- Simple statistics summary



==================================================

ACCOUNT SWITCHING

==================================================



The system should clearly distinguish between:



Owner

Designer

Customer



Owner should be able to view/filter customer and designer orders from the Owner dashboard.



Do NOT allow customers or designers to access Owner/Admin pages.



Use proper role-based authorization.



==================================================

DATABASE

==================================================



Use a simple relational database structure.



Suggested entities/tables:



Users

Roles

Products

Dresses

Fabrics

Colors

Sizes

Categories

Seasons

Patterns

AddOns

Orders

OrderItems

Bookings

Measurements

Payments

OrderStatus

Favorites

Addresses



Create proper relationships between these entities.



Do not duplicate unnecessary data.



==================================================

TECHNOLOGY

==================================================



Because the target laptop has only 8 GB RAM and 64 GB storage, keep the project lightweight.



Preferred stack:



Frontend:

HTML

CSS

JavaScript



Backend:

PHP



Database:

MySQL



Use XAMPP for local development if required.



Avoid unnecessarily heavy frameworks.



If a framework is absolutely necessary, use a lightweight implementation.



The application must run smoothly on a low-spec laptop.



==================================================

UI / UX

==================================================



Design should look premium but simple.



Use:



- Elegant fashion theme

- Clean typography

- White/neutral background

- Subtle chrome/metallic accents

- Rounded cards

- Soft shadows

- Minimal glass effect

- Smooth hover animations

- Button hover effects

- Card hover effects

- Smooth page transitions

- Image hover effects



Do NOT use:



- Heavy 3D

- WebGL

- Excessive animations

- Large video backgrounds

- Extremely large images

- Resource-heavy effects



Animations should be short, smooth and lightweight.



The website should feel modern and premium without slowing down the laptop.



==================================================

RESPONSIVE DESIGN

==================================================



The website must work properly on:



- Laptop

- Desktop

- Tablet

- Mobile



Use responsive layouts.



==================================================

IMPORTANT FINAL REQUIREMENT

======Create a complete, modern, elegant and lightweight fashion designing and customization web application.



IMPORTANT:

This project must be lightweight and suitable for a low-performance government laptop with 8 GB RAM and 64 GB storage. Do NOT use heavy 3D rendering, WebGL, complex animations, or resource-heavy libraries. Use lightweight 2D previews, CSS animations, smooth hover effects and simple transitions only.



The website should have THREE roles:



1. OWNER / ADMIN

2. DESIGNER

3. CUSTOMER



There should be two types of public/login access:

- Owner/Admin login

- Customer/Designer login



After login, the system should identify the user's role and show the appropriate dashboard.



==================================================

PUBLIC LANDING PAGE

==================================================



When the website is opened, show a beautiful but lightweight fashion-themed landing page.



The design should be:

- Elegant

- Premium-looking

- Minimal

- Modern

- Clean

- Responsive

- Smooth

- Not overloaded with animations



Use subtle chrome/metallic visual effects, glass-like cards where appropriate, soft shadows, smooth hover animations and elegant transitions.



Do NOT make it heavy.



Landing page should contain:



- Logo / Brand name

- Home

- Dresses

- Fabrics

- Accessories

- Search

- Login



Hero section with a fashion-related image/visual and a tagline such as:



"Design. Customize. Create."

"Your Style, Your Choice."



Show featured dresses, fabrics, accessories and popular designs.



Customers should be able to browse available products before logging in if appropriate.



==================================================

LOGIN SYSTEM

==================================================



Create role-based authentication.



Customer and Designer should use the same login page but have different dashboards after login.



Owner/Admin should have a separate secure login.



Customer login → Customer Dashboard



Designer login → Designer Dashboard



Owner login → Owner/Admin Dashboard



The menus and content should automatically change according to the logged-in role.



==================================================

CUSTOMER DASHBOARD

==================================================



Customer dashboard should have:



1. Home

2. Search

3. Orders / My Orders

4. Profile

5. Help Desk / Chatbot



The overall layout can be similar to the Designer dashboard, but the content should be different according to the role.



HOME:



Show:

- Available dresses

- Available fabrics

- Handmade accessories

- Featured products

- New products

- Popular designs



SEARCH:



Customer should be able to search for dresses, fabrics, accessories and designs.



Provide filters such as:



- Season:

  - Summer

  - Winter

  - All Season



- Color



- Category / Occasion:

  - Traditional

  - Party Wear

  - Casual

  - Other suitable categories



- Fabric



- Dress type



The owner/admin should be able to create and manage these filter options.



==================================================

DRESS CUSTOMIZATION

==================================================



This is one of the MAIN FEATURES of the project.



When a customer selects a dress/frock design, open a detailed customization page.



For example:



Customer selects a frock.



The customer should be able to customize:



- Fabric

- Fabric color

- Color combination

- Pattern

- Lace

- Flower work

- Back rope

- Other available add-ons

- Size



Available fabrics can include:



- Cotton

- Silk

- Satin

- Other fabrics added by the owner



The owner should be able to add different fabrics and their prices.



Different fabrics can have different prices.



For example:



Cotton → ₹XXX

Silk → ₹XXX

Satin → ₹XXX



The price should automatically change when the customer changes the fabric.



==================================================

2D LIVE PREVIEW

==================================================



Do NOT create a heavy 3D model.



Create a lightweight 2D customization preview.



Show:



- Front view

- Back view



Use a simple 2D mannequin/dress preview.



When the customer changes:



- Fabric

- Color

- Pattern

- Lace

- Flower

- Other add-ons

- Size



the preview should update accordingly.



The customer should be able to switch between:



[ FRONT VIEW ] [ BACK VIEW ]



The preview should also show how the selected design looks on different sizes.



==================================================

SIZES AND CUSTOM MEASUREMENTS

==================================================



Customer should have two options:



OPTION 1:

Select a standard size.



For example:



- XS

- S

- M

- L

- XL

- XXL

- Other sizes configured by Owner



OPTION 2:

Enter custom measurements.



Customer can manually enter their measurements.



For example:



- Shoulder

- Chest

- Waist

- Hip

- Armhole

- Sleeve length

- Dress length

- Other required measurements



The customer should be able to choose either standard size or custom measurements.



Save the selected measurements with the order.



==================================================

ADD-ONS

==================================================



Create an "Add-ons" section.



Owner can add different optional add-ons.



Examples:



- Lace

- Flower work

- Back rope

- Beads

- Extra design work

- Other decorative items



Each add-on must have its own price.



For example:



Lace → ₹100

Flower work → ₹150

Back rope → ₹50



These prices must be configurable from the Owner/Admin dashboard.



When the customer selects an add-on, automatically add its price to the total.



When the customer removes an add-on, automatically subtract its price.



==================================================

AUTOMATIC PRICE CALCULATION

==================================================



The system should automatically calculate:



Base dress/stitching price

+

Fabric price

+

Selected add-ons

+

Other applicable charges

=

Final Total Amount



The customer should clearly see the price breakdown.



Example:



Dress/Stitching: ₹1000

Fabric: ₹300

Lace: ₹100

Flower Work: ₹150

Total: ₹1550



Do not hard-code these prices.



Owner must be able to change them.



==================================================

BOOKING FEE

==================================================



For dress bookings/custom dress orders:



Booking fee = 10% of the final total amount.



Example:



Final order amount = ₹1550



Booking fee = ₹155



The system must automatically calculate this 10%.



Do NOT make the customer manually calculate or enter the booking fee.



Show:



Total Amount

Booking Fee (10%)

Remaining Amount



==================================================

PAYMENT

==================================================



Use UPI payment.



The payment does NOT need to happen inside the website.



The website should calculate the exact amount automatically and initiate/open the customer's available UPI payment application.



The customer may use:



- Google Pay

- PhonePe

- Paytm

- BHIM

- Any supported UPI application



The website should NOT ask for or store:



- UPI PIN

- Bank password

- Card PIN

- Banking credentials



The actual authentication should happen inside the customer's UPI/payment application.



The website should only handle the payment initiation and payment status.



==================================================

BOOKING CONFIRMATION

==================================================



After successful booking/payment:



Show a clear booking confirmation.



Do not create unnecessary complicated confirmation systems.



The customer should be able to see the booking/order inside "My Orders".



==================================================

ORDER TRACKING

==================================================



Each order should have a tracking/order ID.



Customer can open the order and see its current status.



For customized dresses, show progress such as:



1. Order Confirmed

2. Measurements Received

3. Design Confirmed

4. Stitching Started

5. Stitching Completed

6. Quality Check

7. Packed

8. Out for Delivery

9. Delivered



The Owner/Admin should be able to update the status.



When the Owner updates the status, it should automatically appear in the customer's order page.



Use a clean visual progress tracker/timeline.



==================================================

HELP DESK

==================================================



Add a Help Desk section inside Customer and Designer dashboards.



Use a lightweight chatbot/help assistant.



When opened, show:



"How can I help you?"



Provide options such as:



- Order details

- Track my order

- Payment help

- Customization help

- Delivery information

- Other help



The chatbot should answer based on the available project information.



Keep it simple and lightweight.



==================================================

CUSTOMER PROFILE

==================================================



Customer profile page should contain:



- Profile picture

- Name

- Email

- Phone number

- Address

- Saved preferences

- Orders

- Liked/Favorite products

- Previously viewed/ordered products where applicable



Customers should be able to like/favorite products.



Liked products should appear in their profile/favorites section.



==================================================

DESIGNER DASHBOARD

==================================================



Designer dashboard should have a structure similar to the Customer dashboard, but designer-specific content.



Main sections:



1. Home

2. Search

3. Products / Materials

4. Bookings

5. Orders

6. Profile

7. Help Desk



==================================================

DESIGNER HOME

==================================================



Designer should see products/materials required for designing and stitching.



Examples:



- Fabrics

- Beads

- Needles

- Threads

- Laces

- Buttons

- Decorative materials

- Flower materials

- Ropes

- Other tailoring/fashion materials



These products should be managed by Owner/Admin.



Designer should be able to browse, search and filter these products.



==================================================

DESIGNER BOOKINGS

==================================================



Designer should be able to view bookings/orders related to their work.



Show:



- Customer details

- Dress/design details

- Selected fabric

- Selected colors

- Selected pattern

- Selected add-ons

- Size

- Custom measurements

- Customer address

- Payment information

- Booking status

- Order status



Designer should be able to understand exactly what the customer requested.



==================================================

DESIGNER PROFILE

==================================================



Designer profile should contain:



- Profile picture

- Designer name

- Contact information

- Available services/materials

- Orders/bookings

- Favorites

- Other relevant information



==================================================

OWNER / ADMIN DASHBOARD

==================================================



Owner/Admin is the main management side of the website.



Owner dashboard should have:



1. Home

2. Add Products / Add Options

3. Orders

4. Bookings

5. Customers

6. Designers

7. Profile

8. Statistics



==================================================

OWNER HOME

==================================================



Owner should be able to see all products already added.



Show product cards/table with:



- Product image

- Product name

- Product code

- Category

- Price

- Availability

- Stock status

- Target audience

- Edit

- Delete

- Out of Stock / Available status



Add filters.



Owner should be able to filter products for:



- Designers

- Customers

- All



==================================================

ADD PRODUCT

==================================================



Owner should have an "Add Product" option.



When adding a product, allow:



- Product image/photo

- Product name

- Product code

- Description

- Product category

- Fabric

- Available colors

- Available sizes

- Season

- Usage/category

- Price

- Availability

- Stock status



For dresses, allow:



- Dress/stitching price

- Available fabrics

- Fabric-specific price

- Available colors

- Color combinations

- Patterns

- Available sizes

- Add-ons

- Add-on prices

- Season

- Occasion/category



==================================================

FABRIC MANAGEMENT

==================================================



Owner should be able to add/manage fabrics.



Each fabric should contain:



- Fabric name

- Fabric image

- Available colors

- Price

- Availability

- Season

- Suitable category/occasion



Example:



Cotton

- White

- Black

- Pink

- Blue

- etc.



Silk

- Red

- Green

- Gold

- Blue

- etc.



When a customer/designer selects a fabric, show only the colors available for that fabric.



==================================================

COLOR MANAGEMENT

==================================================



Owner should be able to add available colors.



Each fabric can have different available colors.



Customer should see the available colors dynamically based on the selected fabric.



==================================================

SEASON MANAGEMENT

==================================================



Owner should be able to add/manage seasons.



Examples:



- Summer

- Winter

- All Season



Products and fabrics can be assigned to one or more seasons.



==================================================

CATEGORY / OCCASION MANAGEMENT

==================================================



Owner should be able to add/manage categories such as:



- Traditional

- Party Wear

- Casual

- Festival

- Wedding

- Other categories



Customers and Designers should be able to filter products using these categories.



==================================================

ADD-ON MANAGEMENT

==================================================



Owner should be able to add/edit/delete add-ons.



Examples:



- Lace

- Flower Work

- Beads

- Back Rope

- Extra Embroidery

- Other decorative work



Each add-on should have:



- Name

- Image

- Description

- Price

- Availability



==================================================

PRODUCT EDITING

==================================================



Owner must be able to edit every product.



Options:



- Edit product name

- Edit product code

- Change price

- Change fabric

- Change available colors

- Change sizes

- Change season

- Change category

- Change add-ons

- Change image

- Mark Available

- Mark Out of Stock

- Remove product completely



Do not permanently delete immediately.



Show a confirmation before permanent deletion.



==================================================

OWNER ORDERS / BOOKINGS

==================================================



Owner should have an Orders/Bookings section.



There should be separate filters/switches for:



- Customer Orders

- Designer Orders

- All Orders



Owner should be able to switch between Customer and Designer orders easily.



For each order show:



- Order ID

- Customer/Designer name

- Product

- Amount

- Payment status

- Booking fee

- Remaining amount

- Address

- Current status

- Order date

- Delivery information



==================================================

ORDER STATUS MANAGEMENT

==================================================



Owner should be able to update order progress.



For dress orders:



- Order Confirmed

- Measurements Received

- Design Confirmed

- Stitching Started

- Stitching Completed

- Quality Check

- Packed

- Out for Delivery

- Delivered

- Cancelled



For product/material orders:



- Order Confirmed

- Processing

- Packed

- Out for Delivery

- Delivered

- Cancelled



When the Owner changes the status, the customer/designer should automatically see the updated status.



==================================================

OWNER STATISTICS DASHBOARD

==================================================



Owner dashboard should contain simple statistics.



Show:



- Total Orders

- Total Bookings

- Completed Orders

- Delivered Orders

- Cancelled Orders

- Pending Orders

- Total Sales

- Total Earnings

- Booking Fees Collected



Use simple cards and lightweight charts if possible.



Do not use heavy chart libraries.



Keep the statistics clean and easy to understand.



==================================================

OWNER PROFILE

==================================================



Owner profile should contain:



- Profile picture

- Owner name

- Email

- Phone number

- Business information

- Simple statistics summary



==================================================

ACCOUNT SWITCHING

==================================================



The system should clearly distinguish between:



Owner

Designer

Customer



Owner should be able to view/filter customer and designer orders from the Owner dashboard.



Do NOT allow customers or designers to access Owner/Admin pages.



Use proper role-based authorization.



==================================================

DATABASE

==================================================



Use a simple relational database structure.



Suggested entities/tables:



Users

Roles

Products

Dresses

Fabrics

Colors

Sizes

Categories

Seasons

Patterns

AddOns

Orders

OrderItems

Bookings

Measurements

Payments

OrderStatus

Favorites

Addresses



Create proper relationships between these entities.



Do not duplicate unnecessary data.



==================================================

TECHNOLOGY

==================================================



Because the target laptop has only 8 GB RAM and 64 GB storage, keep the project lightweight.



Preferred stack:



Frontend:

HTML

CSS

JavaScript



Backend:

PHP



Database:

MySQL



Use XAMPP for local development if required.



Avoid unnecessarily heavy frameworks.



If a framework is absolutely necessary, use a lightweight implementation.



The application must run smoothly on a low-spec laptop.



==================================================

UI / UX

==================================================



Design should look premium but simple.



Use:



- Elegant fashion theme

- Clean typography

- White/neutral background

- Subtle chrome/metallic accents

- Rounded cards

- Soft shadows

- Minimal glass effect

- Smooth hover animations

- Button hover effects

- Card hover effects

- Smooth page transitions

- Image hover effects



Do NOT use:



- Heavy 3D

- WebGL

- Excessive animations

- Large video backgrounds

- Extremely large images

- Resource-heavy effects



Animations should be short, smooth and lightweight.



The website should feel modern and premium without slowing down the laptop.



==================================================

RESPONSIVE DESIGN

==================================================



The website must work properly on:



- Laptop

- Desktop

- Tablet

- Mobile



Use responsive layouts.



==================================================

IMPORTANT FINAL REQUIREMENT

==================================================



The final project should feel like one complete professional fashion platform where:



OWNER manages products, fabrics, colors, sizes, seasons, categories, add-ons, prices, customers, designers, orders, bookings and order status.



DESIGNER can browse and order fashion materials such as fabrics, beads, needles, laces and other required products, and can manage/view relevant bookings and orders.



CUSTOMER can browse dresses, select a dress, customize fabric, color, pattern, size and add-ons, enter measurements, see a lightweight 2D front/back preview, automatically calculate the price, pay the 10% booking fee through UPI, and track the order progress.



Keep everything simple, lightweight, elegant, responsive and easy to use.



Do not create unnecessary features that were not requested.

Focus on the above requirements and make the application functional, not just a visual mockup.============================================



The final project should feel like one complete professional fashion platform where:



OWNER manages products, fabrics, colors, sizes, seasons, categories, add-ons, prices, customers, designers, orders, bookings and order status.



DESIGNER can browse and order fashion materials such as fabrics, beads, needles, laces and other required products, and can manage/view relevant bookings and orders.



CUSTOMER can browse dresses, select a dress, customize fabric, color, pattern, size and add-ons, enter measurements, see a lightweight 2D front/back preview, automatically calculate the price, pay the 10% booking fee through UPI, and track the order progress.



Keep everything simple, lightweight, elegant, responsive and easy to use.



Do not create unnecessary features that were not requested.

Focus on the above requirements and make the application functional, not just a visual mockup.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/bf8f4b31-ee1c-405d-9fb3-fe20b70c0404).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
