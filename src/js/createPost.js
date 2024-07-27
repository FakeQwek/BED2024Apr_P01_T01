// get discussion name parameter from the url
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const discussionName = urlParams.get("discussionName");

// get html elements
const createPostName = document.getElementById("createPostName");
const createPostDesc = document.getElementById("createPostDesc");
const isEventRadio = document.getElementById("isEvent");
const bannerOptions = document.getElementById("bannerOptions");
const memberCount = document.getElementById("memberCount");
const eventContainer = document.getElementById("eventContainer");
const main = document.getElementById("main");
const searchBar = document.getElementById("searchBar");
const searchResults = document.getElementById("searchResults");
const searchResultsContainer = document.getElementById("searchResultsContainer");

// set variables
let isMember = false;
let isPublic = false;
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

    // stores the account name in the accountName variable if username matches
    accountName = account.accName;

    sidebar();
}

checkAccountName();

// function to get discussion details
async function Discussion() { 
    const res = await fetch("http://localhost:3000/discussions/" + discussionName);
    const discussion = await res.json();

    const discussionName2 = document.getElementById("discussionName");
    const discussionName2HTML = `<h2>d:` + discussion.dscName + `</h2>`;
    discussionName2.insertAdjacentHTML("afterbegin", discussionName2HTML);

    const discussionBannerName = document.getElementById("discussionBannerName");
    const discussionBanerNameHTML = `<h2>` + discussion.dscName + `</h2>`;
    discussionBannerName.insertAdjacentHTML("afterbegin", discussionBanerNameHTML);

    const discussionBannerDesc = document.getElementById("discussionBannerDesc");
    const discussionBannerDescHTML = `<p>` + discussion.dscDesc + `</p>`;
    discussionBannerDesc.insertAdjacentHTML("afterbegin", discussionBannerDescHTML);

    const discussionOwners = document.getElementById("discussionOwners");
    const discussionOwnersHTML = `<div class="flex items-center gap-2">
                                    <img src="../images/account-circle-outline.svg" width="30px" />
                                    <h2>` + discussion.accName + `</h2>
                                </div>`;
    discussionOwners.insertAdjacentHTML("beforeend", discussionOwnersHTML);

    // set isPublic to true if the discussion type is public
    if (discussion.dscType == "Public") {
        isPublic = true;
    }

    DiscussionMembers();
};

// function to create a post
async function createPost() {
    let dateInput = null;

    if (isEventRadio.checked) {
        var isEvent = "True";
        dateInput = document.getElementById("dateInput");
    } else {
        var isEvent = "False";
    }

    // get current date
    let date = new Date();

    let dd = date.getDate();
    let mm = date.getMonth() + 1;

    let yyyy = date.getFullYear();

    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    date = dd + '/' + mm + '/' + yyyy;
        
    await fetch("http://localhost:3000/post/" + discussionName, {
        method: "POST",
        body: JSON.stringify({
            postName: createPostName.value,
            postDesc: createPostDesc.value,
            isEvent: isEvent,
            postDate: date,
            accName: accountName,
            dscName: discussionName
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    });
    
    // directs to a new page
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
    url = url.concat("discussion.html?discussionName=" + discussionName);
    window.location.href = url;
};

// function to get details of the discussion's members
async function DiscussionMembers() {
    const res = await fetch("http://localhost:3000/discussionMembers/" + discussionName);
    const discussionMembers = await res.json();
    
    // sets the discussion member count
    memberCount.innerHTML = `<h2 class="font-bold">` + discussionMembers.length + `</h2>`;

    const postCard = document.getElementById("postCard");

    // if discussion is not public check if user is a member
    if (!isPublic) {
        for (let i = 0; i < discussionMembers.length; i++) {
            if (discussionMembers[i].accName == accountName) {
                isMember = true;
            }
        }
    
        // display user is not a member message
        if (!isMember) {
            postCard.innerHTML = `<div class="flex flex-col justify-center items-center h-full">
                                    <img src="../images/lock-outline.svg" width="100px" />
                                    <h2 class="text-2xl font-bold">You are not a member of this disucssion</h2>
                                </div>`;
        }
    }

    for (let i = 0; i < discussionMembers.length; i++) {
        // display user is muted message
        if (discussionMembers[i].accName == accountName && discussionMembers[i].isMuted == "True") {
            postCard.innerHTML = `<div class="flex flex-col justify-center items-center h-full">
                                    <img src="../images/microphone-off.svg" width="100px" />
                                    <h2 class="text-2xl font-bold">You are muted and are no longer allowed to make posts</h2>
                                </div>`;
        }

        // if user is an owner show them additional options to edit discussion details
        if (discussionMembers[i].dscMemRole == "Owner" && discussionMembers[i].accName == accountName) {
            const bannerOptionsHTML = `<li><button class="btn btn-sm bg-white border-0 text-start shadow-none" onclick="edit_discussion_modal.showModal()"><span class="w-full">Edit</span></button></li>`;
            bannerOptions.insertAdjacentHTML("beforeend", bannerOptionsHTML);
        } else if (discussionMembers[i].dscMemRole == "Admin") { // if user is an admin add their name to the banner
            const discussionAdmins = document.getElementById("discussionAdmins");
            const discussionAdminsHTML = `<div class="flex items-center gap-2">
                                            <img src="../images/account-circle-outline.svg" width="30px" />
                                            <h2>` + discussionMembers[i].accName + `</h2>
                                        </div>`;
            discussionAdmins.insertAdjacentHTML("beforeend", discussionAdminsHTML);
        }
    }
}

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


// event listener to make a date input appear if user marks the post as an event
isEventRadio.addEventListener("change", () => {
    const dateInputHTML = `<input id="dateInput" type="text" placeholder="Date" class="input input-bordered" />`;
    eventContainer.insertAdjacentHTML("afterbegin", dateInputHTML);
})

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

Discussion();
