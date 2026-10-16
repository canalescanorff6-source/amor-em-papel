insert into public.categories (name, slug, description, icon, accent, sort_order)
values
('Papelaria escolar','papelaria-escolar','Itens criativos para estudo e rotina escolar.','Backpack','pink',10),
('Escritório','escritorio','Organização e materiais para o dia a dia.','BriefcaseBusiness','blue',20),
('Cadernos e agendas','cadernos-agendas','Cadernos, planners e agendas.','NotebookTabs','lilac',30),
('Canetas e marcadores','canetas-marcadores','Cores para escrever e criar.','PenLine','turquoise',40),
('Topos de bolo','topos-de-bolo','Topos personalizados para celebrações.','CakeSlice','pink',50),
('Lembrancinhas','lembrancinhas','Mimos personalizados para eventos.','Gift','yellow',60),
('Caixas e embalagens','caixas-embalagens','Embalagens que valorizam o presente.','PackageOpen','blue',70),
('Decoração de festas','decoracao-de-festas','Peças coordenadas para festas.','PartyPopper','lilac',80),
('Personalizados','personalizados','Projetos feitos para nome, tema e ocasião.','Sparkles','pink',90),
('Presentes criativos','presentes-criativos','Ideias delicadas para presentear.','Heart','turquoise',100)
on conflict (slug) do nothing;
