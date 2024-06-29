const popupButton = document.getElementById('popupButton');
const popupDialog = document.getElementById('popupDialog');
const cancelButton = document.getElementById('cancelButton');
const editDetailsButton = document.getElementById('editDetailsButton');
const editDialog = document.getElementById('editDialog');
const cancelEditButton = document.getElementById('cancelEditButton');
const saveEditButton = document.getElementById('saveEditButton');
const editDiscussionDetailInput = document.getElementById('editDiscussionDetailInput');
const postListElement = document.getElementById('postList');

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
        ownersListElement.innerHTML = `
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
                        <div>
                            <button class="btn btn-sm bg-white border-0 shadow-none" onclick="approvePost('${post.postId}')"><img src="../images/tick.svg" width="20px" /></button>
                            <button class="btn btn-sm bg-white border-0 shadow-none" onclick="reportPost('${post.postId}', '${post.accName}')"><img src="../images/cross.svg" width="20px" /></button>
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
});

function handleUserClick(accName) {
    alert(`User ${accName} clicked!`);
    // Implement further actions here
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

async function reportPost(postId, accName) {
    try {
        const response = await fetch('http://localhost:3000/postReport', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                postRptCat: 'Mod',
                postRptDesc: 'Mod unapproved',
                accName: accName,
                postId: postId
            })
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        alert('Post reported successfully');
        location.reload(); // Reload the page to reflect changes
    } catch (error) {
        console.error('Error reporting post:', error);
    }
}
