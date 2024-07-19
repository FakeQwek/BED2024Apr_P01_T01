const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const postId = urlParams.get("postId");
let approvedVolunteerCount = 0;

async function Post() {
    const res = await fetch("http://localhost:3000/post/" + postId);
    const post = await res.json();
    console.log(post);

    const postDiscussionName = document.getElementById("postDiscussionName");

    const postDiscussionNameHTML = `<h1>d:` + post.dscName + `</h1>`;

    postDiscussionName.insertAdjacentHTML("afterbegin", postDiscussionNameHTML);

    const postName = document.getElementById("postName");

    postNameHTML = `<h2 class="text-2xl font-bold m-8">` + post.postName + `</h2>`;

    postName.insertAdjacentHTML("afterbegin", postNameHTML);
};

async function Volunteers() {
    const res = await fetch("http://localhost:3000/volunteers/" + postId);
    const volunteers = await res.json();
    console.log(volunteers);

    const postVolunteers = document.getElementById("postVolunteers");

    for (let i = 0; i < volunteers.length; i++) {
        if (volunteers[i].isApproved == "True") {
            approvedVolunteerCount++;
            const volunteerHTML = `<div class="card w-11/12 h-fit bg-white mt-4">
                                        <div class="card-body">
                                            <div class="card-title flex justify-between items-center">
                                                <div class="flex items-center gap-2">
                                                    <img src="../images/account-circle-outline.svg" width="30px" />
                                                    <h2 class="text-sm">` + volunteers[i].accName + `</h2>
                                                </div>
                                            </div>
                                        </div>
                                    </div>`
            postVolunteers.insertAdjacentHTML("beforeend", volunteerHTML);
        } else {
            const volunteerHTML = `<div class="card w-11/12 h-fit bg-white mt-4">
                                        <div class="card-body">
                                            <div class="card-title flex justify-between items-center max-[820px]:flex-col max-[820px]:items-start">
                                                <div class="flex items-center gap-2">
                                                    <img src="../images/account-circle-outline.svg" width="30px" />
                                                    <h2 class="text-sm">` + volunteers[i].accName + `</h2>
                                                </div>
                                                <div class="flex gap-4 max-[820px]:gap-0">
                                                    <button class="btn btn-sm bg-white border-0 shadow-none"><img src="../images/check.svg" width="20px" onclick="approveVolunteer(` + volunteers[i].volId + `)"></button>
                                                    <button class="btn btn-sm bg-white border-0 shadow-none"><img src="../images/close.svg" width="20px" onclick="deleteVolunteer(` + volunteers[i].volId + `)"></button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>`
            postVolunteers.insertAdjacentHTML("beforeend", volunteerHTML);
        }
    }

    const postName = document.getElementById("postName");

    const approvedVolunteersHTML = `<h2 class="text-md m-8">` + approvedVolunteerCount + ` Volunteers Approved</h2>`;

    postName.insertAdjacentHTML("beforeend", approvedVolunteersHTML);
};

async function approveVolunteerAsync(volId) {
    await fetch("http://localhost:3000/volunteer/" + volId, {
        method: "PUT"
    });
};

async function sidebar() {
    const res = await fetch("http://localhost:3000/discussionMemberTop3Discussions/" + "AppleTan");
    const discussionMembers = await res.json();

    const joinedDiscussions = document.getElementById("joinedDiscussions");
    
    for (let i = 0; i < discussionMembers.length; i++) {
        const discussionButtonHTML = `<li><a><span class="flex items-center w-full gap-2"><img src="../images/account-circle-outline.svg" width="30px" />` + discussionMembers[i].dscName + `</span></a></li>`;
        joinedDiscussions.insertAdjacentHTML("beforeend", discussionButtonHTML);
    }
}

function approveVolunteer(volId) {
    location.reload();

    approveVolunteerAsync(volId);
}


async function deleteVolunteerAsync(volId) {
    await fetch("http://localhost:3000/volunteer/" + postId + "/" + volId, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    });
};


function deleteVolunteer(volId) {
    location.reload();
    
    deleteVolunteerAsync(volId);
};

Post();
Volunteers();
sidebar();