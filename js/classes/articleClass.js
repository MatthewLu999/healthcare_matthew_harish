import { doc, setDoc, updateDoc, getDocs, collection, query, where } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";
// ============================================= ARTICLE CLASS ========================================================

// ----------- Definition for article Class
export class Article {
    constructor(articleID, userID, mainheading, subheading, content, topic, isdeleted, db, documentID) {
        this.articleID = articleID
        this.userID = userID
        this.mainheading = mainheading
        this.subheading = subheading
        this.content = content
        this.topic = topic
        this.isdeleted = isdeleted
        this.db = db
        this.documentID = documentID
    }


    //add img to database
    async inserttoDatabase() {
        //check img info befire inserting to database
        if (this.userID !== null && this.articleID !== null && this.mainheading !== null && this.subheading !== null && this.content !== null && this.topic !== null && this.isdeleted !== null) {
            return new Promise((resolve, reject) => {
                const docRef = doc(this.db, "articles", this.documentID);
                const timestamp = new Date().toISOString();

                setDoc(docRef, {
                    articleid: this.articleID,
                    content: this.content,
                    createddate: timestamp,
                    deleted: 0,
                    maintitle: this.mainheading,
                    subtitle: this.subheading,
                    topic: this.topic,
                    userid: this.userID
                })
                    .then(() => {
                        console.log("Document written with ID: ", docRef.id);
                        resolve(docRef.id);
                        let resulttxt = document.getElementById("resultofquiz")
                        resulttxt.style.display = "block"
                        resulttxt.innerText = "The News was created successfully!"
                    })
                    .catch((error) => {
                        console.error("Error adding document: ", error);
                        reject(error);

                    });
            });
        } else {
            alert("Some errors in inserting this article!")
        }
    }


    // update image
    async updatetoDatabase(db) {
        //check img info befire inserting to database
        if (this.articleID !== null && this.userID !== null) {
            return new Promise((resolve, reject) => {
                const docRef = doc(db, "articles", this.documentID);
                updateDoc(docRef, {
                    content: this.content,
                    maintitle: this.mainheading,
                    subtitle: this.subheading
                })
                    .then(() => {
                        alert("Update successfully!")
                        console.log("Document updated successfully");
                        resolve();
                    })
                    .catch((error) => {
                        console.error("Error updating document:", error);
                        reject(error);
                    });
            });
        } else {
            alert("Some errors in updating this article!")
        }
    }


    // delete image 
    async deletetoDatabase(db) {
        //check img info befire inserting to database
        if (this.articleID !== null && this.userID !== null && this.isdeleted !== null) {
            return new Promise((resolve, reject) => {
                const docRef = doc(db, "articles", this.documentID);

                updateDoc(docRef, {
                    deleted: 1
                })
                    .then(() => {
                        console.log("Document updated successfully");
                        resolve();
                    })
                    .catch((error) => {
                        console.error("Error updating document:", error);
                        reject(error);
                    });
            });
        } else {
            alert("Some errors wiin the process of deleting this article!")
        }
    }

    async getAllNews() {
        //get all data news from firebase 

    }
    async getAllArticles(db) {
        const articlesCollection = collection(db, "articles");
        const articlesSnapshot = await getDocs(articlesCollection);
        const articlesData = [];

        articlesSnapshot.forEach((doc) => {
            const article = { id: doc.id, ...doc.data() };
            articlesData.push(article);
        });

        return articlesData;
    }

    async fetchImages(db, documentId, articleId) {
        const articlesCollection = collection(db, "images");
        const articlesSnapshot = await getDocs(articlesCollection);
        let imgcontent = '';

        articlesSnapshot.forEach((doc) => {
            const article = { id: doc.id, ...doc.data() };
            if (article.id === documentId && article.articleid === articleId) {
                imgcontent = article.imgcontent
            }

        });

        return imgcontent;
    }


    async convertTimestampToDate(timestamp) {
        const date = new Date(timestamp);
        return date.toISOString().split('T')[0]; // Returns date in YYYY-MM-DD format
    }

    async convertTimestampToDateTimeAMPM(timestamp) {
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed
        const day = date.getDate().toString().padStart(2, '0');
        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours.toString().padStart(2, '0') : '12'; // the hour '0' should be '12'
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} ${ampm}`;
    }

    async getTableHTML(db, articles) {
        const table = document.createElement('table');
        table.setAttribute("id", "newslist")
        table.setAttribute("class", "table align-middle mb-0 bg-white")
        table.style.marginTop = "10px"
        const tbody = document.createElement('tbody');
        // Create the <thead> element
        const thead = document.createElement('thead');
        thead.className = 'bg-light';

        // Create the <tr> element
        const trofthead = document.createElement('tr');

        // Define headers
        const headers = ['Topic Name', 'News Headline', 'News Subline', 'Date Created', 'Actions'];

        // Loop through headers array to create and append <th> elements to the <tr>
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            trofthead.appendChild(th);
        });

        // Append the <tr> to the <thead>
        thead.appendChild(trofthead);
        //add theade to table
        table.appendChild(thead)
        for (const article of articles) {
            //only show news is available with specific deleted attribute ,which is 0
            if (article.deleted === 0) {
                let imageUrl = await this.fetchImages(db, article.id, article.articleid)
                let createddate = article.createddate
                let resultdate = await this.convertTimestampToDateTimeAMPM(createddate)
                //create tbody for table
                const tr = document.createElement('tr');

                // Create and append the image cell
                const tdImage = document.createElement('td');
                const divImage = document.createElement('div');
                divImage.className = 'd-flex align-items-center';
                const img = document.createElement('img');
                img.src = imageUrl;
                img.alt = '';
                img.style.width = '45px';
                img.style.height = '45px';
                img.className = 'rounded-circle';
                //create topic description 
                const divtopic = document.createElement('div')
                divtopic.setAttribute("class", "ms-3")
                const ptopic = document.createElement('p')
                ptopic.setAttribute("class", "fw-bold mb-1")
                ptopic.style.marginLeft = "10px"
                ptopic.textContent = article.topic
                divtopic.appendChild(ptopic)
                //------------
                divImage.appendChild(img);
                divImage.appendChild(divtopic)
                tdImage.appendChild(divImage);
                tr.appendChild(tdImage);

                // Create and append the text cell
                const tdText = document.createElement('td');
                const divText = document.createElement('div');
                divText.className = 'ms-3';
                const pTopic = document.createElement('p');
                pTopic.className = 'fw-bold mb-1';
                pTopic.textContent = article.topic;
                const pMainTitle = document.createElement('p');
                pMainTitle.className = 'fw-normal mb-1';
                pMainTitle.textContent = article.maintitle;
                divText.appendChild(pTopic);
                divText.appendChild(pMainTitle);
                tdText.appendChild(divText);
                tr.appendChild(tdText);

                // Create and append the badge cell
                const tdBadge = document.createElement('td');
                const spanBadge = document.createElement('span');
                spanBadge.className = 'badge badge-success rounded-pill d-inline';
                spanBadge.textContent = article.subtitle;
                tdBadge.appendChild(spanBadge);
                tr.appendChild(tdBadge);

                // Create and append the result cell
                const tdResult = document.createElement('td');
                tdResult.textContent = resultdate;
                tr.appendChild(tdResult);

                // Create and append the button cell
                const tdButton = document.createElement('td');
                const button = document.createElement('span');
                // button.type = 'button';
                button.className = 'material-icons btnedit';
                button.textContent = 'mode_edit';
                button.style.color = "black"
                button.style.cursor = "pointer"
                button.setAttribute("data-docid", article.id)
                button.setAttribute("data-articleid", article.articleid)
                button.setAttribute("data-content", article.content)
                button.setAttribute("data-topic", article.topic)
                button.setAttribute("data-mainhead", article.maintitle)
                button.setAttribute("data-subhead", article.subtitle)
                //delete button 
                const buttondelete = document.createElement('span');
                // button.type = 'button';
                buttondelete.className = 'material-icons btndelete';
                buttondelete.textContent = 'clear';
                buttondelete.style.color = "red"
                buttondelete.style.cursor = "pointer"
                buttondelete.setAttribute("data-docid", article.id)
                buttondelete.setAttribute("data-articleid", article.articleid)
                buttondelete.setAttribute("data-content", article.content)
                buttondelete.setAttribute("data-topic", article.topic)
                buttondelete.setAttribute("data-mainhead", article.maintitle)
                buttondelete.setAttribute("data-subhead", article.subtitle)
                //========
                tdButton.appendChild(button);
                tdButton.appendChild(buttondelete);
                tr.appendChild(tdButton);
                tbody.appendChild(tr)
            }

        }
        table.appendChild(tbody)

        return table;
    }

    // Replace this function with your logic to get the image URL based on article ID
    async getArticleImageUrl(db, articleID, documentID) {
        try {
            const docRef = db.collection('images').doc(documentID);
            const doc = await docRef.get();

            if (doc.exists) {
                const data = doc.data();
                // Ensure the articleID matches and the image content exists
                if (data.articleId === articleID && data.imgcontent) {
                    return data.imgcontent; // This is the base64 image content
                } else {
                    throw new Error('Article ID mismatch or no image content available');
                }
            } else {
                throw new Error('No such document!');
            }
        } catch (error) {
            console.error('Error fetching document:', error);
            throw error;
        }
    }

}
