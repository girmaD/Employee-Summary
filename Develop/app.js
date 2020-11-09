const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");


// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```

const employees = [];

const  promptQuestions = () => inquirer.prompt([
    {
        type: 'input',
        name: 'managerName',
        message: "What is your manager's name?"
    },
    {
        type: 'input',
        name: 'managerId',
        message: "What is your manager's id?"
    },
    {
        type: 'input',
        name: 'managerEmail',
        message: "What is your manager's email?"
    },
    {
        type: 'input',
        name: 'managerOffice',
        message: "What is your manager's office number?"
    }   
]);

const addTeamMember = () => inquirer.prompt([
    {
        type: 'list',
        name: 'empType',
        message: "Which type of team members would you like to add?",
        choices: ['Engineer', 'Intern', 'I do not want to add more team members']
    }
])
.then((type) => {
    switch(type.empType){
        case 'Engineer':
            promptEngineer()
            .then((data) =>{
                const engineer = new Engineer(data.engName, data.engId, data.engEmail, data.engGit)
                employees.push(engineer)
                addTeamMember()
            })
            break;
        case 'Intern':
            promptIntern()
            .then((data) =>{
                const intern = new Intern(data.intName, data.intId, data.intEmail, data.intSchool)
                employees.push(intern)
                addTeamMember()
            })
            break;
        default:
            console.log('Thank you for providing infomation')
    }
})

const promptEngineer = () => inquirer.prompt([
    {
        type: 'input',
        name: 'engName',
        message: "What is this Engineer's name?"
    },
    {
        type: 'input',
        name: 'engId',
        message: "What is this Engineer's id?"
    },
    {
        type: 'input',
        name: 'engEmail',
        message: "What is this Engineer's email?"
    },
    {
        type: 'input',
        name: 'engGit',
        message: "What is this Engineer's github user name?"
    },
]); 

const promptIntern = () => inquirer.prompt([
    {
        type: 'input',
        name: 'intName',
        message: "What is this intern's name?"
    },
    {
        type: 'input',
        name: 'intId',
        message: "What is this intern's id?"
    },
    {
        type: 'input',
        name: 'intEmail',
        message: "What is this intern's email?"
    },
    {
        type: 'input',
        name: 'intSchool',
        message: "What is this intern's school?"
    },
]);

//====================================//
console.log(`Please build your team`)

promptQuestions()
.then((data) => {
   const manager = new Manager(data.managerName, data.managerId, data.managerEmail, data.managerOffice)
   employees.push(manager);
   addTeamMember();
   console.log(...employees);
   console.log(employees);
})