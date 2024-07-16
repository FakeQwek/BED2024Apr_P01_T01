

const searchButton = document.getElementById("search-button");
const searchBox = document.getElementById("search-box");
const userBox = document.getElementById("user-box");
const muteBox = document.getElementById("mute-box");
const unmuteBox = document.getElementById("unmute-box");
const cancel = document.getElementById("cancel");
const confirm = document.getElementById("confirm");
const mutedPage = document.getElementById("muted-button");
const bannedPage = document.getElementById("banned-button");
const reportedPostPage = document.getElementById("reported-button");

var selection = "none";
var data = [];
mutedUsers = [];


getMutedUsers();
addPopupListeners();

searchButton.addEventListener("click", function(e) {
    query = searchBox.value;
    mutedUsers = [];
    getMutedUsersByName(query);
})

mutedPage.addEventListener("click", function(e) {
    window.location.href= "./siteadmin-mutedusers.html";
})

bannedPage.addEventListener("click", function(e) {
    window.location.href= "./siteadmin-bannedusers.html";
})

reportedPostPage.addEventListener("click", function(e) {
    window.location.href= "./siteadmin-reportedposts.html";
})


function populateUsers(mutedUsers) {
    userBox.innerHTML = "";
    length = mutedUsers.length;
    if (length == 0) {
        userBox.insertAdjacentHTML("beforeEnd",`
            <div class = "bg-white w-70per m-auto rounded-xl flex justify-center">No more Muted Users</div>
            `)
    }
    for (i = 0; i < length; i++ ) {
        currentUser = mutedUsers[i];
        userBox.insertAdjacentHTML("beforeend", `
            <div class="bg-white rounded-xl w-90per mt-4 h-12 flex flex-row items-center user" id="${currentUser["accId"]},${currentUser["accName"]}">
                <img src="../images/account-circle-outline.svg" width="40px" height="40px" class="ml-4">
                <p class="ml-4"><b>u:${currentUser["accName"]}</b></p>
            </div>`)
    }
    addUserListeners();
}

async function getMutedUsers() {
    response = await fetch("http://localhost:3000/siteadmin/mutedusers")
    .then(response => {
        if(!response.ok) {
            throw new Error('Response invalid!');
        }
        return response.json();
    })
    .then(mutedUserData => {
       
        for(i = 0; i < mutedUserData.length; i++) 
        {
            mutedUsers.push(mutedUserData[i]);
        }
        console.log(mutedUsers);
        
        populateUsers(mutedUsers);
    })
    .catch(error => {
        console.error("Error:", error);
    }); 

}

async function getMutedUsersByName(accName) {
    response = await fetch(`http://localhost:3000/siteadmin/mutedusers/${accName}`)
    .then(response => {
        if(!response.ok) {
            throw new Error('Response invalid!');
        }
        return response.json();
    })
    .then(mutedUserData => {
       
        for(i = 0; i < mutedUserData.length; i++) 
        {
            mutedUsers.push(mutedUserData[i]);
        }
        console.log(mutedUsers);
        
        populateUsers(mutedUsers);
    })
    .catch(error => {
        console.error("Error:", error);
    }); 

}


async function unmuteUser(accId) {
    const response = await fetch(`http://localhost:3000/siteadmin/unmute/${accId}`, {
        method: "PUT",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            'Content-type': "application/json",
        },
        redirect: "follow",
        referrerPolicy: "no-referrer"
    });
    

}

function addUserListeners() {
    const users = document.getElementsByClassName('user');
    const popup = document.getElementById("popup");
    const background = document.getElementById("background");
    const namebox = document.getElementById("name-box");
    console.log("active");
    for (i = 0; i < users.length; i++) {
        
        users[i].addEventListener("click", function(e) {
            console.log("clicked");
            values = event.currentTarget.id.split(",");
            accId = values[0];
            accName = values[1];
            popup.style.visibility = "visible";
            background.style.visibility = "visible";
            namebox.innerHTML = `<b>u:${accName}</b>`;
            data = [];
            data.push(accId);
            data.push(accName);
        })
    }
}

function addPopupListeners() {
    muteBox.addEventListener("click", function(e) {
        muteBox.style.backgroundColor = "lightgray";
        unmuteBox.style.backgroundColor = "white";
        selection = "mute";

    });
    unmuteBox.addEventListener('click', function(e) {
        unmuteBox.style.backgroundColor = "lightgray";
        muteBox.style.backgroundColor = "white";
        selection = "unmute";
    });
    cancel.addEventListener('click', function(e) {
        popup.style.visibility = "hidden";
        background.style.visibility = "hidden";
    });
    confirm.addEventListener('click', function(e) {
        accId = data[0];
        accName = data[1];
        console.log(accId + " " + accName + "Confirmed selection");
        if (selection == "unmute") {
            unmuteUser(accId);
            alert("User unmuted!");
        }
        window.location.reload();
    })

}





