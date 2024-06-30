const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const discussionName = urlParams.get("discussionName");
console.log(discussionName);

const createPostName = document.getElementById("createPostName");
const createPostDesc = document.getElementById("createPostDesc");
const isEventRadio = document.getElementById("isEvent");

async function createPost() {
    if (isEventRadio.checked) {
        var isEvent = "True";
    } else {
        var isEvent = "False";
    }
    
    await fetch("http://localhost:3000/post", {
        method: "POST",
        body: JSON.stringify({
            postName: createPostName.value,
            postDesc: createPostDesc.value,
            isEvent: isEvent,
            accName: "AppleTan",
            dscName: discussionName
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });
    
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
    url = url.concat("discussion.html?discussionName=" + discussionName);
    window.location.href = url;
};