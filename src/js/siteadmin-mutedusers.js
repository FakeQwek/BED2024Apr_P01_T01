const searchButton = document.getElementById("search-button");
const searchBox = document.getElementById("search-box");
const userBox = document.getElementById("user-box");
const muteBox = document.getElementById("mute-box");
const unmuteBox = document.getElementById("unmute-box");
const cancel = document.getElementById("cancel");
const confirm = document.getElementById("confirm");
var selection = "none";
var data = [];
mutedUsers = [];


getMutedUsers();
addPopupListeners();

searchButton.addEventListener("click", function(e) {
    query = searchBox.value;
})

function populateUsers(mutedUsers) {
    for (i = 0; i < mutedUsers.length; i++ ) {
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

async function unmuteUser() {
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

function addUserListeners() {
    const users = document.getElementsByClassName('user');
    const popup = document.getElementById("popup");
    const background = document.getElementById("background");
    const namebox = document.getElementById("name-box");
    console.log("active");
    for (i = 0; i < users.length; i++) {
        
        users[i].addEventListener("click", function(e) {
            console.log("clicked");
            values = event.target.id.split(",");
            accId = values[0];
            accName = values[1];
            popup.style.visibility = "visible";
            background.style.visibility = "visible";
            namebox.innerHTML = `<b>u:${accName}</b>`;
            data.push(accId);
            data.push(accName);
        })
    }
}

function addPopupListeners() {
    muteBox.addEventListener("click", function(e) {
        muteBox.style.backgroundColor = "lightgray";
        selection = "mute";

    });
    unmuteBox.addEventListener('click', function(e) {
        unmuteBox.style.backgroundColor = "lightgray";
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

        }
    })

}





