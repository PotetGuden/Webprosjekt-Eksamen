/*
    TODO: 
        Make array with Users
        Make array with Projects
        GETTERS/SETTERS?
        Constructors

*/

let taskTitle = document.getElementById("task-title");
let task1 = document.getElementById("task1");
let doneBtn = document.getElementsByClassName("done-button");
let updateDoneBtn = document.getElementById("update-done-button");
let backBtn = document.getElementById("back-button"); //kan være vi ikke trenger denne
let makeANewAssignmentDiv = document.getElementsByClassName("input-box-content");
let addNewTaskIcon = document.getElementsByClassName("add-new-item-icon");
let currentMembers = document.getElementById("current-members-div");
let addMemberText = document.getElementById("add-member-text");
let addMemberDiv = document.getElementById("add-member-div");
let addNewContentBox = document.getElementById("add-new-content-box");
let addBtnOk = document.getElementById("add-member-btn-ok");
let memberInputBox = document.getElementById("name-of-member");


let allColumns = document.getElementById("content-canvas");
let hamburgerMenu = document.getElementById("hamburger-icon");
let rightSideSection = document.getElementById("right-side-section");
let calendarOutput = document.getElementById("calendar-output");


let updatedTaskTitle = document.querySelector("[id='task-title']");
let updatedDescription = document.querySelector("[id='description-box']");
let updatedResponsible = document.querySelector("[id='drop-down-names']");
let updatedStartDate = document.querySelector("[id='select-start-date']");
let updatedStartTime = document.querySelector("[id='select-start-time']");
let updatedEndDate = document.querySelector("[id='select-end-date']");
let updatedEndTime = document.querySelector("[id='select-end-time']");

/* EVENTLISTENERS */

backBtn.addEventListener("click", () =>{
    makeANewAssignmentDiv[0].style.display = "none";
    var showTaskIcon = document.getElementsByClassName("add-new-item-icon");
    for(let i = 0; i < showTaskIcon.length; i++){
        showTaskIcon[i].style.display = "block";
    }
});

function addColumnBtnEventListener(){
    let addNewTaskIcon = document.getElementsByClassName("add-new-item-icon");
    for(let i = 0; i < addNewTaskIcon.length; i++){
        addNewTaskIcon[i].addEventListener("click", (event) =>{
            showNewAssignment(addNewTaskIcon[i]);
            currentColumnDiv = i;
        });
    }
}

let currentColumnDiv;

addMemberText.addEventListener("click", function(){
    addMemberText.style.display = "none";
    memberInputBox.style.display = "block";
    addBtnOk.style.display = "block";
});

function addNewCardBtnEventListener(){
    let currentAddNewCardBtns = document.getElementsByClassName("done-button"); 

    for(let i = 0; i < currentAddNewCardBtns.length; i++){
        currentAddNewCardBtns[i].addEventListener("click", function(event){
            hideNewAssignment();
            addColumnToLocalStorage(event);   
        });
    }
}

function addCardColumns(){
    let columns = document.getElementsByClassName("content");

}

function hideNewAssignment(){
    makeANewAssignmentDiv[0].style.display = "none";  
}


// Shows the page where you can define a new assignment
function showNewAssignment(taskIcon){
    taskIcon.style.display = "none";
    makeANewAssignmentDiv[0].style.display = "flex";

    addMembersToDropDownMenu();
}

addBtnOk.addEventListener("click", function(){
    addMemberText.style.display = "block";
    addBtnOk.style.display = "none";
    memberInputBox.style.display = "none";
});

function addMembersToDropDownMenu(){
    let dropDownMembers = document.getElementById("drop-down-names");
    let currentMember = getProjectMembers();
    dropDownMembers.innerHTML = "<option>Ingen</option>";
    for(let i = 0; i < currentMember.length; i++){
        dropDownMembers.innerHTML += `
            <option>${currentMember[i]}</option>
    `;
    }

    let outputText = document.getElementById("red-warning-text-drop-down");
    if(currentMembers.length == 0){
        outputText.innerHTML = `
            - Det er enda ikke blitt lagt til noen medlemmer på denne siden
`;
    } else{
        outputText.innerHTML = " ";
    }
}

function gettaskTitle() {
    return getLocalStorageAsJson("current-task");
}

function createNewTaskColumn(){
    let newColumnDiv = document.createElement("DIV");
    
    newColumnDiv.setAttribute("class", "content");
    newColumnDiv.draggable = true;
    let activeProject = getActiveProject();
    let columnID = activeProject.cardGroups.length;
    let newColumn = new Column("new Column",columnID);
   
    newColumnDiv.innerHTML = `
    <div class="content" name="${columnID}">
        <div class="header-content">
            <h2>new Column</h2>
            <div class="add-new-item-icon"><b>+</b></div>
        </div>
        <input type="text" class="change-column-name-input">
    </div>
    `;
    let moveAddNewContentBoxToRight = addNewContentBox;

    allColumns.appendChild(newColumnDiv);
    allColumns.appendChild(moveAddNewContentBoxToRight);

    let letUsScrollRight = document.getElementById("first-section");
    //Scroller til høyre når man kjører createNewTaskColumn, for å henge med når man bruker mer plass enn diven
    letUsScrollRight.scrollBy(400, 0);

    // Legger til i localstorage
    activeProject.cardGroups.push(newColumn);
    saveProject(activeProject);
}

function getUserFromLocalStorage(userName) {
    let userList = getLocalStorageAsJson("Users");
    for (const user in userList) {
        if(userList[user].userName == userName) {
            return userList[user].userName;
        }
    }
}

function getProjectMembers() {
    let project = getActiveProject();
    let names = [];
    for (const userIndex in project.projectMembers) {
        names.push(project.projectMembers[userIndex]);
    }
    return names;
}

function assertUserExist(userName) {
    let user = getUserFromLocalStorage(userName);
    if (user !=undefined && user !=null) {
        return true;
     }
     return false;
}

function addUserToProject(userName) {
        let user = getUserFromLocalStorage(userName);
        let project = getActiveProject();
        if(!getProjectMembers().includes(userName)) {
            project.projectMembers.push(user);
            saveProject(project);
        }
}

function getActiveProject() {
    let projects = getProjects();
    let activeProjectId = getLocalStorageAsJson("ActiveProject");
    for (let projIndex in projects) {
        if (projects[projIndex].projectId == activeProjectId) {
            return projects[projIndex];
        }
    }
}

function getProjects() {
    return getLocalStorageAsJson("Projects");
}

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

function assertProjectExist(projectId) {
    let projects = getProjects();
    if (projects.length > 0) {
        for (let prj in projects) {
            if (projects[prj].projectId == projectId) {
                return true;
            }
        }
    }
    return false;
}

function handleAddMembers(event){
    event.preventDefault();

    let memberInput = document.querySelector("[id='name-of-member']").value;

    if(currentMembers.innerHTML.includes(memberInput.toString())){
        alert("asd");
    }
    let user = getUserFromLocalStorage(memberInput);
    if (assertUserExist(memberInput)) {
        addUserToProject(user);

        //lagre medlemmer her, må endres senere for endring av prosjekt
        let nameShortage = memberInput.split(" ");
        let newElement = document.createElement("P");

        for(let i = 0; i < 2; i++){                   // Bruker 2 fordi vi bare vil ha første bokstaven i de 2 første navnene
            if(nameShortage.length > 1){
                newElement.innerHTML += nameShortage[i][0].toUpperCase();
                newElement.style.background = getRandomColor();
            }
            else if (i = 1){
                newElement.innerHTML += nameShortage[0][0].toUpperCase();
                newElement.innerHTML += nameShortage[0][1].toUpperCase();
                newElement.style.background = getRandomColor();
            }
        } 
        newElement.setAttribute("class", "current-members");

        currentMembers.appendChild(newElement);
        addMembersToDropDownMenu();  
    }else{
        alert("Du kan bare legge til eksisterende brukere");
    }

}
// EVENT ZONE_________________________________________________________________________________________________________________
//Click EVENTS___________________________________________________________________________________________________________

allColumns.addEventListener('click', (event) => {

    if (event.target.matches(".header-content h2")) {  // Endre kolonne tittel  
        let columnId = event.target.parentNode.parentNode.getAttribute("name");
        let columnInputBox = event.target.parentNode.nextElementSibling;
        let columnTitles = event.target;

        columnInputBox.style.display = "block";
        columnInputBox.focus();

        addEventListenerOnColumnTitles(columnTitles, columnInputBox ,columnId);
    }

    if (event.target.matches('.content-assignments')) { // åpne et kort
        holdingCardId = event.target.getAttribute("name");
        holdingColumnId = event.target.parentNode.getAttribute("name");
        let currCard = getCardFromColumn(holdingCardId,holdingColumnId);

        makeANewAssignmentDiv[0].style.display = "flex";

        updateDoneBtn.style.display = "block";
        doneBtn[0].style.display = "none";
    
        if(currCard.startDate.includes("T") === true){
            var formatStartDate = currCard.startDate.split("T");
            var formatEndDate = currCard.endDate.split("T");

            updatedStartDate.value = formatStartDate[0];
            updatedEndDate.value = formatEndDate[0]; 
        }
    
        updatedTaskTitle.innerHTML = currCard.title;
        updatedDescription.innerHTML = currCard.cardDesc;
        updatedResponsible.value = currCard.responsible;
        updatedStartTime.value = currCard.startTime;
        updatedEndTime.value = currCard.endTime;
        
        // Oppdaterer kortet   currentColumnDiv   putte inn id i information array?=
        updateDoneBtn.addEventListener("click", () => {
            updateCard(holdingCardId, holdingColumnId);
            makeANewAssignmentDiv[0].style.display = "none";
        });
    }

    if (event.target.parentNode.matches('.add-new-item-icon')) { //legge til nytt kort

        let columnIndex = event.target.parentNode.parentNode.parentNode.getAttribute("name");
        columnIndex = parseInt(columnIndex);
        const val = event.target.parentNode;
        showNewAssignment(val);
        currentColumnDiv = columnIndex;
    }
    
    if (event.target.matches("#add-new-content-box")) { // legge til ny kolonne
        createNewTaskColumn();  
        renderProject();
        location.reload();
    }

}, true);

// DRAG OVER EVENT
allColumns.addEventListener("dragover", (event) => { // Endre backgrunnsfarge på den diven
    event.preventDefault();
});

// DRAG EVENT
allColumns.addEventListener("drag", (event) => { //endre farge / opacity / størrelse på kolonne under mus, for å tydeliggjøre hvilken kolonne som er markert.
    event.preventDefault();
    if (event.target.matches(".content-assignments")) {
        holdingCardId = event.target.getAttribute("name");
        holdingColumnId = event.target.parentNode.getAttribute("name");
        
        holdingCardObject = event.target;
    }
});

var holdingCardObject;

// DRAG ENTER Event
allColumns.addEventListener("dragenter", (event) => { //endre farge / opacity på kolonne under mus, for å tydeliggjøre hvilken kolonne som er markert.
    event.preventDefault();
    if (event.target.matches(".header-content")) {
        event.target.style.backgroundColor = "rgba(71, 71, 71, 0.559)";
    }
    if (event.target.matches(".content-assignments")) {
        event.target.style.background = "rgb(238, 238, 238)";
    }
});


//DRAG LEAVE Event
allColumns.addEventListener("dragleave", (event) => { // sette farge fra dragEnter tilbake til opprinnelig farge
    event.preventDefault();
    if (event.target.matches(".header-content")) {
        event.target.style.backgroundColor = "darkgrey"; 
    }
});

// Cacher id
var holdingCardId;          // Lagrer id'en til card globalt
var holdingColumnId;        // Lagrer  id'en til kolonne globalt

allColumns.addEventListener("drop", (event) => {  //plassere card i en kolonne, eller flytte kolonne
    event.preventDefault();
    // IF SETNING NÅR EVENT:TARGET TREFFER EN KOLONNE MATCHES
    if (event.target.matches(".content-assignments")) {
        var tarColumnId = event.target.parentNode.getAttribute("name");
        var tarColumnLength = getActiveProject().cardGroups[tarColumnId].listOfCards.length;
        var holdingCardCurrId = getActiveProject().cardGroups[holdingColumnId].listOfCards[holdingCardId];
    }

    // Event i dette tilfelle vil vil den du sikter på, ikke den du holder
    let currCard = getCardFromColumn(holdingCardId, holdingColumnId);
    let targetColumnId = event.target.parentNode.getAttribute("name");

    currCard.cardId = tarColumnLength;
    
    moveCard(currCard, holdingCardId, holdingColumnId, targetColumnId);
    saveProject(currCard);
    renderProject();

    holdingCardCurrId = "";
    holdingCardId = "";
    holdingColumnId = "";
});

//Denne er feil, den må kun håndtere å legge til kort i en kolonne, den legger ikke til kolonner
function addColumnToLocalStorage(event) {
    event.preventDefault();

    let titleInput = document.querySelector("[id='task-title']").value;
    if (titleInput == "") {
        alert("Du må huske å skrive inn et navn som tittel");
    }

    let newElement = document.createElement("DIV");

    newElement.setAttribute("class", "content-assignments");
    newElement.innerHTML = titleInput;
    newElement.draggable = true;
    newElement.style.fontSize = "25px";
    newElement.style.color = "black";

    let currentColumns = document.getElementsByClassName("content");
    
    // Brukes til classes.js
    let description = document.querySelector("[id='description-box']").value;
    let responsible = document.querySelector("[id='drop-down-names']").value;
    let startDate = document.querySelector("[id='select-start-date']").value;
    let startTime = document.querySelector("[id='select-start-time']").value;
    let endDate = document.querySelector("[id='select-end-date']").value;
    let endTime = document.querySelector("[id='select-end-time']").value;

    let activeProject = getActiveProject();

    let cardId = activeProject.cardGroups[currentColumnDiv].listOfCards.length;
    let card = new Card(titleInput, description, responsible, startDate, startTime,
        endDate, endTime, cardId);
   
    newElement.setAttribute("name", cardId);

    currentColumns[currentColumnDiv].appendChild(newElement);   // LEGGER TIL KORT I EN KOLONNE 
    addCardToColumn(card,currentColumnDiv, card.cardId);        // LEGGER TIL KORT I EN KOLONNE I LOCALSTORAGE  //kanskje fjerne card.cardId 
    addNewTaskIcon[currentColumnDiv].style.display = "block";   // LEGGER TILBAKE + ICON PÅ DEN KOLONNEN MAN TRYKKET PÅ FØRST

}

//Column Functions      FUNKER
function addCardToColumn(card,columnId) {
    let project = getActiveProject();

    project.cardGroups[columnId].listOfCards.push(card);
            
    saveProject(project);
}

function updateCard(cardId, columnDiv){
    let project = getActiveProject();

    project.cardGroups[columnDiv].listOfCards[cardId].title = updatedTaskTitle.value;
    project.cardGroups[columnDiv].listOfCards[cardId].cardDesc = updatedDescription.value;
    project.cardGroups[columnDiv].listOfCards[cardId].responsible = updatedResponsible.value;
    project.cardGroups[columnDiv].listOfCards[cardId].startDate = updatedStartDate.value;
    project.cardGroups[columnDiv].listOfCards[cardId].startTime = updatedStartTime.value;
    project.cardGroups[columnDiv].listOfCards[cardId].endDate = updatedEndDate.value;
    project.cardGroups[columnDiv].listOfCards[cardId].endTime = updatedEndTime.value;
            
    saveProject(project); 
    renderProject();
}

function getCardFromColumn(cardId, columnId) {

    let cardsInColumn = getActiveProject().cardGroups[columnId].listOfCards;

    for(let i = 0; i < cardsInColumn.length; i ++){
        if(cardsInColumn[i].cardId == cardId){
            return cardsInColumn[i];
        }
    }
}

function moveCard(cardObj, holdingCardId, holdingColumnId, toCol) {
    addCardToColumn(cardObj,toCol);

    removeCardFromColumn(holdingCardId,holdingColumnId);
}

function removeCardFromColumn(holdingCardId, holdingColumnId) {
    let project = getActiveProject();
    
    project.cardGroups[holdingColumnId].listOfCards.splice(holdingCardId,1);
   
    project.cardGroups[holdingColumnId].listOfCards = project.cardGroups[holdingColumnId].listOfCards;
    saveProject(project);
}

function makeRightSideFunctionable(){
    let rightSideNav = document.getElementsByClassName("nav-bars");
    let rightSideCalendar = document.getElementById("right-side-calendar");
    let rightSideFiles = document.getElementById("right-side-files");
    let rightSideLinks = document.getElementById("right-side-links");
    
    for(let i = 0; i < rightSideNav.length; i++){
        rightSideNav[i].addEventListener("click", function(){
            if(this.innerHTML == "Kalender"){
                rightSideCalendar.style.display = "block";
                rightSideFiles.style.display = "none";
                rightSideLinks.style.display = "none";
            } else if(this.innerHTML == "Mer"){
                rightSideCalendar.style.display = "none";
                rightSideFiles.style.display = "block";
                rightSideLinks.style.display = "none";
            } else if(this.innerHTML == "Lenker"){
                rightSideCalendar.style.display = "none";
                rightSideFiles.style.display = "none";
                rightSideLinks.style.display = "block";
            }
        });
    }
}

makeRightSideFunctionable();


//      UPLOADE FILER
function uploadFiles(){
    var currentFile = document.getElementById("right-side-files");
    /* 
        gjør noe...
    */
    document.getElementById("links-output").innerHTML = "output noe her?";
}

/* GET FUNCTIONS */
function getRandomGradientColor(i){
    let b0 = "linear-gradient(to top, #134e5e, #71b280)";
    let b1 = "linear-gradient(to top, #16222a, #3a6073)";
    let b2 = "linear-gradient(to top, #659999, #f4791f)";
    let b3 = "background-image: radial-gradient( circle farthest-corner at 10% 20%,  rgba(0,52,89,1) 0%, rgba(0,168,232,1) 90% );"

    let listOfBackgrounds = [b0,b1,b2,b3];

    return listOfBackgrounds[i];
}

function getRandomColor(){
    let x1 = Math.floor(Math.random()*255);
    let x2 = Math.floor(Math.random()*255);
    let x3 = Math.floor(Math.random()*255);

    
    return `rgb(${x1},${x2},${x3})`;
}
// Bakgrunn script
let mainContainer = document.getElementsByTagName("body")[0];
function changeBackground(){
    
    let bakgrunn = document.getElementById("bakgrunn");


    for(i = 0; i < 10; i++){
        let box = document.createElement("DIV");
        box.style.width = "25px";
        box.style.height = "25px";
        box.style.float = "left";
        box.style.background = getRandomGradientColor(i);
        box.style.zIndex = 2;

        box.addEventListener("click", function(){
            mainContainer.style.background = box.style.background;
        });
        bakgrunn.appendChild(box);   
    }
}

changeBackground();

let outputLinksInfo = document.getElementById("output-links");
let linksBtn = document.getElementById("links-btn");

function getTextAreaValueLinks(){
    return document.getElementById("right-side-links-text-area").value;
}

function getTextAreaValueTitle(){
    return document.getElementById("right-side-links-text-area-title").value;
}

let rightSideTextAreaTitle = document.getElementById("right-side-links-text-area-title");
let rightSideTextArea = document.getElementById("right-side-links-text-area");


// Gjør at det blir mulig å skrive bare google.com feks.
linksBtn.addEventListener("click", function(){
    
    document.getElementById("right-side-links-header").innerHTML = 'Nyttige linker:';

    if(getTextAreaValueTitle().length == 0 || getTextAreaValueLinks().length == 0){
        // SKAL DET NOE HER?
    } else if(getTextAreaValueLinks().includes("https://")){
        outputLinksInfo.innerHTML += `<a href="${getTextAreaValueLinks()}" target = "_blank"> <h4><i>${getTextAreaValueTitle()}</h4></i></a><br>`;
        rightSideTextArea.value = "";
        rightSideTextAreaTitle.value = "";
    } else if(getTextAreaValueLinks().includes("www.")){
        outputLinksInfo.innerHTML += `<a href="https://${getTextAreaValueLinks()}" target = "_blank"> <h4><i>${getTextAreaValueTitle()}</h4></i></a><br>`;
        rightSideTextArea.value = "";
        rightSideTextAreaTitle.value = "";
    } else{
        var output = `<a href="https://www.${getTextAreaValueLinks()}" target = "_blank"> <h4><i>${getTextAreaValueTitle()}</i></h4></a><br>`;
        outputLinksInfo.innerHTML += output;
        rightSideTextArea.value = "";
        rightSideTextAreaTitle.value = "";
    }

    let storedLinks = getLocalStorageAsJson("CurrentLinks");
    storedLinks.push(output);
    setLocalStorageKeyValue("CurrentLinks", storedLinks);
    
});

// Henter inn dagens dato til kalenderen
Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});

let todaysDate = new Date().toDateInputValue();

document.getElementById("select-start-date").value = todaysDate;
document.getElementById("select-end-date").value = todaysDate;


function hamburgerMenuToggle(e) {
    e.classList.toggle("animation");
}

let toggleHamburger = false;
hamburgerMenu.addEventListener("click", () =>{
    
    if(!toggleHamburger){
        rightSideSection.style.display = "block";
        toggleHamburger = true;
    } else if(toggleHamburger){
        rightSideSection.style.display = "none";
        toggleHamburger = false;
    }
    
});
/// BYTTE TITTEL PÅ KOLONNER
function changeProjectTextProjectsPreview(){
    let clickableText = document.getElementsByClassName("clickable-text");
    let inputBoxes = document.getElementsByClassName("input-current-projects");

    makeTextReplaceAble(clickableText, inputBoxes);
}

function addEventListenerOnColumnTitles(columnTitles, columnInputBox, columnId){
    columnInputBox.addEventListener("keydown", (e) =>{
        if (e.keyCode == 13) {
            let columnName = columnInputBox.value;
            columnTitles.innerHTML = columnName;
            
            // MULIG BUG HVIS MAN KLIKKER SEG UT AV INPUT BOKSEN OG TILBAKE VIL DEN LAGRES X ANTALL GANGER
            // Lagrer navn i localstorage
            let project = getActiveProject();
            project.cardGroups[columnId].columnName = columnName;

            saveProject(project);

            columnInputBox.style.display = "none";
        } 
    });
    
    columnInputBox.addEventListener("focusout", () =>{
        columnInputBox.style.display = "none";
    });
}


function renderProject(){
    // Linker Rendering
    let currentLinks = getLocalStorageAsJson("CurrentLinks");
    for(let i = 0; i < currentLinks.length; i++){
        outputLinksInfo.innerHTML += currentLinks[i];
    }

    // Kolonne Rendering
    let currentColumns = getActiveProject().cardGroups;
    
    allColumns.innerHTML = "";
    for(let i = 0; i < currentColumns.length; i++){
        
        allColumns.innerHTML += `
        <div class="content" name="${currentColumns[i].columnId}">
            <div class="header-content">
                <h2>${currentColumns[i].columnName}</h2>
                <div class="add-new-item-icon"><b>+</b></div>
            </div>
            <input type="text" class="change-column-name-input">
        </div>
        `;
    }
    //let moveAddNewContentBoxToRight = addNewContentBox;
    allColumns.appendChild(addNewContentBox);
    
    let columnOutput = document.getElementsByClassName("content");
    columnOutput.innerHTML = "";
    // Cards Rendering
    for(let i = 0; i < currentColumns.length; i++){   // Antall kolonner (currentColumns hentes fra Kolonne Rendering)
        for(let j = 0; j < currentColumns[i].listOfCards.length; j++){  // Antall kort i hver kolonne

            let currentCard = document.createElement("DIV");

            currentCard.setAttribute("class", "content-assignments");
            currentCard.innerHTML = currentColumns[i].listOfCards[j].title;
            currentCard.draggable = true;
            currentCard.style.fontSize = "25px";
            currentCard.style.color = "black";
            currentCard.setAttribute("name", currentColumns[i].listOfCards[j].cardId);
            
            columnOutput[i].appendChild(currentCard);

            if(currentColumns[i].listOfCards[j].startDate.includes("T")){
                var formatStartDate = currentColumns[i].listOfCards[j].startDate.split("T");
                var formatEndDate = currentColumns[i].listOfCards[j].endDate.split("T");
    
                updatedStartDate.value = formatStartDate[0];
                updatedEndDate.value = formatEndDate[0]; 
            }
        
            // Information index [0,1,...,8] [title,desc,responisble,startDate,endDate,cardId,currentColumn]
            updatedTaskTitle.innerHTML = currentColumns[i].listOfCards[j].title;
            updatedDescription.innerHTML = currentColumns[i].listOfCards[j].cardDesc;
            updatedResponsible.value = currentColumns[i].listOfCards[j].responsible;
            updatedStartTime.value = currentColumns[i].listOfCards[j].startTime;
            updatedEndTime.value = currentColumns[i].listOfCards[j].endTime;
        }
    }

    // Kalender rendering    FIKS
    calendarOutput.innerHTML = "<h3>Trykk på en dato for å få finne ut hvilke oppgaver som er aktive på den dagen</h3>";

    // Legg til eksisterende bruker rendering
    let currentUsers = getLocalStorageAsJson("Users");
    for(let i = 0; i < currentUsers.length; i++){
        memberInputBox.innerHTML += `<option>${currentUsers[i].userName}</option>`;
    }

// addEventListenerOnColumnTitles(columnTitles, columnInputBox, columnId){

    
    let columnTitles = document.getElementsByTagName("h2");
    let columnInputBox = document.getElementsByClassName("change-column-name-input");
    

    for(let i = 0; i < columnTitles.length; i++){       // kan være det ikke er columnTitles?
        let columnId = getActiveProject().cardGroups[i].columnId;

        addEventListenerOnColumnTitles(columnTitles[i], columnInputBox[i], columnId);
    }

    addMembersToDropDownMenu();
    addColumnBtnEventListener();
    addNewCardBtnEventListener();
}
renderProject();



