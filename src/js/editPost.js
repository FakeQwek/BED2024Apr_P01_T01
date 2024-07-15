const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const discussionName = urlParams.get("discussionName");
const postId = urlParams.get("postId");

const editPostName = document.getElementById("editPostName");
const editPostDesc = document.getElementById("editPostDesc");

async function Discussion(dscName) { 
    const res = await fetch("http://localhost:3000/discussions/" + dscName);
    const discussion = await res.json();

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

const isEventRadio =  document.getElementById("isEvent");

async function Post() {
    const res = await fetch("http://localhost:3000/post/" + postId);
    const post = await res.json();

    editPostName.value = post.postName;
    editPostDesc.value = post.postDesc;
    
    Discussion(post.dscName);
};

var checked;

async function updatePost() {
    if (isEventRadio.checked) {
        checked = "True";
    } else {
        checked = "False"
    }

    await fetch("http://localhost:3000/post/" + postId, {
        method: "PUT",
        body: JSON.stringify({
            postName: editPostName.value,
            postDesc: editPostDesc.value,
            isEvent: checked,
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

async function createDiscussionReport() {
    const dscReportCat = document.getElementById("dscReportCat");
    const dscReportDesc = document.getElementById("dscReportDesc");

    await fetch("http://localhost:3000/discussionReport", {
        method: "POST",
        body: JSON.stringify({
            dscRptCat: dscReportCat.value,
            dscRptDesc: dscReportDesc.value,
            accName: "AppleTan",
            dscName: discussionName
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
}

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

async function sidebar() {
    const res = await fetch("http://localhost:3000/discussionMemberTop3Discussions/" + "AppleTan");
    const discussionMembers = await res.json();

    const joinedDiscussions = document.getElementById("joinedDiscussions");
    
    for (let i = 0; i < discussionMembers.length; i++) {
        const discussionButtonHTML = `<li><a><span class="flex items-center w-full gap-2"><img src="../images/account-circle-outline.svg" width="30px" />` + discussionMembers[i].dscName + `</span></a></li>`;
        joinedDiscussions.insertAdjacentHTML("beforeend", discussionButtonHTML);
    }
}

Post();
DiscussionMembers();
sidebar();