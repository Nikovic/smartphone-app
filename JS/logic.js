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

function newNote() {
    if (document.getElementById("newNoteTitle2")) {
        safeNewNote();
        deleteNote();
    }
    var titleTextArea = document.createElement("textarea");
    titleTextArea.setAttribute("id", "newNoteTitle2");
    titleTextArea.setAttribute("class", "textArea");
    titleTextArea.setAttribute("maxlength", "500");
    titleTextArea.setAttribute("rows", "2");
    document.getElementById("note").appendChild(titleTextArea);
    document.getElementById("newNoteTitle2").focus();


    var contentTextArea = document.createElement("textarea");
    contentTextArea.setAttribute("id", "newNoteContent2");
    contentTextArea.setAttribute("class", "textArea");
    contentTextArea.setAttribute("maxlength", "10000");
    contentTextArea.setAttribute("rows", "10");
    document.getElementById("note").appendChild(contentTextArea);
}

function safeNewNote() {
    /*
1) check if empty
2) check if an localstorage-id has been assigned and if not create one (distinct from others localStorage) and assign
3) take the title, content and any metadata and put them in the right order and so
4) safe to localStorage

var title =
var content =
'blablabla_textarea'.blur();*/
}

function deleteNote() {
    var noteDiv = document.getElementById("note");
    noteDiv.removeChild(document.getElementById("newNoteTitle2"));
    noteDiv.removeChild(document.getElementById("newNoteContent2"));
}

initSites();