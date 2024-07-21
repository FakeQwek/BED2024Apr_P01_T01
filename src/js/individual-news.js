//Obtains newsId from localStorage
retreivedId = localStorage.getItem("clickedNews");
console.log(retreivedId);
getNewsById(retreivedId);
const newsContainer = document.getElementById("news-container");





//Function gets news post by its title
async function getNewsById(retreivedId){
    response = await fetch(`http://localhost:3000/news/${retreivedId}`)
    .then(response => {
       
        if(!response.ok) {
         
            throw new Error('Response invalid');
        }
        
        return response.json();

    })
    .then(newsData => {
        post = newsData[0];
       
        //Populates the clicked news post on the single news post
        newsContainer.insertAdjacentHTML("afterbegin",
            `<div class="flex justify-center w-full">
                <div class="card w-5/6 bg-white news-card">
                    <div class="news-body">
                        <h3 class="news-source">from ${post["newsSource"]} - published on ${post["newsDate"]}</h3>
                        <h2 class="card-title">${post["newsId"]}</h2>
                        <img class="news-thumbnail object-scale-down" src="${post["newsImage"]}" >
                        <p>${post["newsContent"]}<br><br>Read the full story at ${post["newsUrl"]} </p>
                    </div>
                </div>
            </div>` 
        );
        

        });
}
