const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const postId = urlParams.get("postId");
console.log(postId);

const postName = document.getElementById("postName");
const postDesc = document.getElementById("postDesc");
const postComments = document.getElementById("postComments");
const postAccount = document.getElementById("postAccount");

async function Discussion(dscName) { 
    const res = await fetch("http://localhost:3000/discussions/" + dscName);
    const discussion = await res.json();
    console.log(discussion);

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

async function Post() {
    const res = await fetch("http://localhost:3000/post/" + postId);
    const post = await res.json();
    console.log(post);

    const postNameHTML = `<h2>` + post.postName + '</h2>';
    postName.insertAdjacentHTML("afterbegin", postNameHTML);

    const postDescHTML = '<p>' + post.postDesc + '<p>';
    postDesc.insertAdjacentHTML("beforeend", postDescHTML);

    const postAccountHTML = '<p>' + post.accName + '<p>';
    postAccount.insertAdjacentHTML("beforeend", postAccountHTML);

    Discussion(post.dscName);
};

async function Comments() {
    const res = await fetch("http://localhost:3000/comments/" + postId);
    const comments = await res.json();
    console.log(comments);

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

const commentDesc = document.getElementById("commentDesc");

async function createComment() {
    await fetch("http://localhost:3000/comment", {
        method: "POST",
        body: JSON.stringify({
            cmtDesc: commentDesc.value,
            accName: "AppleTan",
            postId: postId
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });
    location.reload();
};

async function deleteComment(cmtId) {
    await fetch("http://localhost:3000/comment/" + cmtId, {
        method: "DELETE"
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

async function editCommentAsync(cmtId, editDesc) {
    await fetch("http://localhost:3000/comment/" + cmtId, {
        method: "PUT",
        body: JSON.stringify({
            "cmtDesc": editDesc,
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });
    location.reload();
}

commentDesc.addEventListener("keyup", ({key}) => {
    console.log("pressed");
    if (key == "Enter") {
        createComment();
    }
})

Post();
Comments();