const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const postId = urlParams.get("postId");
console.log(postId);

const postName = document.getElementById("postName");
const postDesc = document.getElementById("postDesc");
const postComments = document.getElementById("postComments");
const postAccount = document.getElementById("postAccount");

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
                                            <button class="btn btn-sm bg-white border-0 shadow-none"><img src="../images/dots-horizontal.svg" width="20px" /></button>
                                        </div>
                                        <p>` + comments[i].cmtDesc + `</p>
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

commentDesc.addEventListener("keyup", ({key}) => {
    console.log("pressed");
    if (key == "Enter") {
        createComment();
    }
})

Post();
Comments();