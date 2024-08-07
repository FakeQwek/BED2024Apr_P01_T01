document.addEventListener('DOMContentLoaded', async () => {
    const reportedPostsContainer = document.getElementById('reportedPostsContainer');
    const discussionNameElement = document.getElementById('discussionName');
    const discussionBannerDescElement = document.getElementById('discussionBannerDesc');
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const discussionName = urlParams.get("discussionName");

    let accountName;

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

    try {
        const response = await fetch(`http://localhost:3000/discussions/${encodeURIComponent(discussionName)}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const discussion = await response.json();

        discussionNameElement.innerText = "d:" + discussion.dscName;
        discussionBannerDescElement.innerHTML = `<p>${discussion.dscDesc}</p>`;
        adminsListElement.innerHTML = `
            <div class="flex items-center">
                <img src="../images/account-circle-outline.svg" width="30px" />
                <a href="#" class="ml-2 text-blue-500 hover:underline" onclick="handleUserClick('${discussion.accName}')">u:${discussion.accName}</a>
            </div>`;
    } catch (error) {
        console.error('Error fetching discussion details:', error);
    }

    try {
        const response = await fetch(`http://localhost:3000/postReport/${encodeURIComponent(discussionName)}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const postReports = await response.json();
        console.log('Fetched post reports:', postReports); // Log for debugging

        reportedPostsContainer.innerHTML = '';
        postReports.forEach(post => {
            const postHTML = `
                <div class="border p-4 rounded-lg shadow bg-white mb-2" id="post-${post.PostID}">
                    <div class="flex justify-between items-center mb-2">
                        <div class="flex items-center gap-2">
                            <img src="../images/account-circle-outline.svg" width="30px" />
                            <p class="text-black-500" onclick="handleUserClick('${post.AccName}')">u:${post.AccName}</p>
                        </div>
                        <div class="relative">
                            <button class="btn btn-sm bg-white border-0 shadow-none" data-dropdown-button><img src="../images/action.svg" width="20px" /></button>
                            <div id="dropdown-${post.PostID}" class="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg hidden" data-dropdown>
                                <a href="#" class="block px-4 py-2 text-gray-800 hover:bg-gray-100" data-mute-user data-acc-name="${post.OwnerID}" data-post-id="${post.PostID}" data-post-desc="${post.PostDesc}" data-post-rpt-desc="${post.PostRptDesc}">Mute</a>
                                <a href="#" class="block px-4 py-2 text-gray-800 hover:bg-gray-100" data-ban-user data-acc-name="${post.OwnerID}" data-post-id="${post.PostID}" data-post-desc="${post.PostDesc}" data-post-rpt-desc="${post.PostRptDesc}">Ban</a>
                            </div>
                        </div>
                    </div>
                    <p class="font-bold text-lg mb-2">${post.PostName}</p>
                    <p>${post.PostDesc}</p>
                    <div class="border-t mt-4 pt-4">
                        <p class="font-bold text-md">Report Details</p>
                        <p><strong>Category:</strong> ${post.PostRptCat}</p>
                        <p><strong>Description:</strong> ${post.PostRptDesc}</p>
                    </div>
                    <div class="text-right mt-4">
                        <button class="btn btn-sm btn-outline" data-approve-post data-post-id="${post.PostID}">Approve</button>
                        <button class="btn btn-sm btn-outline" data-delete-post data-post-id="${post.PostID}">Delete</button>
                    </div>
                </div>
            `;
            reportedPostsContainer.insertAdjacentHTML('beforeend', postHTML);
        });

        // Add event listener for dropdown buttons
        document.addEventListener('click', (event) => {
            const isDropdownButton = event.target.closest('[data-dropdown-button]');
            if (!isDropdownButton) {
                document.querySelectorAll('[data-dropdown]').forEach(dropdown => {
                    dropdown.classList.add('hidden');
                });
                return;
            }

            const currentDropdown = isDropdownButton.nextElementSibling;
            currentDropdown.classList.toggle('hidden');
            
            document.querySelectorAll('[data-dropdown]').forEach(dropdown => {
                if (dropdown !== currentDropdown) {
                    dropdown.classList.add('hidden');
                }
            });
        });

        // Add event listeners for approve, mute, and ban actions
        reportedPostsContainer.addEventListener('click', async (event) => {
            const approveButton = event.target.closest('[data-approve-post]');
            if (approveButton) {
                const postId = approveButton.getAttribute('data-post-id');
                await approvePost(postId);
                return;
            }

            const deletebutton = event.target.closest('[data-delete-post]');
            if (approveButton) {
                const postId = deletebutton.getAttribute('data-post-id');
                await deletepost(postId);
                return;
            }

            const muteButton = event.target.closest('[data-mute-user]');
            if (muteButton) {
                const accName = muteButton.getAttribute('data-acc-name');
                const postId = muteButton.getAttribute('data-post-id');
                const muteReason = muteButton.getAttribute('data-post-rpt-desc');
                const muteDate = new Date().toISOString();
                const mutedBy = accountName;
                const dscName = discussionName;
                await muteUser(accName, muteReason, mutedBy, postId, dscName, muteDate);
                return;
            }

            const banButton = event.target.closest('[data-ban-user]');
            if (banButton) {
                const accName = banButton.getAttribute('data-acc-name');
                const postId = banButton.getAttribute('data-post-id');
                const banReason = banButton.getAttribute('data-post-rpt-desc');
                const banDate = new Date().toISOString();
                await banUser(accName, banReason, accountName, postId, discussionName, banDate);
                return;
            }
        });
    } catch (error) {
        console.error('Error fetching post reports:', error);
    }
});

async function approvePost(postId) {
    try {
        const response = await fetch(`http://localhost:3000/post/approve/${postId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        await fetch(`http://localhost:3000/postReport/${postId}`, {
            method: 'DELETE',
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
        await fetch(`http://localhost:3000/comments/${postId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        await fetch(`http://localhost:3000/postReport/${postId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        await fetch(`http://localhost:3000/post/${postId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        alert('Post deleted successfully');
        document.getElementById(`post-${postId}`).remove(); // Remove the post from the page
    } catch (error) {
        console.error('Error deleting post:', error);
    }
}

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
        await fetch(`http://localhost:3000/comments/${postId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        await fetch(`http://localhost:3000/postReport/${postId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        await fetch(`http://localhost:3000/post/${postId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        alert(`${accName} muted, post and comments deleted successfully`);
        document.getElementById(`post-${postId}`).remove(); // Remove the post from the page
    } catch (error) {
        console.error('Error muting user, deleting post and comments:', error);
    }
}

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
        await fetch(`http://localhost:3000/comments/${postId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        await fetch(`http://localhost:3000/postReport/${postId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        await fetch(`http://localhost:3000/post/${postId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        alert(`${accName} banned, post and comments deleted successfully`);
        document.getElementById(`post-${postId}`).remove(); // Remove the post from the page
    } catch (error) {
        console.error('Error banning user, deleting post and comments:', error);
    }
}



const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const discussionName = urlParams.get("discussionName");

function toggleDropdown(postId) {
    const dropdown = document.getElementById(`dropdown-${postId}`);
    dropdown.classList.toggle('hidden');
}

function gotobannedusers() {
    window.location.href = `bannedusers.html?discussionName=${discussionName}`;
}

function gotomutedusers() {
    window.location.href = `mutedusers.html?discussionName=${discussionName}`;
}
