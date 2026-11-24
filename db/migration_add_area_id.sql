USE tickets_db;

ALTER TABLE tickets
ADD COLUMN area_id INT NULL;

UPDATE tickets
SET area_id = 1
WHERE area_id IS NULL;

ALTER TABLE tickets
MODIFY COLUMN area_id INT NOT NULL;
