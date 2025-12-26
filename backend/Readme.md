in manger review table added new column called manager_id here is table sql 
ALTER TABLE manager_review
ADD COLUMN manager_id INTEGER;


Now linkig manger tbale manager_id column with the employees table here is the required sql query 
ALTER TABLE manager_review
ADD CONSTRAINT fk_manager_review_manager
FOREIGN KEY (manager_id)
REFERENCES employees(id);

now link the as per  manager 


