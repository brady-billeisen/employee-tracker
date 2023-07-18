USE employee_db;

-- 2 departments
INSERT INTO departments (name)
    VALUES ('Sales'), ('Web Development');
-- 2 roles
INSERT INTO roles (title, salary)
    VALUES ('Outbound Agent', 50000), ('Software Engineer', 100000);
-- 3 employees
INSERT INTO employees (first_name, last_name)
    VALUES ('Peter', 'Griffin'), ('Joe', 'Swanson'), ('Glenn', 'Quagmire');