// get html elements
const discussionName = document.getElementById("discussionName");
const homePosts = document.getElementById("homePosts");
const searchBar = document.getElementById("searchBar");
const searchResults = document.getElementById("searchResults");
const searchResultsContainer = document.getElementById("searchResultsContainer");

// set variables
let accountName;
apikey = "ad61a3b55ab20ed21479950c798b39d9";
url = 'https://gnews.io/api/v4/top-headlines?category=health&lang=en&country=sg&max=10&apikey=' + apikey;
let news = [];

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

    sidebar();
}

checkAccountName();

// function to create discussion
async function createDiscussion() {
    const public = document.getElementById("public");
    const restricted = document.getElementById("restricted");
    const private = document.getElementById("private");
    var type;

    // check which discussion type was selected
    if (public.checked == true) {
        type = "Public";
    } else if (restricted.checked) {
        type = "Restricted";
    } else if (private.checked) {
        type = "Private";
    }

    await fetch("http://localhost:3000/discussion", {
        method: "POST",
        body: JSON.stringify({
            dscName: discussionName.value,
            dscDesc: "",
            dscType: type,
            accName: accountName
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });

    await fetch("http://localhost:3000/discussionMember/" + discussionName.value, {
        method: "POST",
        body: JSON.stringify({
            accName: accountName,
            dscMemRole: "Owner"
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    
    // direct page to discussion page of newly created discussion
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
    url = url.concat("discussion.html?discussionName=" + discussionName.value);
    window.location.href = url;
};

// function to get random posts from random public discussions
async function Posts() {
    const res = await fetch("http://localhost:3000/publicPosts");
    const posts = await res.json();

    for (let j = 0; j < 3; j++) {
        for (let i = 0; i < 5; i++) {
            const homePostsHTML = `<div class="flex justify-center w-full">
                                    <div class="card w-5/6 bg-white">
                                        <div class="card-body">
                                            <div class="flex justify-between">
                                                <div class="flex items-center gap-2">
                                                    <img src="../images/account-circle-outline.svg" width="30px" />
                                                    <h2 class="text-md" onclick="goToDiscussion('` + posts[i].dscName + `')">d:` + posts[i].dscName + `</h2>
                                                    <h2 class="text-sm">` + posts[i].postDate + `</h2>
                                                </div>
                                                <!-- options dropdown -->
                                                <div class="dropdown dropdown-end">
                                                    <div tabindex="0" role="button" class="btn btn-sm bg-white border-0 shadow-none"><img src="../images/dots-horizontal.svg" width="20px" /></div>
                                                    <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                                                        <li><button class="btn btn-sm bg-white border-0 text-left shadow-none" onclick="report_post_modal` + i + `.showModal()"><span class="w-full">Report</span></button></li>
                                                    </ul>
                                                    <!-- report post popup -->
                                                    <dialog id="report_post_modal` + i + `" class="modal">
                                                        <div class="modal-box flex flex-col h-2/3 rounded-3xl gap-2">
                                                            <h2 class="font-bold text-2xl">Submit a report</h2>
                                                            <p class="text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                                                            <select id="postReportCat` + posts[i].postId + `" class="select select-bordered w-full mt-4">
                                                                <option>Hate speech</option>
                                                                <option>Minor abuse or sexualisation</option>
                                                                <option>Self-harm or suicide</option>
                                                            </select>
                                                            <textarea id="postReportDesc` + posts[i].postId + `" class="textarea textarea-bordered h-2/3 resize-none mt-4" placeholder="Description"></textarea>
                                                            <div class="modal-action">
                                                                <form class="flex gap-4" method="dialog">
                                                                    <button class="btn btn-sm">Cancel</button>
                                                                    <button class="btn btn-sm bg-red-500 text-white" onclick="createPostReport(` + posts[i].postId + `)">Submit</button>
                                                                </form>
                                                            </div>
                                                        </div>
                                                    </dialog>
                                                </div>
                                            </div>
                                            <h2 class="card-title">` + posts[i].postName + `</h2>
                                            <p>` + posts[i].postDesc + `</p>
                                            <div class="flex justify-end">
                                                <button id=` + posts[i].postId + ` class="btn btn-sm" onclick="goToPost(` + posts[i].postId + `)">View</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>`;

            homePosts.insertAdjacentHTML("beforeend", homePostsHTML);
        }
        let randomNews = news[Math.floor(Math.random() * 10)];

        const homePostsHTML = `<div class="flex justify-center w-full">
                                    <div class="card w-5/6 bg-white">
                                        <div class="card-body">
                                            <div class="flex justify-between">
                                                <div class="flex items-center gap-2">
                                                    <img src="../images/account-circle-outline.svg" width="30px" />
                                                    <h2 class="text-md">` + randomNews.source.name + `</h2>
                                                </div>
                                            </div>
                                            <h2 class="card-title">` + randomNews.title + `</h2>
                                            <img class="rounded" src=` + randomNews.image + `>
                                            <p>` + randomNews.description + `</p>
                                        </div>
                                    </div>
                                </div>`;

        homePosts.insertAdjacentHTML("beforeend", homePostsHTML);
    }
}

searchBar.addEventListener("focusout", () => {
    searchResultsContainer.classList.add("invisible");
})

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

// function to create post report
async function createPostReport(postId) {
    const postReportCat = document.getElementById("postReportCat" + postId);
    const postReportDesc = document.getElementById("postReportDesc" + postId);

    await fetch("http://localhost:3000/postReport", {
        method: "POST",
        body: JSON.stringify({
            postRptCat: postReportCat.value,
            postRptDesc: postReportDesc.value,
            accName: accountName,
            postId: postId
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
}

// function to get user details to be displayed on the sidebar
async function sidebar() {
    const res = await fetch("http://localhost:3000/discussionMemberTop3Discussions/" + accountName);
    const discussionMembers = await res.json();
    console.log(discussionMembers);

    const joinedDiscussions = document.getElementById("joinedDiscussions");
    
    for (let i = 0; i < discussionMembers.length; i++) {
        const discussionButtonHTML = `<li><a><span class="flex items-center w-full gap-2"><img src="../images/account-circle-outline.svg" width="30px" />` + discussionMembers[i].dscName + `</span></a></li>`;
        joinedDiscussions.insertAdjacentHTML("beforeend", discussionButtonHTML);
    }
}

// direct page to the post page with the post id of the selected post
function goToPost(postId) {
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
    url = url.concat("post.html?postId=" + postId);
    window.location.href = url;
}

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

async function getNews() {
    fetch(url)
    .then(res => {
        if(!res.ok){
            throw new Error('Error retrieving news');
        }
        return res.json();
    })
    .then(newsData => {
        for (i = 0; i < 10; i++) {
            news.push(newsData.articles[i])
        }
        Posts();
    })
    .catch(error => {
        console.error(error);
    });
}

getNews();