const discussionName = document.getElementById("discussionName");

async function createDiscussion() {
    const public = document.getElementById("public");
    const restricted = document.getElementById("restricted");
    const private = document.getElementById("private");
    var type;

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
            accName: "box"
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });

    await fetch("http://localhost:3000/discussionMember/" + discussionName.value, {
        method: "POST",
        body: JSON.stringify({
            accName: "AppleTan",
            dscMemRole: "Owner"
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    
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

const homePosts = document.getElementById("homePosts");

async function Posts() {
    const res = await fetch("http://localhost:3000/posts");
    const posts = await res.json();

    for (let i = 0; i < posts.length; i++) {
        const homePostsHTML = `<div class="flex justify-center w-full">
                                    <div class="card w-5/6 bg-white" onclick="goToPost(` + posts[i].postId + `)">
                                        <div class="card-body">
                                            <div class="flex justify-between">
                                                <div class="flex items-center gap-2">
                                                    <img src="../images/account-circle-outline.svg" width="30px" />
                                                    <h2 class="text-md">d:` + posts[i].dscName + `</h2>
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
                                        </div>
                                    </div>
                                </div>`;

        homePosts.insertAdjacentHTML("beforeend", homePostsHTML);
    }
}

const searchBar = document.getElementById("searchBar");
const searchResults = document.getElementById("searchResults");
const searchResultsContainer = document.getElementById("searchResultsContainer");

// searchBar.addEventListener("focusout", () => {
//     searchResultsContainer.classList.add("invisible");
// })

async function searchDiscussions(searchTerm) {
    const res = await fetch("http://localhost:3000/discussions/search?searchTerm=" + searchTerm);
    const discussions = await res.json();

    console.log(discussions);

    searchResults.innerHTML = ``;
    
    for (let i = 0; i < discussions.length; i++) {
        const resultHTML = `<button class="btn mx-4 my-2" onclick="goToDiscussion('` + discussions[i].DscName + `')">` + discussions[i].DscName + `</button>`
        searchResults.insertAdjacentHTML("beforeend", resultHTML);
    }
}

searchBar.addEventListener("input", () => {
    searchResultsContainer.classList.remove("invisible");
    searchDiscussions(searchBar.value);
})

searchBar.addEventListener("focus", () => {
    searchResultsContainer.classList.remove("invisible");
})

async function createPostReport(postId) {
    const postReportCat = document.getElementById("postReportCat" + postId);
    const postReportDesc = document.getElementById("postReportDesc" + postId);

    await fetch("http://localhost:3000/postReport", {
        method: "POST",
        body: JSON.stringify({
            postRptCat: postReportCat.value,
            postRptDesc: postReportDesc.value,
            accName: "AppleTan",
            postId: postId
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
}

async function sidebar() {
    const res = await fetch("http://localhost:3000/discussionMemberTop3Discussions/" + "AppleTan");
    const discussionMembers = await res.json();

    const joinedDiscussions = document.getElementById("joinedDiscussions");
    
    for (let i = 0; i < discussionMembers.length; i++) {
        const discussionButtonHTML = `<li><a><span class="flex items-center w-full gap-2"><img src="../images/account-circle-outline.svg" width="30px" />` + discussionMembers[i].dscName + `</span></a></li>`;
        joinedDiscussions.insertAdjacentHTML("beforeend", discussionButtonHTML);
    }
}

function goToPost(postId) {
    // var script = document.getElementsByTagName("script");
    // var url = script[script.length-1].src;
    // for (let i = 0; i < url.length; i++) {
    //     if (url.slice(-1) != "/") {
    //         url = url.substring(0, url.length - 1);
    //     } else {
    //         break;
    //     }
    // }
    // url = url.substring(0, url.length - 3);
    // url = url.concat("post.html?postId=" + postId);
    // window.location.href = url;
}

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

Posts();
sidebar();