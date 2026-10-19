USE only_garments;
INSERT INTO products (id,barcode,name,brand,category,size,mrp,purchase_price,selling_price,quantity,unit,description,demo) VALUES
('P-DEMO-1','OG1001','Western Garment','Demo brand','Garment','32–34',483,NULL,483,1,'piece','Demonstration prices only; purchase cost unknown.',TRUE),
('P-DEMO-2','OG1002','Western Garment','Demo brand','Garment','20–30',425,NULL,425,1,'piece','Demonstration prices only; purchase cost unknown.',TRUE),
('P-DEMO-3','OG1003','Western Garment','Demo brand','Garment','XL',529,NULL,529,1,'piece','Demonstration prices only; purchase cost unknown.',TRUE),
('P-DEMO-4','OG1004','Nighty','Demo brand','Nighty','L',325,NULL,325,1,'piece','Demonstration prices only; purchase cost unknown.',TRUE),
('P-DEMO-5','OG1005','Men’s Rib Vest','Demo brand','Garment','80 cm',142,NULL,142,1,'piece','Demonstration prices only; purchase cost unknown.',TRUE);
-- Create production users through a secure provisioning flow, never plaintext SQL passwords.
