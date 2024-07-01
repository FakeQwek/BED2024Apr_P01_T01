const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const discussionName = urlParams.get("discussionName");
console.log(discussionName);

async function Discussion() { 
    const res = await fetch("http://localhost:3000/discussions/" + discussionName);
    const discussion = await res.json();
    console.log(discussion);

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
};

async function Posts() {
    const res = await fetch("http://localhost:3000/posts/" + discussionName);
    const posts = await res.json();
    console.log(posts);

    const discussionPosts = document.getElementById("discussionPosts");

    for (let i = 0; i < posts.length; i++) {
        if (posts[i].isEvent == "True") {
            const postHTML = `<div class="card w-full h-fit bg-white" onclick="goToPost(` + posts[i].postId + `)">
                                <div class="card-body">
                                    <div class="card-title flex justify-between items-center">
                                        <div class="flex flex-col justify-between w-full gap-2">
                                            <div class="flex justify-between">
                                                <div class="flex items-center gap-2">
                                                    <img src="../images/account-circle-outline.svg" width="30px" />
                                                    <h2 class="text-sm">` + posts[i].accName + `</h2>
                                                </div>
                                                <!-- options dropdown -->
                                                <div class="dropdown dropdown-end">
                                                    <div tabindex="0" role="button" class="btn btn-sm bg-white border-0 shadow-none"><img src="../images/dots-horizontal.svg" width="20px" /></div>
                                                    <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                                                        <li><button class="btn btn-sm bg-white border-0 text-left shadow-none" onclick="report_post_modal` + i + `.showModal()"><span class="w-full">Report</span></button></li>
                                                        <li><button class="btn btn-sm bg-white border-0 text-left shadow-none" onclick="delete_modal` + i + `.showModal()"><span class="w-full">Delete</span></button></li>
                                                    </ul>
                                                    <!-- report post popup -->
                                                    <dialog id="report_post_modal` + i + `" class="modal">
                                                        <div class="modal-box flex flex-col h-2/3 rounded-3xl gap-2">
                                                            <h2 class="font-bold text-2xl">Submit a report</h2>
                                                            <p class="text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                                                            <select class="select select-bordered w-full mt-4">
                                                                <option hidden>Issue</option>
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
                                    <div class="flex justify-end">
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
                                                </div>
                                                <!-- options dropdown -->
                                                <div class="dropdown dropdown-end">
                                                    <div tabindex="0" role="button" class="btn btn-sm bg-white border-0 shadow-none"><img src="../images/dots-horizontal.svg" width="20px" /></div>
                                                    <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                                                        <li><button class="btn btn-sm bg-white border-0 text-left shadow-none" onclick="report_post_modal` + i + `.showModal()"><span class="w-full">Report</span></button></li>
                                                        <li><button class="btn btn-sm bg-white border-0 text-left shadow-none" onclick="delete_modal` + i + `.showModal()"><span class="w-full">Delete</span></button></li>
                                                    </ul>
                                                    <!-- report post popup -->
                                                    <dialog id="report_post_modal` + i + `" class="modal">
                                                        <div class="modal-box flex flex-col h-2/3 rounded-3xl gap-2">
                                                            <h2 class="font-bold text-2xl">Submit a report</h2>
                                                            <p class="text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                                                            <select class="select select-bordered w-full mt-4">
                                                                <option hidden>Issue</option>
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
                                </div>
                            </div>`;
            discussionPosts.insertAdjacentHTML("beforeend", postHTML);
        }
    }
};

async function deletePost(postId) {
    await fetch("http://localhost:3000/posts/" + postId, {
        method: "DELETE"
    });
    location.reload();
}

async function createVolunteer(postId) {
    console.log(postId);
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

Discussion();
Posts();