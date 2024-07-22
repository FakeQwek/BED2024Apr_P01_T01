const returnButton = document.getElementById("contact-button");
const homeButton = document.getElementById("home-button");

returnButton.addEventListener("click", function(e) {
    window.location.href = "./contact-us.html";
})
homeButton.addEventListener("click", function(e) {
    window.location.href = "./index.html";
})