const discussionName = document.getElementById("discussionName");

async function createDiscussion() {
    await fetch("http://localhost:3000/discussion", {
        method: "POST",
        body: JSON.stringify({
            dscName: discussionName.value,
            dscDesc: "",
            accName: "ApplestTan"
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });
    window.location.href = "http://127.0.0.1:5500/src/discussion.html?discussionName=" + discussionName;
};