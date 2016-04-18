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

function backbuttonBehavior () {
    if (currentSite != document.getElementById("homepage")){
        switchVisibleSite("homepage");
    }
}

initSites();

//function newNote(){'blablabla_textarea'.focus();}

/*function safeNewNote(){
var title =
var content =
'blablabla_textarea'.blur();}
*/

//function to stop creation of new notes when form.elements.length (if this exists) > 1