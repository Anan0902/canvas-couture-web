# College Project Report Documents — Atelier Aura

Generate the same four-document set the user uploaded (from Priya's speech-to-text project) but written for the Atelier Aura fashion designing & customization web app. All files as **Word (DOCX)** in Files.

## Details to use

- Student: **Ananthika B**, Reg. No: **25P34A001**
- Guide: **Ms. Chrish Lancy, M.Sc.**, Assistant Professor, School of Science
- College: Park's College (Autonomous), Tirupur – 641 605 (same as the sample: NAAC "A", Bharathiar University, AICTE/UGC lines)
- Degree: Bachelor of Science in Computer Science
- Project title: **"FASHION DESIGNING AND CUSTOMIZATION WEB APPLICATION"** (app name Atelier Aura)
- Submission month/year: editable placeholder ("MAY 2026") — user can change in Word

## Files to create (in /mnt/documents)

1. `ananthika_front_page.docx` — title front page (with college logo if extractable from the uploaded PDF, otherwise a clean text layout), Certificate (institution style), Guide's certificate page, Declaration, Acknowledgement (college office-bearer names kept), Synopsis describing the fashion app.
2. `ananthika_abstract.docx` — one-page "MINI PROJECT" abstract in the same style: objective, how the system works (customer customizes fabric/colour/pattern/add-ons/size, AI preview, server-computed pricing, 10% booking fee, UPI booking, three roles, order tracking), closing conclusion sentence.
3. `ananthika_table_of_contents.docx` — the chapter/particulars/page-number table, same structure: Ch1 Introduction (org profile, hardware/software spec, about the software), Ch2 System Study (existing/proposed), Ch3 System Design & Development (input/output/database design, modules), Ch4 Testing & Implementation, Ch5 Conclusion, Bibliography, Appendices A–E.
4. `ananthika_report.docx` — full chapter report (~30 pages):
   - Ch1 Introduction; organizational profile (adapted); hardware spec; software spec: **React.js + TypeScript, Tailwind CSS, TanStack Start, PostgreSQL (cloud database), AI image generation**; overviews of each technology.
   - Ch2 System study: existing system (phone/in-person tailoring, paper measurements, no preview, manual price quoting) + drawbacks; proposed system + features.
   - Ch3 System design: input design (customization form, measurements, buyer details), output design (AI preview, price breakdown, order tracking, dashboards), database design (tables: profiles, user_roles, fabrics, fabric_colors, colors, patterns, sizes, seasons, categories, addons, products, product_fabrics, product_addons, orders, order_status_history, favorites — with the 3NF normalization discussion), module descriptions (Customer, Designer, Owner, Customization & AI Preview, Pricing & UPI Booking, Order Tracking, Help Desk).
   - Ch4 Testing & implementation (unit/integration/user acceptance written around the real flows).
   - Ch5 Conclusion; Bibliography (React, TanStack, PostgreSQL, Tailwind docs).
   - Appendices: A. Data flow diagrams (Level 0/1/2 as diagrams), B. Table structures (real column lists), C. Sample code (real excerpts: pricing/booking-fee logic, order placement, AI preview prompt), D. Sample input (app screenshots), E. Sample output (app screenshots).

## Screenshots for appendices D & E

Capture live app pages with Playwright (home, catalogue, customize page with AI preview, order tracking, owner dashboard, statistics) into /tmp, then embed as labelled figures (FIG 1 … FIG n) in the DOCX.

## Build approach

- Copy the docx skill scripts to /tmp, write one Node script per document using `docx` (docx-js), A4 page size, Times New Roman-style serif, same heading/bold structure as the samples.
- Reuse facts from the existing `atelier-aura-app-summary.md` and the app source so the report matches what was actually built.
- Validate each DOCX with the skill validator, convert to PDF, render pages to images, and visually QA every page (layout, no clipped/overlapping text, correct names/numbering) before delivering. Fix and re-run until clean.
