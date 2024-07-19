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
        console.log(storednewsData); 
        populateNews(storednewsData, newsContainer);

    })
    .catch(error => {
        console.error("Error:", error);
    });  
}


const chartElement = document.getElementById('myChart');
            
                    new Chart(chartElement, {
                    type: 'bar',
                    data: {
                        labels: ['Red', 'Blue', 'Yellow', 'Green', "Purple", "Orange"],
                        datasets: [{
                            label: '# of Votes',
                            data: [12, 19, 3, 5, 2, 3],
                            borderWidth: 1
                     }]
                    },
                    options: {
                     scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                
                });

                