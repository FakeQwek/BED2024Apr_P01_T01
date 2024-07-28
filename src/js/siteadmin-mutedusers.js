

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
const discussionPage = document.getElementById("discussion-button");
const sidebar = document.getElementById("sidebar");

var selection = "none";
var data = [];
mutedUsers = [];


getMutedUsers();
addPopupListeners();

//Allows user to search for muted users
searchButton.addEventListener("click", function(e) {
    query = searchBox.value;
    mutedUsers = [];
    //Gets muted users after clicking on search button
    getMutedUsersByName(query);
})

//Links to the muted users page
mutedPage.addEventListener("click", function(e) {
    window.location.href= "./siteadmin-mutedusers.html";
})

//Links to the banned users page
bannedPage.addEventListener("click", function(e) {
    window.location.href= "./siteadmin-bannedusers.html";
})

//Links to the reported post page
reportedPostPage.addEventListener("click", function(e) {
    window.location.href= "./siteadmin-reportedposts.html";
})

//Links to the reported discussions page
discussionPage.addEventListener("click", function(e) {
    window.location.href= "./siteadmin.html";
})

//Inserts html for each muted user
function populateUsers(mutedUsers) {
    //Clears user box before adding muted users to avoid duplicate muted users
    userBox.innerHTML = "";
    length = mutedUsers.length;
    //If no more muted users are present, displays no more muted users
    if (length == 0) {
        userBox.insertAdjacentHTML("beforeEnd",`
            <div class = "bg-white w-70per m-auto rounded-xl flex justify-center p-2">No more Muted Users</div>
            `)
    }
    //Populates muted users before adding listeners to each user
    for (i = 0; i < length; i++ ) {
        currentUser = mutedUsers[i];
        userBox.insertAdjacentHTML("beforeend", `
            <div class="bg-white rounded-xl w-90per mt-4 h-12 flex flex-row items-center user" id="${currentUser["accName"]}">
                <img src="../images/account-circle-outline.svg" width="40px" height="40px" class="ml-4">
                <p class="ml-4"><b>u:${currentUser["accName"]}</b></p>
            </div>`)
    }
    addUserListeners();
}

//Function gets muted users from local database
async function getMutedUsers() {
    response = await fetch("http://localhost:3000/siteadmin/mutedusers")
    .then(response => {
        if(!response.ok) {
            throw new Error('Response invalid!');
        }
        return response.json();
    })
    .then(mutedUserData => {
        //Pushes muted user data into mutedUsers array
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

//Gets all muted users with name similar to query
async function getMutedUsersByName(accName) {
    response = await fetch(`http://localhost:3000/siteadmin/mutedusers/${accName}`)
    .then(response => {
        if(!response.ok) {
            throw new Error('Response invalid!');
        }
        return response.json();
    })
    .then(mutedUserData => {
       //Pushes muted user data into mutedUsers array
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

//Updates user to be unmuted
async function unmuteUser(accName) {
    const response = await fetch(`http://localhost:3000/siteadmin/unmute/${accName}`, {
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

//Adds listener to each muted user
function addUserListeners() {
    const users = document.getElementsByClassName('user');
    const popup = document.getElementById("popup");
    const background = document.getElementById("background");
    const namebox = document.getElementById("name-box");
    console.log("active");
    //Assigns respective user data to each html element for muted user
    for (i = 0; i < users.length; i++) {
        
        users[i].addEventListener("click", function(e) {
            console.log("clicked");
            accName = event.currentTarget.id;
            //Makes popup visible after clicking
            popup.style.visibility = "visible";
            background.style.visibility = "visible";
            sidebar.classList.remove('z-20');
            //Assigns name in popup
            namebox.innerHTML = `<b>u:${accName}</b>`;
            data = [];
        
            data.push(accName);
        })
    }
}

//Adds event listeners to popup
function addPopupListeners() {
    //Event listeners allow for selection of either mute or unmute
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

    //Hides popup
    cancel.addEventListener('click', function(e) {
        popup.style.visibility = "hidden";
        background.style.visibility = "hidden";
    });
    //Unmutes user if unmute is selected
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





