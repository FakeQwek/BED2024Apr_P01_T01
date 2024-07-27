document.addEventListener('DOMContentLoaded', async () => {
    const discussionNameElement = document.getElementById('discussionName');
    const discussionBannerDescElement = document.getElementById('discussionBannerDesc');
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const discussionName = urlParams.get("discussionName");

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

    async function fetchDiscussionDetails(discussionName) {
        try {
            const response = await fetch(`http://localhost:3000/discussions/${encodeURIComponent(discussionName)}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const discussion = await response.json();

            discussionNameElement.innerText = "d:" + discussion.dscName;
            discussionBannerDescElement.innerHTML = `<p>${discussion.dscDesc}</p>`;
        } catch (error) {
            console.error('Error fetching discussion details:', error);
        }
    }

    async function fetchBanInfo(accName, dscName) {
        try {
            const response = await fetch(`http://localhost:3000/baninfo/${accName}/${dscName}`);
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

    async function fetchBannedUsers(dscName) {
        try {
            const response = await fetch(`http://localhost:3000/bannedaccount/${encodeURIComponent(dscName)}`);
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
                    const banInfo = await fetchBanInfo(user.accName, dscName);
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

                const unbanButtons = container.querySelectorAll('.btn-outline');
                unbanButtons.forEach(button => {
                    button.addEventListener('click', async (event) => {
                        const accName = event.target.getAttribute('data-username');
                        try {
                            const unbanResponse = await fetch(`http://localhost:3000/account/unban/${accName}/${dscName}`, {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            });
                            if (!unbanResponse.ok) {
                                throw new Error('Network response was not ok');
                            }

                            const removeBanInfoResponse = await fetch(`http://localhost:3000/baninfo/${accName}/${dscName}`, {
                                method: 'DELETE',
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            });
                            if (!removeBanInfoResponse.ok) {
                                throw new Error('Failed to remove ban info');
                            }

                            alert(`User ${accName} has been unbanned.`);
                            fetchBannedUsers(dscName);
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

    await fetchDiscussionDetails(discussionName);
    fetchBannedUsers(discussionName);
});

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const discussionName = urlParams.get("discussionName");

function goToReportedPosts() {
    window.location.href = `reportedposts.html?discussionName=${discussionName}`;
}

function goToMutedUsers() {
    window.location.href = `mutedusers.html?discussionName=${discussionName}`;
}
