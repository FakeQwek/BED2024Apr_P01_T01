const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const discussionName = urlParams.get("discussionName");
console.log(discussionName);

const createPostName = document.getElementById("createPostName");
const createPostDesc = document.getElementById("createPostDesc");

async function createPost() {
    await fetch("http://localhost:3000/post", {
        method: "POST",
        body: JSON.stringify({
            postName: createPostName.value,
            postDesc: createPostDesc.value,
            isEvent: "True",
            accName: "ApplestTan",
            dscName: discussionName
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });
    window.location.href = "http://127.0.0.1:5500/src/discussion.html?discussionName=" + discussionName;
};