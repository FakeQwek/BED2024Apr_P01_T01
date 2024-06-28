const popupButton = document.getElementById('popupButton');
const popupDialog = document.getElementById('popupDialog');
const cancelButton = document.getElementById('cancelButton');
const editDetailsButton = document.getElementById('editDetailsButton');
const editDialog = document.getElementById('editDialog');
const cancelEditButton = document.getElementById('cancelEditButton');

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

window.addEventListener('click', (event) => {
    if (event.target === popupDialog) {
        popupDialog.close();
    }
    if (event.target === editDialog) {
        editDialog.close();
    }
});
