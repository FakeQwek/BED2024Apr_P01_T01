const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const discussionName = urlParams.get("discussionName");
console.log(discussionName);

const createPostName = document.getElementById("createPostName");
const createPostDesc = document.getElementById("createPostDesc");
const isEventRadio = document.getElementById("isEvent");

async function Discussion() { 
    const res = await fetch("http://localhost:3000/discussions/" + discussionName);
    const discussion = await res.json();
    console.log(discussion);

    const discussionName2 = document.getElementById("discussionName");
    const discussionName2HTML = `<h2>d:` + discussion.dscName + `</h2>`;
    discussionName2.insertAdjacentHTML("afterbegin", discussionName2HTML);

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

async function createPost() {
    if (isEventRadio.checked) {
        var isEvent = "True";
    } else {
        var isEvent = "False";
    }

    let date = new Date();

    let dd = date.getDate();
    let mm = date.getMonth() + 1;

    let yyyy = date.getFullYear();

    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    date = dd + '/' + mm + '/' + yyyy;
        
    await fetch("http://localhost:3000/post", {
        method: "POST",
        body: JSON.stringify({
            postName: createPostName.value,
            postDesc: createPostDesc.value,
            isEvent: isEvent,
            postDate: date,
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

const bannerOptions = document.getElementById("bannerOptions");

const memberCount = document.getElementById("memberCount");

async function DiscussionMembers() {
    const res = await fetch("http://localhost:3000/discussionMembers/" + discussionName);
    const discussionMembers = await res.json();
    
    memberCount.innerHTML = `<h2 class="font-bold">` + discussionMembers.length + `</h2>`;

    for (let i = 0; i < discussionMembers.length; i++) {
        if (discussionMembers[i].dscMemRole == "Owner" && discussionMembers[i].accName == "AppleTan") {
            const bannerOptionsHTML = `<li><button class="btn btn-sm bg-white border-0 text-start shadow-none" onclick="edit_discussion_modal.showModal()"><span class="w-full">Edit</span></button></li>`;
            bannerOptions.insertAdjacentHTML("beforeend", bannerOptionsHTML);
        }
    }
}

Discussion();
DiscussionMembers();