
const popupButton = document.getElementById('popupButton');
const popupDialog = document.getElementById('popupDialog');
const cancelButton = document.getElementById('cancelButton');

popupButton.addEventListener('click', () => {
    popupDialog.showModal();
});

cancelButton.addEventListener('click', () => {
    popupDialog.close();
});

window.addEventListener('click', (event) => {
    if (event.target === popupDialog) {
        popupDialog.close();
    }
});
