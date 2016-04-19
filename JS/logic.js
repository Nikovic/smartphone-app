var deviceReady = false;
document.addEventListener('deviceready', onDeviceReady, false);

document.addEventListener("backbutton", backbuttonBehavior, false);

var currentSite;
//the HTMLCollection of all "sites" (aka pseudo-site divs)
var siteArray = [];

var numberOfVisibleNotes = 30;

//really, this should be what calls initSites, but since I don't want to introduce tons of code to make sure it is called at some point even if the app isn't run in Cordova/PhoneGap, I'm not going to do it. If/When I want to do it, this site knows how http://stackoverflow.com/questions/12576062/jquery-document-ready-vs-phonegap-deviceready
function onDeviceReady() {
    console.log("device is ready, whatever that means");
    deviceReady = true;
}

function initSites() {
    var tempSiteContainer = document.getElementsByClassName('site');
    for (var i = 0; i < tempSiteContainer.length; i++) {
        siteArray.push(tempSiteContainer[i]);
        siteArray[i].style.display = "none";
    }
    switchVisibleSite("homepage");
    initViewNote(numberOfVisibleNotes);
    console.log("initSites() has been called");
}

function switchVisibleSite(targetSiteId) {
    //get and temporarily store the target "site"
    var targetSite = document.getElementById(targetSiteId);
    //(try to) set current site's display to none, does nothing when called for the first time (in "initSites()") since there is no current site yet
    try {
        currentSite.style.display = "none";
    } catch (err) {}
    targetSite.style.display = "block";
    currentSite = targetSite;
}

function backbuttonBehavior() {
    if (currentSite != document.getElementById("homepage")) {
        switchVisibleSite("homepage");
    }
}

function getRandomId() {
    var min = 0;
    var max = 1000000;
    return Math.floor(Math.random() * (max - min)) + min;
}

function openNote() {
    if (document.getElementById("newNoteTitle")) {
        safeNewNote();
        deleteNote();
        console.log("there was a note in the way, safed and deleted it")
    }

    if (document.getElementById("newNote").getAttribute("localStorageId") == "") {
        //I REALLY should make this check if the number has already been used but I'm way in over my head anyway... and tbh, this is funny
        document.getElementById("newNote").setAttribute("localStorageId", getRandomId());
    }

    console.log("the note-div's 'localStorageId' is: " + document.getElementById("newNote").getAttribute("localStorageId"));

    var titleTextArea = document.createElement("textarea");
    titleTextArea.setAttribute("id", "newNoteTitle");
    titleTextArea.setAttribute("class", "textArea title");
    titleTextArea.setAttribute("maxlength", "500");
    titleTextArea.setAttribute("rows", "2");
    titleTextArea.setAttribute("placeholder", "Add an Title");

    var contentTextArea = document.createElement("textarea");
    contentTextArea.setAttribute("id", "newNoteContent");
    contentTextArea.setAttribute("class", "textArea content");
    contentTextArea.setAttribute("maxlength", "10000");
    contentTextArea.setAttribute("rows", "10");
    contentTextArea.setAttribute("placeholder", "Main Content Here");

    document.getElementById("newNote").appendChild(titleTextArea);
    document.getElementById("newNoteTitle").focus();
    document.getElementById("newNote").appendChild(contentTextArea);
}

function openExistingNote(title, content, localStorageId, targetDivId) {
    var targetDiv = document.getElementById(targetDivId);

    //make sure there's nothing there
    while (targetDiv.firstChild) {
        targetDiv.removeChild(targetDiv.firstChild);
    }

    targetDiv.setAttribute("localStorageId", localStorageId);


    console.log("the note-div's 'localStorageId' is: " + localStorageId);

    var titleTextArea = document.createElement("textarea");
    titleTextArea.setAttribute("id", targetDivId + "Title");
    titleTextArea.setAttribute("class", "textArea title");
    titleTextArea.setAttribute("maxlength", "500");
    titleTextArea.setAttribute("rows", "2");
    titleTextArea.setAttribute("placeholder", "Add an Title");
    titleTextArea.value = title;

    var contentTextArea = document.createElement("textarea");
    contentTextArea.setAttribute("id", targetDivId + "Content");
    contentTextArea.setAttribute("class", "textArea content");
    contentTextArea.setAttribute("maxlength", "10000");
    contentTextArea.setAttribute("rows", "10");
    contentTextArea.setAttribute("placeholder", "Main Content Here");
    contentTextArea.value = content;

    targetDiv.appendChild(titleTextArea);
    targetDiv.appendChild(contentTextArea);
}

function safeNewNote() {
    var titleElement = document.getElementById("newNoteTitle");
    var title = titleElement.value;
    console.log(title);
    var content = document.getElementById("newNoteContent").value;

    //I need to have titleLength always be of a certain length so I now weird stuff happens when opening the note (reading the string) later on
    if (title.length > 0 || content.length > 0) {
        var titleLength = (function () {
            if (title.length < 1) {
                return "000";
            }
            if (title.length < 10) {
                return "00" + title.length;
            }
            if (title.length < 100) {
                return "0" + title.length;
            }
            return title.length;
        })();

        var localStorageName = document.getElementById("newNote").getAttribute("localStorageId");
        window.localStorage.setItem(localStorageName, titleLength + title + content);
        console.log("safeNote() was called and localStorageName is: " + localStorageName);
    } else {
        console.log("title || content apparently both empty");
    }
    /* Once I do this properly:
        1) check if everything is empty (if it is, I don't want to safe anything, right?)
    2) check if an localstorage-id has been assigned and if not create one (distinct from others localStorage) and assign
    3) take the title, content and any metadata and put them in the right order and so
    4) safe to localStorage
    */
    updateViewNote(numberOfVisibleNotes);
}

function deleteNote() {
    var noteDiv = document.getElementById("newNote");
    noteDiv.removeChild(document.getElementById("newNoteTitle"));
    noteDiv.removeChild(document.getElementById("newNoteContent"));
    document.getElementById("newNote").setAttribute("localStorageId", "");
}

function openNoteByName(localStorageName, targetDivId) {
    noteReader(localStorageName, targetDivId);
}

function openNoteByLocation(localStorageIndex, targetDivId) {
    if (window.localStorage.key(localStorageIndex)) {
        noteReader(window.localStorage.key(localStorageIndex), targetDivId);
    }
}

//actually makes the conversion from one long string with all the data (title, content, metadata) to the note and immediately puts it in the target Div (has to be a note thingy)
function noteReader(localStorageName, targetDivId) {
    var localStorageValue = window.localStorage.getItem(localStorageName)
    var titleLength = +localStorageValue.substring(0, 3);
    var title = localStorageValue.substring(3, 3 + titleLength);
    var content = localStorageValue.substring(3 + titleLength);
    openExistingNote(title, content, localStorageName, targetDivId)
}

function initViewNote(numberOfNotes) {
    var noteViewContainer = document.getElementById("viewNote");
    var divToAttach;
    for (var i = 0; i < numberOfNotes; i++) {
        divToAttach = document.createElement("div");
        divToAttach.setAttribute("id", "noteView" + i);
        divToAttach.setAttribute("localStorageId", "");
        noteViewContainer.appendChild(divToAttach);
    }
    updateViewNote(numberOfNotes);
}

function updateViewNote(numberOfNotes) {
    for (var i = 0; i < numberOfNotes; i++) {
        var targetDivId = "noteView" + i;
        openNoteByLocation(i, targetDivId);
    }
    console.log("omg is dis real lyfe?");
}

initSites();