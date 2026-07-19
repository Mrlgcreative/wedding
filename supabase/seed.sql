-- ============================================================
-- E-Wedding — Données de seed (mariage Amélie & Julien)
-- ============================================================

INSERT INTO weddings (id, template, partner1, partner2, date, story, website)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'classic',
  'Amélie',
  'Julien',
  '2026-09-12T15:00:00+02:00',
  E'Amélie et Julien se sont rencontrés un soir d''automne sous la pluie parisienne. Après six années d''aventures, de fous rires et de voyages, ils ont décidé de s''unir pour la vie.',
  'https://ameliectjulien.wedding'
);

INSERT INTO dress_codes (wedding_id, theme, instructions, palette_primary, palette_secondary, palette_accent, palette_background, palette_text)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Élégance Champêtre Chic',
  E'Nous vous invitons à porter des tenues dans les tons de notre palette. Le smoking et la robe longue sont les bienvenus, mais restez à l''aise pour danser !',
  '#1a3c34', '#d4af37', '#e8d5c4', '#faf6f1', '#2d2d2d'
);

INSERT INTO events (wedding_id, type, name, address, date, time, notes, sort_order)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'mairie',    'Mairie du 6e arrondissement',  '1 Place Saint-Sulpice, 75006 Paris',         '2026-09-12', '15:00', NULL, 1),
  ('00000000-0000-0000-0000-000000000001', 'ceremonie', 'Église Saint-Germain-des-Prés', '3 Place Saint-Germain des Prés, 75006 Paris', '2026-09-12', '16:30', 'Cérémonie religieuse ouverte à tous', 2),
  ('00000000-0000-0000-0000-000000000001', 'reception', 'Domaine de la Roseraie',        '15 Rue des Lilas, 92370 Chaville',            '2026-09-12', '19:00', 'Tenue de soirée recommandée — Cocktail puis dîner dansant', 3);

INSERT INTO photos (wedding_id, url, type, sort_order)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80', 'hero', 1),
  ('00000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80', 'gallery', 1),
  ('00000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=400&q=80', 'gallery', 2);

INSERT INTO guests (id, wedding_id, name, email, phone, invited_plus_one, status)
VALUES
  ('00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000001', 'Sophie Martin',  'sophie.martin@email.com',  NULL,    true,  'pending'),
  ('00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000001', 'Thomas Dubois',  'thomas.dubois@email.com',  NULL,    true,  'pending'),
  ('00000000-0000-0000-0000-000000000103', '00000000-0000-0000-0000-000000000001', 'Claire Lefèvre', 'claire.lefevre@email.com', '+33612345678', false, 'pending'),
  ('00000000-0000-0000-0000-000000000104', '00000000-0000-0000-0000-000000000001', 'Antoine Petit',  'antoine.petit@email.com',  NULL,    true,  'confirmed'),
  ('00000000-0000-0000-0000-000000000105', '00000000-0000-0000-0000-000000000001', 'Marie Laurent',  'marie.laurent@email.com',  NULL,    false, 'declined');

INSERT INTO rsvps (guest_id, confirmed, plus_one, plus_one_name, dietary_restrictions)
VALUES (
  '00000000-0000-0000-0000-000000000104',
  true, true, 'Camille Petit', 'Végétarien'
);
