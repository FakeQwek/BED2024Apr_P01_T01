const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const discussionName = urlParams.get("discussionName");
const postId = urlParams.get("postId");
console.log(discussionName);
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
}

Post();