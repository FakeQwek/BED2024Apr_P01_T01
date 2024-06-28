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
            mutedUsers.forEach(user => {
                const userCard = document.createElement('div');
                userCard.className = 'border p-4 rounded-lg shadow';
                userCard.innerHTML = `
                    <div class="flex justify-between items-center mb-4">
                        <div>
                            <p class="font-bold text-lg">u/${user.accName}</p>
                            <p class="text-sm text-gray-500">${user.muteDate || 'N/A'}</p>
                        </div>
                        <div class="text-sm text-gray-500">muted by: u/${user.mutedBy || 'Unknown'}</div>
                    </div>
                    <p class="font-bold">Reason for mute</p>
                    <p>${user.reason || 'No reason provided'}</p>
                    <div class="mt-4 text-right">
                        <button class="btn btn-sm btn-outline" data-username="${user.accName}">unmute</button>
                    </div>
                `;
                container.appendChild(userCard);
            });

            const unmuteButtons = container.querySelectorAll('.btn-outline');
            unmuteButtons.forEach(button => {
                button.addEventListener('click', async (event) => {
                    const accName = event.target.getAttribute('data-username');
                    try {
                        const response = await fetch(`http://localhost:3000/accounts/unmute/${accName}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        });
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
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

document.addEventListener('DOMContentLoaded', fetchMutedUsers);
