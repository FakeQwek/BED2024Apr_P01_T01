document.addEventListener('DOMContentLoaded', async () => {
    const reportedPostsContainer = document.getElementById('reportedPostsContainer');
    const discussionNameElement = document.getElementById('discussionName');
    const discussionBannerDescElement = document.getElementById('discussionBannerDesc');
    const adminsListElement = document.getElementById('adminsList');
    const discussionName = 'TechTalk'; // Replace with the dynamic discussion name as needed

    try {
        const response = await fetch(`http://localhost:3000/discussions/${encodeURIComponent(discussionName)}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const discussion = await response.json();

        discussionNameElement.innerText = discussion.dscName;
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
        const response = await fetch(`http://localhost:3000/unapprovedposts/${encodeURIComponent(discussionName)}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const postReports = await response.json();
        console.log('Fetched unapproved posts:', postReports); // Log for debugging

        reportedPostsContainer.innerHTML = '';
        postReports.forEach(post => {
            const postHTML = `
                <div class="border p-4 rounded-lg shadow bg-white mb-2" id="post-${post.PostID}">
                    <div class="flex justify-between items-center mb-2">
                        <div class="flex items-center gap-2">
                            <img src="../images/account-circle-outline.svg" width="30px" />
                            <a href="#" class="text-blue-500 hover:underline" onclick="handleUserClick('${post.OwnerID}')">u:${post.OwnerID}</a>
                        </div>
                        <div class="relative">
                            <button class="btn btn-sm bg-white border-0 shadow-none" data-dropdown-button><img src="../images/action.svg" width="20px" /></button>
                            <div id="dropdown-${post.PostID}" class="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg hidden" data-dropdown>
                                <a href="#" class="block px-4 py-2 text-gray-800 hover:bg-gray-100" data-approve-post data-post-id="${post.PostID}">Approve</a>
                                <a href="#" class="block px-4 py-2 text-gray-800 hover:bg-gray-100" data-mute-user data-acc-name="${post.OwnerID}" data-post-desc="${post.PostDesc}">Mute</a>
                                <a href="#" class="block px-4 py-2 text-gray-800 hover:bg-gray-100" data-ban-user data-acc-name="${post.OwnerID}" data-post-desc="${post.PostDesc}">Ban</a>
                            </div>
                        </div>
                    </div>
                    <p class="font-bold text-lg mb-2">${post.PostName}</p>
                    <p>${post.PostDesc}</p>
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

            const muteButton = event.target.closest('[data-mute-user]');
            if (muteButton) {
                const accName = muteButton.getAttribute('data-acc-name');
                const postDesc = muteButton.getAttribute('data-post-desc');
                await muteUser(accName, postDesc, 'admin', postDesc);
                return;
            }

            const banButton = event.target.closest('[data-ban-user]');
            if (banButton) {
                const accName = banButton.getAttribute('data-acc-name');
                const postDesc = banButton.getAttribute('data-post-desc');
                await banUser(accName, postDesc, 'admin', postDesc);
                return;
            }
        });
    } catch (error) {
        console.error('Error fetching unapproved posts:', error);
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
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        alert('Post approved successfully');
        document.getElementById(`post-${postId}`).remove(); // Remove the post from the page
    } catch (error) {
        console.error('Error approving post:', error);
    }
}

async function muteUser(accName, muteReason, mutedBy, postId) {
    try {
        const muteDate = new Date().toISOString();
        await fetch('http://localhost:3000/muteinfo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ accName, muteDate, muteReason, mutedBy })
        });
        await fetch(`http://localhost:3000/accounts/mute/${accName}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        alert('User muted successfully');
        document.getElementById(`post-${postId}`).remove(); // Remove the post from the page
    } catch (error) {
        console.error('Error muting user:', error);
    }
}

async function banUser(accName, banReason, bannedBy, postId) {
    try {
        const banDate = new Date().toISOString();
        await fetch('http://localhost:3000/baninfo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ accName, banDate, banReason, bannedBy })
        });
        await fetch(`http://localhost:3000/accounts/ban/${accName}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        alert('User banned successfully');
        document.getElementById(`post-${postId}`).remove(); // Remove the post from the page
    } catch (error) {
        console.error('Error banning user:', error);
    }
}

function toggleDropdown(postId) {
    const dropdown = document.getElementById(`dropdown-${postId}`);
    dropdown.classList.toggle('hidden');
}
