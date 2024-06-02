const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const discussionId = urlParams.get("discussionId");
console.log(discussionId);

const createPostName = document.getElementById("createPostName");
const createPostDesc = document.getElementById("createPostDesc");

async function createPost() {
    await fetch("http://localhost:3000/posts", {
        method: "POST",
        body: JSON.stringify({
            postName: createPostName.value,
            postDesc: createPostDesc.value,
            isEvent: "False",
            ownerId: "1",
            dscId: discussionId
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });
    window.location.href = "http://127.0.0.1:5500/src/discussion.html?discussionId=" + discussionId;
};