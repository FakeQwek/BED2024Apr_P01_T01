const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const discussionId = urlParams.get("discussionId");
console.log(discussionId);

async function Discussion() { 
    const res = await fetch("http://localhost:3000/discussions/" + discussionId);
    const discussion = await res.json();
    console.log(discussion);

    const discussionName = document.getElementById("discussionName");
    const discussionNameHTML = `<h2>d:` + discussion.dscName + `</h2>`;
    discussionName.insertAdjacentHTML("afterbegin", discussionNameHTML);

    const discussionBannerName = document.getElementById("discussionBannerName");
    const discussionBanerNameHTML = `<h2>` + discussion.dscName + `</h2>`;
    discussionBannerName.insertAdjacentHTML("afterbegin", discussionBanerNameHTML);

    const discussionBannerDesc = document.getElementById("discussionBannerDesc");
    const discussionBannerDescHTML = `<p>` + discussion.dscDesc + `</p>`;
    discussionBannerDesc.insertAdjacentHTML("afterbegin", discussionBannerDescHTML);

    const discussionOwners = document.getElementById("discussionOwners");
    const discussionOwnersHTML = `<div class="flex items-center gap-2">
                                    <img src="../images/account-circle-outline.svg" width="30px" />
                                    <h2>` + discussion.ownerId + `</h2>
                                </div>`;
    discussionOwners.insertAdjacentHTML("beforeend", discussionOwnersHTML);
};

async function Posts() {
    const res = await fetch("http://localhost:3000/posts/" + discussionId);
    const posts = await res.json();
    console.log(posts);

    const discussionPosts = document.getElementById("discussionPosts");

    for (let i = 0; i < posts.length; i++) {
        const postHTML = `<div class="card w-full h-fit bg-white">
                            <div class="card-body">
                                <div class="card-title flex justify-between items-center">
                                    <div class="flex flex-col justify-between w-full gap-2">
                                        <div class="flex justify-between">
                                            <div class="flex items-center gap-2">
                                                <img src="../images/account-circle-outline.svg" width="30px" />
                                                <h2 class="text-sm">` + posts[i].ownerId + `</h2>
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
};

async function deletePost(postId) {
    await fetch("http://localhost:3000/posts/" + postId, {
        method: "DELETE"
    });
    window.location.href = "http://127.0.0.1:5500/src/discussion.html?discussionId=" + discussionId;
}

function goToCreatePost() {
    window.location.href = "http://127.0.0.1:5500/src/create-post.html?discussionId=" + discussionId;
}

Discussion();
Posts();