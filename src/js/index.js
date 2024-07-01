const discussionName = document.getElementById("discussionName");

async function createDiscussion() {
    await fetch("http://localhost:3000/discussion", {
        method: "POST",
        body: JSON.stringify({
            dscName: discussionName.value,
            dscDesc: "",
            accName: "AppleTan"
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
    url = url.concat("discussion.html?discussionName=" + discussionName.value);
    window.location.href = url;
};

const homePosts = document.getElementById("homePosts");

async function Posts() {
    const res = await fetch("http://localhost:3000/posts");
    const posts = await res.json();

    for (let i = 0; i < posts.length; i++) {
        const homePostsHTML = `<div class="flex justify-center w-full">
                                    <div class="card w-5/6 bg-white" onclick="goToPost(` + posts[i].postId + `)">
                                        <div class="card-body">
                                            <div class="flex items-center gap-2">
                                                <img src="../images/account-circle-outline.svg" width="30px" />
                                                <h2 class="text-sm">d:` + posts[i].dscName + `</h2>
                                            </div>
                                            <h2 class="card-title">` + posts[i].postName + `</h2>
                                            <p>` + posts[i].postDesc +`</p>
                                        </div>
                                    </div>
                                </div>`;

        homePosts.insertAdjacentHTML("beforeend", homePostsHTML);
    }
}

function goToPost(postId) {
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
    url = url.concat("post.html?postId=" + postId);
    window.location.href = url;
}

Posts();