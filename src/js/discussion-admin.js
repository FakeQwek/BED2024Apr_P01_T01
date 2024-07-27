// Extract discussion name parameter from the URL
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const discussionName = urlParams.get("discussionName");

// Set variables
let accountName;
let isAdmin = false;
let isMember = false;
let isMuted = false;
let isBanned = false;
let isPublic = false;
let discussionType;


// function that checks if the username in the get request matches with the username in the jwt token
async function checkAccountName() {
    const res = await fetch("http://localhost:3000/accounts/" + localStorage.getItem("username"), {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    });
    const account = await res.json();

    // set html for account if the user is logged in
    if (account.accName != null) {
        const loginSignUp = document.getElementById("loginSignUp");
        loginSignUp.innerHTML = `<button class="btn btn-sm mr-4 max-[820px]:hidden" onclick="goToProfile('` + account.accName + `')"><img src="../images/account-circle-outline.svg" width="20px" />` + account.accName + `</button>`;
    }

    accountName = account.accName;
}

checkAccountName();

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

            if (discussionMembers[i].dscMemRole == 'Admin'){
                isAdmin = true;
            }

            if (discussionMembers[i].isMuted === "True") {
                isMuted = true;
            }

            if (discussionMembers[i].isBanned === "True") {
                isBanned = true;
            }
        }
    }


    if ((!isAdmin) || isBanned || isMuted) {
        const discussionPosts = document.getElementById("discussionPosts");

        const postHTML = `<div class="flex flex-col justify-center items-center h-full">
                                    <img src="../images/lock-outline.svg" width="100px" />
                                    <h2 class="text-2xl font-bold">You are not an admin of this discussion</h2>
                                </div>`;

        discussionPosts.insertAdjacentHTML("beforeend", postHTML);
    } else {
        if (isAdmin){
            Posts();
        }
    }

}

function initializeDropdowns() {
    document.querySelectorAll('[data-dropdown-button]').forEach(button => {
        button.addEventListener('click', function () {
            const dropdown = this.nextElementSibling;
            dropdown.classList.toggle('hidden');
        });
    });
    
    const reasonDialog = document.getElementById('reasonDialog');
    const reasonInput = document.getElementById('reasonInput');
    const saveReasonButton = document.getElementById('saveReasonButton');
    const cancelReasonButton = document.getElementById('cancelReasonButton');
    let currentPostId;
    let currentAccName;
    let currentAction;
    let banDate;
    let muteDate;

    // Close dropdowns when clicking outside
    document.addEventListener('click', (event) => {
        const muteButton = event.target.closest('[data-mute-user]');
        const banButton = event.target.closest('[data-ban-user]');

        if (muteButton || banButton) {
            currentAccName = (muteButton || banButton).getAttribute('data-acc-name');
            currentPostId = (muteButton || banButton).getAttribute('data-post-id');
            currentAction = muteButton ? 'mute' : 'ban';
            banDate = new Date().toISOString(); // Capture the current date and time
            muteDate = new Date().toISOString(); // Capture the current date and time
            reasonDialog.showModal();
        }
    
        const isClickInside = event.target.closest('[data-dropdown-button]') || event.target.closest('[data-dropdown]');
        if (!isClickInside) {
            document.querySelectorAll('[data-dropdown]').forEach(dropdown => {
                dropdown.classList.add('hidden');
            });
            reasonDialog.close();
        }
    });

    cancelReasonButton.addEventListener('click', () => {
        reasonDialog.close();
    });
    
    saveReasonButton.addEventListener('click', async () => {
        const reason = reasonInput.value.trim();
        const bannedBy = accountName; // Assuming you have this variable set somewhere in your script
        const mutedBy = accountName; // Assuming you have this variable set somewhere in your script
        const dscName = discussionName;

        if (reason === ' ') {
            alert('Please provide a reason.');
            return;
        }

        if (currentAction === 'mute') {
            await muteUser(currentAccName, reason, mutedBy, currentPostId, dscName, muteDate);
        } else if (currentAction === 'ban') {
            await banUser(currentAccName, reason, bannedBy, currentPostId, dscName, banDate);
        }

        reasonDialog.close();

        reasonInput.value = ''; // Clear the input for the next use
        currentAction = null;
        currentAccName = null;
        currentPostId = null;
    });

    cancelReasonButton.addEventListener('click', () => {
        reasonDialog.close();
        reasonInput.value = ''; // Clear the input for the next use
        currentAction = null;
        currentAccName = null;
        currentPostId = null;
    });
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

    const unapprovedPosts = posts.filter(post => post.isApproved === 'False');
    const approvedPosts = posts.filter(post => post.isApproved === 'True');

    // Render unapproved posts first
    for (let i = 0; i < unapprovedPosts.length; i++) {
        const post = unapprovedPosts[i];
        const postHTML = `
            <div class="border p-4 rounded-lg shadow bg-white mb-2" id="post-${post.postId}">
                <div class="flex justify-between items-center mb-2">
                    <div class="flex items-center gap-2">
                        <img src="../images/account-circle-outline.svg" width="30px" />
                        <a href="#" class="text-blue-500 hover:underline" onclick="handleUserClick('${post.accName}')">u:${post.accName}</a>
                    </div>
                    <div class="relative">
                        <button class="btn btn-sm bg-white border-0 shadow-none" data-dropdown-button><img src="../images/action.svg" width="20px" /></button>
                        <div id="dropdown-${post.postId}" class="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg hidden" data-dropdown>
                            <a href="#" class="block px-4 py-2 text-gray-800 hover:bg-gray-100" data-mute-user data-acc-name="${post.accName}" data-post-desc="${post.postDesc}">Mute</a>
                            <a href="#" class="block px-4 py-2 text-gray-800 hover:bg-gray-100" data-ban-user data-acc-name="${post.accName}" data-post-desc="${post.postDesc}">Ban</a>
                        </div>
                    </div>
                </div>
                <p class="font-bold text-lg mb-2">${post.postName}</p>
                <p>${post.postDesc}</p>
                <div class="text-right mt-4">
                    <button class="btn btn-sm btn-outline" data-approve-post data-post-id="${post.postId}">Approve</button>
                    <button class="btn btn-sm btn-outline" data-delete-post data-post-id="${post.postId}">Delete</button>
                </div>
            </div>

            <!-- Mute/Ban Reason Dialog -->
            <dialog id="reasonDialog" class="modal">
                <div class="modal-box flex flex-col h-1.6/3 rounded-3xl gap-2">
                    <h2 class="font-bold text-2xl">Provide Reason</h2>
                    <textarea id="reasonInput" class="textarea textarea-bordered w-full mt-4" placeholder="Enter the reason..."></textarea>
                    <div class="modal-action">
                        <button class="btn btn-sm transition duration-300 hover:bg-gray-200" id="cancelReasonButton">Cancel</button>
                        <button class="btn btn-sm transition duration-300 hover:bg-gray-200" id="saveReasonButton">Save</button>
                    </div>
                </div>
            </dialog>
        `;
        discussionPosts.insertAdjacentHTML("beforeend", postHTML);
    }

    // Render approved posts next
    for (let i = 0; i < approvedPosts.length; i++) {
        const post = approvedPosts[i];
        const postHTML = `
            <div class="border p-4 rounded-lg shadow bg-white mb-2" id="post-${post.postId}">
        <div class="flex justify-between items-center mb-2">
            <div class="flex items-center gap-2">
                <img src="../images/account-circle-outline.svg" width="30px" />
                <a href="#" class="text-blue-500 hover:underline" onclick="handleUserClick('${post.accName}')">u:${post.accName}</a>
            </div>
            <div class="relative">
                <button class="btn btn-sm bg-white border-0 shadow-none" data-dropdown-button><img src="../images/action.svg" width="20px" /></button>
                <div id="dropdown-${post.postId}" class="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg hidden" data-dropdown>
                    <a href="#" class="block px-4 py-2 text-gray-800 hover:bg-gray-100" data-mute-user data-acc-name="${post.accName}" data-post-id="${post.postId}" data-post-desc="${post.postDesc}">Mute</a>
                    <a href="#" class="block px-4 py-2 text-gray-800 hover:bg-gray-100" data-ban-user data-acc-name="${post.accName}" data-post-id="${post.postId}" data-post-desc="${post.postDesc}">Ban</a>
                </div>
            </div>
        </div>
        <p class="font-bold text-lg mb-2">${post.postName}</p>
        <p>${post.postDesc}</p>
    </div>

    <!-- Mute/Ban Reason Dialog -->
    <dialog id="reasonDialog" class="modal">
    <div class="modal-box">
        <h2 class="font-bold text-2xl">Provide a reason</h2>
        <textarea id="ReasonInput" class="textarea textarea-bordered w-full mt-4" placeholder="Enter reason"></textarea>
        <div class="modal-action">
            <button id="cancelReasonButton" class="btn">Cancel</button>
            <button id="saveReasonButton" class="btn btn-primary">Save</button>
        </div>
    </div>
</dialog>
        `;
        discussionPosts.insertAdjacentHTML("beforeend", postHTML);
    }

   // Initialize the dropdown functionality after posts are added to the DOM
   initializeDropdowns();

   // Add event listeners for approve and delete actions
   discussionPosts.addEventListener('click', async (event) => {
       const approveButton = event.target.closest('[data-approve-post]');
       if (approveButton) {
           const postId = approveButton.getAttribute('data-post-id');
           await approvePost(postId);
           return;
       }

       const deleteButton = event.target.closest('[data-delete-post]');
       if (deleteButton) {
           const postId = deleteButton.getAttribute('data-post-id');
           await deletePost(postId);
           return;
       }
   });
}


// Function to handle user click for promoting or demoting users
function handleUserClick(accName) {
   promoteUsername.innerText = `u:${accName}`;
   promoteUserDialog.showModal();
}

// Function for muting users
async function muteUser(accName, muteReason, mutedBy, postId, dscName, muteDate) {
    try {
        await fetch('http://localhost:3000/muteinfo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ accName, muteDate, muteReason, mutedBy, dscName })
        });
        await fetch(`http://localhost:3000/account/mute/${accName}/${dscName}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        alert(`${accName} muted successfully`);
        document.getElementById(`post-${postId}`).remove(); // Remove the post from the page
    } catch (error) {
        console.error('Error muting user:', error);
    }
}

//Function for banning users
async function banUser(accName, banReason, bannedBy, postId, dscName, banDate) {
    try {
        await fetch('http://localhost:3000/baninfo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ accName, banDate, banReason, bannedBy, dscName })
        });
        await fetch(`http://localhost:3000/account/ban/${accName}/${dscName}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        alert(`${accName} banned successfully`);
        document.getElementById(`post-${postId}`).remove(); // Remove the post from the page
    } catch (error) {
        console.error('Error banning user:', error);
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

// Function to handle user promotion or demotion
async function updateUserRole(accName, dscName, role) {
   try {
       if (role === 'admin') {
           const appendAdminUrl = `http://localhost:3000/appendAdmin/${accName}/${dscName}`;
           const promoteUserUrl = `http://localhost:3000/promoteUsers/${accName}/${dscName}`;

           // First request to appendAdmin
           let response = await fetch(appendAdminUrl, {
               method: 'PUT',
               headers: {
                   'Content-Type': 'application/json',
                   'Authorization': `Bearer ${localStorage.getItem('token')}`
               }
           });

           if (!response.ok) {
               throw new Error('Network response was not ok');
           }

           // Second request to promoteUser
           response = await fetch(promoteUserUrl, {
               method: 'PUT',
               headers: {
                   'Content-Type': 'application/json',
                   'Authorization': `Bearer ${localStorage.getItem('token')}`
               }
           });

           if (!response.ok) {
               throw new Error('Network response was not ok');
           }

       } else if (role === 'user') {
           const removeAdminUrl = `http://localhost:3000/removeAdmin/${accName}/${dscName}`;
           const demoteUserUrl = `http://localhost:3000/demoteUsers/${accName}/${dscName}`;

           // First request to removeAdmin
           let response = await fetch(removeAdminUrl, {
               method: 'PUT',
               headers: {
                   'Content-Type': 'application/json',
                   'Authorization': `Bearer ${localStorage.getItem('token')}`
               }
           });

           if (!response.ok) {
               throw new Error('Network response was not ok');
           }

           // Second request to demoteUser
           response = await fetch(demoteUserUrl, {
               method: 'PUT',
               headers: {
                   'Content-Type': 'application/json',
                   'Authorization': `Bearer ${localStorage.getItem('token')}`
               }
           });

           if (!response.ok) {
               throw new Error('Network response was not ok');
           }
       }

       alert('User role updated successfully');
       location.reload(); // Reload the page to reflect changes
   } catch (error) {
       console.error('Error updating user role:', error);
       alert('Error updating user role');
   }
}

async function approvePost(postId) {
   try {
       const response = await fetch(`http://localhost:3000/post/approve/${postId}`, {
           method: 'PUT',
           headers: {
               'Content-Type': 'application/json'
           }
       });
       if (!response.ok) {
           throw new Error('Network response was not ok');
       }
       alert('Post approved successfully');
       document.getElementById(`post-${postId}`).remove(); // Remove the post from the page
   } catch (error) {
       console.error('Error approving post:', error);
   }
}

async function deletePost(postId) {
   try {
       const response = await fetch(`http://localhost:3000/post/${postId}`, {
           method: 'DELETE',
           headers: {
               'Content-Type': 'application/json'
           }
       });
       if (!response.ok) {
           throw new Error('Network response was not ok');
       }
       alert('Post deleted successfully');
       document.getElementById(`post-${postId}`).remove(); // Remove the post from the page
   } catch (error) {
       console.error('Error deleting post:', error);
   }
}

// Add event listener for the save promote button
savePromoteButton.addEventListener('click', () => {
   const selectedRole = document.querySelector('input[name="promoteRole"]:checked').value;
   const accName = promoteUsername.innerText.substring(2);
   updateUserRole(accName, discussionName, selectedRole);
});

// Add event listener for the cancel promote button
document.getElementById('cancelPromoteButton').addEventListener('click', () => {
   document.getElementById('promoteUserDialog').close();
});


// Initialize the page by fetching discussion details and setting the sidebar
document.addEventListener('DOMContentLoaded', async () => {
    await Discussion();
    sidebar();
});

function goToReportedPosts() {
   window.location.href = `reportedposts.html?discussionName=${discussionName}`;
}
