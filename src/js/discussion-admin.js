// Extract discussion name parameter from the URL
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const discussionName = urlParams.get("discussionName");

// Set variables
let accountName = 'zultest';
let isMember = false;
let isMuted = false;
let isBanned = false;
let isPublic = false;
let discussionType;

// Function to get discussion details and set page layout
async function Discussion() { 
    const res = await fetch("http://localhost:3000/discussions/" + discussionName);
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

    DiscussionMembers();

    // Set discussion type
    discussionType = discussion.dscType;

    // Set isPublic to true if the discussion type is public
    if (discussion.dscType === "Public") {
        isPublic = true;
    }
}

// Function to fetch discussion members and set details
async function DiscussionMembers() {
    const res = await fetch("http://localhost:3000/discussionMembers/" + discussionName);
    const discussionMembers = await res.json();

    // Sets the discussion member count
    memberCount.innerHTML = `<h2 class="font-bold">` + discussionMembers.length + `</h2>`;

    const joinButton = document.getElementById("joinButton");

    // Check if user is a member, muted or banned
    for (let i = 0; i < discussionMembers.length; i++) {
        if (discussionMembers[i].accName === accountName && discussionMembers[i].dscName === discussionName) {
            isMember = true;

            if (discussionMembers[i].isMuted === "True") {
                isMuted = true;
            }

            if (discussionMembers[i].isBanned === "True") {
                isBanned = true;
            }
        }
    }

    // Display user is banned message if user is banned
    if (!isBanned) {
        // If discussion is not public check if user is a member
        if (!isPublic) {
            for (let i = 0; i < discussionMembers.length; i++) {
                if (discussionMembers[i].accName === accountName && discussionMembers[i].dscName === discussionName) {
                    Posts();
                    isMember = true;
                }
            }
            // Display user is not a member message
            if (!isMember) {
                const discussionPosts = document.getElementById("discussionPosts");

                const postHTML = `<div class="flex flex-col justify-center items-center h-full">
                                    <img src="../images/lock-outline.svg" width="100px" />
                                    <h2 class="text-2xl font-bold">You are not a member of this discussion</h2>
                                </div>`;

                discussionPosts.insertAdjacentHTML("beforeend", postHTML);
            } else {
                // Set button text to leave if user is a member
                joinButton.innerHTML = `<img src="../images/plus.svg" width="20px" />Leave`;
            }
            // Remove the join button if the discussion is not public
            if (joinButton) {
                joinButton.remove();
            }
        } else {
            if (isMember) {
                // Set button text to leave if user is a member
                joinButton.innerHTML = `<img src="../images/plus.svg" width="20px" />Leave`;
            }
            Posts();
        }
    }

    for (let i = 0; i < discussionMembers.length; i++) {
        // Display user is banned message
        if (isBanned) {
            const discussionPosts = document.getElementById("discussionPosts");
            discussionPosts.innerHTML = `<div class="flex flex-col justify-center items-center h-full">
                                            <img src="../images/cancel.svg" width="100px" />
                                            <h2 class="text-2xl font-bold">You are banned from this discussion</h2>
                                        </div>`;
        }

        // If user is an owner show them additional options to edit discussion details
        if (discussionMembers[i].dscMemRole === "Owner" && discussionMembers[i].accName === accountName) {
            let bannerOptionsHTML;

            // If discussion is restricted add an extra option for the owner to invite users
            if (discussionType === "Restricted") {
                bannerOptionsHTML = `<li><button class="btn btn-sm bg-white border-0 text-start shadow-none" onclick="edit_discussion_modal.showModal()"><span class="w-full">Edit</span></button></li>
                                        <li><button class="btn btn-sm bg-white border-0 text-start shadow-none" onclick="invite_modal.showModal()"><span class="w-full">Invite</span></button></li>`;
            } else {
                bannerOptionsHTML = `<li><button class="btn btn-sm bg-white border-0 text-start shadow-none" onclick="edit_discussion_modal.showModal()"><span class="w-full">Edit</span></button></li>`;
            }

            bannerOptions.insertAdjacentHTML("beforeend", bannerOptionsHTML);

            // Remove the join button
            if (joinButton) {
                joinButton.remove();
            }
        } else if (discussionMembers[i].dscMemRole === "Admin") { // If user is an admin add their name to the banner
            const discussionAdmins = document.getElementById("discussionAdmins");
            const discussionAdminsHTML = `<div class="flex items-center gap-2">
                                            <img src="../images/account-circle-outline.svg" width="30px" />
                                            <h2>` + discussionMembers[i].accName + `</h2>
                                        </div>`;
            discussionAdmins.insertAdjacentHTML("beforeend", discussionAdminsHTML);
        }
    }
}

// Fetch posts of the discussion
async function Posts() {
    const res = await fetch("http://localhost:3000/posts/" + discussionName, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    });
    const posts = await res.json();

    const discussionPosts = document.getElementById("discussionPosts");

    // Sets the HTML of the post depending on if they are an event and whether the user owns them
    for (let i = 0; i < posts.length; i++) {
        const postHTML = `
            <div class="border p-4 rounded-lg shadow bg-white mb-2" id="post-${posts[i].postId}">
                <div class="flex justify-between items-center mb-2">
                    <div class="flex items-center gap-2">
                        <img src="../images/account-circle-outline.svg" width="30px" />
                        <a href="#" class="text-blue-500 hover:underline" onclick="handleUserClick('${posts[i].accName}')">u:${posts[i].accName}</a>
                    </div>
                    <div class="relative">
                        <button class="btn btn-sm bg-white border-0 shadow-none" data-dropdown-button><img src="../images/action.svg" width="20px" /></button>
                        <div id="dropdown-${posts[i].postId}" class="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg hidden" data-dropdown>
                            <a href="#" class="block px-4 py-2 text-gray-800 hover:bg-gray-100" data-mute-user data-acc-name="${posts[i].accName}" data-post-desc="${posts[i].postDesc}">Mute</a>
                            <a href="#" class="block px-4 py-2 text-gray-800 hover:bg-gray-100" data-ban-user data-acc-name="${posts[i].accName}" data-post-desc="${posts[i].postDesc}">Ban</a>
                        </div>
                    </div>
                </div>
                <p class="font-bold text-lg mb-2">${posts[i].postName}</p>
                <p>${posts[i].postDesc}</p>
            </div>
        `;
        discussionPosts.insertAdjacentHTML("beforeend", postHTML);
        getPostLikesByPost(posts[i].postId);
    }
}

// Function to get the number of likes for each post
async function getPostLikesByPost(postId) {
    const res = await fetch("http://localhost:3000/postLikes/" + discussionName + "/" + postId, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    });
    const postLikes = await res.json();

    // Set the like count of the post
    const likeCount = document.getElementById("likeCount" + postId);
    const likeCountHTML = `<h2 id="postLikeCount${postId}">${postLikes.length}</h2>`;
    likeCount.insertAdjacentHTML("beforeend", likeCountHTML);

    for (let i = 0; i < postLikes.length; i++) {
        if (postLikes[i].accName === accountName) {
            const likeButton = document.getElementById("likeButton" + postId);
            likeButton.innerHTML = `<img src="../images/thumb-up.svg" width="20px" />`;
        }
    }
}

// Function to delete post
async function deletePost(postId) {
    await fetch("http://localhost:3000/posts/" + postId, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    });
    location.reload();
}

// Function to create volunteer
async function createVolunteer(postId) {
    await fetch("http://localhost:3000/volunteer/" + discussionName, {
        method: "POST",
        body: JSON.stringify({
            accName: accountName,
            isApproved: "False",
            postId: postId
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    });
}

// Function to create a post report
async function createPostReport(postId) {
    const postReportCat = document.getElementById("postReportCat" + postId);
    const postReportDesc = document.getElementById("postReportDesc" + postId);

    await fetch("http://localhost:3000/postReport/" + discussionName, {
        method: "POST",
        body: JSON.stringify({
            postRptCat: postReportCat.value,
            postRptDesc: postReportDesc.value,
            accName: accountName,
            postId: postId
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    });
}

// Function to create a discussion report
async function createDiscussionReport() {
    const dscReportCat = document.getElementById("dscReportCat");
    const dscReportDesc = document.getElementById("dscReportDesc");

    await fetch("http://localhost:3000/discussionReport/" + discussionName, {
        method: "POST",
        body: JSON.stringify({
            dscRptCat: dscReportCat.value,
            dscRptDesc: dscReportDesc.value,
            accName: accountName,
            dscName: discussionName
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    });
}

// Function to create a discussion member
async function createDiscussionMember() {
    const joinButton = document.getElementById("joinButton");

    // If user is not a member create a new member record
    if (!isMember) {
        await fetch("http://localhost:3000/discussionMember/" + discussionName, {
            method: "POST",
            body: JSON.stringify({
                accName: accountName,
                dscMemRole: "Member"
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });
        isMember = true;
        joinButton.innerHTML = `<img src="../images/plus.svg" width="20px" />Leave`;
    } else { // If user is already a member delete their member record
        await fetch("http://localhost:3000/discussionMember/" + accountName + "/" + discussionName, {
            method: "DELETE"
        });
        isMember = false;
        joinButton.innerHTML = `<img src="../images/plus.svg" width="20px" />Join`;
    }
}

// Function to create a post like
async function createPostLike(postId) {
    const likeButton = document.getElementById("likeButton" + postId);

    // If user has not liked the post create a new post like record
    if (likeButton.innerHTML === `<img src="../images/thumb-up-outline.svg" width="20px">`) {
        await fetch("http://localhost:3000/postLike/" + discussionName, {
            method: "POST",
            body: JSON.stringify({
                accName: accountName,
                postId: postId
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        });

        // Change the thumbs up image and update the like count
        likeButton.innerHTML = `<img src="../images/thumb-up.svg" width="20px">`;
        const postLikeCount = document.getElementById("postLikeCount" + postId);
        let likeCount = parseInt(postLikeCount.innerHTML) + 1;
        postLikeCount.innerHTML = likeCount;
    } else { // If user has already liked the post delete the post like record
        await fetch("http://localhost:3000/postLike/" + accountName + "/" + postId + "/" + discussionName, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        });

        // Change the thumbs up image and update the like count
        likeButton.innerHTML = `<img src="../images/thumb-up-outline.svg" width="20px">`;
        const postLikeCount = document.getElementById("postLikeCount" + postId);
        let likeCount = parseInt(postLikeCount.innerHTML) - 1;
        postLikeCount.innerHTML = likeCount;
    }
}

// Function to get user details to be displayed on the sidebar
async function sidebar() {
    const res = await fetch("http://localhost:3000/discussionMemberTop3Discussions/" + accountName);
    const discussionMembers = await res.json();

    const joinedDiscussions = document.getElementById("joinedDiscussions");

    for (let i = 0; i < discussionMembers.length; i++) {
        const discussionButtonHTML = `<li><a><span class="flex items-center w-full gap-2"><img src="../images/account-circle-outline.svg" width="30px" />` + discussionMembers[i].dscName + `</span></a></li>`;
        joinedDiscussions.insertAdjacentHTML("beforeend", discussionButtonHTML);
    }
}

// Function to create an invite to the discussion
async function createInvite() {
    await fetch("http://localhost:3000/invite", {
        method: "POST",
        body: JSON.stringify({
            accName: accountName,
            dscName: discussionName
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });
}

// Direct page to the create post page
function goToCreatePost() {
    var script = document.getElementsByTagName("script");
    var url = script[script.length - 1].src;
    for (let i = 0; i < url.length; i++) {
        if (url.slice(-1) != "/") {
            url = url.substring(0, url.length - 1);
        } else {
            break;
        }
    }
    url = url.substring(0, url.length - 3);
    url = url.concat("create-post.html?discussionName=" + discussionName);
    window.location.href = url;
}

// Direct page to the post page with the post id of the selected post
function goToPost(postId) {
    var script = document.getElementsByTagName("script");
    var url = script[script.length - 1].src;
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

// Direct page to the edit post page
function goToEditPost(postId) {
    var script = document.getElementsByTagName("script");
    var url = script[script.length - 1].src;
    for (let i = 0; i < url.length; i++) {
        if (url.slice(-1) != "/") {
            url = url.substring(0, url.length - 1);
        } else {
            break;
        }
    }
    url = url.substring(0, url.length - 3);
    url = url.concat("edit-post.html?discussionName=" + discussionName + "&postId=" + postId);
    window.location.href = url;
}

// Direct page to profile page
function goToProfile(accName) {
    var script = document.getElementsByTagName("script");
    var url = script[script.length - 1].src;
    for (let i = 0; i < url.length; i++) {
        if (url.slice(-1) != "/") {
            url = url.substring(0, url.length - 1);
        } else {
            break;
        }
    }
    url = url.substring(0, url.length - 3);
    url = url.concat("profile.html");
    window.location.href = url;
}

// Direct page to manage volunteers page
function goToManageVolunteers(postId) {
    var script = document.getElementsByTagName("script");
    var url = script[script.length - 1].src;
    for (let i = 0; i < url.length; i++) {
        if (url.slice(-1) != "/") {
            url = url.substring(0, url.length - 1);
        } else {
            break;
        }
    }
    url = url.substring(0, url.length - 3);
    url = url.concat("manage-volunteers.html?postId=" + postId);
    window.location.href = url;
}

// Add event listener for the popup button
popupButton.addEventListener('click', () => {
    popupDialog.showModal();
});

// Add event listener for the edit details button
editDetailsButton.addEventListener('click', () => {
    popupDialog.close();
    editDialog.showModal();
});

// Add event listener for the cancel edit button
cancelEditButton.addEventListener('click', () => {
    editDialog.close();
    popupDialog.showModal();
});

// Add event listener for the save edit button
saveEditButton.addEventListener('click', async () => {
    const newDetails = editDiscussionDetailInput.value;
    try {
        const response = await fetch(`http://localhost:3000/discussions/${encodeURIComponent(discussionName)}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ dscDesc: newDetails })
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        alert('Discussion details updated successfully');
        editDialog.close();
        popupDialog.showModal();
        location.reload(); // Reload the page to reflect changes
    } catch (error) {
        console.error('Error updating discussion details:', error);
    }
});

// Add event listeners for the promote user dialog buttons
savePromoteButton.addEventListener('click', () => {
    const selectedRole = document.querySelector('input[name="promoteRole"]:checked').value;
    const accName = promoteUsername.innerText.substring(2);

    if (selectedRole === 'admin') {
        promoteUser(accName, selectedRole);
    } else if (selectedRole === 'user') {
        demoteUser(accName);
    }
    promoteUserDialog.close(); // Close the dialog after saving
});

cancelPromoteButton.addEventListener('click', () => {
    promoteUserDialog.close();
});

function promoteUser(accName, role) {
    fetch(`http://localhost:3000/promoteUser/${accName}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: role })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        alert('User promoted successfully');
        location.reload(); // Reload the page to reflect changes
    })
    .catch(error => {
        console.error('Error promoting user:', error);
    });
}

function demoteUser(accName) {
    fetch(`http://localhost:3000/demoteUser/${accName}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        alert('User demoted successfully');
        location.reload(); // Reload the page to reflect changes
    })
    .catch(error => {
        console.error('Error demoting user:', error);
    });
}

// Function to handle user click for promoting or demoting users
function handleUserClick(accName) {
    promoteUsername.innerText = `u:${accName}`;
    promoteUserDialog.showModal();
}

// Initialize the page by fetching discussion details and setting the sidebar
document.addEventListener('DOMContentLoaded', async () => {
    await Discussion();
    sidebar();
});
