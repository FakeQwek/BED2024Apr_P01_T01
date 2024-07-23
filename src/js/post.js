// get post id parameter from the url
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const postId = urlParams.get("postId");

// get html elements
const postName = document.getElementById("postName");
const postDesc = document.getElementById("postDesc");
const postComments = document.getElementById("postComments");
const postAccount = document.getElementById("postAccount");
const postDate = document.getElementById("postDate");
const postOptions = document.getElementById("postOptions");
const commentDesc = document.getElementById("commentDesc");
const memberCount = document.getElementById("memberCount");

// set variables
let discussionName;
let isPublic = false;
let isMember = false;
let isMuted = false;
let isBanned = false;
let accountName;
let postNameHTML;
let postDescHTML;
let postAccountHTML;
let postDateHTML;

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

// function to get discussion details
async function Discussion(dscName) { 
    const res = await fetch("http://localhost:3000/discussions/" + dscName);
    const discussion = await res.json();

    discussionName = discussion.dscName;

    const discussionBannerName = document.getElementById("discussionBannerName");
    const discussionBanerNameHTML = `<h2>` + discussionName + `</h2>`;
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

    if (discussion.dscType == "Public") {
        isPublic = true;
    }

    DiscussionMembers();
};

// function to get post details
async function Post() {
    const res = await fetch("http://localhost:3000/post/" + postId);
    const post = await res.json();

    // set post details in variables
    postNameHTML = `<h2>` + post.postName + '</h2>';
    postDescHTML = '<p>' + post.postDesc + '<p>';
    postAccountHTML = '<p>' + post.accName + '<p>';
    postDateHTML = '<p>' + post.postDate + '<p>';

    // if user is the post owner show them additional options to delete and edit the post
    if (post.accName == accountName) {
        const postOptionsHTML = `<li><button class="btn btn-sm bg-white border-0 text-left shadow-none" onclick="delete_modal.showModal()"><span class="w-full">Delete</span></button></li>
                                <li><button class="btn btn-sm bg-white border-0 text-left shadow-none" onclick="goToEditPost(` + postId + `)"><span class="w-full">Edit</span></button></li>`;
        postOptions.insertAdjacentHTML("beforeend", postOptionsHTML);
    }

    Discussion(post.dscName);
};

// function to get the comment details of the post
async function Comments() {
    const res = await fetch("http://localhost:3000/comments/" + discussionName + "/" + postId, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    });
    const comments = await res.json();

    for (let i = 0; i < comments.length; i++) {
        const postCommentHTML = `<div class="card w-full h-fit bg-white">
                                    <div class="card-body">
                                        <div class="flex justify-between">
                                            <div class="flex items-center gap-2">
                                                <img src="../images/account-circle-outline.svg" width="30px" />
                                                <h2>` + comments[i].accName + `</h2>
                                            </div>
                                            <!-- options dropdown -->
                                            <div class="dropdown dropdown-end">
                                                <div tabindex="0" role="button" class="btn btn-sm bg-white border-0 shadow-none"><img src="../images/dots-horizontal.svg" width="20px" /></div>
                                                <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                                                    <li><button class="btn btn-sm bg-white border-0 text-left shadow-none" onclick="report_post_modal` + i + `.showModal()"><span class="w-full">Report</span></button></li>
                                                    <li><button class="btn btn-sm bg-white border-0 text-left shadow-none" onclick="editComment(` + comments[i].cmtId + `,'` + comments[i].cmtDesc + `')"><span class="w-full">Edit</span></button></li>
                                                    <li><button class="btn btn-sm bg-white border-0 text-left shadow-none" onclick="delete_modal` + i + `.showModal()"><span class="w-full">Delete</span></button></li>
                                                </ul>
                                                <!-- report post popup -->
                                                <dialog id="report_post_modal` + i + `" class="modal">
                                                    <div class="modal-box flex flex-col h-2/3 rounded-3xl gap-2">
                                                        <h2 class="font-bold text-2xl">Submit a report</h2>
                                                        <p class="text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                                                        <select class="select select-bordered w-full mt-4">
                                                            <option>Hate speech</option>
                                                            <option>Minor abuse or sexualisation</option>
                                                            <option>Self-harm or suicide</option>
                                                        </select>
                                                        <textarea class="textarea textarea-bordered h-2/3 resize-none mt-4" placeholder="Description"></textarea>
                                                        <div class="modal-action">
                                                            <form class="flex gap-4" method="dialog">
                                                                <button class="btn btn-sm">Cancel</button>
                                                                <button class="btn btn-sm bg-red-500 text-white">Submit</button>
                                                            </form>
                                                        </div>
                                                    </div>
                                                </dialog>
                                                <!-- delete popup -->
                                                <dialog id="delete_modal` + i + `" class="modal">
                                                    <div class="modal-box flex flex-col rounded-3xl gap-2">
                                                        <h2 class="font-bold text-2xl">Delete this post</h2>
                                                        <p class="text-sm">Are you sure you want to delete this comment? Once deleted this comment will be gone forever.</p>
                                                        <div class="modal-action">
                                                            <form class="flex gap-4" method="dialog">
                                                                <button class="btn btn-sm">Cancel</button>
                                                                <button class="btn btn-sm bg-red-500 text-white" onclick="deleteComment(` + comments[i].cmtId + `)">Delete</button>
                                                            </form>
                                                        </div>
                                                    </div>
                                                </dialog>
                                            </div>
                                        </div>
                                        <div id="` + comments[i].cmtId + `">
                                            <p>` + comments[i].cmtDesc + `</p>
                                        </div>
                                    </div>
                                </div>`
        
        postComments.insertAdjacentHTML("afterbegin", postCommentHTML);
    }
};

// function to create comment
async function createComment() {
    await fetch("http://localhost:3000/comment/" + discussionName, {
        method: "POST",
        body: JSON.stringify({
            cmtDesc: commentDesc.value,
            accName: "box",
            postId: postId
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    });
    location.reload();
};

// function to delete comment
async function deleteComment(cmtId) {
    await fetch("http://localhost:3000/comment/" + cmtId, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    });
    location.reload();
}

function editComment(cmtId, cmtDesc) {
    const commentDesc = document.getElementById(cmtId);
    commentDesc.innerHTML = `<div class="flex w-full h-fit bg-white rounded-2xl my-4 p-4">
                                <input id="editDesc` + cmtId + `" value="` + cmtDesc + `" type="text" placeholder="Comment" class="input input-bordered w-full" />
                            </div>
                            <button id="cancel` + cmtId + `" class="btn">Cancel</button>
                            <button id="edit` + cmtId + `" class="btn">Edit</button>`;
    const editDesc = document.getElementById("editDesc" + cmtId);
    const cancel = document.getElementById("cancel" + cmtId);
    const edit = document.getElementById("edit" + cmtId);

    cancel.addEventListener("click", () => {
        commentDesc.innerHTML = `<p>` + cmtDesc + `</p>`;
    })

    edit.addEventListener("click", () => {
        editCommentAsync(cmtId, editDesc.value);
    })
}

// function to edit comment
async function editCommentAsync(cmtId, editDesc) {
    await fetch("http://localhost:3000/comment/" + cmtId, {
        method: "PUT",
        body: JSON.stringify({
            "cmtDesc": editDesc,
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    });
    location.reload();
}

// event listener to create comment when user hits the enter key
commentDesc.addEventListener("keyup", ({key}) => {
    if (key == "Enter") {
        createComment();
    }
})

// function to create post report
async function createPostReport() {
    const postReportCat = document.getElementById("postReportCat");
    const postReportDesc = document.getElementById("postReportDesc");

    await fetch("http://localhost:3000/postReport/" + discussionName, {
        method: "POST",
        body: JSON.stringify({
            postRptCat: postReportCat.value,
            postRptDesc: postReportDesc.value,
            accName: "box",
            postId: postId
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    })
}

// function to create discussion report
async function createDiscussionReport() {
    const dscReportCat = document.getElementById("dscReportCat");
    const dscReportDesc = document.getElementById("dscReportDesc");

    await fetch("http://localhost:3000/discussionReport/" + discussionName, {
        method: "POST",
        body: JSON.stringify({
            dscRptCat: dscReportCat.value,
            dscRptDesc: dscReportDesc.value,
            accName: "box",
            dscName: discussionName
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    })
}

// function to get details of the discussion's members
async function DiscussionMembers() {
    const res = await fetch("http://localhost:3000/discussionMembers/" + discussionName);
    const discussionMembers = await res.json();

    // sets the discussion member count
    memberCount.innerHTML = `<h2 class="font-bold">` + discussionMembers.length + `</h2>`;

    // check if user is a member, muted or banned
    for (let i = 0; i < discussionMembers.length; i++) {
        if (discussionMembers[i].accName == accountName) {
            isMember = true;
            
            if (discussionMembers[i].isMuted == "True") {
                isMuted = "True";
            }

            if (discussionMembers[i].isBanned == "True") {
                isBanned = "True";
            }
        }

        // if user is an owner show them additional options to edit discussion details
        if (discussionMembers[i].dscMemRole == "Owner" && discussionMembers[i].accName == accountName) {
            const bannerOptionsHTML = `<li><button class="btn btn-sm bg-white border-0 text-start shadow-none" onclick="edit_discussion_modal.showModal()"><span class="w-full">Edit</span></button></li>`;
            bannerOptions.insertAdjacentHTML("beforeend", bannerOptionsHTML);
        } else if (discussionMembers[i].dscMemRole == "Admin") {
            const discussionAdmins = document.getElementById("discussionAdmins");
            const discussionAdminsHTML = `<div class="flex items-center gap-2">
                                            <img src="../images/account-circle-outline.svg" width="30px" />
                                            <h2>` + discussionMembers[i].accName + `</h2>
                                        </div>`;
            discussionAdmins.insertAdjacentHTML("beforeend", discussionAdminsHTML);
        }
    }

    // display user is banned message if user is banned
    if (!isBanned) {
        // if discussion is not public check if user is a member
        if (!isPublic) {
            if (!isMember) {
                // display user is not a member message
                const postCard = document.getElementById("postCard");
                postCard.innerHTML = `<div class="flex flex-col justify-center items-center h-full">
                                        <img src="../images/lock-outline.svg" width="100px" />
                                        <h2 class="text-2xl font-bold">You do not have access to this discussion</h2>
                                    </div>`;
            } else {
                // set post details
                postName.insertAdjacentHTML("beforeend", postNameHTML);
                postDesc.insertAdjacentHTML("beforeend", postDescHTML);
                postAccount.insertAdjacentHTML("beforeend", postAccountHTML);
                postDate.insertAdjacentHTML("beforeend", postDateHTML);
                if (isMuted) {
                    // display user is muted message
                    const commentInput = document.getElementById("commentInput");
                    commentInput.innerHTML = `<div class="flex items-center">
                                                <img src="../images/lock-outline.svg" width="30" />
                                                <h2 class="text-md font-bold ms-2">You are muted in this discussion</h2>
                                            </div>`;
                }
                Comments();
            }
        } else {
            // set post details
            postName.insertAdjacentHTML("beforeend", postNameHTML);
            postDesc.insertAdjacentHTML("beforeend", postDescHTML);
            postAccount.insertAdjacentHTML("beforeend", postAccountHTML);
            postDate.insertAdjacentHTML("beforeend", postDateHTML);
            if (isMuted) {
                // display user is muted message
                const commentInput = document.getElementById("commentInput");
                commentInput.innerHTML = `<div class="flex items-center">
                                            <img src="../images/lock-outline.svg" width="30" />
                                            <h2 class="text-md font-bold ms-2">You are muted in this discussion</h2>
                                        </div>`;
            }
            Comments(); 
        }
    } else {
        // display user is banned message
        const postCard = document.getElementById("postCard");
        postCard.innerHTML = `<div class="flex flex-col justify-center items-center h-full">
                                <img src="../images/lock-outline.svg" width="100px" />
                                <h2 class="text-2xl font-bold">You are banned from this discussion</h2>
                            </div>`;
    }
}

// function to get user details to be displayed on the sidebar
async function sidebar() {
    const res = await fetch("http://localhost:3000/discussionMemberTop3Discussions/" + accountName);
    const discussionMembers = await res.json();

    const joinedDiscussions = document.getElementById("joinedDiscussions");
    
    for (let i = 0; i < discussionMembers.length; i++) {
        const discussionButtonHTML = `<li><a><span class="flex items-center w-full gap-2"><img src="../images/account-circle-outline.svg" width="30px" />` + discussionMembers[i].dscName + `</span></a></li>`;
        joinedDiscussions.insertAdjacentHTML("beforeend", discussionButtonHTML);
    }
}

// direct page to edit post page
function goToEditPost(postId) {
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
    url = url.concat("edit-post.html?discussionName=" + discussionName + "&postId=" + postId);
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
