const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
const { type } = require("os");

//empty array to store employees' from the CLI answers
const employees = [];

//A regEx to validate email
//source - https://gist.github.com/Amitabh-K/ae073eea3d5207efaddffde19b1618e8
function validEmail (email) {  
    valid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
    if (valid) {    
        return true;
    } else {
        console.log(".  Please enter a valid email")
        return false;
    }
}
//A function to validate empty answers will not be accepted
function nonEmpty(answer) {
    if(answer !== '') {
        return true
    } else {
        console.log('Please enter an answer to proceed')
        return false
    }
}

//Prompt Manager related questions to a user
const  promptManager = () => inquirer.prompt([
    {
        type: 'input',
        name: 'name',
        message: "What is your manager's name?",       
        validate: nonEmpty
    },
    {
        type: 'input',
        name: 'id',
        message: "What is your manager's id?",
        validate: nonEmpty        
    },
    {
        type: 'input',
        name: 'email',
        message: "What is your manager's email?",
        validate: validEmail
    },
    {
        type: 'input',
        name: 'office',
        message: "What is your manager's office number?",
        validate: nonEmpty
    }   
])

// questions about team members (other than the manager)
const promptTeamMember = () => inquirer.prompt([
    {
        type: 'input',
        name: 'name',
        message: `What is this team member's name?`,
        validate: nonEmpty
    },
    {
        type: 'input',
        name: 'id',
        message: `What is this team member's id?`, 
        validate: nonEmpty       
    },
    {
        type: 'input',
        name: 'email',
        message:` What is this team member's email?`,
        validate: validEmail
    },
    {
        type: 'list',
        name: 'empType',
        message: "Is this team member an engineer or an intern?",
        choices: ['Engineer', 'Intern']
    }    
]);

//Ask if a user wants to add a team member
const addTeamMember = () => inquirer.prompt([
    {
        type: 'confirm',
        name: 'add',
        message: "Would you like to add another team member?",
    }    
])
// if yes, 
.then((answer) => {
    if(answer.add) {
        // ask questions about the team member
        promptTeamMember()
        .then((response) => {
            // check the response on empType
            switch(response.empType) {
                // if engineer
                case 'Engineer':
                    //ask engineer's github user name
                    inquirer.prompt([
                        {
                            type: 'input',
                            name: 'github',
                            message: "What is this Engineer's github user name?"
                        },
                    ])
                    //create new instance of Engineer and push it to employee array
                    .then((eng) =>{
                        const engineer = new Engineer(response.name, response.id, response.email, eng.github)
                        employees.push(engineer) 
                        // ask again if the user wants to add new team member
                        addTeamMember();
                    })
                    break;
                //if intern 
                case 'Intern':
                    //ask the intern's school
                    inquirer.prompt([
                        {
                            type: 'input',
                            name: 'school',
                            message: "What is this intern's school?"
                        },
                    ])
                    // create new intance of Intern and push it to employees array
                    .then((int) => {                       
                        const intern = new Intern(response.name, response.id, response.email, int.school)
                        employees.push(intern) 
                        // ask again if a user wants to add another team member
                        addTeamMember();                        
                    })
                    break;
            }
        })
    } else {
        //if the user would not like to add a team member, create the HTML file with all the information gathered
        console.log('Thank you for providing valuable infomation')        
        createHTML();
    }
})

//A function that creates the html file
const createHTML = () => {
    //check if 'output' directory exists - 
    if (!fs.existsSync(OUTPUT_DIR)) {
        // if not found, create it
        fs.mkdirSync(OUTPUT_DIR);
    }
    //use fs.writeFile to create the html file and pass (render(employees)) data in it
    fs.writeFile(outputPath, render(employees), (err) =>{
        // if error, throw error
        if(err) throw err;
        //if successful, tell in console that it was successfully created
        console.log('html successfully created');
    })
}

//Using async and await to make sure - the next function runs after the first function's promise is resolved.
const init = async () => {
    //Using try catch to handle error
    try {
        //call promptManager() and use await keyword to make sure functions wait until the promise is resolved
        let data =  await promptManager()
        //use data from promptManager() to create a new instance of Manager
        const manager = new Manager(data.name, data.id, data.email, data.office)
        // put that instance to employees array
        employees.push(manager);
        
        //await makes sure this function will not run until the promise from above is resolved
        await addTeamMember() 
        //if error occurs, it will be captured as follows 
    } catch(e) {
        console.log("Here is the error", e)
    }
}

//====================================//
console.log(`Please build your team`)
// call init function to start the whole thing
init();