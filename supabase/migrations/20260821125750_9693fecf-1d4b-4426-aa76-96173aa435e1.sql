delete from public.program_hours where class_key in ('gym','mtl') or (class_key='a' and season='summer');
insert into public.program_hours (class_key, season, subject, hours, sort_order) values
('gym','winter','Αρχαία',2,1),
('gym','winter','Έκθεση',2,2),
('gym','winter','Μαθηματικά',2,3),
('gym','winter','Φυσική',1,4),
('mtl','winter','Αρχαία – Άγνωστο',4,1),
('mtl','winter','Αρχαία – Γνωστό',2,2),
('mtl','winter','Έκθεση – Λογοτεχνία',3,3),
('mtl','winter','Λατινικά',3,4),
('mtl','winter','Ιστορία',2,5);