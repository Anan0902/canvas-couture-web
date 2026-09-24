
-- ROLES ---------------------------------------------------------------
CREATE TYPE public.app_role AS ENUM ('owner','designer','customer');

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  address text NOT NULL DEFAULT '',
  avatar_url text,
  bio text NOT NULL DEFAULT '',
  preferences text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  requested text;
  final_role public.app_role;
BEGIN
  INSERT INTO public.profiles (id, full_name, email, phone)
  VALUES (NEW.id,
          COALESCE(NEW.raw_user_meta_data->>'full_name',''),
          COALESCE(NEW.email,''),
          COALESCE(NEW.raw_user_meta_data->>'phone',''))
  ON CONFLICT (id) DO NOTHING;

  requested := COALESCE(NEW.raw_user_meta_data->>'role','customer');
  IF lower(COALESCE(NEW.email,'')) = 'owner@atelier.app' THEN
    final_role := 'owner';
  ELSIF requested = 'designer' THEN
    final_role := 'designer';
  ELSE
    final_role := 'customer';
  END IF;

  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, final_role)
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE POLICY "own profile read" ON public.profiles FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.has_role(auth.uid(),'owner') OR public.has_role(auth.uid(),'designer'));
CREATE POLICY "own profile write" ON public.profiles FOR UPDATE TO authenticated
  USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());

CREATE POLICY "roles read" ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(),'owner'));

-- CATALOGUE -----------------------------------------------------------
CREATE TABLE public.seasons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.sizes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  sort_order int NOT NULL DEFAULT 0,
  scale numeric NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.colors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  hex text NOT NULL DEFAULT '#cccccc',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.patterns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  style_key text NOT NULL DEFAULT 'plain',
  price numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.fabrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  image_url text,
  price numeric NOT NULL DEFAULT 0,
  available boolean NOT NULL DEFAULT true,
  season text NOT NULL DEFAULT 'All Season',
  category text NOT NULL DEFAULT 'Casual',
  description text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.fabric_colors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fabric_id uuid NOT NULL REFERENCES public.fabrics(id) ON DELETE CASCADE,
  color_id uuid NOT NULL REFERENCES public.colors(id) ON DELETE CASCADE,
  UNIQUE (fabric_id, color_id)
);
CREATE TABLE public.addons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  image_url text,
  price numeric NOT NULL DEFAULT 0,
  available boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  kind text NOT NULL DEFAULT 'dress',          -- dress | accessory | material | fabric
  audience text NOT NULL DEFAULT 'customer',   -- customer | designer | all
  category text NOT NULL DEFAULT 'Casual',
  season text NOT NULL DEFAULT 'All Season',
  dress_type text NOT NULL DEFAULT '',
  image_url text,
  price numeric NOT NULL DEFAULT 0,            -- base / stitching price
  available boolean NOT NULL DEFAULT true,
  in_stock boolean NOT NULL DEFAULT true,
  featured boolean NOT NULL DEFAULT false,
  popular boolean NOT NULL DEFAULT false,
  silhouette text NOT NULL DEFAULT 'frock',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.product_fabrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  fabric_id uuid NOT NULL REFERENCES public.fabrics(id) ON DELETE CASCADE,
  UNIQUE (product_id, fabric_id)
);
CREATE TABLE public.product_addons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  addon_id uuid NOT NULL REFERENCES public.addons(id) ON DELETE CASCADE,
  UNIQUE (product_id, addon_id)
);

GRANT SELECT ON public.seasons, public.categories, public.sizes, public.colors, public.patterns,
  public.fabrics, public.fabric_colors, public.addons, public.products,
  public.product_fabrics, public.product_addons TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.seasons, public.categories, public.sizes, public.colors,
  public.patterns, public.fabrics, public.fabric_colors, public.addons, public.products,
  public.product_fabrics, public.product_addons TO authenticated;
GRANT ALL ON public.seasons, public.categories, public.sizes, public.colors, public.patterns,
  public.fabrics, public.fabric_colors, public.addons, public.products,
  public.product_fabrics, public.product_addons TO service_role;

ALTER TABLE public.seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.colors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fabrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fabric_colors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_fabrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_addons ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['seasons','categories','sizes','colors','patterns','fabrics','fabric_colors','addons','products','product_fabrics','product_addons']
  LOOP
    EXECUTE format('CREATE POLICY "public read %1$s" ON public.%1$I FOR SELECT USING (true)', t);
    EXECUTE format('CREATE POLICY "owner manage %1$s" ON public.%1$I FOR ALL TO authenticated USING (public.has_role(auth.uid(),''owner'')) WITH CHECK (public.has_role(auth.uid(),''owner''))', t);
  END LOOP;
END $$;

-- FAVORITES -----------------------------------------------------------
CREATE TABLE public.favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, product_id)
);
GRANT SELECT, INSERT, DELETE ON public.favorites TO authenticated;
GRANT ALL ON public.favorites TO service_role;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own favorites" ON public.favorites FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- ORDERS --------------------------------------------------------------
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_no text NOT NULL UNIQUE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  buyer_role text NOT NULL DEFAULT 'customer',   -- customer | designer
  buyer_name text NOT NULL DEFAULT '',
  buyer_phone text NOT NULL DEFAULT '',
  address text NOT NULL DEFAULT '',
  order_kind text NOT NULL DEFAULT 'dress',      -- dress | material
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  product_name text NOT NULL DEFAULT '',
  customization jsonb NOT NULL DEFAULT '{}'::jsonb,
  measurements jsonb NOT NULL DEFAULT '{}'::jsonb,
  price_breakdown jsonb NOT NULL DEFAULT '[]'::jsonb,
  total numeric NOT NULL DEFAULT 0,
  booking_fee numeric NOT NULL DEFAULT 0,
  remaining numeric NOT NULL DEFAULT 0,
  payment_status text NOT NULL DEFAULT 'pending',
  payment_ref text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'Order Confirmed',
  delivery_note text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.order_status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  status text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
GRANT SELECT, INSERT ON public.order_status_history TO authenticated;
GRANT ALL ON public.order_status_history TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "orders read" ON public.orders FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(),'owner') OR public.has_role(auth.uid(),'designer'));
CREATE POLICY "orders insert own" ON public.orders FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "orders update" ON public.orders FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'owner') OR user_id = auth.uid())
  WITH CHECK (public.has_role(auth.uid(),'owner') OR user_id = auth.uid());

CREATE POLICY "history read" ON public.order_status_history FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id
    AND (o.user_id = auth.uid() OR public.has_role(auth.uid(),'owner') OR public.has_role(auth.uid(),'designer'))));
CREATE POLICY "history insert" ON public.order_status_history FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id
    AND (o.user_id = auth.uid() OR public.has_role(auth.uid(),'owner'))));

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER orders_touch BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- SEED ----------------------------------------------------------------
INSERT INTO public.seasons (name) VALUES ('Summer'),('Winter'),('All Season');
INSERT INTO public.categories (name) VALUES ('Traditional'),('Party Wear'),('Casual'),('Festival'),('Wedding');
INSERT INTO public.sizes (name, sort_order, scale) VALUES
  ('XS',1,0.88),('S',2,0.94),('M',3,1.0),('L',4,1.06),('XL',5,1.12),('XXL',6,1.18);
INSERT INTO public.colors (name, hex) VALUES
  ('Ivory','#f4efe6'),('Blush Pink','#e8b4bc'),('Midnight Black','#1c1c1e'),('Royal Blue','#2b4c9b'),
  ('Emerald','#1f7a5a'),('Ruby Red','#9b1f34'),('Gold','#c9a227'),('Lavender','#b9a7d6'),
  ('Sky Blue','#8fc1e3'),('Mustard','#d6a327');
INSERT INTO public.patterns (name, style_key, price) VALUES
  ('Plain','plain',0),('Fine Stripes','stripes',80),('Polka Dots','dots',90),
  ('Floral Print','floral',150),('Checks','checks',100);
INSERT INTO public.fabrics (name, price, season, category, description) VALUES
  ('Cotton',300,'Summer','Casual','Breathable everyday cotton.'),
  ('Silk',900,'All Season','Wedding','Lustrous pure silk with a soft drape.'),
  ('Satin',650,'All Season','Party Wear','Smooth satin with a gentle sheen.'),
  ('Georgette',480,'Summer','Party Wear','Light, flowing georgette.'),
  ('Velvet',1100,'Winter','Festival','Rich winter velvet.');

INSERT INTO public.fabric_colors (fabric_id, color_id)
SELECT f.id, c.id FROM public.fabrics f JOIN public.colors c ON true
WHERE (f.name='Cotton' AND c.name IN ('Ivory','Blush Pink','Sky Blue','Mustard','Midnight Black'))
   OR (f.name='Silk' AND c.name IN ('Ruby Red','Emerald','Gold','Royal Blue','Ivory'))
   OR (f.name='Satin' AND c.name IN ('Blush Pink','Midnight Black','Royal Blue','Gold'))
   OR (f.name='Georgette' AND c.name IN ('Lavender','Sky Blue','Ivory','Blush Pink'))
   OR (f.name='Velvet' AND c.name IN ('Ruby Red','Emerald','Midnight Black','Royal Blue'));

INSERT INTO public.addons (name, description, price) VALUES
  ('Lace Trim','Delicate lace along the hem and sleeves.',100),
  ('Flower Work','Hand-stitched fabric flowers.',150),
  ('Back Rope','Decorative tie-up rope at the back.',50),
  ('Bead Work','Fine bead detailing on the bodice.',200),
  ('Extra Embroidery','Additional thread embroidery panel.',250);

INSERT INTO public.products (name, code, description, kind, audience, category, season, dress_type, price, featured, popular, silhouette) VALUES
  ('Aurora Frock','DR-001','A flared frock with a fitted bodice.','dress','customer','Party Wear','Summer','Frock',1000,true,true,'frock'),
  ('Rani Anarkali','DR-002','Floor-length anarkali with flared panels.','dress','customer','Traditional','All Season','Anarkali',1800,true,true,'anarkali'),
  ('Lumiere Gown','DR-003','Elegant evening gown with a sweeping hem.','dress','customer','Wedding','Winter','Gown',2500,true,false,'gown'),
  ('Everyday Kurti','DR-004','Straight-cut kurti for daily wear.','dress','customer','Casual','Summer','Kurti',700,false,true,'kurti'),
  ('Festive Lehenga','DR-005','Festive lehenga with a flared skirt.','dress','customer','Festival','Winter','Lehenga',3200,true,false,'lehenga'),
  ('Sunday Wrap Dress','DR-006','Relaxed wrap dress with a tie waist.','dress','customer','Casual','All Season','Wrap Dress',1200,false,true,'frock');

INSERT INTO public.products (name, code, description, kind, audience, category, season, price, featured, popular) VALUES
  ('Handmade Pearl Clutch','AC-001','Hand-beaded pearl clutch.','accessory','customer','Party Wear','All Season',850,true,true),
  ('Silk Thread Jhumkas','AC-002','Handmade silk thread earrings.','accessory','customer','Traditional','All Season',450,false,true),
  ('Embroidered Potli Bag','AC-003','Hand-embroidered potli bag.','accessory','customer','Festival','All Season',650,true,false),
  ('Beaded Hair Pins (Set of 4)','AC-004','Handmade beaded hair pins.','accessory','customer','Casual','Summer',250,false,false),
  ('Glass Bead Pack (500g)','MT-001','Assorted glass beads for detailing.','material','designer','Casual','All Season',320,false,true),
  ('Hand Sewing Needle Set','MT-002','Assorted sizes, stainless steel.','material','designer','Casual','All Season',120,false,false),
  ('Polyester Thread Box (24 shades)','MT-003','Everyday stitching threads.','material','designer','Casual','All Season',540,true,true),
  ('Chantilly Lace Roll (10m)','MT-004','Fine lace roll for trims.','material','designer','Party Wear','All Season',760,true,false),
  ('Shell Button Assortment','MT-005','Natural shell buttons, 100 pieces.','material','designer','Casual','All Season',290,false,false),
  ('Fabric Flower Kit','MT-006','Pre-cut petals and centres.','material','designer','Festival','All Season',430,false,true),
  ('Satin Rope Spool (20m)','MT-007','Back-rope and tie-up spool.','material','designer','Casual','All Season',180,false,false),
  ('Sequin Trim Roll (5m)','MT-008','Decorative sequin trim.','material','designer','Party Wear','Winter','610'::numeric,false,false);

INSERT INTO public.product_fabrics (product_id, fabric_id)
SELECT p.id, f.id FROM public.products p JOIN public.fabrics f ON true WHERE p.kind = 'dress';
INSERT INTO public.product_addons (product_id, addon_id)
SELECT p.id, a.id FROM public.products p JOIN public.addons a ON true WHERE p.kind = 'dress';

INSERT INTO public.orders (order_no, buyer_role, buyer_name, buyer_phone, address, order_kind, product_name,
  customization, measurements, price_breakdown, total, booking_fee, remaining, payment_status, status)
VALUES
 ('AT-100001','customer','Meera Nair','9876500011','12 Rose Lane, Kochi','dress','Aurora Frock',
  '{"fabric":"Cotton","color":"Blush Pink","pattern":"Floral Print","addons":["Lace Trim"],"size":"M"}',
  '{"mode":"standard"}',
  '[{"label":"Stitching","amount":1000},{"label":"Fabric: Cotton","amount":300},{"label":"Pattern: Floral Print","amount":150},{"label":"Lace Trim","amount":100}]',
  1550,155,1395,'paid','Stitching Started'),
 ('AT-100002','customer','Divya Raj','9876500022','44 Palm Street, Chennai','dress','Rani Anarkali',
  '{"fabric":"Silk","color":"Ruby Red","pattern":"Plain","addons":["Bead Work","Flower Work"],"size":"L"}',
  '{"mode":"custom","shoulder":15,"chest":36,"waist":30,"hip":38,"armhole":16,"sleeve_length":18,"dress_length":52}',
  '[{"label":"Stitching","amount":1800},{"label":"Fabric: Silk","amount":900},{"label":"Bead Work","amount":200},{"label":"Flower Work","amount":150}]',
  3050,305,2745,'paid','Quality Check'),
 ('AT-100003','designer','Studio Kala','9876500033','7 Textile Road, Bengaluru','material','Chantilly Lace Roll (10m)',
  '{"quantity":2}','{}','[{"label":"Chantilly Lace Roll (10m) x2","amount":1520}]',
  1520,152,1368,'paid','Packed'),
 ('AT-100004','customer','Anita George','9876500044','19 Hill View, Pune','dress','Lumiere Gown',
  '{"fabric":"Velvet","color":"Emerald","pattern":"Plain","addons":["Extra Embroidery"],"size":"S"}',
  '{"mode":"standard"}',
  '[{"label":"Stitching","amount":2500},{"label":"Fabric: Velvet","amount":1100},{"label":"Extra Embroidery","amount":250}]',
  3850,385,3465,'paid','Delivered'),
 ('AT-100005','designer','Threadcraft','9876500055','88 Market Lane, Hyderabad','material','Polyester Thread Box (24 shades)',
  '{"quantity":1}','{}','[{"label":"Polyester Thread Box (24 shades) x1","amount":540}]',
  540,54,486,'pending','Order Confirmed');

INSERT INTO public.order_status_history (order_id, status)
SELECT id, 'Order Confirmed' FROM public.orders;
