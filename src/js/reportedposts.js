document.addEventListener('DOMContentLoaded', async () => {
    const reportedPostsContainer = document.getElementById('reportedPostsContainer');

    try {
        const response = await fetch('http://localhost:3000/postReports');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const postReports = await response.json();

        reportedPostsContainer.innerHTML = '';
        for (const report of postReports) {
            const postResponse = await fetch(`http://localhost:3000/post/${report.postId}`);
            if (!postResponse.ok) {
                throw new Error('Network response was not ok');
            }
            const post = await postResponse.json();

            const reportHTML = `
                <div class="border p-4 rounded-lg shadow bg-white mb-2" id="post-${report.postId}">
                    <div class="flex justify-between items-center mb-2">
                        <div class="flex items-center gap-2">
                            <img src="../images/account-circle-outline.svg" width="30px" />
                            <a href="#" class="text-blue-500 hover:underline">u:${report.accName}</a>
                            <span class="text-gray-500">${report.postRptCat}</span>
                        </div>
                        <div class="relative">
                            <button class="btn btn-sm bg-white border-0 shadow-none" onclick="toggleDropdown(${report.postId})"><img src="../images/action.svg" width="20px" /></button>
                            <div id="dropdown-${report.postId}" class="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg hidden">
                                <a href="#" class="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition duration-200" onclick="approvePost(${report.postId})">Approve</a>
                                <a href="#" class="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition duration-200" onclick="muteUser('${report.accName}', '${report.postRptDesc}', 'admin', ${report.postId})">Mute</a>
                                <a href="#" class="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition duration-200" onclick="banUser('${report.accName}', '${report.postRptDesc}', 'admin', ${report.postId})">Ban</a>
                            </div>
                        </div>
                    </div>
                    <p class="font-bold text-lg mb-2">${post.postName}</p>
                    <p>${post.postDesc}</p>
                    <p class="text-gray-500">${report.postRptDesc}</p>
                </div>
            `;
            reportedPostsContainer.insertAdjacentHTML('beforeend', reportHTML);
        }
    } catch (error) {
        console.error('Error fetching reported posts:', error);
    }
});

function toggleDropdown(postId) {
    const dropdown = document.getElementById(`dropdown-${postId}`);
    dropdown.classList.toggle('hidden');
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
            }
        });
        alert('User banned successfully');
        document.getElementById(`post-${postId}`).remove(); // Remove the post from the page
    } catch (error) {
        console.error('Error banning user:', error);
    }
}
