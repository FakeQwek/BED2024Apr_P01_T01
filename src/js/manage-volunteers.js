// get post id parameter from the url
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const postId = urlParams.get("postId");

// set variables
let approvedVolunteerCount = 0;
let accountName;

// function that checks if the username in the get request matches with the username in the jwt token
async function checkAccountName() {
    const res = await fetch("http://localhost:3000/accounts/" + localStorage.getItem("username"), {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    });
    const account = await res.json();

    // set html for account if the user is logged in
    if (account.accName != null) {
        const loginSignUp = document.getElementById("loginSignUp");
        loginSignUp.innerHTML = `<button class="btn btn-sm mr-4 max-[820px]:hidden" onclick="goToProfile('` + account.accName +`')"><img src="../images/account-circle-outline.svg" width="20px" />` + account.accName + `</button>`;
    }

    accountName = account.accName;

    Post();
    sidebar();
}

checkAccountName();

// function to get post details
async function Post() {
    const res = await fetch("http://localhost:3000/post/" + postId);
    const post = await res.json();

    const postDiscussionName = document.getElementById("postDiscussionName");

    const postDiscussionNameHTML = `<h1>d:` + post.dscName + `</h1>`;

    postDiscussionName.insertAdjacentHTML("afterbegin", postDiscussionNameHTML);

    const postName = document.getElementById("postName");

    postNameHTML = `<h2 class="text-2xl font-bold m-8">` + post.postName + `</h2>`;

    postName.insertAdjacentHTML("afterbegin", postNameHTML);

    if (post.accName != accountName) {
        const postCard = document.getElementById("postCard");
        postCard.innerHTML = `<div class="flex flex-col justify-center items-center h-full">
                                <img src="../images/lock-outline.svg" width="100px" />
                                <h2 class="text-2xl font-bold">You are not the owner of this post</h2>
                            </div>`;
    } else if (post.isEvent == "False") {
        const postCard = document.getElementById("postCard");
        postCard.innerHTML = `<div class="flex flex-col justify-center items-center h-full">
                                <img src="../images/lock-outline.svg" width="100px" />
                                <h2 class="text-2xl font-bold">This post is not an event</h2>
                            </div>`;
    }
};

// function to get volunteers details of the post
async function Volunteers() {
    const res = await fetch("http://localhost:3000/volunteers/" + postId, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    });
    const volunteers = await res.json();

    const postVolunteers = document.getElementById("postVolunteers");

    // set the html of the volunteers based on whether they were approved
    for (let i = 0; i < volunteers.length; i++) {
        if (volunteers[i].isApproved == "True") {
            approvedVolunteerCount++;
            const volunteerHTML = `<div class="card w-11/12 h-fit bg-white mt-4">
                                        <div class="card-body">
                                            <div class="card-title flex justify-between items-center">
                                                <div class="flex items-center gap-2">
                                                    <img src="../images/account-circle-outline.svg" width="30px" />
                                                    <h2 class="text-sm">` + volunteers[i].accName + `</h2>
                                                </div>
                                            </div>
                                        </div>
                                    </div>`
            postVolunteers.insertAdjacentHTML("beforeend", volunteerHTML);
        } else {
            const volunteerHTML = `<div class="card w-11/12 h-fit bg-white mt-4">
                                        <div class="card-body">
                                            <div class="card-title flex justify-between items-center max-[820px]:flex-col max-[820px]:items-start">
                                                <div class="flex items-center gap-2">
                                                    <img src="../images/account-circle-outline.svg" width="30px" />
                                                    <h2 class="text-sm">` + volunteers[i].accName + `</h2>
                                                </div>
                                                <div class="flex gap-4 max-[820px]:gap-0">
                                                    <button class="btn btn-sm bg-white border-0 shadow-none"><img src="../images/check.svg" width="20px" onclick="approveVolunteer(` + volunteers[i].volId + `)"></button>
                                                    <button class="btn btn-sm bg-white border-0 shadow-none"><img src="../images/close.svg" width="20px" onclick="deleteVolunteer(` + volunteers[i].volId + `)"></button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>`
            postVolunteers.insertAdjacentHTML("beforeend", volunteerHTML);
        }
    }

    const postName = document.getElementById("postName");

    const approvedVolunteersHTML = `<h2 class="text-md m-8">` + approvedVolunteerCount + ` Volunteers Approved</h2>`;

    postName.insertAdjacentHTML("beforeend", approvedVolunteersHTML);
};

// function to approve volunteers
async function approveVolunteerAsync(volId) {
    await fetch("http://localhost:3000/volunteer/" + postId + "/" + volId, {
        method: "PUT",
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    });
};

// function to get user details to be displayed on the sidebar
async function sidebar() {
    const res = await fetch("http://localhost:3000/discussionMemberTop3Discussions/" + accountName);
    const discussionMembers = await res.json();

    const joinedDiscussions = document.getElementById("joinedDiscussions");
    
    for (let i = 0; i < discussionMembers.length; i++) {
        const discussionButtonHTML = `<li><a href="./discussion.html?discussionName=` + discussionMembers[i].dscName + `"><span class="flex items-center w-full gap-2"><img src="../images/account-circle-outline.svg" width="30px" />` + discussionMembers[i].dscName + `</span></a></li>`;
        joinedDiscussions.insertAdjacentHTML("beforeend", discussionButtonHTML);
    }
}

function approveVolunteer(volId) {
    approveVolunteerAsync(volId);

    location.reload();
}

// function to reject/delete volunteers
async function deleteVolunteerAsync(volId) {
    await fetch("http://localhost:3000/volunteer/" + postId + "/" + volId, {
        method: "DELETE",
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    });
};


function deleteVolunteer(volId) {
    deleteVolunteerAsync(volId);

    location.reload();
};

// direct page to profile page
function goToProfile(accName) {
    var script = document.getElementsByTagName("script");
    var url = script[script.length-1].src;
    for (let i = 0; i < url.length; i++) {
        if (url.slice(-1) != "/") {
            url = url.substring(0, url.length - 1);
        } else {
            break;
        }
    }
    url = url.substring(0, url.length - 3);
    url = url.concat("profile.html");
    window.location.href = url;
}

const main = document.getElementById("main");
const searchBar = document.getElementById("searchBar");
const searchResults = document.getElementById("searchResults");
const searchResultsContainer = document.getElementById("searchResultsContainer");

// function to search all discussions
async function searchDiscussions(searchTerm) {
    const res = await fetch("http://localhost:3000/discussions/search?searchTerm=" + searchTerm);
    const discussions = await res.json();

    searchResults.innerHTML = ``;
    
    for (let i = 0; i < discussions.length; i++) {
        const resultHTML = `<button class="btn mx-4 my-2" onclick="goToDiscussion('` + discussions[i].DscName + `')">` + discussions[i].DscName + `</button>`
        searchResults.insertAdjacentHTML("beforeend", resultHTML);
    }
}

// event listener for search bar input
searchBar.addEventListener("input", () => {
    searchResultsContainer.classList.remove("invisible");
    searchDiscussions(searchBar.value);
})

// event listener for search bar focus
searchBar.addEventListener("focus", () => {
    searchResultsContainer.classList.remove("invisible");
})

// event listener to remove search results when users clicks on anything that is below the navbar
main.addEventListener("click", () => {
    searchResultsContainer.classList.add("invisible");
})

// direct page to discussion page
function goToDiscussion(dscName) {
    var script = document.getElementsByTagName("script");
    var url = script[script.length-1].src;
    for (let i = 0; i < url.length; i++) {
        if (url.slice(-1) != "/") {
            url = url.substring(0, url.length - 1);
        } else {
            break;
        }
    }
    url = url.substring(0, url.length - 3);
    url = url.concat("discussion.html?discussionName=" + dscName);
    window.location.href = url;
}

Volunteers();
