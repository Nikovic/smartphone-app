var deviceReady = false;
document.addEventListener('deviceready', onDeviceReady, false);

document.addEventListener("backbutton", backbuttonBehavior, false);

var currentSite;
//the HTMLCollection of all "sites" (aka pseudo-site divs)
var siteArray = [];

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

    if (document.getElementById("note").getAttribute("localStorageId") == "") {
        //I REALLY should make this check if the number has already been used but I'm way in over my head anyway... and tbh, this is funny
        document.getElementById("note").setAttribute("localStorageId", getRandomId());
    }
    
    console.log("the note-div's 'localStorageId' is: " + document.getElementById("note").getAttribute("localStorageId"));
    
    var titleTextArea = document.createElement("textarea");
    titleTextArea.setAttribute("id", "newNoteTitle");
    titleTextArea.setAttribute("class", "textArea");
    titleTextArea.setAttribute("maxlength", "500");
    titleTextArea.setAttribute("rows", "2");
    titleTextArea.setAttribute("placeholder", "Add an Title");

    var contentTextArea = document.createElement("textarea");
    contentTextArea.setAttribute("id", "newNoteContent");
    contentTextArea.setAttribute("class", "textArea");
    contentTextArea.setAttribute("maxlength", "10000");
    contentTextArea.setAttribute("rows", "10");
    contentTextArea.setAttribute("placeholder", "Main Content Here");

    document.getElementById("note").appendChild(titleTextArea);
    document.getElementById("newNoteTitle").focus();
    document.getElementById("note").appendChild(contentTextArea);
    
    console.log(document.getElementById("note").getAttribute("localStorageId"));
}

function safeNewNote() {
    var titleElement = document.getElementById("newNoteTitle");
    var title = titleElement.value.trim();
    console.log(title);
    var content = document.getElementById("newNoteContent").value.trim();

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

        var localStorageName = document.getElementById("note").getAttribute("localStorageId");
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
}

function deleteNote() {
    var noteDiv = document.getElementById("note");
    noteDiv.removeChild(document.getElementById("newNoteTitle"));
    noteDiv.removeChild(document.getElementById("newNoteContent"));
    document.getElementById("note").dataset.localStorageId = "";
}

initSites();