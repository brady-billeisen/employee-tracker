USE employee_db;

-- 2 departments
INSERT INTO departments (name)
    VALUES ('Sales'), ('Web Development');
-- 2 roles
INSERT INTO roles (title, salary, department_id)
    VALUES ('Outbound Agent', 50000, 1), ('Software Engineer', 100000, 2);
-- 3 employees
INSERT INTO employees (first_name, last_name, role_id, manager_id)
    VALUES ('Peter', 'Griffin', 1, null), ('Joe', 'Swanson', 1, 1), ('Glenn', 'Quagmire', 2, null);