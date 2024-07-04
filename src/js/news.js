apikey = "ad61a3b55ab20ed21479950c798b39d9";
url = 'https://gnews.io/api/v4/top-headlines?lang=en&country=sg&max=10&apikey=' + apikey;
const newsContainer = document.getElementById("news-container");
const loadButton = document.getElementById("load-button");
const loadContainer = document.getElementById("load-container");
currentPostIndex = 0;
currentPosts = {};

//Gets and adds initial news posts
getAllNews();
storednewsData = [];
//lastIndex remembers where to start loading news posts
var lastIndex = 0;
loadButton.addEventListener("click", function (){
    
    for (i = 0; i < 5; i++){

        newsIndex = lastIndex + i;
        if (newsIndex >= storednewsData.length) {
            console.log("No more news to populate!");
            loadButton.innerHTML = `End of News`
            break;
        }
        article = storednewsData[newsIndex];
        loadContainer.insertAdjacentHTML("beforebegin",
            `<div class="flex justify-center w-full ${currentPostIndex}">
                <div class="card w-5/6 bg-white news-card">
                    <div class="news-body">
                        <h3 class="news-source">from ${article["newsSource"]}</h3>
                        <h2 class="card-title">${article["newsId"]}</h2>
                        <img class="news-thumbnail object-scale-down" src="${article["newsImage"]}" >
                        <p>${article["newsDesc"]}</p>
                    </div>
                </div>
            </div>` 
        );
        currentPosts[currentPostIndex] = article["newsId"];
    }
    currentPostIndex += 1;
    lastIndex += 5;
    newsPosts = document.getElementsByClassName("news-card");
    newsPosts.addEventListener("click", function() {
        post = event.target;
        classes = post.className;
        postIndex = classes[4];
        newsId = currentPosts[postIndex];
        localStorage.setItem("clickedNews", newsId);

    });
    

});
console.log(url);
//Will update the database with new news responses from api every launch
getNewsResponse(url);

function populateNews(news, newsContainer) {
  
    console.log(news);
    for (i = 0; i < 5; i++){

        newsIndex = lastIndex + i;
        if (newsIndex >= news.length) {
            console.log("No more news to populate!");
            return;
        }
        article = news[newsIndex];
        newsContainer.insertAdjacentHTML("afterbegin",
            `<div class="flex justify-center w-full">
                <div class="card w-5/6 bg-white news-card ${currentPostIndex}">
                    <div class="news-body">
                        <h3 class="news-source">from ${article["newsSource"]}</h3>
                        <h2 class="card-title">${article["newsId"]}</h2>
                        <img class="news-thumbnail object-scale-down" src="${article["newsImage"]}" >
                        <p>${article["newsDesc"]}</p>
                    </div>
                </div>
            </div>` 
        );

    }
    currentPostIndex +=1;
    lastIndex += 5;
    newsPosts = document.getElementsByClassName("news-card");
    newsPosts.addEventListener("click", function() {
        post = event.target;
        classes = post.className;
        postIndex = classes[4];
        newsId = currentPosts[postIndex];
        localStorage.setItem("clickedNews", newsId);

    });
  
}

//Removes illegal sql characters
function cleanText(string) {
    string = string.replace("~", '\~');
    string = string.replace("!", '\!');
    string = string.replace("%", '\%');
    string = string.replace("^", '\^');
    string = string.replace("&", '\&');
    string = string.replace("'", '\'');
    string = string.replace(".", '\.');
    string = string.replace(",", '\,');
    return string; 
}

async function getAllNews() {
    response = await fetch("http://localhost:3000/news")
    .then(response => {
        if(!response.ok){
            throw new Error('Response invalid!');
        }
        return response.json();
    })
    .then(newsData => {
    
        for (i = 0; i < newsData.length; i++) {
           
            storednewsData.push(newsData[i]);
            
        }
    
        populateNews(storednewsData, newsContainer);

    })
    .catch(error => {
        console.error("Error:", error);
    });  
}

async function postNews(url, article) {
    source = article['source'];
    id = cleanText(article['title']);
    image = cleanText(article['image']);
    desc = cleanText(article['description']);
    rawDate = article['publishedAt'].substring(0,10);
    
    date = cleanText(rawDate);
    console.log(date);
    content = cleanText(article['content']);

    
    const response = await fetch(url, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            'Content-Type': "application/json",
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify({
            newsId: id,
            newsDesc: desc,
            newsImage: image,
            newsSource: source['name'],
            newsDate: date,
            newsContent: content
            }),
    });
    return response.json();
}



function getNewsResponse(url) {
    fetch(url)
    .then(response => {
        if(!response.ok){
            throw new Error('Response invalid!');
        }
        
        return response.json();
       
    })
    .then(newsData =>   {
        url = "http://localhost:3000/news/";
       
        for (i = 0; i < 10; i++) {
            try {
                console.log(newsData);
                postNews(url, newsData.articles[i]);
            }
            catch (error) {
                console.error(error);
            }
        }
    
    })
    .catch(error => {
        console.error("Error:", error);
    });
}