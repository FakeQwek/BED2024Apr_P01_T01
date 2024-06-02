const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const discussionId = urlParams.get("discussionId");
const postId = urlParams.get("postId");
console.log(discussionId);
console.log(postId);

const postName = document.getElementById("postName");
const postDesc = document.getElementById("postDesc");
const postComments = document.getElementById("postComments");

async function Post() {
    const res = await fetch("http://localhost:3000/post/" + postId);
    const post = await res.json();
    console.log(post);

    const postNameHTML = `<h2>` + post.postName + '</h2>';
    postName.insertAdjacentHTML("afterbegin", postNameHTML);

    const postDescHTML = '<p>' + post.postDesc + '<p>';
    postDesc.insertAdjacentHTML("beforeend", postDescHTML);
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
                                                <h2>testerman</h2>
                                            </div>
                                            <button class="btn btn-sm bg-white border-0 shadow-none"><img src="../images/dots-horizontal.svg" width="20px" /></button>
                                        </div>
                                        <p>` + comments[i].cmtDesc + `</p>
                                    </div>
                                </div>`
        
        postComments.insertAdjacentHTML("afterbegin", postCommentHTML);
    }
};

const postComment = document.getElementById("postComment");

async function createComment() {
    await fetch("http://localhost:3000/comment", {
        method: "POST",
        body: JSON.stringify({
            cmtDesc: postComment.value,
            ownerId: "1",
            postId: postId
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });
    window.location.href = "http://127.0.0.1:5500/src/post.html?discussionId=" + discussionId + "&postId=" + postId;
};

postComment.addEventListener("keyup", ({key}) => {
    if (key == "Enter") {
        createComment();
    }
})

Post();
Comments();