async function fetchDiscussionDetails(discussionName) {
    const discussionNameElement = document.getElementById('discussionName');
    const discussionBannerDescElement = document.getElementById('discussionBannerDesc');
    const adminsListElement = document.getElementById('adminsList');

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
}

async function fetchBanInfo(accName) {
    try {
        const response = await fetch(`http://localhost:3000/baninfo/${accName}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const banInfo = await response.json();
        return banInfo.length > 0 ? banInfo[0] : {};
    } catch (error) {
        console.error('Error fetching ban info:', error);
        return {};
    }
}

async function fetchBannedUsers() {
    try {
        const response = await fetch('http://localhost:3000/bannedaccounts');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const bannedUsers = await response.json();
        const container = document.getElementById('bannedUsersContainer');
        container.innerHTML = '';
        if (bannedUsers.length === 0) {
            container.innerHTML = '<div class="text-center text-gray-500">No banned users available</div>';
        } else {
            for (const user of bannedUsers) {
                // Fetch ban info for each user
                const banInfo = await fetchBanInfo(user.accName);
                const userCard = document.createElement('div');
                userCard.className = 'border p-4 rounded-lg shadow';
                userCard.innerHTML = `
                    <div class="flex justify-between items-center mb-4">
                        <div>
                            <p class="font-bold text-lg">u:${user.accName}</p>
                            <p class="text-sm text-gray-500">Banned on: ${banInfo.banDate ? new Date(banInfo.banDate).toLocaleDateString() : 'N/A'}</p>
                        </div>
                        <div class="text-sm text-gray-500">Banned by: u:${banInfo.bannedBy || 'Unknown'}</div>
                    </div>
                    <p class="font-bold">Reason for ban</p>
                    <p>${banInfo.banReason || 'No reason provided'}</p>
                    <div class="mt-4 text-right">
                        <button class="btn btn-sm btn-outline" data-username="${user.accName}">unban</button>
                    </div>
                `;
                container.appendChild(userCard);
            }

            // Attach event listeners to unban buttons
            const unbanButtons = container.querySelectorAll('.btn-outline');
            unbanButtons.forEach(button => {
                button.addEventListener('click', async (event) => {
                    const accName = event.target.getAttribute('data-username');
                    try {
                        const unbanResponse = await fetch(`http://localhost:3000/accounts/unban/${accName}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        });
                        if (!unbanResponse.ok) {
                            throw new Error('Network response was not ok');
                        }

                        // Remove ban info
                        const removeBanInfoResponse = await fetch(`http://localhost:3000/baninfo/${accName}`, {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        });
                        if (!removeBanInfoResponse.ok) {
                            throw new Error('Failed to remove ban info');
                        }

                        alert(`User ${accName} has been unbanned.`);
                        fetchBannedUsers(); // Refresh the list after unbanning
                    } catch (error) {
                        console.error('Error unbanning user:', error);
                    }
                });
            });
        }
    } catch (error) {
        console.error('Error fetching banned users:', error);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const discussionName = 'TechTalk'; // Replace with the dynamic discussion name as needed
    await fetchDiscussionDetails(discussionName);
    fetchBannedUsers();
});
