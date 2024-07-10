const popupButton = document.getElementById('popupButton');
const popupDialog = document.getElementById('popupDialog');
const editDetailsButton = document.getElementById('editDetailsButton');
const editDialog = document.getElementById('editDialog');
const cancelEditButton = document.getElementById('cancelEditButton');
const saveEditButton = document.getElementById('saveEditButton');
const editDiscussionDetailInput = document.getElementById('editDiscussionDetailInput');
const postListElement = document.getElementById('postList');
const promoteUserDialog = document.getElementById('promoteUserDialog');
const savePromoteButton = document.getElementById('savePromoteButton');
const cancelPromoteButton = document.getElementById('cancelPromoteButton');

document.addEventListener('DOMContentLoaded', async () => {
    const discussionNameElement = document.getElementById('discussionName');
    const discussionBannerDescElement = document.getElementById('discussionBannerDesc');
    const ownersListElement = document.getElementById('ownersList');
    const adminsListElement = document.getElementById('adminsList');

    try {
        const response = await fetch('http://localhost:3000/discussions/d:Social');
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
        
        // Fetch unapproved posts
        const postsResponse = await fetch(`http://localhost:3000/unapprovedposts/${encodeURIComponent(discussion.dscName)}`);
        if (!postsResponse.ok) {
            throw new Error('Network response was not ok');
        }
        const posts = await postsResponse.json();
        
        postListElement.innerHTML = '';
        posts.forEach(post => {
            const postHTML = `
                <div class="border p-4 rounded-lg shadow bg-white mb-2">
                    <div class="flex justify-between items-center mb-2">
                        <div class="flex items-center gap-2">
                            <img src="../images/account-circle-outline.svg" width="30px" />
                            <a href="#" class="text-blue-500 hover:underline" onclick="handleUserClick('${post.accName}')">u:${post.accName}</a>
                        </div>
                        <div class="relative">
                            <button class="btn btn-sm bg-white border-0 shadow-none" onclick="toggleDropdown(${post.postId})"><img src="../images/action.svg" width="20px" /></button>
                            <div id="dropdown-${post.postId}" class="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg hidden transition ease-in-out duration-300">
                                <a href="#" class="block px-4 py-2 text-gray-800 hover:bg-gray-100" onclick="approvePost(${post.postId})">Approve</a>
                                <a href="#" class="block px-4 py-2 text-gray-800 hover:bg-gray-100" onclick="muteUser('${post.accName}', '${post.postDesc}', 'admin', ${post.postId})">Mute</a>
                                <a href="#" class="block px-4 py-2 text-gray-800 hover:bg-gray-100" onclick="banUser('${post.accName}', '${post.postDesc}', 'admin', ${post.postId})">Ban</a>
                            </div>
                        </div>
                    </div>
                    <p class="font-bold text-lg mb-2">${post.postName}</p>
                    <p>${post.postDesc}</p>
                </div>
            `;
            postListElement.insertAdjacentHTML('beforeend', postHTML);
        });
    } catch (error) {
        console.error('Error fetching discussion details or posts:', error);
    }
});

popupButton.addEventListener('click', () => {
    popupDialog.showModal();
});

editDetailsButton.addEventListener('click', () => {
    popupDialog.close();
    editDialog.showModal();
});

cancelEditButton.addEventListener('click', () => {
    editDialog.close();
    popupDialog.showModal();
});

saveEditButton.addEventListener('click', async () => {
    const newDetails = editDiscussionDetailInput.value;
    try {
        const response = await fetch('http://localhost:3000/discussions/d:Social', {
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

window.addEventListener('click', (event) => {
    if (event.target === popupDialog) {
        popupDialog.close();
    }
    if (event.target === editDialog) {
        editDialog.close();
    }
    if (event.target === promoteUserDialog) {
        promoteUserDialog.close();
    }
});

function handleUserClick(accName) {
    const promoteUserDialog = document.getElementById('promoteUserDialog');
    const promoteUsername = document.getElementById('promoteUsername');
    promoteUsername.innerText = `u:${accName}`;
    promoteUserDialog.showModal();
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
        location.reload(); // Reload the page to reflect changes
    } catch (error) {
        console.error('Error approving post:', error);
    }
}

async function muteUser(accName, muteReason, mutedBy, postId) {
    try {
        const response = await fetch(`http://localhost:3000/accounts/mute/${accName}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ muteReason: muteReason, mutedBy: mutedBy })
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        alert('User muted successfully');
        document.getElementById(`post-${postId}`).remove(); // Remove the post from the page
    } catch (error) {
        console.error('Error muting user:', error);
    }
}

async function banUser(accName, banReason, bannedBy, postId) {
    try {
        const response = await fetch(`http://localhost:3000/accounts/ban/${accName}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ banReason: banReason, bannedBy: bannedBy })
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
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

// Event listeners for the promote user dialog buttons
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
