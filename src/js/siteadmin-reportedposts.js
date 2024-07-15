reportedPosts = [];
const reportedPostBox = document.getElementById("post-box");
const newButton = document.getElementById("new-button");
const reportButton = document.getElementById("report-button");
getAllReportedPosts("http://localhost:3000/siteadmin/postreport");


//Add event listeners to sorting buttons to get post report data - in progress
newButton.addEventListener("click", function() {
    getAllReportedPosts("http://localhost:3000/siteadmin/newestpostreport");
    console.log("received");
})

reportButton.addEventListener("click", function() {

})




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

//Populates the post reports onto the page
function populatePosts(reportedPosts) {
    length = reportedPosts.length;
    //Displays 'no more post reports' if there are no posts remaining
    if (length == 0) {
        reportedPostBox.insertAdjacentHTML("beforeEnd",`
            <div class = "bg-white w-70per m-auto rounded-xl flex justify-center">No more Post Reports</div>
            `)
    }

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
                reportId = event.target.id;
                deletePostReport(reportId);
                console.log(reportId + " approved");
                alert("Post approved!");
                window.location.reload();
            }
        )
        console.log(allCrosses[i]);
        allCrosses[i].addEventListener("click", function() {
            ids = event.target.id.split(',');
            postId = ids[0];
            reportId = ids[1];
            deletePostReport(reportId);
            deletePost(postId);
           
            console.log(postId + reportId + " denied");
            alert("Post rejected!")
            window.location.reload();
        }
    )
    }   
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
async function deletePost(postId) {
    const response = await fetch(`http://localhost:3000/siteadmin/post/${postId}`, {
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


 