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
        if (index === 0) li.className = 'carouselslideto active';
        indicators.appendChild(li);
    });

    // Create the carousel inner
    const inner = document.createElement('div');
    inner.className = 'carousel-inner';
    slides.forEach((slide, index) => {
        const item = document.createElement('div');
        item.className = 'carousel-item';
        item.setAttribute("data-index", index)
        if (index === 0) item.classList.add('active');

        const img = document.createElement('img');
        img.className = 'd-block w-100';
        img.src = slide.src;
        img.alt = slide.alt;
        img.style.height = "15vw"
        //create div
        let divparent = document.createElement("div")
        divparent.className = "carousel-caption d-none d-md-block"
        let h5child = document.createElement("h5")
        h5child.textContent = slide.headline
        h5child.style.backgroundColor = "gray"

        let pchild = document.createElement("p")
        pchild.style.backgroundColor = "gray"
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





function createBreakingNewsArea(imageUrl, linkUrl, headlineText, description, timestamp, container) {
    // Create the main 'panel-row-items' div
    const panelRowItems = document.createElement('div');
    panelRowItems.className = 'panel-row-items';

    // Create the image container and image element
    const divIcon = document.createElement('div');
    divIcon.className = 'panel-row-icon';
    const img = document.createElement('img');
    img.src = imageUrl;
    img.style.borderRadius = '5px'
    img.style.width = '98%'; // Assuming full width here; adjust as per your needs
    img.style.height = '18vw'; // Assuming full height here; adjust as per your needs
    divIcon.appendChild(img);

    // Create the title and text container
    const divTitle = document.createElement('div');
    divTitle.className = 'panel-row-title';

    // Create and append the paragraph and link for the headline
    const pTitle = document.createElement('p');
    pTitle.style.marginTop = '2px';
    const link = document.createElement('a');
    link.href = linkUrl;
    link.target = '_blank';
    link.style.color = 'blue';
    link.style.fontSize = "1.5vw";
    link.style.fontWeight = "500"
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



async function getAllBreakingNews() {
    console.log("\n Get all news from FireBase")

    let articlecollections = await instanceArticleClass.getAllArticles(db)
    console.log(articlecollections)
    let linkUrl = 'news_detail.html'
    let container = document.getElementById("breakingnewsArea")
    let isreadfirstitem = true
    const carouselContainer = document.createElement('div');
    carouselContainer.setAttribute("id", "mycarousel")
    // carouselContainer.setAttribute("class", "carousel slide")
    // carouselContainer.setAttribute("data-ride", "carousel")
    carouselContainer.className = 'carousel slide';
    carouselContainer.setAttribute('data-ride', 'carousel');
    slidesData = []
    //loop to read all values
    for (const article of articlecollections) {
        if (article.topic === "breakingnews") {
            let imageUrl = await instanceArticleClass.fetchImages(db, article.id, article.articleid)
            let headlineText = article.maintitle
            let description = article.subtitle
            let timestamp = await instanceArticleClass.convertTimestampToDateTimeAMPM(article.createddate)
            //check the first time
            if (isreadfirstitem) {
                //create breaking news area
                createBreakingNewsArea(imageUrl, linkUrl, headlineText, description, timestamp, container)
                isreadfirstitem = false
            } else {
                // The ID of the container where the carousel will be appended
                slidesData.push({ src: imageUrl, alt: headlineText, headline: headlineText, subline: description })
            }
        }

    }
    const carousel = createBootstrapCarousel('mycarousel', slidesData, carouselContainer);
    container.appendChild(carousel);


}

// ============  CATCH USERS' EVENTS ==============================================
await getAllBreakingNews()


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
    });

    if (currentindexCausoel.length <= allslideitems.length) {
        for (let i = 0; i < allslideitems.length; i++) {
            let index = allslideitems[i].getAttribute("data-index")
            if (!currentindexCausoel.includes(index)) {
                currentindexCausoel.push(index)
                allslideitems[i].classList.add('active')
                miniunderline[i].classList.add('active')
                break
            }
        }
    } else {
        currentindexCausoel = [0]
        allslideitems[0].classList.add('active')
        miniunderline[0].classList.add('active')
    }
}, 2000);


