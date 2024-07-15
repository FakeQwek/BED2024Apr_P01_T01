const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const discussionName = urlParams.get("discussionName");

let owners = [];
let isMember = false;

let isPublic = false;

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

    if (discussion.dscType == "Public") {
        isPublic = true;
    }
};

async function Posts() {
    const res = await fetch("http://localhost:3000/posts/" + discussionName);
    const posts = await res.json();

    const discussionPosts = document.getElementById("discussionPosts");

    for (let i = 0; i < posts.length; i++) {
        if (posts[i].isEvent == "True") {
            if (posts[i].accName == "AppleTan") {
                const postHTML = `<div class="card w-full h-fit bg-white" onclick="goToPost(` + posts[i].postId + `)">
                                    <div class="card-body">
                                        <div class="card-title flex justify-between items-center">
                                            <div class="flex flex-col justify-between w-full gap-2">
                                                <div class="flex justify-between">
                                                    <div class="flex items-center gap-2">
                                                        <img src="../images/account-circle-outline.svg" width="30px" />
                                                        <h2 class="text-sm">` + posts[i].accName + `</h2>
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
                                            <button id=` + posts[i].postId + ` class="btn btn-sm" onclick="createVolunteer(` + posts[i].postId + `)">Join</button>
                                        </div>
                                    </div>
                                </div>`;
                discussionPosts.insertAdjacentHTML("beforeend", postHTML);
            } else {
                const postHTML = `<div class="card w-full h-fit bg-white" onclick="goToPost(` + posts[i].postId + `)">
                                    <div class="card-body">
                                        <div class="card-title flex justify-between items-center">
                                            <div class="flex flex-col justify-between w-full gap-2">
                                                <div class="flex justify-between">
                                                    <div class="flex items-center gap-2">
                                                        <img src="../images/account-circle-outline.svg" width="30px" />
                                                        <h2 class="text-sm">` + posts[i].accName + `</h2>
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
                                            <button id=` + posts[i].postId + ` class="btn btn-sm" onclick="createVolunteer(` + posts[i].postId + `)">Join</button>
                                        </div>
                                    </div>
                                </div>`;
                discussionPosts.insertAdjacentHTML("beforeend", postHTML);
            }
        } else {
            if (posts[i].accName == "AppleTan") {
                const postHTML = `<div class="card w-full h-fit bg-white" onclick="goToPost(` + posts[i].postId + `)">
                                    <div class="card-body">
                                        <div class="card-title flex justify-between items-center">
                                            <div class="flex flex-col justify-between w-full gap-2">
                                                <div class="flex justify-between">
                                                    <div class="flex items-center gap-2">
                                                        <img src="../images/account-circle-outline.svg" width="30px" />
                                                        <h2 class="text-sm">` + posts[i].accName + `</h2>
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
                                        <div id="likeCount` + posts[i].postId + `" class="flex items-center gap-4">
                                            <button id="likeButton` + posts[i].postId + `" class="btn btn-sm" onclick="createPostLike(` + posts[i].postId + `)"><img src="../images/thumb-up-outline.svg" width="20px"></button>
                                        </div>
                                    </div>
                                </div>`;
                discussionPosts.insertAdjacentHTML("beforeend", postHTML);
            } else {
                const postHTML = `<div class="card w-full h-fit bg-white" onclick="goToPost(` + posts[i].postId + `)">
                                    <div class="card-body">
                                        <div class="card-title flex justify-between items-center">
                                            <div class="flex flex-col justify-between w-full gap-2">
                                                <div class="flex justify-between">
                                                    <div class="flex items-center gap-2">
                                                        <img src="../images/account-circle-outline.svg" width="30px" />
                                                        <h2 class="text-sm">` + posts[i].accName + `</h2>
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
                                        <div id="likeCount` + posts[i].postId + `" class="flex items-center gap-4">
                                            <button id="likeButton` + posts[i].postId + `" class="btn btn-sm" onclick="createPostLike(` + posts[i].postId + `)"><img src="../images/thumb-up-outline.svg" width="20px"></button>
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

async function DiscussionMembers() {
    const res = await fetch("http://localhost:3000/discussionMembers/" + discussionName);
    const discussionMembers = await res.json();
    
    memberCount.innerHTML = `<h2 class="font-bold">` + discussionMembers.length + `</h2>`;

    const joinButton = document.getElementById("joinButton");

    for (let i = 0; i < discussionMembers.length; i++) {
        if (discussionMembers[i].accName == "AppleTan") {
            isMember = true;
        }
    }

    for (let i = 0; i < discussionMembers.length; i++) {
        if (discussionMembers[i].dscMemRole == "Owner" && discussionMembers[i].accName == "AppleTan") {
            const bannerOptionsHTML = `<li><button class="btn btn-sm bg-white border-0 text-start shadow-none" onclick="edit_discussion_modal.showModal()"><span class="w-full">Edit</span></button></li>`;
            bannerOptions.insertAdjacentHTML("beforeend", bannerOptionsHTML);
        }
    }

    if (!isPublic) {
        for (let i = 0; i < discussionMembers.length; i++) {
            if (discussionMembers[i].accName == "AppleTan" && discussionMembers[i].dscName == discussionName) {
                Posts();
                isMember = true;
            }
        }
    
        if (!isMember) {
            const discussionPosts = document.getElementById("discussionPosts");

            const postHTML = `<div class="flex flex-col justify-center items-center h-full">
                                <img src="../images/lock-outline.svg" width="100px" />
                                <h2 class="text-2xl font-bold">You do not have access to this discussion</h2>
                            </div>`;

            discussionPosts.insertAdjacentHTML("beforeend", postHTML);
        } else {
            joinButton.innerHTML = `<img src="../images/plus.svg" width="20px" />Leave`;
        }
    } else {
        if (isMember) {
            joinButton.innerHTML = `<img src="../images/plus.svg" width="20px" />Leave`;
        }
        Posts();
    }
}

async function deletePost(postId) {
    await fetch("http://localhost:3000/posts/" + postId, {
        method: "DELETE"
    });
    location.reload();
}

async function createVolunteer(postId) {
    await fetch("http://localhost:3000/volunteer", {
        method: "POST",
        body: JSON.stringify({
            accName: "AppleTan",
            isApproved: "False",
            postId: postId
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });
}

const editDesc = document.getElementById("editDesc");

async function editDiscussionDescription() {
    await fetch ("http://localhost:3000/discussion/" + discussionName, {
        method: "PUT",
        body: JSON.stringify({
            "dscDesc": editDesc.value,
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    location.reload();
}

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

async function createDiscussionReport() {
    const dscReportCat = document.getElementById("dscReportCat");
    const dscReportDesc = document.getElementById("dscReportDesc");

    await fetch("http://localhost:3000/discussionReport", {
        method: "POST",
        body: JSON.stringify({
            dscRptCat: dscReportCat.value,
            dscRptDesc: dscReportDesc.value,
            accName: "AppleTan",
            dscName: discussionName
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
}

async function createDiscussionMember() {
    const joinButton = document.getElementById("joinButton");
    if (!isMember) {
        await fetch("http://localhost:3000/discussionMember/" + discussionName, {
            method: "POST",
            body: JSON.stringify({
                accName: "AppleTan",
                dscMemRole: "Member"
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        isMember = true;
        joinButton.innerHTML = `<img src="../images/plus.svg" width="20px" />Leave`;
    } else {
        await fetch("http://localhost:3000/discussionMember/" + "AppleTan" + "/" + discussionName , {
            method: "DELETE"
        });
        isMember = false;
        joinButton.innerHTML = `<img src="../images/plus.svg" width="20px" />Join`;
    }
}

async function createPostLike(postId) {
    const likeButton = document.getElementById("likeButton" + postId);
    if (likeButton.innerHTML == `<img src="../images/thumb-up-outline.svg" width="20px">`) {
        await fetch("http://localhost:3000/postLike/", {
            method: "POST",
            body: JSON.stringify({
                accName: "AppleTan",
                postId: postId
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        likeButton.innerHTML = `<img src="../images/thumb-up.svg" width="20px">`;
        const postLikeCount = document.getElementById("postLikeCount" + postId);
        let likeCount =  parseInt(postLikeCount.innerHTML) + 1;
        postLikeCount.innerHTML = likeCount;
    } else {
        await fetch("http://localhost:3000/postLike/" + "AppleTan" + "/" + postId , {
            method: "DELETE"
        });
        likeButton.innerHTML = `<img src="../images/thumb-up-outline.svg" width="20px">`;
        const postLikeCount = document.getElementById("postLikeCount" + postId);
        let likeCount =  parseInt(postLikeCount.innerHTML)- 1;
        postLikeCount.innerHTML = likeCount;

    }
}

async function getPostLikesByPost(postId) {
    const res = await fetch("http://localhost:3000/postLikes/" + postId);
    const postLikes = await res.json();

    const likeCount = document.getElementById("likeCount" + postId);
    
    const likeCountHTML = `<h2 id="postLikeCount` + postId + `">` + postLikes.length + `</h2>`;

    likeCount.insertAdjacentHTML("beforeend", likeCountHTML);

    for (let i = 0; i < postLikes.length; i++) {
        if (postLikes[i].accName == "AppleTan") {
            const likeButton = document.getElementById("likeButton" + postId);
            likeButton.innerHTML = `<img src="../images/thumb-up.svg" width="20px" />`;
        }
    }
}

async function getPostsByDiscussionOrderByLikes() {
    const res = await fetch("http://localhost:3000/postsOrderByLikes/" + discussionName);
    const posts = await res.json();

    const discussionPosts = document.getElementById("discussionPosts");

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

    for (let i = 0; i < posts.length; i++) {
        if (posts[i].isEvent == "True") {
            if (posts[i].accName == "AppleTan") {
                const postHTML = `<div class="card w-full h-fit bg-white" onclick="goToPost(` + posts[i].postId + `)">
                                    <div class="card-body">
                                        <div class="card-title flex justify-between items-center">
                                            <div class="flex flex-col justify-between w-full gap-2">
                                                <div class="flex justify-between">
                                                    <div class="flex items-center gap-2">
                                                        <img src="../images/account-circle-outline.svg" width="30px" />
                                                        <h2 class="text-sm">` + posts[i].accName + `</h2>
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
                                            <button id=` + posts[i].postId + ` class="btn btn-sm" onclick="createVolunteer(` + posts[i].postId + `)">Join</button>
                                        </div>
                                    </div>
                                </div>`;
                discussionPosts.insertAdjacentHTML("beforeend", postHTML);
            } else {
                const postHTML = `<div class="card w-full h-fit bg-white" onclick="goToPost(` + posts[i].postId + `)">
                                    <div class="card-body">
                                        <div class="card-title flex justify-between items-center">
                                            <div class="flex flex-col justify-between w-full gap-2">
                                                <div class="flex justify-between">
                                                    <div class="flex items-center gap-2">
                                                        <img src="../images/account-circle-outline.svg" width="30px" />
                                                        <h2 class="text-sm">` + posts[i].accName + `</h2>
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
                                            <button id=` + posts[i].postId + ` class="btn btn-sm" onclick="createVolunteer(` + posts[i].postId + `)">Join</button>
                                        </div>
                                    </div>
                                </div>`;
                discussionPosts.insertAdjacentHTML("beforeend", postHTML);
            }
        } else {
            if (posts[i].accName == "AppleTan") {
                const postHTML = `<div class="card w-full h-fit bg-white" onclick="goToPost(` + posts[i].postId + `)">
                                    <div class="card-body">
                                        <div class="card-title flex justify-between items-center">
                                            <div class="flex flex-col justify-between w-full gap-2">
                                                <div class="flex justify-between">
                                                    <div class="flex items-center gap-2">
                                                        <img src="../images/account-circle-outline.svg" width="30px" />
                                                        <h2 class="text-sm">` + posts[i].accName + `</h2>
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
                                        <div id="likeCount` + posts[i].postId + `" class="flex items-center gap-4">
                                            <button id="likeButton` + posts[i].postId + `" class="btn btn-sm" onclick="createPostLike(` + posts[i].postId + `)"><img src="../images/thumb-up-outline.svg" width="20px"></button>
                                        </div>
                                    </div>
                                </div>`;
                discussionPosts.insertAdjacentHTML("beforeend", postHTML);
            } else {
                const postHTML = `<div class="card w-full h-fit bg-white" onclick="goToPost(` + posts[i].postId + `)">
                                    <div class="card-body">
                                        <div class="card-title flex justify-between items-center">
                                            <div class="flex flex-col justify-between w-full gap-2">
                                                <div class="flex justify-between">
                                                    <div class="flex items-center gap-2">
                                                        <img src="../images/account-circle-outline.svg" width="30px" />
                                                        <h2 class="text-sm">` + posts[i].accName + `</h2>
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
                                        <div id="likeCount` + posts[i].postId + `" class="flex items-center gap-4">
                                            <button id="likeButton` + posts[i].postId + `" class="btn btn-sm" onclick="createPostLike(` + posts[i].postId + `)"><img src="../images/thumb-up-outline.svg" width="20px"></button>
                                        </div>
                                    </div>
                                </div>`;
                discussionPosts.insertAdjacentHTML("beforeend", postHTML);
            }
        }
        getPostLikesByPost(posts[i].postId);
    }
}

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

Discussion();