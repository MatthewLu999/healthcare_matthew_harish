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
let userID = "matthew@gmail.com"
let imgContent = ""
let isMainPhoto = 1
let documentID = ""
let mainheading = ""
let subheading = ""
let content = ""
let topic = ""
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
    txtContent.value = ""
    var resulttxt = document.getElementById("resultofquiz")
    resulttxt.style.display = "none"
    //clear label img
    let labelIMG = document.getElementById("labelIMG")
    labelIMG.innerText = "Choose photo for the news ..."
    // hide the done progress bar
    hideDoneProgress()
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

    if (isEmptyString(txtContent.value)) {
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



// ============  CATCH USERS' EVENTS ==============================================

// User click the upload button
document.getElementById('btnUploadIMG').addEventListener('click', handleFileUpload);

// userclick refresh
document.getElementById('clearcontrols').addEventListener('click', clearAllControls);

// User click submit button
var buttonsubmit = document.getElementById("btnsubmit")
buttonsubmit.addEventListener('click', function () {
    showRunningProgress()
    console.log("okmen")
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
            content = document.getElementById('txtContent').value.trim()

            //make a instance for image Class 
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
                    instanceArticleClass.inserttoDatabase()
                    //control progress bars
                    hideRunningProgress()
                    showDoneProgress()
                } else {
                    hideRunningProgress()
                    alert("Cannot upload this picture!")
                }
            }, 500)


        } else {
            hideRunningProgress()
            alert("You need to choose a photo for this news!")
        }
    } else {
        hideRunningProgress()
        alert("Some Information is missing!")
    }


})



