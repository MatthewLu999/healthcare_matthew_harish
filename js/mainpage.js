//import Connection Class from connectionClass.js
import { Connection } from './classes/connectionClass.js';
import { Article } from './classes/articleClass.js';
import { images, articleImage } from './classes/imageClass.js';


// =========== CREATE GLOBAL VARIBALE =============================================
//make a instance for Connection Class
const instanceConnectionFireBase = new Connection()
let db = instanceConnectionFireBase.getDBConnection()
const instanceArticleClass = new Article()
let slidesData = []
let currentindexCausoel = [0]

//=============  DEFINITON FOR FUNCTIONS ==========================================
function createPagination(containerId, currentPage, totalPages) {
    const container = document.getElementById(containerId);
    container.style.fontSize = "0.7vw"
    if (!container) {
        console.error("Pagination container not found");
        return;
    }

    const ul = document.createElement("ul");
    ul.className = "pagination";
    container.appendChild(ul);

    // Previous button
    const liPrev = document.createElement("li");
    liPrev.className = "page-item" + (currentPage === 1 ? " disabled" : "");
    ul.appendChild(liPrev);

    const aPrev = document.createElement("a");
    aPrev.className = "page-link";
    aPrev.href = "#";
    aPrev.textContent = "Previous";
    liPrev.appendChild(aPrev);

    // Numbered page links
    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement("li");
        li.className = "page-item" + (i === currentPage ? " active" : "");
        ul.appendChild(li);

        const a = document.createElement("a");
        a.className = "page-link";
        a.href = "#";
        a.textContent = i;
        if (i === currentPage) {
            const span = document.createElement("span");
            span.className = "sr-only";
            span.textContent = "(current)";
            a.appendChild(span);
        }
        li.appendChild(a);
    }

    // Next button
    const liNext = document.createElement("li");
    liNext.className = "page-item" + (currentPage === totalPages ? " disabled" : "");
    ul.appendChild(liNext);

    const aNext = document.createElement("a");
    aNext.className = "page-link";
    aNext.href = "#";
    aNext.textContent = "Next";
    liNext.appendChild(aNext);
}

function createBootstrapCarousel(carouselId, slides, carouselControl) {
    // Create the carousel container
    // const carousel = document.createElement('div');
    // carousel.id = carouselId;
    // carousel.className = 'carousel slide';
    // carousel.setAttribute('data-ride', 'carousel');

    // Create the indicators
    const indicators = document.createElement('ol');
    indicators.className = 'carousel-indicators';
    slides.forEach((slide, index) => {
        const li = document.createElement('li');
        li.setAttribute('data-target', `#${carouselId}`);
        li.setAttribute('data-slide-to', index);
        li.setAttribute('class', 'carouselslideto')
        li.style.backgroundColor = "black"
        if (index === 0) li.className = 'carouselslideto active'; li.style.backgroundColor = "blue";;
        indicators.appendChild(li);
    });

    // Create the carousel inner
    const inner = document.createElement('div');
    inner.className = 'carousel-inner';
    slides.forEach((slide, index) => {
        const item = document.createElement('div');
        item.className = 'carousel-item';
        item.setAttribute("data-index", index)
        item.style.width = "100%"
        if (index === 0) item.classList.add('active');

        const img = document.createElement('img');
        img.className = 'd-block w-100';
        img.src = slide.src;
        img.alt = slide.alt;
        img.style.height = "15vw"
        //create div
        let divparent = document.createElement("div")
        divparent.className = "row carousel-caption d-none d-md-block"
        divparent.style.position = "relative"

        divparent.style.marginTop = "2vw"
        divparent.style.marginRight = "15vw"
        divparent.style.color = "black"
        let h5child = document.createElement("a")
        h5child.textContent = slide.headline
        h5child.href = 'news_detail.html?articleID=' + slide.articleID;
        h5child.target = 'news_detail.html?articleID=' + slide.articleID;
        h5child.style.fontSize = "1.5vw";
        h5child.style.fontWeight = "500"


        let pchild = document.createElement("p")
        pchild.textContent = slide.subline

        divparent.appendChild(h5child)
        divparent.appendChild(pchild)


        item.appendChild(img);
        item.appendChild(divparent)
        inner.appendChild(item);
    });

    // Create controls (previous and next)
    const createControl = (direction) => {
        const link = document.createElement('a');
        link.className = `carousel-control-${direction}`;
        link.href = `#${carouselId}`;
        link.role = 'button';
        link.setAttribute('data-slide', direction);

        const spanIcon = document.createElement('span');
        spanIcon.className = `carousel-control-${direction}-icon`;
        spanIcon.setAttribute('aria-hidden', 'true');

        const spanText = document.createElement('span');
        spanText.className = 'sr-only';
        spanText.textContent = direction === 'prev' ? 'Previous' : 'Next';

        link.appendChild(spanIcon);
        link.appendChild(spanText);

        return link;
    };

    carouselControl.appendChild(indicators);
    carouselControl.appendChild(inner);
    carouselControl.appendChild(createControl('prev'));
    carouselControl.appendChild(createControl('next'));

    return carouselControl;
}


function createBreakingNewsArea(docID, userID, articleId, imageUrl, linkUrl, headlineText, description, timestamp, container) {
    // Create the main 'panel-row-items' div
    const panelRowItems = document.createElement('div');
    panelRowItems.className = 'panel-row-items';

    // Create the image container and image element
    const divIcon = document.createElement('div');
    divIcon.className = 'panel-row-icon imgbreakingnews';
    const img = document.createElement('img');
    img.src = imageUrl;
    img.style.borderRadius = '5px'
    img.style.width = '98%'; // Assuming full width here; adjust as per your needs
    img.style.height = '18vw'; // Assuming full height here; adjust as per your needs
    img.setAttribute("data-docid", docID)
    img.setAttribute("data-userID", userID)
    img.setAttribute("data-articleID", articleId)
    img.setAttribute("data-subhead", description)
    img.setAttribute("data-mainhead", headlineText)
    divIcon.appendChild(img);

    // Create the title and text container
    const divTitle = document.createElement('div');
    divTitle.className = 'panel-row-title';

    // Create and append the paragraph and link for the headline
    const pTitle = document.createElement('p');
    pTitle.style.marginTop = '2px';
    const link = document.createElement('a');
    link.href = 'news_detail.html?articleID=' + articleId;
    link.target = 'news_detail.html?articleID=' + articleId;
    link.style.color = 'blue';
    link.style.fontSize = "1.5vw";
    link.style.fontWeight = "500"
    link.setAttribute("data-docid", docID)
    link.setAttribute("data-userID", userID)
    link.setAttribute("data-articleID", articleId)
    link.className = "breakingnewslinks"

    link.textContent = headlineText;
    pTitle.appendChild(link);

    // Create and append the description paragraph
    const pDescription = document.createElement('p');
    pDescription.style.fontSize = '1.3vw';
    pDescription.style.fontWeight = "500"
    pDescription.textContent = description;

    // Create and append the timestamp paragraph
    const pTimestamp = document.createElement('p');
    pTimestamp.style.marginTop = '3.5vw';
    pTimestamp.style.fontWeight = "700"
    pTimestamp.style.fontSize = '1.3vw';
    pTimestamp.style.fontStyle = 'italic';
    pTimestamp.textContent = "Date: " + timestamp;

    // Append paragraphs to title and text container
    divTitle.appendChild(pTitle);
    divTitle.appendChild(pDescription);
    divTitle.appendChild(pTimestamp);

    // Append icon and title/text containers to the main container
    panelRowItems.appendChild(divIcon);
    panelRowItems.appendChild(divTitle);

    // Append the whole structure to the provided container
    container.appendChild(panelRowItems);

    //create hr tag 
    const hrtag = document.createElement("hr")
    container.appendChild(hrtag)

    //create mini slide show
    const divtag = document.createElement("div")
    divtag.textContent = "Other Breaking News"
    divtag.style.fontWeight = 700
    divtag.style.marginBottom = "1vw"
    container.appendChild(divtag)
}


function createDailyNews(imageUrl, headlineText, description, timestamp, trTag, articleID) {

    //------crreate all columns for first news
    console.log(imageUrl)
    // //column 1
    let tdTag1 = document.createElement("td")

    //------ img tag
    let imgTag1 = document.createElement("img")
    imgTag1.src = imageUrl
    imgTag1.className = "rounded mx-auto d-block"
    imgTag1.style.width = "13vw"
    imgTag1.style.height = "12vw"
    imgTag1.style.padding = "1vw"

    //------append to Tag td 1
    tdTag1.appendChild(imgTag1)
    trTag.appendChild(tdTag1)
    //next column 
    let tdTag2 = document.createElement("td")

    //-----h4 
    let h4FristTag = document.createElement("a")
    h4FristTag.textContent = headlineText
    h4FristTag.style.fontSize = '1.3vw';
    h4FristTag.style.fontWeight = "500"
    h4FristTag.href = 'news_detail.html?articleID=' + articleID;
    h4FristTag.target = 'news_detail.html?articleID=' + articleID;
    h4FristTag.style.color = 'blue';
    h4FristTag.style.fontWeight = "500"

    tdTag2.appendChild(h4FristTag)

    //-----p
    let pFristTag = document.createElement("p")
    pFristTag.textContent = description
    pFristTag.style.fontSize = '1vw';
    pFristTag.style.fontWeight = "500"
    tdTag2.appendChild(pFristTag)

    //-----b
    let bFristTag = document.createElement("b")
    bFristTag.textContent = timestamp
    bFristTag.style.fontSize = '0.8vw';
    bFristTag.style.fontWeight = "500"
    tdTag2.appendChild(bFristTag)

    //---add all columns of fist news
    //---add all columns of fist news

    trTag.appendChild(tdTag2)
}

function createVideoHTMLNode(videolink, headlineText, description, timestamp, trTag) {
    // //column 1
    let tdTag1 = document.createElement("td")

    //------ img tag
    let imgTag1 = document.createElement("iframe")
    imgTag1.src = videolink
    imgTag1.className = "rounded mx-auto d-block"
    imgTag1.style.width = "13vw"
    imgTag1.style.height = "12vw"
    imgTag1.style.padding = "1vw"
    imgTag1.setAttribute("title", "YouTube video player")
    imgTag1.setAttribute("frameborder", "0")
    imgTag1.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share")
    imgTag1.setAttribute("referrerpolicy", "strict-origin-when-cross-origin")

    //------append to Tag td 1
    tdTag1.appendChild(imgTag1)
    trTag.appendChild(tdTag1)
    //next column 
    let tdTag2 = document.createElement("td")

    //-----h4 
    let h4FristTag = document.createElement("h4")
    h4FristTag.textContent = headlineText
    h4FristTag.style.fontSize = '1.3vw';
    h4FristTag.style.fontWeight = "500"
    tdTag2.appendChild(h4FristTag)

    //-----p
    let pFristTag = document.createElement("p")
    pFristTag.textContent = description
    pFristTag.style.fontSize = '1.1vw';
    pFristTag.style.fontWeight = "500"
    tdTag2.appendChild(pFristTag)

    //-----b
    let bFristTag = document.createElement("b")
    bFristTag.textContent = timestamp
    bFristTag.style.fontSize = '0.8vw';
    bFristTag.style.fontWeight = "500"
    tdTag2.appendChild(bFristTag)

    //---add all columns of fist news
    //---add all columns of fist news

    trTag.appendChild(tdTag2)
}



async function getAllBreakingNews() {
    console.log("\n Get all news from FireBase")

    let articlecollections = await instanceArticleClass.getAllArticles(db)
    console.log(articlecollections)
    let linkUrl = 'news_detail.html'
    let container = document.getElementById("breakingnewsArea")
    let isreadfirstitem = true
    const carouselContainer = document.createElement('div');
    carouselContainer.setAttribute("id", "mycarousel")
    carouselContainer.className = 'carousel slide';
    carouselContainer.style.height = "27vw";
    carouselContainer.setAttribute('data-ride', 'carousel');
    slidesData = []
    //loop to read all values
    for (const article of articlecollections) {
        if (article.topic === "breakingnews") {
            let imageUrl = await instanceArticleClass.fetchImages(db, article.id, article.articleid)
            let headlineText = article.maintitle
            let description = article.subtitle
            let timestamp = await instanceArticleClass.convertTimestampToDateTimeAMPM(article.createddate)
            let docID = article.id
            let userid = article.userid
            let articleID = article.articleid
            //check the first time
            if (isreadfirstitem) {
                //create breaking news area
                createBreakingNewsArea(docID, userid, articleID, imageUrl, linkUrl, headlineText, description, timestamp, container)
                isreadfirstitem = false
            } else {
                // The ID of the container where the carousel will be appended
                slidesData.push({ src: imageUrl, alt: headlineText, headline: headlineText, subline: description, articleID: articleID })
            }
        }

    }
    // create the content for other news
    const carousel = createBootstrapCarousel('mycarousel', slidesData, carouselContainer);
    container.appendChild(carousel);


}

async function getAllDailyNews() {
    console.log("\n Get daily news from FireBase")
    let articlecollections = await instanceArticleClass.getAllArticles(db)

    let tBodycontainer = document.getElementById("dailynewsArea")
    let trTagFirst = document.createElement("tr")
    tBodycontainer.appendChild(trTagFirst)
    let totalNutritionNews = 0
    let totalfirestrow = 0
    let totalcolumnneed = 2
    //loop to read all values
    for (const article of articlecollections) {
        if (article.topic === "nutrition") {
            totalNutritionNews++
            let articleID = article.articleid
            let imageUrl = await instanceArticleClass.fetchImages(db, article.id, article.articleid)
            let headlineText = article.maintitle
            let description = article.subtitle
            let timestamp = await instanceArticleClass.convertTimestampToDateTimeAMPM(article.createddate)
            // dataNews.push({ imgcontent: imageUrl, headline: headlineText, subline: description, datecreated: timestamp })
            if (totalcolumnneed > 0) {
                console.log("\n current index" + totalfirestrow + "," + headlineText)
                createDailyNews(imageUrl, headlineText, description, timestamp, trTagFirst, articleID)
                totalcolumnneed--
            } else {
                console.log("\n >2 break, " + totalfirestrow + "," + headlineText)
                //reset
                trTagFirst = document.createElement("tr")
                tBodycontainer.appendChild(trTagFirst)
                createDailyNews(imageUrl, headlineText, description, timestamp, trTagFirst, articleID)
                totalcolumnneed = 2

            }

        }

    }
    //create pavigation 
    let totalpages = Math.round(totalNutritionNews / 4)
    createPagination("customnavigation", 1, totalpages)

}

async function getAllVideoMedia() {
    console.log("\n Get daily news from FireBase")
    let articlecollections = await instanceArticleClass.getAllArticles(db)

    let tBodycontainer = document.getElementById("VideoArea")
    let trTagFirst = document.createElement("tr")
    tBodycontainer.appendChild(trTagFirst)
    //loop to read all values
    for (const article of articlecollections) {
        if (article.topic === "video") {
            let headlineText = article.maintitle
            let description = article.subtitle
            let timestamp = await instanceArticleClass.convertTimestampToDateTimeAMPM(article.createddate)
            let videolink = article.videolink
            // dataNews.push({ imgcontent: imageUrl, headline: headlineText, subline: description, datecreated: timestamp })
            createVideoHTMLNode(videolink, headlineText, description, timestamp, trTagFirst)
        }
    }
}

// ============  CATCH USERS' EVENTS ==============================================
//check if use is login or not 
var current_username = getCookieforArray("username");
console.log("\n call me:")
console.log(current_username)
let welcomelogo = document.getElementById("welcometxt")
welcomelogo.innerText = "Welcome, " + current_username
if (current_username !== null) {
    await getAllBreakingNews()
    await getAllDailyNews()
    await getAllVideoMedia()

    setInterval(() => {
        let allslideitems = document.querySelectorAll(".carousel-item")
        let miniunderline = document.querySelectorAll(".carouselslideto")

        //remove all active class
        allslideitems.forEach(element => {
            element.classList.remove('active')
        });

        //remove all active class
        miniunderline.forEach(element => {
            element.classList.remove('active')
            element.style.backgroundColor = "black"
        });

        if (currentindexCausoel.length <= allslideitems.length) {
            for (let i = 0; i < allslideitems.length; i++) {
                let index = allslideitems[i].getAttribute("data-index")
                if (!currentindexCausoel.includes(index)) {
                    currentindexCausoel.push(index)
                    allslideitems[i].classList.add('active')
                    miniunderline[i].classList.add('active')
                    miniunderline[i].style.backgroundColor = "blue"
                    break
                }
            }
        } else {
            currentindexCausoel = [0]
            allslideitems[0].classList.add('active')
            miniunderline[0].classList.add('active')
        }
    }, 3000);




} else {
    window.location.href = "login.html"
}





