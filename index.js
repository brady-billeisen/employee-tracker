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

const insertEmployee = (data) => {
    db.query('INSERT INTO employees SET ?', data, (err, results) => {
        if (err) {
            return console.error(err);
        }
        console.log('Employee added!');
        init();
    });
};

const handleAction = ({ action }) => {
    switch (action) {
        case 'View All Employees': {
            getAll('employees');
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
            prompt([
                {
                    name: 'first_name',
                    message: 'Enter employee first name?',
                },
                {
                    name: 'last_name',
                    message: 'Enter employee last name?',
                }
            ]).then(insertEmployee);
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

