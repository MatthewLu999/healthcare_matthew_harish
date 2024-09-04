import { Connection } from './connection.js';
import { Article } from './classes/articleClass.js';
import { Feedback } from './classes/feedbacksClass.js';  // Make sure this class is properly defined
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";

// Create an instance of the Connection class and get the Firestore database
const instanceConnectionFireBase = new Connection();
const db = instanceConnectionFireBase.getDBConnection();

var current_username = getCookieforArray("username");
let userID = ""
if (current_username) {
    userID = current_username
} else {
    userID = "admin@gmail.com"
}

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

const articleID = getQueryParam('articleID'); // Retrieve articleID from the URL
console.log('Article ID from URL:', articleID);

document.addEventListener('DOMContentLoaded', async () => {
    if (articleID) {
        await loadArticleDetails(articleID);
        await loadComments(articleID);  // Load existing comments for this article

        // Attach the submitComment function to the submit button, but ensure it's only attached once
        const submitButton = document.getElementById('submitCommentButton');
        if (submitButton && !submitButton.hasAttribute('data-listener-added')) {
            submitButton.addEventListener('click', submitComment);
            submitButton.setAttribute('data-listener-added', 'true'); // Prevent double attachment
        } else {
            console.error('Submit button not found or listener already attached.');
        }
    } else {
        console.error("Article ID not found in the URL");
    }
});

async function loadArticleDetails(articleID) {
    const instanceArticleClass = new Article();
    const articles = await instanceArticleClass.getAllArticles(db);

    console.log("All Articles Data:", articles);

    const article = articles.find(article => String(article.articleid) === String(articleID));

    if (article) {
        console.log("Filtered Article Data:", article);

        document.getElementById('articleTitle').textContent = article.maintitle;
        document.getElementById('articleAuthor').textContent = `By ${article.userid + " - " + article.topic}`;
        let timestamp = await instanceArticleClass.convertTimestampToDateTimeAMPM(article.createddate)
        document.getElementById('articleDate').textContent = "Posted: " + timestamp

        // Check for the articleImage element before setting its src
        const articleImage = document.getElementById('articleImage');
        if (articleImage) {
            articleImage.src = await instanceArticleClass.fetchImages(db, article.id, article.articleid);
        } else {
            console.error('Image element with ID "articleImage" not found.');
        }

        document.getElementById('articleContent').innerHTML = article.content;
    } else {
        console.error('Article Not Found');
        document.getElementById('articleTitle').textContent = 'Article Not Found';
        document.getElementById('articleAuthor').textContent = '';
        document.getElementById('articleDate').textContent = '';
        document.getElementById('articleContent').textContent = 'The requested article could not be found.';
    }
}

// Function to load existing comments for the article
async function loadComments(articleID) {
    const feedbackCollection = collection(db, "feedbacks");
    const q = query(feedbackCollection, where("articleID", "==", articleID));
    const querySnapshot = await getDocs(q);

    const commentsList = document.getElementById('commentsList');
    commentsList.innerHTML = ''; // Clear existing comments
    var totalcomment = 0
    //txttotalComments
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        const li = document.createElement('li');
        li.style.padding = "1vw"
        const trtag = document.createElement('div');
        const trtag1 = document.createElement('div');
        const tdtag = document.createElement('div');
        const tdtag1 = document.createElement('div');
        const tdtag2 = document.createElement('div');
        const img = document.createElement('img');
        img.src = "images/usericon-removebg-preview.png";
        img.alt = '';
        img.style.width = '3vw';
        img.style.height = '3vw';
        img.className = 'rounded-circle';

        tdtag.className = "col-md-1"
        tdtag.append(img)


        const ptag = document.createElement("span")
        ptag.textContent = data.content

        tdtag1.append(ptag)
        tdtag1.className = "col-md-11"

        const smalltag = document.createElement("i")
        smalltag.textContent = "User (" + data.userid + ") " + "commented on " + new Date(data.datecreated).toLocaleString()
        smalltag.style.width = "100%"
        tdtag2.className = "col-md-12"
        tdtag2.appendChild(smalltag)
        trtag1.append(tdtag2)

        //add td to tr
        trtag.className = "row"
        trtag.append(tdtag)
        trtag.append(tdtag1)
        //add to li
        trtag1.className = "row"
        li.append(trtag1)
        li.append(trtag)

        commentsList.appendChild(li);
        totalcomment++
    });
    //show total of comments
    var txttotalcomments = document.getElementById("txttotalComments")
    txttotalcomments.innerText = " Comments " + "(" + totalcomment + ")"
}

// Function to handle comment submission
async function submitComment() {
    const commentText = document.getElementById('commentText').value;
    if (!commentText) {
        alert("Comment cannot be empty.");
        return;
    }

    const datecreated = new Date().toISOString();
    const documentID = `feedback_${Date.now()}`; // Generate a unique ID for the feedback

    const newComment = new Feedback(commentText, datecreated, 0, "", userID, db, documentID);

    try {
        await newComment.insertToDatabase(articleID);  // Pass articleID here
        console.log("Comment added successfully.");

        // Clear the comment input
        document.getElementById('commentText').value = "";

        // Reload comments to display the new one
        await loadComments(articleID);
    } catch (error) {
        console.error("Error adding comment:", error);
    }
}

var current_username = getCookieforArray("username");
let welcomelogo = document.getElementById("welcometxt")

if (current_username !== null) {
    welcomelogo.innerText = "Welcome, " + current_username
} else {
    // window.location.href = "login.html"
    welcomelogo.innerText = "Welcome, guest"
}


