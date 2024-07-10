retreivedId = localStorage.getItem("clickedNews");


async function getNewsById(retreivedId){
    response = await fetch(`https://localhost:3000/news/:${retreivedId}`)
    .then(response => {
        if(!response.ok) {
            throw new Error('Response invalid');
        }
        return response.json();

    })
    .then(newsData => {
        post = newsData[0];
        const source = document.querySelector(".news-source");
        const title = document.querySelector(".card-title");
        const content = document.querySelector("news-content");
        source.innerHTML = post['newsSource'];
        title.innerHTML = post['newsId'];
        content.innerHTML = post['newsContent'];


    })
}