const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const postId = urlParams.get("postId");
console.log(postId);

async function Post() {
    const res = await fetch("http://localhost:3000/post/" + postId);
    const post = await res.json();
    console.log(post);

    const postDiscussionName = document.getElementById("postDiscussionName");

    const postDiscussionNameHTML = `<h1>d:` + post.dscName + `</h1>`;

    postDiscussionName.insertAdjacentHTML("afterbegin", postDiscussionNameHTML);

    const postName = document.getElementById("postName");

    postNameHTML = `<h2 class="text-2xl font-bold m-8">` + post.postName + `</h2>`;

    postName.insertAdjacentHTML("beforeend", postNameHTML);
};

async function Volunteers() {
    const res = await fetch("http://localhost:3000/volunteers/" + postId);
    const volunteers = await res.json();
    console.log(volunteers);

    const postVolunteers = document.getElementById("postVolunteers");

    for (let i = 0; i < volunteers.length; i++) {
        if (volunteers[i].isApproved == "True") {
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
                                            <div class="card-title flex justify-between items-center">
                                                <div class="flex items-center gap-2">
                                                    <img src="../images/account-circle-outline.svg" width="30px" />
                                                    <h2 class="text-sm">` + volunteers[i].accName + `</h2>
                                                </div>
                                                <div class="flex gap-4">
                                                    <button class="btn btn-sm bg-white border-0 shadow-none"><img src="../images/check.svg" width="20px" onclick="approveVolunteer(` + volunteers[i].volId + `)"></button>
                                                    <button class="btn btn-sm bg-white border-0 shadow-none"><img src="../images/close.svg" width="20px" onclick="deleteVol(` + volunteers[i].volId + `)"></button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>`
            postVolunteers.insertAdjacentHTML("beforeend", volunteerHTML);
        }
    }
};

async function approveVolunteerAsync(volId) {
    await fetch("http://localhost:3000/volunteer/" + volId, {
        method: "PUT"
    });
};

function approveVolunteer(volId) {
    window.location.href = "http://127.0.0.1:5500/src/manage-volunteers.html?postId=" + postId;
    approveVolunteerAsync(volId);
}


async function deleteVolunteerAsync(volId) {
    await fetch("http://localhost:3000/volunteer/" + volId, {
        method: "DELETE"
    });
};


function deleteVolunteer(volId) {
    window.location.href = "http://127.0.0.1:5500/src/manage-volunteers.html?postId=" + postId;
    deleteVolunteerAsync(volId);
};

Post();
Volunteers();