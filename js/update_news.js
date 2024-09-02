//import Connection Class from connectionClass.js
import { Connection } from './classes/connectionClass.js';
import { Article } from './classes/articleClass.js';
import { images, articleImage } from './classes/imageClass.js';


// =========== CREATE GLOBAL VARIBALE =============================================
//make a instance for Connection Class
const instanceConnectionFireBase = new Connection()
let db = instanceConnectionFireBase.getDBConnection()
const instanceArticleClass = new Article()
let myModal
let myModalUpdateNews
let docid
let artcileid

//=============  DEFINITON FOR FUNCTIONS ==========================================
function showConfirmModal(btnControl) {
    myModal = new bootstrap.Modal(document.getElementById('confirmModal'), {
        keyboard: false
    });
    myModal.show();
}

function showConfirmModalUpdateNews(btnControl) {
    myModalUpdateNews = new bootstrap.Modal(document.getElementById('UpdateNewsmModal'), {
        keyboard: false
    });

    docid = btnControl.getAttribute("data-docid")
    artcileid = btnControl.getAttribute("data-articleid")
    let content = btnControl.getAttribute("data-content")
    let topic = btnControl.getAttribute("data-topic")
    let mainhead = btnControl.getAttribute("data-mainhead")
    let subhead = btnControl.getAttribute("data-subhead")
    //assign the current value to inputs of the modal 
    let txtmainheadline = document.getElementById('txtNewsHeadLine')
    let txtSubHeadLine = document.getElementById('txtSubHeadLine')
    let comboxTopic = document.getElementById('comboxTopic')
    let txtContent = document.getElementById('txtContent')
    txtmainheadline.value = mainhead
    txtSubHeadLine.value = subhead
    txtContent.value = content
    comboxTopic.value = topic

    //==========
    myModalUpdateNews.show();
}



// CALL BACK FUNCTIONS 
// UPDATE NEWS
function cancelActionUpdateNews() {
    myModalUpdateNews.hide()
}

function confirmActionUpdateNews() {
    //prepare data 
    let mainheading = document.getElementById('txtNewsHeadLine').value.trim()
    let subheading = document.getElementById('txtSubHeadLine').value.trim()
    let topic = document.getElementById('comboxTopic').value.trim()
    let content = document.getElementById('txtContent').value.trim()

    // upload insert news data to database
    //make a instance for article Class 
    const instanceArticleClass = new Article(artcileid, '', mainheading, subheading, content, topic, 0, db, docid)

    //insert to firebase
    instanceArticleClass.updatetoDatabase(db)
    myModalUpdateNews.hide()
    getAllNews()
}

// DELETE NEWS
function cancelActionDelete() {
    myModal.hide()
}

function confirmActionDelete() {
    console.log('Decided to deleted this news!');

    //make a instance for article Class 
    const instanceArticleClass = new Article(artcileid, '', '', '', '', '', 1, db, docid)

    //insert to firebase
    instanceArticleClass.deletetoDatabase(db)
    myModal.hide()
    getAllNews()

}


function showRunningProgress() {
    let progressbarrunning = document.getElementById('progresssrunning')
    progressbarrunning.style.display = "flex"
}

function hideRunningProgress() {
    let progressbarrunning = document.getElementById('progresssrunning')
    progressbarrunning.style.display = "none"
}

async function getAllNews() {
    showRunningProgress()
    console.log("\n Get all news from FireBase")

    let articlecollections = await instanceArticleClass.getAllArticles(db)
    console.log(articlecollections)

    // create table for news
    let contentHTML = await instanceArticleClass.getTableHTML(db, articlecollections)
    let newsArea = document.getElementById("AreaNewsTable")
    newsArea.innerHTML = ""
    newsArea.appendChild(contentHTML)
    setTimeout(() => {
        hideRunningProgress()
    }, 1000);

}

// ============  CATCH USERS' EVENTS ==============================================
await getAllNews()

let btnreload = document.getElementById("btnReloadData")
btnreload.addEventListener('click', function () {
    getAllNews()
})

window.onclick = e => {
    let targetclassname = e.target.className
    let currentButton = e.target
    //check if player is clicking any cell on the chessboard
    if (targetclassname === "material-icons btnedit") {
        showConfirmModalUpdateNews(currentButton)

    } else if (targetclassname === "material-icons btndelete") {
        showConfirmModal(currentButton)

    }
}

// button update news
let btnUpdateNews = document.getElementById("btnAgreeConfirmUpdateNews")
btnUpdateNews.addEventListener('click', function () {
    confirmActionUpdateNews()
})

//button cancel 
let btnCancelUpdateNews = document.getElementById("btnCancelActionUpdateNews")
btnCancelUpdateNews.addEventListener('click', function () {
    cancelActionUpdateNews()
})

// button delete news
let btndeleteNews = document.getElementById("btnDeleteAgree")
btndeleteNews.addEventListener('click', function () {
    confirmActionDelete()
})

//button cancel 
let btnCancelDeleteNews = document.getElementById("btnDeleteCancel")
btnCancelDeleteNews.addEventListener('click', function () {
    cancelActionDelete()
})


