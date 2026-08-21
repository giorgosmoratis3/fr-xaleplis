delete from public.program_hours;
insert into public.program_hours (class_key, season, subject, hours, sort_order) values
('a','winter','Αρχαία Ελληνικά',3,1),
('a','winter','Έκθεση – Λογοτεχνία',3,2),
('a','summer','Αρχαία',2,1),
('a','summer','Έκθεση',2,2),
('a','summer','Μαθηματικά',2,3),
('a','summer','Φυσική',1,4),
('b','winter','Αρχαία – Άγνωστο',4,1),
('b','winter','Αρχαία – Γνωστό',2,2),
('b','winter','Έκθεση – Λογοτεχνία',3,3),
('b','winter','Λατινικά',2,4),
('b','winter','Ιστορία',1,5),
('g','winter','Αρχαία – Άγνωστο',4,1),
('g','winter','Αρχαία – Γνωστό',2,2),
('g','winter','Έκθεση – Λογοτεχνία',3,3),
('g','winter','Λατινικά',3,4),
('g','winter','Ιστορία',2,5);