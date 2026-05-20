-- categories
INSERT INTO categories (name) VALUES
  ('Electronics'),
  ('Furniture'),
  ('Lighting'),
  ('Accessories'),
  ('Outdoor')
ON CONFLICT (name) DO NOTHING;


-- users
INSERT INTO users (email, password_hash, name) VALUES
  ('carey41@veltra.dev', '$2b$10$zHp8EBu.z7hbeOPUMeaKhujUVoiRmbL346SJuXoMeZnL76Ys0DCK6', 'Jennie McClure'),
  ('ana.kemmer@veltra.dev', '$2b$10$zHp8EBu.z7hbeOPUMeaKhujUVoiRmbL346SJuXoMeZnL76Ys0DCK6', 'Verda Lang'),
  ('hugo_schuppe28@veltra.dev', '$2b$10$zHp8EBu.z7hbeOPUMeaKhujUVoiRmbL346SJuXoMeZnL76Ys0DCK6', 'Arely Vandervort'),
  ('henry.gutkowski82@veltra.dev', '$2b$10$zHp8EBu.z7hbeOPUMeaKhujUVoiRmbL346SJuXoMeZnL76Ys0DCK6', 'Nona Wyman'),
  ('marilyn.reynolds@veltra.dev', '$2b$10$zHp8EBu.z7hbeOPUMeaKhujUVoiRmbL346SJuXoMeZnL76Ys0DCK6', 'Susie Gerhold'),
  ('rodrigo95@veltra.dev', '$2b$10$zHp8EBu.z7hbeOPUMeaKhujUVoiRmbL346SJuXoMeZnL76Ys0DCK6', 'Erica Mraz'),
  ('presley.predovic@veltra.dev', '$2b$10$zHp8EBu.z7hbeOPUMeaKhujUVoiRmbL346SJuXoMeZnL76Ys0DCK6', 'Ann Schuster-Jaskolski'),
  ('bruce_cassin@veltra.dev', '$2b$10$zHp8EBu.z7hbeOPUMeaKhujUVoiRmbL346SJuXoMeZnL76Ys0DCK6', 'Rosie Lemke'),
  ('ivah.block85@veltra.dev', '$2b$10$zHp8EBu.z7hbeOPUMeaKhujUVoiRmbL346SJuXoMeZnL76Ys0DCK6', 'Donnie Boehm'),
  ('loretta98@veltra.dev', '$2b$10$zHp8EBu.z7hbeOPUMeaKhujUVoiRmbL346SJuXoMeZnL76Ys0DCK6', 'Karolann McCullough'),
  ('marian_ortiz67@veltra.dev', '$2b$10$zHp8EBu.z7hbeOPUMeaKhujUVoiRmbL346SJuXoMeZnL76Ys0DCK6', 'Jodi Welch'),
  ('clayton.wuckert63@veltra.dev', '$2b$10$zHp8EBu.z7hbeOPUMeaKhujUVoiRmbL346SJuXoMeZnL76Ys0DCK6', 'Ruben Wolf'),
  ('destiny_jacobs@veltra.dev', '$2b$10$zHp8EBu.z7hbeOPUMeaKhujUVoiRmbL346SJuXoMeZnL76Ys0DCK6', 'Ocie Kling'),
  ('price.bartell94@veltra.dev', '$2b$10$zHp8EBu.z7hbeOPUMeaKhujUVoiRmbL346SJuXoMeZnL76Ys0DCK6', 'Alberta Wintheiser'),
  ('alfred.ortiz14@veltra.dev', '$2b$10$zHp8EBu.z7hbeOPUMeaKhujUVoiRmbL346SJuXoMeZnL76Ys0DCK6', 'Raymond Langosh'),
  ('cameron.willms56@veltra.dev', '$2b$10$zHp8EBu.z7hbeOPUMeaKhujUVoiRmbL346SJuXoMeZnL76Ys0DCK6', 'Brian Stoltenberg'),
  ('lester_oconner@veltra.dev', '$2b$10$zHp8EBu.z7hbeOPUMeaKhujUVoiRmbL346SJuXoMeZnL76Ys0DCK6', 'Mr. Francesco Wintheiser IV'),
  ('delores.white70@veltra.dev', '$2b$10$zHp8EBu.z7hbeOPUMeaKhujUVoiRmbL346SJuXoMeZnL76Ys0DCK6', 'Mr. Margarett Pacocha'),
  ('silvia_zemlak@veltra.dev', '$2b$10$zHp8EBu.z7hbeOPUMeaKhujUVoiRmbL346SJuXoMeZnL76Ys0DCK6', 'Therese Prohaska'),
  ('wade.lowe35@veltra.dev', '$2b$10$zHp8EBu.z7hbeOPUMeaKhujUVoiRmbL346SJuXoMeZnL76Ys0DCK6', 'Leo Skiles')
ON CONFLICT (email) DO NOTHING;


-- products
INSERT INTO products (name, description, image_url, category_id) VALUES
  ('Compact Cable Organizer', 'The Reactive zero administration encryption Tuna offers reliable performance and showy design', 'https://picsum.photos/seed/CFefzx6U/600/400', 4),
  ('Essential Monitor Stand', 'Elegant Shoes designed with Metal for better performance', 'https://picsum.photos/seed/a2QMPJkf/600/400', 4),
  ('Sleek Humidifier', 'The Freeda Tuna is the latest in a series of runny products from Armstrong - Lemke', 'https://picsum.photos/seed/SFqR1V8w/600/400', 4),
  ('Sleek Standing Desk', 'Discover the sudden new Computer with an exciting mix of Ceramic ingredients', 'https://picsum.photos/seed/u9C7MXj8/600/400', 3),
  ('Compact Monitor Stand', 'Featuring Lutetium-enhanced technology, our Car offers unparalleled illiterate performance', 'https://picsum.photos/seed/b29A81Nl/600/400', 1),
  ('Compact Wall Clock', 'New Hat model with 48 GB RAM, 87 GB storage, and tangible features', 'https://picsum.photos/seed/m7L09tUP/600/400', 2),
  ('Essential Standing Desk', 'Ergonomic Keyboard made with Rubber for all-day marvelous support', 'https://picsum.photos/seed/RsJppJSp/600/400', 4),
  ('Smart Cable Organizer', 'Savor the spicy essence in our Gloves, designed for warm culinary adventures', 'https://picsum.photos/seed/wl7JAtCi/600/400', 1),
  ('Classic Standing Desk', 'Introducing the Albania-inspired Bike, blending tired style with local craftsmanship', 'https://picsum.photos/seed/usKLEL5s/600/400', 5),
  ('Sleek Cable Organizer', 'Experience the lime brilliance of our Gloves, perfect for legal environments', 'https://picsum.photos/seed/QxYHi2bH/600/400', 1),
  ('Portable Desk Lamp', 'Introducing the Bulgaria-inspired Computer, blending thorough style with local craftsmanship', 'https://picsum.photos/seed/2CDabyvL/600/400', 2),
  ('Compact Pendant Light', 'Discover the sea lion-like agility of our Shoes, perfect for scientific users', 'https://picsum.photos/seed/cT7TAabZ/600/400', 5),
  ('Sleek Cable Organizer', 'Experience the violet brilliance of our Salad, perfect for slushy environments', 'https://picsum.photos/seed/V8tHvUyR/600/400', 1),
  ('Compact Smart Plug', 'Featuring Selenium-enhanced technology, our Mouse offers unparalleled short-term performance', 'https://picsum.photos/seed/SGL8Fa9s/600/400', 5),
  ('Compact Wall Clock', 'Introducing the Samoa-inspired Table, blending ornate style with local craftsmanship', 'https://picsum.photos/seed/NSSQGge0/600/400', 3),
  ('Compact Wall Clock', 'Innovative Tuna featuring clear-cut technology and Steel construction', 'https://picsum.photos/seed/Jz8NE5oL/600/400', 1),
  ('Smart Cable Organizer', 'The Triple-buffered encompassing analyzer Ball offers reliable performance and smart design', 'https://picsum.photos/seed/uadxTqNy/600/400', 4),
  ('Premium Monitor Stand', 'Innovative Bike featuring trustworthy technology and Rubber construction', 'https://picsum.photos/seed/Qn8Bxj2M/600/400', 3),
  ('Premium Portable Speaker', 'Featuring Silicon-enhanced technology, our Soap offers unparalleled frivolous performance', 'https://picsum.photos/seed/gl5naKUN/600/400', 2),
  ('Classic Monitor Stand', 'Stylish Salad designed to make you stand out with illustrious looks', 'https://picsum.photos/seed/fdU6tyMC/600/400', 3);


-- employees
INSERT INTO employees (name, role, phone) VALUES
  ('Emmie Mante', 'Finance Officer', '+16352511812'),
  ('Georgia Hagenes', 'Warehouse Lead', '+14343296003'),
  ('Stacey Gusikowski', 'Warehouse Lead', '+13905795734'),
  ('Kayley Borer II', 'Customer Support', '+19462594232'),
  ('Elvira Jerde', 'Head of Sales', '+19714839576'),
  ('Mrs. Pearl Welch', 'General Manager', '+12987436338'),
  ('Itzel Pollich', 'General Manager', '+12089087776'),
  ('Daryl Ryan', 'Head of Sales', '+16582354917');


-- friendships
INSERT INTO friendships (user_id, friend_id, status) VALUES
  (2, 13, 'accepted'),
  (7, 8, 'accepted'),
  (11, 13, 'accepted'),
  (12, 16, 'accepted'),
  (5, 10, 'accepted'),
  (8, 4, 'accepted'),
  (3, 13, 'accepted'),
  (9, 18, 'accepted'),
  (16, 2, 'accepted'),
  (14, 7, 'accepted'),
  (9, 1, 'accepted'),
  (14, 12, 'accepted'),
  (7, 12, 'accepted'),
  (17, 15, 'accepted'),
  (15, 13, 'accepted')
ON CONFLICT (user_id, friend_id) DO NOTHING;


-- messages
INSERT INTO messages (sender_id, receiver_id, content) VALUES
  (18, 13, 'Timor quos dapifer vere.'),
  (6, 1, 'Umquam facere abbas tersus culpa acerbitas ustilo curiositas deprecator terga.'),
  (6, 2, 'Volutabrum desipio error delinquo cattus amo soleo vobis subseco trepide.'),
  (2, 20, 'Ait appello inventore verbera incidunt ex sit veniam admitto commodi.'),
  (16, 5, 'Barba vesper rem valetudo dignissimos voluptates volutabrum aestivus conitor conduco.'),
  (15, 9, 'Tabesco atavus despecto curis terra.'),
  (4, 5, 'Infit appono decumbo reprehenderit cervus pecus aer colligo.'),
  (11, 14, 'Usitas conscendo antiquus tricesimus vallum venia celebrer ubi labore.'),
  (16, 18, 'Compello aro pauper nisi volo tamquam appello atque.'),
  (12, 13, 'Tepidus claustrum magni alias.'),
  (7, 2, 'Charisma summa talis vulgaris conduco adsuesco subseco suggero toties statua.'),
  (19, 13, 'Solutio catena claudeo summisse torrens tumultus temperantia.'),
  (7, 10, 'Sollicito ver caput adulatio abscido dolorum vergo abundans.'),
  (3, 10, 'Vulnus thermae voveo spargo nam degenero argentum.'),
  (1, 7, 'Sodalitas artificiose architecto vetus beatus auctus sustineo deputo atrocitas.'),
  (4, 1, 'Sperno sui terebro sordeo conforto campana.'),
  (14, 20, 'Asporto valens coepi minus.'),
  (10, 8, 'Depono decet ultio astrum stultus unde sursum amicitia.'),
  (13, 16, 'Natus xiphias quam crinis accendo tabella tamquam.'),
  (10, 2, 'Temperantia fugiat terga sollicito theologus contabesco audio testimonium verbera absens.'),
  (13, 6, 'Assumenda callide vulticulus allatus.'),
  (13, 14, 'Catena aptus vorago cogito.'),
  (2, 19, 'Abbas statua deputo arx quos defluo deleo repudiandae accendo.'),
  (10, 13, 'Apparatus balbus ventus ipsum currus.'),
  (10, 15, 'Derelinquo ademptio thymbra clamo tero triumphus vita amoveo summisse.'),
  (16, 4, 'Ciminatio terga caterva triduana curia bellicus tantum volubilis nemo caritas.'),
  (15, 2, 'Veniam amaritudo voluntarius spes assentator constans cubitum succedo animus similique.'),
  (1, 8, 'Abduco allatus timidus tabella sit aperiam.'),
  (14, 9, 'Beatus statim vitiosus culpa.'),
  (4, 5, 'Eius demens conspergo ventosus officia.'),
  (20, 3, 'Sortitus vester ulterius.'),
  (11, 13, 'Una caveo solio asper cauda cado utique.'),
  (16, 11, 'Abeo cervus campana cauda atrox.'),
  (8, 10, 'Ancilla ait crastinus ratione.'),
  (1, 6, 'Complectus corrupti cuppedia vox civis consequatur aliqua textus.'),
  (6, 2, 'Accusantium tredecim umerus toties speculum facere umbra caries constans.'),
  (9, 4, 'Dens administratio cubo exercitationem decerno conatus adhuc.'),
  (11, 18, 'Conturbo vel trans antepono ver avarus.'),
  (15, 19, 'Porro cohibeo ter consectetur cupio tutamen.'),
  (3, 8, 'Cursim arguo celo timor colligo cattus sulum constans ambulo.');


-- contacts
INSERT INTO contacts (name, message) VALUES
  ('Nikki Fritsch', 'Testimonium demo strues spiritus deleo quaerat aer vito vulpes. Ambitus verbum tricesimus iusto victoria reiciendis ex stillicidium. Turbo voluptatum attollo.'),
  ('Talon Swaniawski', 'Spero deorsum cilicium quos valetudo aeneus adsidue ancilla custodia defessus. Nam aequitas celer vis. Vacuus impedit ciminatio.'),
  ('Manuel O''Conner-Pagac', 'Vinum sumo volubilis solutio carmen curriculum suppellex vestrum adipisci. Ventus enim demum delectatio. Administratio arguo degusto venia acidus arbor tolero.'),
  ('Miss Dixie Torphy', 'Desipio dedico iure. Coniuratio deputo terra sol synagoga. Certus stips sumo arguo tergo illo sustineo.'),
  ('Sabrina Ward III', 'Tum demens fugit substantia demitto contra territo. Verumtamen vigor tego vereor. Stultus voluntarius impedit tendo saepe validus subnecto cupiditate testimonium ex.'),
  ('Dr. Vanessa Reynolds', 'Bibo defluo calcar damno spectaculum demens suppono utrum necessitatibus. Ipsam aegrotatio aureus alius utpote deinde solus sed dignissimos amoveo. Pax turba et tergum certus depraedor.'),
  ('Candice Boyle', 'Chirographum doloribus depopulo patruus compono vulgus tui. Vorago coaegresco arbor ultio thema decet vulticulus. Ultra velociter aegrotatio angustus.'),
  ('Lafayette Gibson', 'Spargo bestia amoveo ducimus suffoco ciminatio repudiandae dolorem vetus carpo. Copiose tunc canto defaeco peccatus traho audacia triduana alter. Ultra beatus surculus contra iste brevis somnus acceptus strenuus.'),
  ('Dean Hintz', 'Arma tollo totam blandior voluptatum incidunt distinctio. Tum utrimque stabilis cenaculum cilicium defluo adeo ater crepusculum. Cohaero apto vallum.'),
  ('Giovanni West', 'Cuppedia bis quo debilito textor. Degenero caries arx eligendi. Usus ocer curis valde.');