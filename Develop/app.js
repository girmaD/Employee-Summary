const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

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
// let combinedData;

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

//Prompt Manager related questions to a user
const  promptManager = () => inquirer.prompt([
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
])

//Prompt Engineer related question to a user
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

//Prompt Intern related questions to a user
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


//Prompt addTeamMember question to a user
const addTeamMember = () => inquirer.prompt([
    {
        type: 'list',
        name: 'empType',
        message: "Which type of team member would you like to add?",
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
            console.log('Thank you for providing valuable infomation')
            // render(employees);
            createHTML();
    }
})

//====================================//
console.log(`Please build your team`)

//Using async and await to make sure - the next function runs after the first function's promise is recolved.
const init = async () => {
    //Using try catch to handle error
    try {
        let data =  await promptManager()
        const manager = new Manager(data.managerName, data.managerId, data.managerEmail, data.managerOffice)
        employees.push(manager);
        console.log(manager)

        await addTeamMember()         
    } catch(e) {
        console.log("Here is the error", e)
    }
}

init();

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee! 

//=====================================//
const createHTML = () => {
    fs.writeFile(outputPath, render(employees), (err) =>{
        if(err) throw err;
        console.log('html successfully created');
    })
}