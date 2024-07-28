reportedPosts = [];
countData = [];
const reportedPostBox = document.getElementById("post-box");
const newButton = document.getElementById("new-button");
const reportButton = document.getElementById("report-button");
const mutedPage = document.getElementById("muted-button");
const bannedPage = document.getElementById("banned-button");
const reportedPostPage = document.getElementById("reported-button");
const discussionPage = document.getElementById("discussion-button");
const sidebar = document.getElementById("sidebar");
//Begins by getting all reported posts from local database
getAllReportedPosts("http://localhost:3000/siteadmin/postreport");


//Adds event listener to new button to repopulate report box with reports ordered by newest to oldest
newButton.addEventListener("click", function() {
    //Reset post box and data to empty
    reportedPostBox.innerHTML = ""; 
    reportedPosts = [];
    getAllReportedPosts("http://localhost:3000/siteadmin/newestpostreport");
    console.log("received");
})

//Adds event listener to report button to repopulate report box with reports ordered by most reported
reportButton.addEventListener("click", function() {
    //Reset post box and data to empty
    reportedPostBox.innerHTML = ""; 
    reportedPosts = [];
    countData = [];
    getPostsSortedByMostReported();
   

})

//Set of buttons for different site admin panel pages
mutedPage.addEventListener("click", function(e) {
    window.location.href= "./siteadmin-mutedusers.html";
})

bannedPage.addEventListener("click", function(e) {
    window.location.href= "./siteadmin-bannedusers.html";
})

reportedPostPage.addEventListener("click", function(e) {
    window.location.href= "./siteadmin-reportedposts.html";
})

discussionPage.addEventListener("click", function(e) {
    window.location.href= "./siteadmin.html";
})


//Populates the post reports onto the page
function populatePosts(reportedPosts) {
    console.log("populating posts");
    length = reportedPosts.length;
    //Displays 'no more post reports' if there are no posts remaining
    if (length == 0) {
        reportedPostBox.insertAdjacentHTML("beforeEnd",`
            <div class = "bg-white w-70per m-auto rounded-xl flex justify-center p-2">No more Post Reports</div>
            `)
    }
    //Creates html for a post for every post in reportedPosts
    for (i = 0; i < length; i++) {
        currentPost = reportedPosts[i];
        reportedPostBox.insertAdjacentHTML("beforeEnd",
            `<div class="bg-white card w-95per mt-8 m-auto rounded-xl flex flex-col" id="post-box">
                    <p class="mt-4 mb-2 ml-4 flex flex-row items-center"><img src="../images/account-circle-outline.svg" width="40px" height="40px" class="mr-2"><b>u:${currentPost["accName"]}</b> </p>
                    <h1 class="mb-4 ml-4"><b>${currentPost["postName"]}</b></h1>
                    <p class="mb-6 ml-4">${currentPost["reportDesc"]}</p>
                    <div class="flex flex-row mb-4 flex-end mr-4"><img src="../images/tick.svg" width="25px" height="25px" class="cursor-pointer tick" id="${currentPost["reportId"]}"><img src="../images/cross.svg" width="25px" height="25px" class="ml-8 cursor-pointer cross" id="${currentPost["postId"]},${currentPost["reportId"]}"></div>
            </div>`

         )
    }
    addApproveDenyListeners();
   
}

function addApproveDenyListeners() {
    const allTicks = document.getElementsByClassName("tick");
    const allCrosses = document.getElementsByClassName("cross");
    length = allCrosses.length;
    for (i = 0; i < length; i++) {
        //Adds event listeners to the approve and deny buttons respectively. Approve deletes the report while deny deletes both post and report
        console.log(allTicks[i]);
        allTicks[i].addEventListener("click", function() {
                reportId = event.currentTarget.id;
                deletePostReport(reportId);
                console.log(reportId + " approved");
                alert("Post approved!");
                window.location.reload();
            }
        )
       
        allCrosses[i].addEventListener("click", function() {
            ids = event.currentTarget.id.split(',');
            postId = ids[0];
            reportId = ids[1];
            deletePostReport(reportId);
            denyPost(postId);
            sidebar.classList.remove('z-20');
           
            console.log(postId + reportId + " denied");
            alert("Post rejected!");
            window.location.reload();
        }
    )
    }   
}


//Function gets all post reports from the database
async function getAllReportedPosts(url) {
    response = await fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error('Response invalid!');
        }
        
        return response.json();
    })
    .then(reportedPostData => {
       
        for(i = 0; i < reportedPostData.length; i++) 
        {
            reportedPosts.push(reportedPostData[i]);
        }
        console.log(reportedPosts);
        //returns reported posts in dictionary format
        populatePosts(reportedPosts);
    })
    .catch(error => {
        console.error("Error:", error);
    }); 
}

//Function gets and populates the post by most reported
async function getPostsSortedByMostReported() {
    //Fetch gets the count of all post reports grouped by post from the database
    response = await fetch("http://localhost:3000/siteadmin/reportcount")
    .then(response => {
        if (!response.ok) {
            throw new Error('Response invalid!');
        }
        
        return response.json();
    })
    .then(countPostData => {
       
        for(i = 0; i < countPostData.length; i++) 
        {
             //Sends count data into countdata array
            countData.push(countPostData[i]);
        }
       
        countLength = countData.length;
        if(countLength < 1) {
                reportedPostBox.insertAdjacentHTML("beforeEnd",`
                    <div class = "bg-white w-70per m-auto rounded-xl flex justify-center p-2">No more Post Reports</div>
                    `)
            
        }

        //For each set of data counts, get a post report by id
        for (i = 0; i < countLength; i++) {
            reportInstance = countData[i];
            console.log(reportInstance);
            postId = reportInstance["PostId"];
            console.log(postId);
            getPostReportById(postId);
    
        }
        console.log(countLength, reportedPosts );
        
       
       
    })
    .catch(error => {
        console.error("Error:", error);
    }); 
}

async function getPostReportById(postId) {
    response = await fetch(`http://localhost:3000/siteadmin/postreport/${postId}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Response invalid!');
        }
        
        return response.json();
    })
    .then(reportedPostData => {
            //Sends single post report into reported posts
            console.log(reportedPostData[0]);
            //Pushes each post report data into reported posts
            reportedPosts.push(reportedPostData[0]);
            console.log(reportedPosts);
            //Resets the html every time this function is called to avoid duplicate reports
            reportedPostBox.innerHTML = "";
            //Finally creates the html for each post report
            populatePosts(reportedPosts);
    })
    .catch(error => {
        console.error("Error:", error);
    }); 
}


//Function deletes post report from postreport table
async function deletePostReport(reportId) {
    const response = await fetch(`http://localhost:3000/siteadmin/approve/${reportId}`, {
        method: "DELETE",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            'Content-type': "application/json",
        },
        redirect: "follow",
        referrerPolicy: "no-referrer"
    });
   
  
}


//Function deletes post with their post id
async function denyPost(postId) {
    const response = await fetch(`http://localhost:3000/siteadmin/deny/${postId}`, {
        method: "PUT",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            'Content-type': "application/json",
        },
        redirect: "follow",
        referrerPolicy: "no-referrer"
    });
}


 