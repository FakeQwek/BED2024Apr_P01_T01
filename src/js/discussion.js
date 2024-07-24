// get discussion name parameter from the url
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const discussionName = urlParams.get("discussionName");

// set variables
let accountName;
let isAdmin = false;
let isMember = false;
let isMuted = false;
let isBanned = false;
let isPublic = false;
let discussionType;


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
        loginSignUp.innerHTML = `<button class="btn btn-sm mr-4 max-[820px]:hidden" onclick="goToProfile('` + account.accName + `')"><img src="../images/account-circle-outline.svg" width="20px" />` + account.accName + `</button>`;
    }

    accountName = account.accName;
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

    DiscussionMembers();

    // set discussion type
    discussionType = discussion.dscType;

    // set isPublic to true if the discussion type is public
    if (discussion.dscType == "Public") {
        isPublic = true;
    }
};

// function to get posts of the discussion
async function Posts() {
    const res = await fetch("http://localhost:3000/posts/" + discussionName, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    });
    const posts = await res.json();

    const discussionPosts = document.getElementById("discussionPosts");

    // sets the html of the post depending on if they are an event and whether the user owns them
    for (let i = 0; i < posts.length; i++) {
        if (posts[i].isEvent == "True") {
            if (posts[i].accName == accountName) {
                const postHTML = `<div class="card w-full h-fit bg-white">
                                    <div class="card-body">
                                        <div class="card-title flex justify-between items-center">
                                            <div class="flex flex-col justify-between w-full gap-2">
                                                <div class="flex justify-between">
                                                    <div class="flex items-center gap-2">
                                                        <img src="../images/account-circle-outline.svg" width="30px" />
                                                        <h2 class="text-sm" onclick="goToProfile('` + posts[i].accName + `')">` + posts[i].accName + `</h2>
                                                        <h2 class="text-sm">` + posts[i].postDate + `</h2>
                                                    </div>
                                                    <!-- options dropdown -->
                                                    <div class="dropdown dropdown-end">
                                                        <div tabindex="0" role="button" class="btn btn-sm bg-white border-0 shadow-none"><img src="../images/dots-horizontal.svg" width="20px" /></div>
                                                        <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                                                            <li><button class="btn btn-sm bg-white border-0 text-left shadow-none" onclick="report_post_modal` + i + `.showModal()"><span class="w-full">Report</span></button></li>
                                                            <li><button class="btn btn-sm bg-white border-0 text-left shadow-none" onclick="delete_modal` + i + `.showModal()"><span class="w-full">Delete</span></button></li>
                                                            <li><button class="btn btn-sm bg-white border-0 text-left shadow-none" onclick="goToEditPost(` + posts[i].postId + `)"><span class="w-full">Edit</span></button></li>
                                                            <li><button class="btn btn-sm bg-white border-0 text-left shadow-none" onclick="goToManageVolunteers(` + posts[i].postId + `)"><span class="w-full">Manage Volunteers</span></button></li>
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
                                                        <!-- delete popup -->
                                                        <dialog id="delete_modal` + i + `" class="modal">
                                                            <div class="modal-box flex flex-col rounded-3xl gap-2">
                                                                <h2 class="font-bold text-2xl">Delete this post</h2>
                                                                <p class="text-sm">Are you sure you want to delete this post? Once deleted this post will be gone forever.</p>
                                                                <div class="modal-action">
                                                                    <form class="flex gap-4" method="dialog">
                                                                        <button class="btn btn-sm">Cancel</button>
                                                                        <button class="btn btn-sm bg-red-500 text-white" onclick="deletePost(` + posts[i].postId + `)">Delete</button>
                                                                    </form>
                                                                </div>
                                                            </div>
                                                        </dialog>
                                                    </div>
                                                </div>
                                                <h2>` + posts[i].postName + `</h2>
                                            </div>
                                        </div>
                                        <p>` + posts[i].postDesc + `</p>
                                        <div class="flex justify-between">
                                            <div id="likeCount` + posts[i].postId + `" class="flex items-center gap-4">
                                                <button id="likeButton` + posts[i].postId + `" class="btn btn-sm" onclick="createPostLike(` + posts[i].postId + `)"><img src="../images/thumb-up-outline.svg" width="20px"></button>
                                            </div>
                                            <div>
                                                <button id=` + posts[i].postId + ` class="btn btn-sm" onclick="createVolunteer(` + posts[i].postId + `)">Join</button>
                                                <button id=` + posts[i].postId + ` class="btn btn-sm" onclick="goToPost(` + posts[i].postId + `)">View</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>`;
                discussionPosts.insertAdjacentHTML("beforeend", postHTML);
            } else {
                const postHTML = `<div class="card w-full h-fit bg-white">
                                    <div class="card-body">
                                        <div class="card-title flex justify-between items-center">
                                            <div class="flex flex-col justify-between w-full gap-2">
                                                <div class="flex justify-between">
                                                    <div class="flex items-center gap-2">
                                                        <img src="../images/account-circle-outline.svg" width="30px" />
                                                        <h2 class="text-sm" onclick="goToProfile('` + posts[i].accName + `')">` + posts[i].accName + `</h2>
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
                                                <h2>` + posts[i].postName + `</h2>
                                            </div>
                                        </div>
                                        <p>` + posts[i].postDesc + `</p>
                                        <div class="flex justify-between">
                                            <div id="likeCount` + posts[i].postId + `" class="flex items-center gap-4">
                                                <button id="likeButton` + posts[i].postId + `" class="btn btn-sm" onclick="createPostLike(` + posts[i].postId + `)"><img src="../images/thumb-up-outline.svg" width="20px"></button>
                                            </div>
                                            <div>
                                                <button id=` + posts[i].postId + ` class="btn btn-sm" onclick="createVolunteer(` + posts[i].postId + `)">Join</button>
                                                <button id=` + posts[i].postId + ` class="btn btn-sm" onclick="goToPost(` + posts[i].postId + `)">View</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>`;
                discussionPosts.insertAdjacentHTML("beforeend", postHTML);
            }
        } else {
            if (posts[i].accName == accountName) {
                const postHTML = `<div class="card w-full h-fit bg-white">
                                    <div class="card-body">
                                        <div class="card-title flex justify-between items-center">
                                            <div class="flex flex-col justify-between w-full gap-2">
                                                <div class="flex justify-between">
                                                    <div class="flex items-center gap-2">
                                                        <img src="../images/account-circle-outline.svg" width="30px" />
                                                        <h2 class="text-sm" onclick="goToProfile('` + posts[i].accName + `')">` + posts[i].accName + `</h2>
                                                        <h2 class="text-sm">` + posts[i].postDate + `</h2>
                                                    </div>
                                                    <!-- options dropdown -->
                                                    <div class="dropdown dropdown-end">
                                                        <div tabindex="0" role="button" class="btn btn-sm bg-white border-0 shadow-none"><img src="../images/dots-horizontal.svg" width="20px" /></div>
                                                        <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                                                            <li><button class="btn btn-sm bg-white border-0 text-left shadow-none" onclick="report_post_modal` + i + `.showModal()"><span class="w-full">Report</span></button></li>
                                                            <li><button class="btn btn-sm bg-white border-0 text-left shadow-none" onclick="delete_modal` + i + `.showModal()"><span class="w-full">Delete</span></button></li>
                                                            <li><button class="btn btn-sm bg-white border-0 text-left shadow-none" onclick="goToEditPost(` + posts[i].postId + `)"><span class="w-full">Edit</span></button></li>
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
                                                        <!-- delete popup -->
                                                        <dialog id="delete_modal` + i + `" class="modal">
                                                            <div class="modal-box flex flex-col rounded-3xl gap-2">
                                                                <h2 class="font-bold text-2xl">Delete this post</h2>
                                                                <p class="text-sm">Are you sure you want to delete this post? Once deleted this post will be gone forever.</p>
                                                                <div class="modal-action">
                                                                    <form class="flex gap-4" method="dialog">
                                                                        <button class="btn btn-sm">Cancel</button>
                                                                        <button class="btn btn-sm bg-red-500 text-white" onclick="deletePost(` + posts[i].postId + `)">Delete</button>
                                                                    </form>
                                                                </div>
                                                            </div>
                                                        </dialog>
                                                    </div>
                                                </div>
                                                <h2>` + posts[i].postName + `</h2>
                                            </div>
                                        </div>
                                        <p>` + posts[i].postDesc + `</p>
                                        <div class="flex justify-between">
                                            <div id="likeCount` + posts[i].postId + `" class="flex items-center gap-4">
                                                <button id="likeButton` + posts[i].postId + `" class="btn btn-sm" onclick="createPostLike(` + posts[i].postId + `)"><img src="../images/thumb-up-outline.svg" width="20px"></button>
                                            </div>
                                            <button id=` + posts[i].postId + ` class="btn btn-sm" onclick="goToPost(` + posts[i].postId + `)">View</button>
                                        </div>
                                    </div>
                                </div>`;
                discussionPosts.insertAdjacentHTML("beforeend", postHTML);
            } else {
                const postHTML = `<div class="card w-full h-fit bg-white">
                                    <div class="card-body">
                                        <div class="card-title flex justify-between items-center">
                                            <div class="flex flex-col justify-between w-full gap-2">
                                                <div class="flex justify-between">
                                                    <div class="flex items-center gap-2">
                                                        <img src="../images/account-circle-outline.svg" width="30px" />
                                                        <h2 class="text-sm" onclick="goToProfile('` + posts[i].accName + `')">` + posts[i].accName + `</h2>
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
                                                <h2>` + posts[i].postName + `</h2>
                                            </div>
                                        </div>
                                        <p>` + posts[i].postDesc + `</p>
                                        <div class="flex justify-between">
                                            <div id="likeCount` + posts[i].postId + `" class="flex items-center gap-4">
                                                <button id="likeButton` + posts[i].postId + `" class="btn btn-sm" onclick="createPostLike(` + posts[i].postId + `)"><img src="../images/thumb-up-outline.svg" width="20px"></button>
                                            </div>
                                            <button id=` + posts[i].postId + ` class="btn btn-sm" onclick="goToPost(` + posts[i].postId + `)">View</button>
                                        </div>
                                    </div>
                                </div>`;
                discussionPosts.insertAdjacentHTML("beforeend", postHTML);
            }
        }
        getPostLikesByPost(posts[i].postId);
    }
};

const memberCount = document.getElementById("memberCount");

const bannerOptions = document.getElementById("bannerOptions");

// function to get details of the discussion's members
async function DiscussionMembers() {
    const res = await fetch("http://localhost:3000/discussionMembers/" + discussionName);
    const discussionMembers = await res.json();
    
    // sets the discussion member count
    memberCount.innerHTML = `<h2 class="font-bold">` + discussionMembers.length + `</h2>`;

    const joinButton = document.getElementById("joinButton");

    // check if user is a member, muted or banned
    for (let i = 0; i < discussionMembers.length; i++) {
        if (discussionMembers[i].accName == accountName && discussionMembers[i].dscName == discussionName) {
            isMember = true;
            
            if (discussionMembers[i].isMuted == "True") {
                isMuted = "True";
            }

            if (discussionMembers[i].isBanned == "True") {
                isBanned = "True";
            }
        }
    }

    for (let i = 0; i < discussionMembers.length; i++) {
        if (discussionMembers[i].accName == accountName && discussionMembers[i].dscName == discussionName && discussionMembers[i].dscMemRole == 'Admin') {
            isAdmin = true;
            
            if (discussionMembers[i].isMuted == "True") {
                isMuted = "True";
            }

            if (discussionMembers[i].isBanned == "True") {
                isBanned = "True";
            }
        }
    }

    // display user is banned message if user is banned
    if (!isBanned) {
        // if discussion is not public check if user is a member
        if (!isPublic) {
            for (let i = 0; i < discussionMembers.length; i++) {
                if (discussionMembers[i].accName == accountName && discussionMembers[i].dscName == discussionName) {
                    Posts();
                    isMember = true;
                }
            }
            if (isAdmin){
                window.location.href = `discussion-admin.html?discussionName=${discussionName}`;

            }
            // display user is not a member message
            if (!isMember) {
                const discussionPosts = document.getElementById("discussionPosts");
    
                const postHTML = `<div class="flex flex-col justify-center items-center h-full">
                                    <img src="../images/lock-outline.svg" width="100px" />
                                    <h2 class="text-2xl font-bold">You are not a member of this disucssion</h2>
                                </div>`;
    
                discussionPosts.insertAdjacentHTML("beforeend", postHTML);
            } else {
                // set button text to leave if user is a member
                joinButton.innerHTML = `<img src="../images/plus.svg" width="20px" />Leave`;
            }
            // remove the join button if the discussion is not public
            if (joinButton) {
                joinButton.remove();
            }
        } else {
            if (isMember) {
                // set button text to leave if user is a member
                joinButton.innerHTML = `<img src="../images/plus.svg" width="20px" />Leave`;
            }
            Posts();
        }
    }

    for (let i = 0; i < discussionMembers.length; i++) {
        // display user is banned message
        if (isBanned) {
            const discussionPosts = document.getElementById("discussionPosts");
            discussionPosts.innerHTML = `<div class="flex flex-col justify-center items-center h-full">
                                            <img src="../images/cancel.svg" width="100px" />
                                            <h2 class="text-2xl font-bold">You are banned from this discussion</h2>
                                        </div>`;
        }

        // if user is an owner show them additional options to edit discussion details
        if (discussionMembers[i].dscMemRole == "Owner" && discussionMembers[i].accName == accountName) {
            let bannerOptionsHTML;

            // if discussion is restricted add an extra option for the owner to invite users
            if (discussionType == "Restricted") {
                bannerOptionsHTML = `<li><button class="btn btn-sm bg-white border-0 text-start shadow-none" onclick="edit_discussion_modal.showModal()"><span class="w-full">Edit</span></button></li>
                                        <li><button class="btn btn-sm bg-white border-0 text-start shadow-none" onclick="invite_modal.showModal()"><span class="w-full">Invite</span></button></li>`;
            } else {
                bannerOptionsHTML = `<li><button class="btn btn-sm bg-white border-0 text-start shadow-none" onclick="edit_discussion_modal.showModal()"><span class="w-full">Edit</span></button></li>`;
            }

            bannerOptions.insertAdjacentHTML("beforeend", bannerOptionsHTML);
            
            // remove the join button
            if (joinButton) {
                joinButton.remove();
            }
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

// function to delete post
async function deletePost(postId) {
    await fetch("http://localhost:3000/posts/" + postId, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    });
    location.reload();
}

// function to create volunteer
async function createVolunteer(postId) {
    await fetch("http://localhost:3000/volunteer/" + discussionName, {
        method: "POST",
        body: JSON.stringify({
            accName: accountName,
            isApproved: "False",
            postId: postId
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    });
}

const editDesc = document.getElementById("editDesc");

// function to edit the description of the discussion
async function editDiscussionDescription() {
    await fetch ("http://localhost:3000/discussion/" + discussionName, {
        method: "PUT",
        body: JSON.stringify({
            "dscDesc": editDesc.value,
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    })
    location.reload();
}

// function to create a post report
async function createPostReport(postId) {
    const postReportCat = document.getElementById("postReportCat" + postId);
    const postReportDesc = document.getElementById("postReportDesc" + postId);

    await fetch("http://localhost:3000/postReport/" + discussionName, {
        method: "POST",
        body: JSON.stringify({
            postRptCat: postReportCat.value,
            postRptDesc: postReportDesc.value,
            accName: accountName,
            postId: postId
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    })
}

// function to create a discussion report
async function createDiscussionReport() {
    const dscReportCat = document.getElementById("dscReportCat");
    const dscReportDesc = document.getElementById("dscReportDesc");

    await fetch("http://localhost:3000/discussionReport/" + discussionName, {
        method: "POST",
        body: JSON.stringify({
            dscRptCat: dscReportCat.value,
            dscRptDesc: dscReportDesc.value,
            accName: accountName,
            dscName: discussionName
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    })
}

// function to create a discussion member
async function createDiscussionMember() {
    const joinButton = document.getElementById("joinButton");

    // if user is not a member create a new member record
    if (!isMember) {
        await fetch("http://localhost:3000/discussionMember/" + discussionName, {
            method: "POST",
            body: JSON.stringify({
                accName: accountName,
                dscMemRole: "Member"
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        isMember = true;
        joinButton.innerHTML = `<img src="../images/plus.svg" width="20px" />Leave`;
    } else { // if user is already a member delete their member record
        await fetch("http://localhost:3000/discussionMember/" + accountName + "/" + discussionName , {
            method: "DELETE"
        });
        isMember = false;
        joinButton.innerHTML = `<img src="../images/plus.svg" width="20px" />Join`;
    }
}

// function to create a post like
async function createPostLike(postId) {
    const likeButton = document.getElementById("likeButton" + postId);

    // if user has not liked the post create a new post like record
    if (likeButton.innerHTML == `<img src="../images/thumb-up-outline.svg" width="20px">`) {
        await fetch("http://localhost:3000/postLike/" + discussionName, {
            method: "POST",
            body: JSON.stringify({
                accName: accountName,
                postId: postId
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        })

        // change the thumbs up image and update the like count
        likeButton.innerHTML = `<img src="../images/thumb-up.svg" width="20px">`;
        const postLikeCount = document.getElementById("postLikeCount" + postId);
        let likeCount =  parseInt(postLikeCount.innerHTML) + 1;
        postLikeCount.innerHTML = likeCount;
    } else { // if user has already liked the post delete the post like record
        await fetch("http://localhost:3000/postLike/" + accountName + "/" + postId + "/" + discussionName, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        });

        // change the thumbs up image and update the like count
        likeButton.innerHTML = `<img src="../images/thumb-up-outline.svg" width="20px">`;
        const postLikeCount = document.getElementById("postLikeCount" + postId);
        let likeCount =  parseInt(postLikeCount.innerHTML)- 1;
        postLikeCount.innerHTML = likeCount;
    }
}

// function to get the number of likes for each post
async function getPostLikesByPost(postId) {
    const res = await fetch("http://localhost:3000/postLikes/" + discussionName + "/" + postId, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    });
    const postLikes = await res.json();

    // set the like count of the post
    const likeCount = document.getElementById("likeCount" + postId);
    const likeCountHTML = `<h2 id="postLikeCount` + postId + `">` + postLikes.length + `</h2>`;
    likeCount.insertAdjacentHTML("beforeend", likeCountHTML);

    for (let i = 0; i < postLikes.length; i++) {
        if (postLikes[i].accName == accountName) {
            const likeButton = document.getElementById("likeButton" + postId);
            likeButton.innerHTML = `<img src="../images/thumb-up.svg" width="20px" />`;
        }
    }
}

// order the posts by the most likes
async function getPostsByDiscussionOrderByLikes() {
    const res = await fetch("http://localhost:3000/postsOrderByLikes/" + discussionName, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    });
    const posts = await res.json();

    const discussionPosts = document.getElementById("discussionPosts");

    // set the join button text based on whether the user is a member
    if (isMember) {
        discussionPosts.innerHTML = `<div class="flex justify-between w-full h-fit mt-4">
                                        <div>
                                            <button class="btn btn-sm bg-white ml-8 max-[820px]:hidden" onclick="getPostsByDiscussionOrderByLikes()"><img src="../images/fire.svg" width="20px" />Hot</button>
                                            <button class="btn btn-sm bg-white ml-4"><img src="../images/finance.svg" width="20px" />Trending</button>
                                        </div>
                                        <div>
                                            <button id="joinButton" class="btn btn-sm bg-white mr-4 max-[820px]:mr-2" onclick="createDiscussionMember()"><img src="../images/plus.svg" width="20px" />Leave</button>
                                            <button class="btn btn-sm bg-white mr-8" onclick="goToCreatePost()"><img src="../images/plus.svg" width="20px" />Post</button>
                                        </div>
                                    </div>`;
    } else {
        discussionPosts.innerHTML = `<div class="flex justify-between w-full h-fit mt-4">
                                        <div>
                                            <button class="btn btn-sm bg-white ml-8 max-[820px]:hidden" onclick="getPostsByDiscussionOrderByLikes()"><img src="../images/fire.svg" width="20px" />Hot</button>
                                            <button class="btn btn-sm bg-white ml-4"><img src="../images/finance.svg" width="20px" />Trending</button>
                                        </div>
                                        <div>
                                            <button id="joinButton" class="btn btn-sm bg-white mr-4 max-[820px]:mr-2" onclick="createDiscussionMember()"><img src="../images/plus.svg" width="20px" />Join</button>
                                            <button class="btn btn-sm bg-white mr-8" onclick="goToCreatePost()"><img src="../images/plus.svg" width="20px" />Post</button>
                                        </div>
                                    </div>`;
    }

    // sets the html of the post depending on if they are an event and whether the user owns them
    for (let i = 0; i < posts.length; i++) {
        if (posts[i].isEvent == "True") {
            if (posts[i].accName == accountName) {
                const postHTML = `<div class="card w-full h-fit bg-white">
                                    <div class="card-body">
                                        <div class="card-title flex justify-between items-center">
                                            <div class="flex flex-col justify-between w-full gap-2">
                                                <div class="flex justify-between">
                                                    <div class="flex items-center gap-2">
                                                        <img src="../images/account-circle-outline.svg" width="30px" />
                                                        <h2 class="text-sm" onclick="goToProfile('` + posts[i].accName + `')">` + posts[i].accName + `</h2>
                                                        <h2 class="text-sm">` + posts[i].postDate + `</h2>
                                                    </div>
                                                    <!-- options dropdown -->
                                                    <div class="dropdown dropdown-end">
                                                        <div tabindex="0" role="button" class="btn btn-sm bg-white border-0 shadow-none"><img src="../images/dots-horizontal.svg" width="20px" /></div>
                                                        <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                                                            <li><button class="btn btn-sm bg-white border-0 text-left shadow-none" onclick="report_post_modal` + i + `.showModal()"><span class="w-full">Report</span></button></li>
                                                            <li><button class="btn btn-sm bg-white border-0 text-left shadow-none" onclick="delete_modal` + i + `.showModal()"><span class="w-full">Delete</span></button></li>
                                                            <li><button class="btn btn-sm bg-white border-0 text-left shadow-none" onclick="goToEditPost(` + posts[i].postId + `)"><span class="w-full">Edit</span></button></li>
                                                            <li><button class="btn btn-sm bg-white border-0 text-left shadow-none" onclick="goToManageVolunteers(` + posts[i].postId + `)"><span class="w-full">Manage Volunteers</span></button></li>
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
                                                        <!-- delete popup -->
                                                        <dialog id="delete_modal` + i + `" class="modal">
                                                            <div class="modal-box flex flex-col rounded-3xl gap-2">
                                                                <h2 class="font-bold text-2xl">Delete this post</h2>
                                                                <p class="text-sm">Are you sure you want to delete this post? Once deleted this post will be gone forever.</p>
                                                                <div class="modal-action">
                                                                    <form class="flex gap-4" method="dialog">
                                                                        <button class="btn btn-sm">Cancel</button>
                                                                        <button class="btn btn-sm bg-red-500 text-white" onclick="deletePost(` + posts[i].postId + `)">Delete</button>
                                                                    </form>
                                                                </div>
                                                            </div>
                                                        </dialog>
                                                    </div>
                                                </div>
                                                <h2>` + posts[i].postName + `</h2>
                                            </div>
                                        </div>
                                        <p>` + posts[i].postDesc + `</p>
                                        <div class="flex justify-between">
                                            <div id="likeCount` + posts[i].postId + `" class="flex items-center gap-4">
                                                <button id="likeButton` + posts[i].postId + `" class="btn btn-sm" onclick="createPostLike(` + posts[i].postId + `)"><img src="../images/thumb-up-outline.svg" width="20px"></button>
                                            </div>
                                            <div>
                                                <button id=` + posts[i].postId + ` class="btn btn-sm" onclick="createVolunteer(` + posts[i].postId + `)">Join</button>
                                                <button id=` + posts[i].postId + ` class="btn btn-sm" onclick="goToPost(` + posts[i].postId + `)">View</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>`;
                discussionPosts.insertAdjacentHTML("beforeend", postHTML);
            } else {
                const postHTML = `<div class="card w-full h-fit bg-white">
                                    <div class="card-body">
                                        <div class="card-title flex justify-between items-center">
                                            <div class="flex flex-col justify-between w-full gap-2">
                                                <div class="flex justify-between">
                                                    <div class="flex items-center gap-2">
                                                        <img src="../images/account-circle-outline.svg" width="30px" />
                                                        <h2 class="text-sm" onclick="goToProfile('` + posts[i].accName + `')">` + posts[i].accName + `</h2>
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
                                                <h2>` + posts[i].postName + `</h2>
                                            </div>
                                        </div>
                                        <p>` + posts[i].postDesc + `</p>
                                        <div class="flex justify-between">
                                            <div id="likeCount` + posts[i].postId + `" class="flex items-center gap-4">
                                                <button id="likeButton` + posts[i].postId + `" class="btn btn-sm" onclick="createPostLike(` + posts[i].postId + `)"><img src="../images/thumb-up-outline.svg" width="20px"></button>
                                            </div>
                                            <div>
                                                <button id=` + posts[i].postId + ` class="btn btn-sm" onclick="createVolunteer(` + posts[i].postId + `)">Join</button>
                                                <button id=` + posts[i].postId + ` class="btn btn-sm" onclick="goToPost(` + posts[i].postId + `)">View</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>`;
                discussionPosts.insertAdjacentHTML("beforeend", postHTML);
            }
        } else {
            if (posts[i].accName == accountName) {
                const postHTML = `<div class="card w-full h-fit bg-white">
                                    <div class="card-body">
                                        <div class="card-title flex justify-between items-center">
                                            <div class="flex flex-col justify-between w-full gap-2">
                                                <div class="flex justify-between">
                                                    <div class="flex items-center gap-2">
                                                        <img src="../images/account-circle-outline.svg" width="30px" />
                                                        <h2 class="text-sm" onclick="goToProfile('` + posts[i].accName + `')">` + posts[i].accName + `</h2>
                                                        <h2 class="text-sm">` + posts[i].postDate + `</h2>
                                                    </div>
                                                    <!-- options dropdown -->
                                                    <div class="dropdown dropdown-end">
                                                        <div tabindex="0" role="button" class="btn btn-sm bg-white border-0 shadow-none"><img src="../images/dots-horizontal.svg" width="20px" /></div>
                                                        <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                                                            <li><button class="btn btn-sm bg-white border-0 text-left shadow-none" onclick="report_post_modal` + i + `.showModal()"><span class="w-full">Report</span></button></li>
                                                            <li><button class="btn btn-sm bg-white border-0 text-left shadow-none" onclick="delete_modal` + i + `.showModal()"><span class="w-full">Delete</span></button></li>
                                                            <li><button class="btn btn-sm bg-white border-0 text-left shadow-none" onclick="goToEditPost(` + posts[i].postId + `)"><span class="w-full">Edit</span></button></li>
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
                                                        <!-- delete popup -->
                                                        <dialog id="delete_modal` + i + `" class="modal">
                                                            <div class="modal-box flex flex-col rounded-3xl gap-2">
                                                                <h2 class="font-bold text-2xl">Delete this post</h2>
                                                                <p class="text-sm">Are you sure you want to delete this post? Once deleted this post will be gone forever.</p>
                                                                <div class="modal-action">
                                                                    <form class="flex gap-4" method="dialog">
                                                                        <button class="btn btn-sm">Cancel</button>
                                                                        <button class="btn btn-sm bg-red-500 text-white" onclick="deletePost(` + posts[i].postId + `)">Delete</button>
                                                                    </form>
                                                                </div>
                                                            </div>
                                                        </dialog>
                                                    </div>
                                                </div>
                                                <h2>` + posts[i].postName + `</h2>
                                            </div>
                                        </div>
                                        <p>` + posts[i].postDesc + `</p>
                                        <div class="flex justify-between">
                                            <div id="likeCount` + posts[i].postId + `" class="flex items-center gap-4">
                                                <button id="likeButton` + posts[i].postId + `" class="btn btn-sm" onclick="createPostLike(` + posts[i].postId + `)"><img src="../images/thumb-up-outline.svg" width="20px"></button>
                                            </div>
                                            <button id=` + posts[i].postId + ` class="btn btn-sm" onclick="goToPost(` + posts[i].postId + `)">View</button>
                                        </div>
                                    </div>
                                </div>`;
                discussionPosts.insertAdjacentHTML("beforeend", postHTML);
            } else {
                const postHTML = `<div class="card w-full h-fit bg-white">
                                    <div class="card-body">
                                        <div class="card-title flex justify-between items-center">
                                            <div class="flex flex-col justify-between w-full gap-2">
                                                <div class="flex justify-between">
                                                    <div class="flex items-center gap-2">
                                                        <img src="../images/account-circle-outline.svg" width="30px" />
                                                        <h2 class="text-sm" onclick="goToProfile('` + posts[i].accName + `')">` + posts[i].accName + `</h2>
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
                                                <h2>` + posts[i].postName + `</h2>
                                            </div>
                                        </div>
                                        <p>` + posts[i].postDesc + `</p>
                                        <div class="flex justify-between">
                                            <div id="likeCount` + posts[i].postId + `" class="flex items-center gap-4">
                                                <button id="likeButton` + posts[i].postId + `" class="btn btn-sm" onclick="createPostLike(` + posts[i].postId + `)"><img src="../images/thumb-up-outline.svg" width="20px"></button>
                                            </div>
                                            <button id=` + posts[i].postId + ` class="btn btn-sm" onclick="goToPost(` + posts[i].postId + `)">View</button>
                                        </div>
                                    </div>
                                </div>`;
                discussionPosts.insertAdjacentHTML("beforeend", postHTML);
            }
        }
        getPostLikesByPost(posts[i].postId);
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

// function to create an invite to the discussion
async function createInvite() {
    await fetch("http://localhost:3000/invite", {
        method: "POST",
        body: JSON.stringify({
            accName: accountName,
            dscName: discussionName
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });
}

// direct page to the create post page
function goToCreatePost() {
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
    url = url.concat("create-post.html?discussionName=" + discussionName);
    window.location.href = url;
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

// direct page to the edit post page
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

// direct page to manage volunteers page
function goToManageVolunteers(postId) {
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
    url = url.concat("manage-volunteers.html?postId=" + postId);
    window.location.href = url;
}


Discussion();
sidebar();