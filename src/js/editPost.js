const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const discussionId = urlParams.get("discussionId");
const postId = urlParams.get("postId");
console.log(discussionId);
console.log(postId);

const editPostName = document.getElementById("editPostName");
const editPostDesc = document.getElementById("editPostDesc");

async function Post() {
    const res = await fetch("http://localhost:3000/post/" + postId);
    const post = await res.json();
    console.log(post);

    editPostName.value = post.postName;
    editPostDesc.value = post.postDesc;
}

async function updatePost() {
    await fetch("http://localhost:3000/post/" + postId, {
        method: "PUT",
        body: JSON.stringify({
            postName: editPostName.value,
            postDesc: editPostDesc.value,
            isEvent: "False",
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });
    window.location.href = "http://127.0.0.1:5500/src/discussion.html?discussionId=" + discussionId;
}

Post();