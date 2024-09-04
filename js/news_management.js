//import Connection Class from connectionClass.js
import { Connection } from './classes/connectionClass.js';
import { Article } from './classes/articleClass.js';
import { images, articleImage } from './classes/imageClass.js';

// =========== CREATE GLOBAL VARIBALE =============================================
//make a instance for Connection Class
const instanceConnectionFireBase = new Connection()
let db = instanceConnectionFireBase.getDBConnection()
//Declare a varibale for determine whether the user uploaded a photo or not
let isuploadedPhoto = false
//Declare essential variable 
let articleID = ""
let userID = ""
var current_username = getCookieforArray("username");
if (current_username) {
    userID = current_username
} else {
    userID = "admin@gmail.com"
}

let imgContent = ""
let isMainPhoto = 1
let documentID = ""
let mainheading = ""
let subheading = ""
let content = ""
let topic = ""
let videolink = ""
let isdeleted = 0
let isuploadedIMGSuccess = false


//=============  DEFINITON FOR FUNCTIONS ==========================================
function clearAllControls() {
    let txtmainheadline = document.getElementById('txtNewsHeadLine')
    let txtSubHeadLine = document.getElementById('txtSubHeadLine')
    let comboxTopic = document.getElementById('comboxTopic')
    let txtContent = document.getElementById('txtContent')
    txtmainheadline.value = ""
    txtSubHeadLine.value = ""
    comboxTopic.value = ""
    txtContent.innerHTML = ""
    var resulttxt = document.getElementById("resultofquiz")
    resulttxt.style.display = "none"
    //clear label img
    let labelIMG = document.getElementById("labelIMG")
    labelIMG.innerText = "Choose photo for the news ..."
    // hide the done progress bar
    hideDoneProgress()
    //
    let videoInput = document.getElementById("txtVideoLink")
    videoInput.style.display = "none"
    let imgresult = document.getElementById("resultofuploadedIMG")
    imgresult.src = "images/pictureicon.png"
}

function isEmptyString(str) {
    return str === '' || str === null || str === undefined;
}


function checkEmptyAllControls() {
    let isEmpty = false;
    let txtmainheadline = document.getElementById('txtNewsHeadLine')
    let txtSubHeadLine = document.getElementById('txtSubHeadLine')
    let comboxTopic = document.getElementById('comboxTopic')
    let txtContent = document.getElementById('txtContent')

    if (isEmptyString(txtmainheadline.value)) {
        console.log("Empty Main HeadLines!")
        isEmpty = true
    }

    if (isEmptyString(txtSubHeadLine.value)) {
        console.log("Empty SubLines!")
        isEmpty = true
    }

    if (isEmptyString(txtContent.innerText)) {
        console.log("Empty Content!")
        isEmpty = true
    }

    if (isEmptyString(comboxTopic.value)) {
        console.log("Empty Topic!")
        isEmpty = true
    }

    return isEmpty;
}

function generateTimestampId() {
    const timestamp = new Date().getTime();
    return userID + "_" + timestamp;
}

function handleFileUpload() {
    isuploadedPhoto = false
    const inputImgFile = document.getElementById('inputImgFile');
    const file = inputImgFile.files[0];

    if (file) {
        // File selected
        const fileName = file.name;
        let labelIMG = document.getElementById("labelIMG")
        labelIMG.innerText = fileName
        console.log('File selected:', fileName);
        imgContent = file
        isuploadedPhoto = true
        showImage(imgContent)

        // You can do further processing with the file here, such as uploading it to a server
    } else {
        console.log('No file selected');
    }
}

function showImage(file) {
    const reader = new FileReader();
    reader.onload = (event) => {
        const imgElement = document.getElementById('resultofuploadedIMG');
        imgElement.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

function showRunningProgress() {
    let progressbarrunning = document.getElementById('progresssrunning')
    progressbarrunning.style.display = "flex"
}

function hideRunningProgress() {
    let progressbarrunning = document.getElementById('progresssrunning')
    progressbarrunning.style.display = "none"
}

function showDoneProgress() {
    let progressbarrunning = document.getElementById('progressfinished')
    progressbarrunning.style.display = "flex"
}

function hideDoneProgress() {
    let progressbarrunning = document.getElementById('progressfinished')
    progressbarrunning.style.display = "none"
}
function ComboxUserChange() {
    let selectControl = document.getElementById("comboxTopic")
    let inputVideo = document.getElementById("txtVideoLink")

    if (selectControl.value !== "" && selectControl.value === "video") {
        inputVideo.style.display = "flex"
    } else {
        inputVideo.style.display = "none"
    }
}

// functions for formart font size, color 
function ChangeFontType() {
    var control = document.getElementById("selectFontControl")
    var fonttype = control.value

    // const customArea = document.getElementById('customarea');
    const selectedText = window.getSelection().toString();
    console.log(selectedText)
    const range = window.getSelection().getRangeAt(0);

    const newNode = document.createElement('span');
    newNode.style.fontFamily = fonttype
    newNode.textContent = selectedText;

    range.deleteContents();
    range.insertNode(newNode);
}



function changeFontSize() {
    var control = document.getElementById("FontSizeControl")
    var fontSize = control.value

    // const customArea = document.getElementById('customarea');
    const selectedText = window.getSelection().toString();
    console.log(selectedText)
    const range = window.getSelection().getRangeAt(0);

    const newNode = document.createElement('span');
    newNode.style.fontSize = fontSize
    newNode.textContent = selectedText;

    range.deleteContents();
    range.insertNode(newNode);
}



function ChangetextColor() {
    var control = document.getElementById("myColor")
    var fontcolor = control.value
    // const customArea = document.getElementById('customarea');
    const selectedText = window.getSelection().toString();
    console.log(selectedText)
    const range = window.getSelection().getRangeAt(0);
    console.log(range)
    const newNode = document.createElement('span');
    newNode.textContent = selectedText;
    newNode.style.color = fontcolor
    range.deleteContents();
    range.insertNode(newNode);
    window.getSelection().removeAllRanges(); // Clears the old selection
    const newRange = document.createRange(); // Creates a new range
    newRange.selectNode(newNode); // Selects the new node
    window.getSelection().addRange(newRange); // Applies the new range
}

function BolderBold() {
    // const customArea = document.getElementById('customarea');
    const selectedText = window.getSelection().toString();
    console.log(selectedText)
    const range = window.getSelection().getRangeAt(0);

    const newNode = document.createElement('span');
    newNode.style.fontWeight = "800"
    newNode.textContent = selectedText;

    range.deleteContents();
    range.insertNode(newNode);
}

function Italic() {
    // const customArea = document.getElementById('customarea');
    const selectedText = window.getSelection().toString();
    console.log(selectedText)
    const range = window.getSelection().getRangeAt(0);

    const newNode = document.createElement('span');
    newNode.style.fontStyle = "italic"
    newNode.textContent = selectedText;

    range.deleteContents();
    range.insertNode(newNode);
}

function underLine() {
    // const customArea = document.getElementById('customarea');
    const selectedText = window.getSelection().toString();
    console.log(selectedText)
    const range = window.getSelection().getRangeAt(0);

    const newNode = document.createElement('span');
    newNode.style.textDecoration = "underline"
    newNode.textContent = selectedText;

    range.deleteContents();
    range.insertNode(newNode);
}

function AlignCenter() {
    const selectedText = window.getSelection().toString();
    console.log(selectedText)
    const range = window.getSelection().getRangeAt(0);

    const newNode = document.createElement('span');
    newNode.textContent = selectedText;
    newNode.style.display = "inline-block";  // or "block" based on your needs
    newNode.style.textAlign = "center";
    newNode.style.width = "100%";

    range.deleteContents();
    range.insertNode(newNode);
    window.getSelection().removeAllRanges(); // Clears the old selection
    const newRange = document.createRange(); // Creates a new range
    newRange.selectNode(newNode); // Selects the new node
    window.getSelection().addRange(newRange); // Applies the new range
}

function AlignRight() {
    const selectedText = window.getSelection().toString();
    console.log(selectedText)
    const range = window.getSelection().getRangeAt(0);

    const newNode = document.createElement('span');
    newNode.textContent = selectedText;
    newNode.style.display = "inline-block";  // or "block" based on your needs
    newNode.style.textAlign = "right";
    newNode.style.width = "100%";

    range.deleteContents();
    range.insertNode(newNode);
    window.getSelection().removeAllRanges(); // Clears the old selection
    const newRange = document.createRange(); // Creates a new range
    newRange.selectNode(newNode); // Selects the new node
    window.getSelection().addRange(newRange); // Applies the new range
}

function AlignLeft() {
    const selectedText = window.getSelection().toString();
    console.log(selectedText)
    const range = window.getSelection().getRangeAt(0);

    const newNode = document.createElement('span');
    newNode.textContent = selectedText;
    newNode.style.display = "inline-block";  // or "block" based on your needs
    newNode.style.textAlign = "left";
    newNode.style.width = "100%";

    range.deleteContents();
    range.insertNode(newNode);
    window.getSelection().removeAllRanges(); // Clears the old selection
    const newRange = document.createRange(); // Creates a new range
    newRange.selectNode(newNode); // Selects the new node
    window.getSelection().addRange(newRange); // Applies the new range
}

function AlignJustify() {
    const selectedText = window.getSelection().toString();
    console.log(selectedText)
    const range = window.getSelection().getRangeAt(0);

    const newNode = document.createElement('span');
    newNode.textContent = selectedText;
    newNode.style.display = "inline-block";  // or "block" based on your needs
    newNode.style.textAlign = "justify";
    newNode.style.width = "100%";

    range.deleteContents();
    range.insertNode(newNode);
    window.getSelection().removeAllRanges(); // Clears the old selection
    const newRange = document.createRange(); // Creates a new range
    newRange.selectNode(newNode); // Selects the new node
    window.getSelection().addRange(newRange); // Applies the new range
}

function CapitalizeText() {
    const selectedText = window.getSelection().toString();
    console.log(selectedText)
    const range = window.getSelection().getRangeAt(0);

    const newNode = document.createElement('span');
    newNode.textContent = selectedText.toUpperCase()

    range.deleteContents();
    range.insertNode(newNode);
    window.getSelection().removeAllRanges(); // Clears the old selection
    const newRange = document.createRange(); // Creates a new range
    newRange.selectNode(newNode); // Selects the new node
    window.getSelection().addRange(newRange); // Applies the new range
}



// ============  CATCH USERS' EVENTS ==============================================
// document.getElementById('txtContent').addEventListener('input', highlightSelectedText);

document.getElementById('btncapitalize').addEventListener('click', CapitalizeText);

document.getElementById('btnBold').addEventListener('click', BolderBold);

document.getElementById('btnTextAlignJustify').addEventListener('click', AlignJustify);

document.getElementById('btnTextAlignRight').addEventListener('click', AlignRight);

document.getElementById('btnTextAlignCenter').addEventListener('click', AlignCenter);

document.getElementById('btnTextAlignLeft').addEventListener('click', AlignLeft);

document.getElementById('btnItalic').addEventListener('click', Italic);

document.getElementById('btnUnderLine').addEventListener('click', underLine);

document.getElementById('FontSizeControl').addEventListener('change', changeFontSize);

document.getElementById('myColor').addEventListener('change', ChangetextColor);

document.getElementById('selectFontControl').addEventListener('change', ChangeFontType);

document.getElementById('comboxTopic').addEventListener('change', ComboxUserChange);



// User click the upload button
document.getElementById('btnUploadIMG').addEventListener('click', handleFileUpload);

// userclick refresh
document.getElementById('clearcontrols').addEventListener('click', clearAllControls);

// User click submit button
var buttonsubmit = document.getElementById("btnsubmit")
buttonsubmit.addEventListener('click', function () {
    showRunningProgress()
    let checkresults = checkEmptyAllControls()
    if (checkresults === false) {
        console.log("\n ok not empty!")
        if (isuploadedPhoto) {
            //create a documentID for this
            documentID = generateTimestampId()
            articleID = "art" + "_" + documentID

            //prepare data 
            mainheading = document.getElementById('txtNewsHeadLine').value.trim()
            subheading = document.getElementById('txtSubHeadLine').value.trim()
            topic = document.getElementById('comboxTopic').value.trim()
            content = document.getElementById('txtContent').innerHTML
            videolink = document.getElementById('ContentVideoLink').value.trim()
            // //make a instance for image Class 
            const instanceIMGClass = new articleImage(articleID, userID, imgContent, isMainPhoto, isdeleted, db, documentID)
            instanceIMGClass.addImgToDatabase(db, documentID, imgContent)
            setTimeout(function () {
                var uploadresult = getCookieforArray("uploadedimgresult");
                if (uploadresult === "success") {
                    console.log("Upload the picture successfully!")
                    deleteCookie("uploadedimgresult");

                    // upload insert news data to database
                    //make a instance for article Class 
                    const instanceArticleClass = new Article(articleID, userID, mainheading, subheading, content, topic, isdeleted, db, documentID)

                    //insert to firebase
                    instanceArticleClass.inserttoDatabase(videolink)
                    //control progress bars
                    hideRunningProgress()
                    showDoneProgress()
                } else {
                    hideRunningProgress()
                    alert("Cannot upload this picture!")
                }
            }, 1000)


        } else {
            hideRunningProgress()
            alert("You need to choose a photo for this news!")
        }
    } else {
        hideRunningProgress()
        alert("Some Information is missing!")
    }


})

var current_username = getCookieforArray("username");
let welcomelogo = document.getElementById("welcometxt")

if (current_username !== null) {
    welcomelogo.innerText = "Welcome, " + current_username
} else {
    // window.location.href = "login.html"
    welcomelogo.innerText = "Welcome, guest"
}



