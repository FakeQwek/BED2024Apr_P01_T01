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

async function fetchMuteInfo(accName) {
    try {
        const response = await fetch(`http://localhost:3000/muteinfo/${accName}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const muteInfo = await response.json();
        return muteInfo.length > 0 ? muteInfo[0] : {};
    } catch (error) {
        console.error('Error fetching mute info:', error);
        return {};
    }
}

async function fetchMutedUsers() {
    try {
        const response = await fetch('http://localhost:3000/mutedaccounts');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const mutedUsers = await response.json();
        const container = document.getElementById('mutedUsersContainer');
        container.innerHTML = '';
        if (mutedUsers.length === 0) {
            container.innerHTML = '<div class="text-center text-gray-500">No muted users available</div>';
        } else {
            for (const user of mutedUsers) {
                // Fetch mute info for each user
                const muteInfo = await fetchMuteInfo(user.accName);
                const userCard = document.createElement('div');
                userCard.className = 'border p-4 rounded-lg shadow';
                userCard.innerHTML = `
                    <div class="flex justify-between items-center mb-4">
                        <div>
                            <p class="font-bold text-lg">u:${user.accName}</p>
                            <p class="text-sm text-gray-500">Muted on: ${muteInfo.muteDate ? new Date(muteInfo.muteDate).toLocaleDateString() : 'N/A'}</p>
                        </div>
                        <div class="text-sm text-gray-500">Muted by: u:${muteInfo.mutedBy || 'Unknown'}</div>
                    </div>
                    <p class="font-bold">Reason for mute</p>
                    <p>${muteInfo.muteReason || 'No reason provided'}</p>
                    <div class="mt-4 text-right">
                        <button class="btn btn-sm btn-outline" data-username="${user.accName}">unmute</button>
                    </div>
                `;
                container.appendChild(userCard);
            }

            // Attach event listeners to unmute buttons
            const unmuteButtons = container.querySelectorAll('.btn-outline');
            unmuteButtons.forEach(button => {
                button.addEventListener('click', async (event) => {
                    const accName = event.target.getAttribute('data-username');
                    try {
                        const unmuteResponse = await fetch(`http://localhost:3000/accounts/unmute/${accName}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        });
                        if (!unmuteResponse.ok) {
                            throw new Error('Network response was not ok');
                        }

                        // Remove mute info
                        const removeMuteInfoResponse = await fetch(`http://localhost:3000/muteinfo/${accName}`, {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        });
                        if (!removeMuteInfoResponse.ok) {
                            throw new Error('Failed to remove mute info');
                        }

                        alert(`User ${accName} has been unmuted.`);
                        fetchMutedUsers(); // Refresh the list after unmuting
                    } catch (error) {
                        console.error('Error unmuting user:', error);
                    }
                });
            });
        }
    } catch (error) {
        console.error('Error fetching muted users:', error);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const discussionName = 'TechTalk'; // Replace with the dynamic discussion name as needed
    await fetchDiscussionDetails(discussionName);
    fetchMutedUsers();
});
