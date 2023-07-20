const inquirer = require('inquirer');
const mysql = require('mysql2');

const prompt = inquirer.createPromptModule();

let db;

const getAll = (tableName) => {
    db.query('SELECT * FROM ??', tableName, (err, results) => {
        if (err) {
            return console.error(err);
        }
        console.table(results);
        init();
    });
};

const getAllEmployees = () => {
    db.query(`
SELECT
    employees.id,
    CONCAT(employees.first_name, ' ', employees.last_name) AS name,
    title AS role,
    salary,
    departments.name AS department,
    employees.manager_id,
    CONCAT(managers.first_name, ' ', managers.last_name) AS manager
FROM employees
LEFT JOIN roles
ON employees.role_id = roles.id
LEFT JOIN departments
ON roles.department_id = departments.id
LEFT JOIN employees AS managers
ON employees.manager_id = managers.id
`, (err, results) => {
        if (err) {
            return console.error(err);
        }
        console.table(results);
        init();
    });
};

const insertEmployee = (data) => {
    db.query('INSERT INTO employees SET ?', data, (err, results) => {
        if (err) {
            return console.error(err);
        }
        console.log('Employee added!');
        init();
    });
};

const addEmployeeDetails = (roles, employees) => {
    prompt([
        {
            name: 'first_name',
            message: 'Enter employee first name:',
        },
        {
            name: 'last_name',
            message: 'Enter employee last name:',
        },
        {
            name: 'role_id',
            message: 'Enter employee role:',
            type: 'rawlist',
            choices: roles,
        },
        {
            name: 'manager_id',
            message: 'Enter employee manager:',
            type: 'rawlist',
            choices: employees,
        }
    ]).then(insertEmployee);
};

const queryAndSendRoles = () => {
    db.query('SELECT id AS value, title AS name FROM roles', (err, roles) => {
        queryAndSendEmployees(roles);
    });
};

const queryAndSendEmployees = (roles) => {
    db.query('SELECT id AS value, CONCAT(first_name, " ", last_name) AS name FROM employees', (err, employees) => {
        addEmployeeDetails(roles, employees);
    });
};

const insertDepartment = (data) => {
    db.query('INSERT INTO departments SET ?', data, (err, results) => {
        if (err) {
            return console.error(err);
        }
        console.log('Department added!');
        init();
    });
};

const addDepartment = () => {
    prompt({
        name: 'name',
        message: 'Enter the department name:',
    }).then(insertDepartment);
};

const insertRole = (data) => {
    db.query('INSERT INTO roles SET ?', data, (err, results) => {
        if (err) {
            return console.error(err);
        }
        console.log('Role added!');
        init();
    });
};

const addRole = () => {
    db.query('SELECT * FROM departments', (err, departments) => {
        if (err) {
            return console.error(err);
        }

        prompt([
            {
                name: 'title',
                message: 'Enter the role title:',
            },
            {
                name: 'salary',
                message: 'Enter the role salary:',
            },
            {
                name: 'department_id',
                message: 'Select the department for the role:',
                type: 'rawlist',
                choices: departments.map((department) => ({
                    name: department.name,
                    value: department.id,
                })),
            },
        ]).then(insertRole);
    });
};

const updateEmployeeRole = (data) => {
    db.query('UPDATE employees SET role_id = ? WHERE id = ?', [data.role_id, data.employee_id], (err, results) => {
        if (err) {
            return console.error(err);
        }
        console.log('Employee role updated!');
        init();
    });
};

const updateEmployeeRolePrompt = () => {
    db.query('SELECT * FROM employees', (err, employees) => {
        if (err) {
            return console.error(err);
        }

        db.query('SELECT * FROM roles', (err, roles) => {
            if (err) {
                return console.error(err);
            }

            prompt([
                {
                    name: 'employee_id',
                    message: 'Select the employee to update:',
                    type: 'rawlist',
                    choices: employees.map((employee) => ({
                        name: `${employee.first_name} ${employee.last_name}`,
                        value: employee.id,
                    })),
                },
                {
                    name: 'role_id',
                    message: 'Select the new role for the employee:',
                    type: 'rawlist',
                    choices: roles.map((role) => ({
                        name: role.title,
                        value: role.id,
                    })),
                },
            ]).then(updateEmployeeRole);
        });
    });
};

const handleAction = ({ action }) => {
    switch (action) {
        case 'View All Employees': {
            getAllEmployees();
            break;
        }
        case 'View All Departments': {
            getAll('departments');
            break;
        }
        case 'View All Roles': {
            getAll('roles');
            break;
        }
        case 'Add Employee': {
            queryAndSendRoles();
            break;
        }
        case 'Add Department': {
            addDepartment();
            break;
        }
        case 'Add Role': {
            addRole();
            break;
        }
        case 'Update Employee Role': {
            updateEmployeeRolePrompt();
            break;
        }
        default: {
            process.exit();
        }
    }
};

const init = () => {
    prompt({
        name: 'action',
        type: 'rawlist',
        message: 'What would you like to do?',
        choices: [
            'View All Employees',
            'View All Departments',
            'View All Roles',
            'Add Employee',
            'Add Department',
            'Add Role',
            'Update Employee Role',
            'Exit',
        ]
    }).then(handleAction);
};

db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    database: 'employee_db',
    port: 3306,
}, init());

