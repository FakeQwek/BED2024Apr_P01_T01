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
            bannedUsers.forEach(user => {
                const userCard = document.createElement('div');
                userCard.className = 'border p-4 rounded-lg shadow';
                userCard.innerHTML = `
                    <div class="flex justify-between items-center mb-4">
                        <div>
                            <p class="font-bold text-lg">u/${user.accName}</p>
                            <p class="text-sm text-gray-500">${user.banDate || 'N/A'}</p>
                        </div>
                        <div class="text-sm text-gray-500">banned by: u/${user.bannedBy || 'Unknown'}</div>
                    </div>
                    <p class="font-bold">Reason for ban</p>
                    <p>${user.reason || 'No reason provided'}</p>
                    <div class="mt-4 text-right">
                        <button class="btn btn-sm btn-outline" data-username="${user.accName}">unban</button>
                    </div>
                `;
                container.appendChild(userCard);
            });

            const unbanButtons = container.querySelectorAll('.btn-outline');
            unbanButtons.forEach(button => {
                button.addEventListener('click', async (event) => {
                    const accName = event.target.getAttribute('data-username');
                    try {
                        const response = await fetch(`http://localhost:3000/accounts/unban/${accName}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        });
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
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

document.addEventListener('DOMContentLoaded', fetchBannedUsers);
