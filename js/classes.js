class SetAssignment{

    static array = [];

    constructor(title, description, responsible, startDate, startTime, endDate, endTime){
        this.title = title;
        this.description = description;
        this.responsible = responsible;
        this.startDate = startDate;
        this.startTime = startTime;
        this.endDate = endDate;
        this.endTime = endTime;

        SetAssignment.array.push(this);
    }
    // test
    getTitles(){
        return SetAssignment.array.title;
    }
    
}

class Project{
    constructor(projectName, projectLeader){
        this.projectName = projectName;
        this.projectLeader = projectLeader;
        this.projectMembers = [];
        this.projectMembers.push(projectLeader);
        this.projectId = 0;
        this.cardGroups = [];
        this.projectBackground = "27, 174, 233";

        //Project.array.push(this);
    }
    addMemeber(member) {
        this.projectMembers.push(member);
    }
    removeMember(member) {
        if (this.projectMembers.includes(member)) {
            let memberIndex = this.projectMembers.indexOf(member);
            this.projectMembers.splice(memberIndex,1);
        }
    }
    createCardGroup() {
        this.cardGroups.push(new CardGroup);
    }
}

class Column {

    columnName = "New column";
    listOfCards = [];
    columnId = 0; // Mulig vi ikke trenger

    constructor(columnName,columnId) {
        this.columnName = columnName;
        this.columnId = columnId;
    }
}

class Card {
    constructor(title, cardDesc, responsible, startDate, startTime, endDate, endTime, cardId) {
        this.title = title;
        this.cardDesc = cardDesc;
        this.responsible = [responsible];
        this.endDate = new Date(endDate);
        this.startDate = new Date(startDate);
        this.startTime = startTime;
        this.endTime = endTime;
        this.cardId = cardId;
    }
    changeTitle(newTitle) {
        this.title = newTitle;
    }

    changeDescription(newDesc) {
        this.cardDesc = newDesc;
    }
    addMember(member) {
        this.responsible.push(member);
    }
    removeMember(member) {
        if (this.responsible.includes(member)) {
            let memberIndex = this.responsible.indexOf(member);
            this.responsible.splice(memberIndex,1);
        }
    }
}

class User {
    constructor(userName, password) {
        this.userName = userName;
        this.password = password;
        this.projectIds = [];
    }

    addProject(project) {
        this.projectsPartOf.push(project);
    }

    removeProject(project) {
        if (this.projectsPartOf.includes(project)) {
            let projectIndex = this.projectsPartOf.indexOf(project);
            this.projectsPartOf.splice(projectIndex,1);
        }
    }


    get username() {
        this.userName;
    }

    validate(userName, password) {
       return (this.userName === userName && this.password === password);
    }
}