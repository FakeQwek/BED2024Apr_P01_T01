const discussionName = document.getElementById("discussionName");

async function createDiscussion() {
    await fetch("http://localhost:3000/discussion", {
        method: "POST",
        body: JSON.stringify({
            dscName: discussionName.value,
            dscDesc: "",
            ownerId: "1"
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });
};