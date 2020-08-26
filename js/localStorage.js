
// Returns The LocalStorage in JSON format if it exists, if not it will return a empty list.
function getLocalStorageAsJson(itemName) {
    return JSON.parse(window.localStorage.getItem(itemName)) || [];
}

/* sets the matching keyName to be equal to the given keyValue,
 keep in mind this alone will remove any data in the key value pair, unless
the keyvalue sent as argument also contains the old keyvalue.
*/
function setLocalStorageKeyValue(keyName, keyValue) {
    localStorage.setItem(keyName,JSON.stringify(keyValue));
}


// Boolean check to see if the given key currently exist in localstorage
function keyNameInStorage(keyNameTocheckFor) {
    if (localStorage.getItem(keyNameInStorage)===null) {
        return true;
    }
    return false;
}

// Returns the value of the given key
function getLocalStorageKeyValue(keyName) {
    localStorage.getItem(keyName);
}

// Removes the key with the given name
function removeKey(keyName) {
    localStorage.removeItem(keyName);
}

// Get all Keynames from localstorage as a list of strings
function getKeyNamesAsList() {
    let keys = [];
    for (var i = 0; i < localStorage.length; i++) {
        keys.push(window.localStorage.key(i));
    }
    return keys;
}

// Listen for events in localstorage, doesnt necessarily need the list of keys in storage
/*
window.addEventListener("storage"), function(event) {
    let keysInStorage = getKeyNamesAsList();
    if (keysInStorage.includes(event.key)) {

    }
}
*/

// Completely Empties the local storage
function clearLocalStorage() {
    window.localStorage.clear();
}

/*
Functions used to handle DomChanges
*/

// We will use the page body to handle propogation of events somehow.
const mainBody = "Main-body";

function eventMaster() {
    let body = document.querySelector(mainBody);
    body.addEventListener("click", clickHandler,false);
}

function clickHandler(e) {
    event.preventDefault();
    // find the event target
} 
