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
const promoteUsername = document.getElementById('promoteUsername');

document.addEventListener('DOMContentLoaded', async () => {
    const discussionNameElement = document.getElementById('discussionName');
    const discussionBannerDescElement = document.getElementById('discussionBannerDesc');
    const ownersListElement = document.getElementById('ownersList');
    const adminsListElement = document.getElementById('adminsList');
    const discussionName = 'BookClub'; // Replace with the dynamic discussion name as needed

    // Role Verification Logic
    const token = localStorage.getItem('token'); // Assume token is stored in localStorage
    let isAdmin = false;
    let isMember = false;

    try {
        const adminResponse = await fetch(`/api/discussions/${discussionName}/admin`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (adminResponse.ok) {
            isAdmin = true;
        } else {
            const memberResponse = await fetch(`/api/discussions/${discussionName}/member`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (memberResponse.ok) {
                isMember = true;
            }
        }

        if (!isAdmin && !isMember) {
            throw new Error('Access denied');
        }

        // Fetch Discussion Details
        const response = await fetch(`http://localhost:3000/discussions/${encodeURIComponent(discussionName)}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const discussion = await response.json();

        discussionNameElement.innerText = discussion.dscName;
        discussionBannerDescElement.innerHTML = `<p>${discussion.dscDesc}</p>`;
        ownersListElement.innerHTML = `
            <div class="flex items-center">
                <img src="../images/account-circle-outline.svg" width="30px" />
                <a href="#" class="ml-2 text-blue-500 hover:underline" onclick="handleUserClick('${discussion.accName}')">u:${discussion.accName}</a>
            </div>`;
        
        // Fetch and display admins
        try {
            const response = await fetch(`http://localhost:3000/admins/${encodeURIComponent(discussionName)}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const admins = await response.json();
            adminsListElement.innerHTML = admins.map(admin => 
                `<div class="flex items-center">
                    <img src="../images/account-circle-outline.svg" width="30px" />
                    <a href="#" class="ml-2 text-blue-500 hover:underline" onclick="handleUserClick('${admin.AccName}')">u:${admin.AccName}</a>
                </div>`
            ).join('');
        } catch (error) {
            console.error('Error fetching admins:', error);
        }

        // Fetch approved posts
        const postsResponse = await fetch(`http://localhost:3000/approvedposts/${encodeURIComponent(discussion.dscName)}`);
        if (!postsResponse.ok) {
            throw new Error('Network response was not ok');
        }
        const posts = await postsResponse.json();
        
        postListElement.innerHTML = '';
        posts.forEach(post => {
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
                                <a href="#" class="block px-4 py-2 text-gray-800 hover:bg-gray-100" data-mute-user data-acc-name="${post.OwnerID}" data-post-desc="${post.PostDesc}">Mute</a>
                                <a href="#" class="block px-4 py-2 text-gray-800 hover:bg-gray-100" data-ban-user data-acc-name="${post.OwnerID}" data-post-desc="${post.PostDesc}">Ban</a>
                            </div>
                        </div>
                    </div>
                    <p class="font-bold text-lg mb-2">${post.PostName}</p>
                    <p>${post.PostDesc}</p>
                </div>
            `;
            postListElement.insertAdjacentHTML('beforeend', postHTML);
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
        postListElement.addEventListener('click', async (event) => {
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
                await muteUser(accName, postDesc, 'admin', muteButton.dataset.postId);
                return;
            }

            const banButton = event.target.closest('[data-ban-user]');
            if (banButton) {
                const accName = banButton.getAttribute('data-acc-name');
                const postDesc = banButton.getAttribute('data-post-desc');
                await banUser(accName, postDesc, 'admin', banButton.dataset.postId);
                return;
            }
        });
    } catch (error) {
        console.error('Error fetching discussion details or posts:', error);
    }
});

async function fetchAdmins(dscName) {
    try {
        const response = await fetch(`http://localhost:3000/admins/${encodeURIComponent(dscName)}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const admins = await response.json();
        adminsListElement.innerHTML = admins.map(admin => `
            <div class="flex items-center">
                <img src="../images/account-circle-outline.svg" width="30px" />
                <a href="#" class="ml-2 text-blue-500 hover:underline" onclick="handleUserClick('${admin.AccName}')">u:${admin.AccName}</a>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error fetching admins:', error);
    }
}

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
        const response = await fetch(`http://localhost:3000/discussion/${encodeURIComponent(dscName)}`, {
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
            },
            body: JSON.stringify({ banReason: banReason, bannedBy: bannedBy })
        });
        alert('User banned successfully');
        document.getElementById(`post-${postId}`).remove(); // Remove the post from the page
    } catch (error) {
        console.error('Error banning user:', error);
    }
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
