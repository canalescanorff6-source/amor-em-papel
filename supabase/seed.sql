insert into public.categories (name,slug,description,icon,sort_order) values
('Papelaria escolar','escolar','Materiais criativos para rotina escolar.','✏️',1),
('Materiais de escritório','escritorio','Organização bonita para trabalho e estudo.','📎',2),
('Cadernos e agendas','cadernos','Cadernos, planners e agendas personalizáveis.','📒',3),
('Canetas e marcadores','canetas','Escrita criativa e colorida.','🖊️',4),
('Topos de bolo','topos','Topos personalizados para celebrar.','🎂',5),
('Lembrancinhas personalizadas','lembrancinhas','Mimos para festas e eventos.','🎁',6),
('Caixas e embalagens','caixas','Embalagens e caixas especiais.','📦',7),
('Decoração de festas','decoracao','Peças para mesas e cenários.','🎈',8),
('Produtos personalizados','personalizados','Criações feitas do seu jeito.','💖',9),
('Presentes criativos','presentes','Ideias afetivas para presentear.','✨',10)
on conflict (slug) do nothing;
