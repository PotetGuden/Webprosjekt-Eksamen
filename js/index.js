let createNewUserBtn = document.getElementById("create-user-btn");
let logInBox = document.getElementById("log-in-box");
let createNewUserBox = document.getElementById("create-user-box");
let createNewUserSubmitBtn = document.getElementById("submit-create-user");
let createPasswordInput = document.getElementById("create-user-password-input");
let signInBtn = document.getElementById("sign-in-btn");
let logInPasswordInput = document.getElementById("user-password-input");
let addNewProjectBtn = document.getElementById("add-new-project");
let newProjectsDiv = document.getElementById("personal-projects");
let projectsPreview = document.getElementById("choose-project-box");


//LocalStorageNameVariables
var UserKey = "Users";


function letPressEnter(value, func){
    value.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
          func();
        }
    });
}

letPressEnter(logInPasswordInput, userLogin);
letPressEnter(createPasswordInput, createUser);

signInBtn.addEventListener("click", () =>{
    userLogin();
});

createNewUserBtn.addEventListener("click", () =>{
    logInBox.style.display = "none";
    createNewUserBox.style.display = "block";
});

createNewUserSubmitBtn.addEventListener("click", () =>{
    createUser();
});


// Source: "https://stackoverflow.com/questions/2794137/sanitizing-user-inp"ut-before-adding-it-to-the-dom-in-javascript"

function sanitizeInput(string) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        "/": '&#x2F;',
    };
    const reg = /[&<>"'/]/ig;
    return string.replace(reg, (match)=>(map[match]));
  }



function validLoginInput(username,password) {
    if(username == '' || password == '') {
        return false;
    }
    return true;
}


function createUser() {
    // hente noen input fields
    //validere at input er gyldig for ny bruker

    let userName = sanitizeInput(document.getElementById("create-user-name-input").value);
    let password = sanitizeInput(document.getElementById("create-user-password-input").value);
    if (validLoginInput(userName, password)) {
        let user = new User(userName, password);

        let users = getLocalStorageAsJson(UserKey); //Gets the users list from localstorage;
        if (users.length === 0) {
            users.push(user);
            setLocalStorageKeyValue(UserKey,users);
        } else {
            let add = true;
            for (let usr in users) {
                if (users[usr].userName == user.userName) {
                    add = false;
                }
            }
            if(add) {
                users.push(user);
                setLocalStorageKeyValue(UserKey,users);
            }
        }

        logInBox.style.display = "block";
        createNewUserBox.style.display = "none";
    }
}
 
function userLogin() {
    // hente inloggings input felt
    // sjekke at disse stemmer overens med en bruker i localstorage
  
    let userName = sanitizeInput(document.getElementById("user-name-input").value);
    let password = sanitizeInput(document.getElementById("user-password-input").value);

    if (validLoginInput(userName, password)) {
        let userList = getLocalStorageAsJson(UserKey);
        for (const user in userList) {
            if(userList[user].userName == userName && userList[user].password == password) {
                logInBox.style.display = "none";
                projectsPreview.style.display = "block";

                setActiveUser(userList[user]);
                renderProjects(userList[user]);
            }
        }   
    }
}



function renderProjects(user){
    let relatedProjects = getProjectsRelatedToUser(user);
    for(let i = 0; i < relatedProjects.length; i++){
        let newProject = document.createElement("DIV");

        newProject.className = "current-projects";
        newProject.innerHTML = `
            <p class="clickable-text">${relatedProjects[i].projectName}</p>
            <input type="text" name=${relatedProjects[i].projectId} class="input-current-projects">
            `
        ;

        let moveNewProjectBtnRight = addNewProjectBtn;

        newProjectsDiv.appendChild(newProject);
        newProjectsDiv.appendChild(moveNewProjectBtnRight);

        changeProjectTextProjectsPreview();
        console.log(relatedProjects[i].projectId);
        newProject.addEventListener("click", () => {
            setLocalStorageKeyValue("ActiveProject",relatedProjects[i].projectId);
        });

        // getProjectsRelatedToUser(user)[event.target].projectId]
    }   
}

function getProjectsRelatedToUser(user) {
    let projects = getProjects();
    let projectsList = [];
    for (let prj in projects) {
        if (user.projectIds.includes(projects[prj].projectId)) {
            projectsList.push(projects[prj]);
        }
    }
    return projectsList;
}


function getProjectMembers() {
    let project = getActiveProject();
    let names = [];
    for (const userIndex in project.projectMembers) {
        names.push(project.projectMembers[userIndex]);
    }
    return names;
}



function setActiveUser(user){
    setLocalStorageKeyValue("ActiveUser",user);
}

function getActiveUser(){
    return getLocalStorageAsJson("ActiveUser");
}

function newProjectBtnClicked() {
    let newProject = document.createElement("DIV");
   
    newProject.className = "current-projects";
    newProject.innerHTML = `
        <p class="clickable-text">Fyll inn navn</p>
        <input type="text" name="" class="input-current-projects">
    `;
    
    let moveNewProjectBtnRight = addNewProjectBtn;

    newProjectsDiv.appendChild(newProject);
    newProjectsDiv.appendChild(moveNewProjectBtnRight);

    changeProjectTextProjectsPreview();
}

function clickToChangeName(element){
    element.addEventListener('focusout', (event) => {
        element.target.style.display = 'none';
    });
}

function changeProjectTextProjectsPreview(){
    let clickableText = document.getElementsByClassName("clickable-text");
    let inputBoxes = document.getElementsByClassName("input-current-projects");

    makeTextReplaceAble(clickableText, inputBoxes);
}



//______________________________________________________________________________________
const personalProjects = document.getElementById("personal-projects");

personalProjects.addEventListener("click", (event)=> {
    if (event.target.id=="add-new-project") {
        console.log("klikket på new project")
        newProjectBtnClicked();
    }
    if (event.target.className =="current-projects" && event.target.id=="") {
        let projectId = event.target.childNodes[3].getAttribute("name"); 

        
        setLocalStorageKeyValue("ActiveProject",projectId); 
        window.location.href = "/pro104-eksamen-gruppe06/mainpage.html";
    }
    if(event.target.class == "clickable-text"){
        alert("hei"); 
    }
}); 





// Kan kun brukes for classes hvor man har text som har display:block og en input box med display:none (for å kunne bytte display imellom boksene og endre innerHTML til teksten)
function makeTextReplaceAble(clickableText, inputBox){

    for(let i = 0; i < clickableText.length; i++){
        clickableText[i].addEventListener("click", () =>{
            clickableText[i].style.display = "none";
            inputBox[i].style.display = "block";

            inputBox[i].focus();
        });

        inputBox[i].addEventListener("keydown", (e) =>{
            if (e.keyCode == 13) {
                let projectName = inputBox[i].value;
                clickableText[i].innerHTML = projectName;
                if (inputBox[i].name == "") {
                    let project = newProject(projectName, getActiveUser());
                    inputBox[i].name = project.projectId;
                    updateProjectName(project.projectId,projectName);
                } else {
                    console.log("project exist")
                    updateProjectName(parseInt(inputBox[i].name),projectName);
                    //update
                }
                clickableText[i].style.display = "block";
                inputBox[i].style.display = "none";
                // project.projectName.push(projectName) ... noe sånt
                
            } 
        });

        inputBox[i].addEventListener("focusout", () =>{
            clickableText[i].style.display = "block";
            inputBox[i].style.display = "none";
        });
    }
}




function updateProjectName(projectId, newProjectName) {
    let projects = getProjects();
    for (let prj in projects) {
        if (projects[prj].projectId==projectId) {
            console.log(projects[prj].projectName +"="+ newProjectName);
            projects[prj].projectName = newProjectName;
            console.log(projects[prj].projectName +"="+ newProjectName);
            saveProject(projects[prj]);
            return;
        }
    }
}

function saveUser(user) {
    let users = getLocalStorageAsJson("Users");
    
    let add = true;
    for (let usrIndex in users) {
        if (users[usrIndex].userName == user.userName) {
            users[usrIndex] = user;
            add = false;
        }
    }
    if (add) {
        users.push(user);
        console.log("added new project");
    }
    setLocalStorageKeyValue("Users",users);
}




function newProject(projectName, projectLeader){
    let newProject = new Project(projectName, projectLeader);
    console.log("før lagt til nytt prosjekt"+getProjects().length)
    newProject.projectId = getProjects().length++;
    console.log(newProject.projectId)
    let user = getActiveUser();
    user.projectIds.push(newProject.projectId);
    setLocalStorageKeyValue("ActiveUser",user);

    saveUser(user);
    saveProject(newProject);
    return newProject;
}

changeProjectTextProjectsPreview();




/* PRØV Å IMPORTER DISSE FUNKSJONENE */

function saveProject(project) {
    let projects = getProjects();
    
    let add = true;
    for (let projIndex in projects) {
        if (projects[projIndex].projectId == project.projectId) {
            projects[projIndex] = project;
            add = false;
        }
    }
    if (add) {
        projects.push(project);
    }
    setLocalStorageKeyValue("Projects",projects);
}

function getProjects() {
    return getLocalStorageAsJson("Projects");
}




