const searchButton = document.getElementById("search-button");
const searchBox = document.getElementById("search-box");
const userBox = document.getElementById("user-box");
const banBox = document.getElementById("ban-box");
const unbanBox = document.getElementById("unban-box");
const cancel = document.getElementById("cancel");
const confirm = document.getElementById("confirm");
const mutedPage = document.getElementById("muted-button");
const bannedPage = document.getElementById("banned-button");
const reportedPostPage = document.getElementById("reported-button");
const discussionPage = document.getElementById("discussion-button");


var selection = "none";
var data = [];
var bannedUsers = [];


getBannedUsers();
addPopupListeners();

//Tries to get all users by name after clicking search button
searchButton.addEventListener("click", function(e) {
    query = searchBox.value;
    bannedUsers = [];
    getBannedUsersByName(query);
})

//Links to muted users page
mutedPage.addEventListener("click", function(e) {
    window.location.href= "./siteadmin-mutedusers.html";
})

//Links to banned users page
bannedPage.addEventListener("click", function(e) {
    window.location.href= "./siteadmin-bannedusers.html";
})

//Links to reported posts page
reportedPostPage.addEventListener("click", function(e) {
    window.location.href= "./siteadmin-reportedposts.html";
})

//Links to reported discussions page
discussionPage.addEventListener("click", function(e) {
    window.location.href= "./siteadmin.html";
})

//Populates each banned user in the html
function populateUsers(bannedUsers) {
    userBox.innerHTML = "";
    length = bannedUsers.length;
    //If there are no banned users left 'No more banned users' is displayed
    if (length == 0) {
        userBox.insertAdjacentHTML("beforeEnd",`
            <div class = "bg-white w-70per m-auto rounded-xl flex justify-center">No more Banned Users</div>
            `)
    }
    for (i = 0; i < length; i++ ) {
        currentUser = bannedUsers[i];
        userBox.insertAdjacentHTML("beforeend", `
            <div class="bg-white rounded-xl w-90per mt-4 h-12 flex flex-row items-center user" id="${currentUser["accId"]},${currentUser["accName"]}">
                <img src="../images/account-circle-outline.svg" width="40px" height="40px" class="ml-4">
                <p class="ml-4"><b>u:${currentUser["accName"]}</b></p>
            </div>`)
    }
    addUserListeners();
}

//Get banned users from the local database
async function getBannedUsers() {
    response = await fetch("http://localhost:3000/siteadmin/bannedusers")
    .then(response => {
        if(!response.ok) {
            throw new Error('Response invalid!');
        }
        return response.json();
    })
    .then(bannedUserData => {
       
        for(i = 0; i < bannedUserData.length; i++) 
        {
            bannedUsers.push(bannedUserData[i]);
        }
        console.log(bannedUsers);
        
        populateUsers(bannedUsers);
    })
    .catch(error => {
        console.error("Error:", error);
    }); 

}

//Get all banned users by name
async function getBannedUsersByName(accName) {
    console.log(accName);
    response = await fetch(`http://localhost:3000/siteadmin/bannedusers/${accName}`)
    .then(response => {
        if(!response.ok) {
            throw new Error('Response invalid!');
        }
        return response.json();
    })
    .then(bannedUserData => {
       
        for(i = 0; i < bannedUserData.length; i++) 
        {
            bannedUsers.push(bannedUserData[i]);
        }
        console.log(bannedUsers);
        
        populateUsers(bannedUsers);
    })
    .catch(error => {
        console.error("Error:", error);
    }); 

}


//Unbans user
async function unbanUser(accId) {
    const response = await fetch(`http://localhost:3000/siteadmin/unban/${accId}`, {
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


//Add banned user listeners to open popup
function addUserListeners() {
    const users = document.getElementsByClassName('user');
    const popup = document.getElementById("popup");
    const background = document.getElementById("background");
    const namebox = document.getElementById("name-box");
    console.log("active");
    //Assigns respective user data for each banned user
    for (i = 0; i < users.length; i++) {
        
        users[i].addEventListener("click", function(e) {
            console.log("clicked");
            values = event.currentTarget.id.split(",");
            accId = values[0];
            accName = values[1];
            //Makes popup visible
            popup.style.visibility = "visible";
            background.style.visibility = "visible";
            namebox.innerHTML = `<b>u:${accName}</b>`;
            data = [];
            data.push(accId);
            data.push(accName);
        })
    }
}

//Adds event listeners to popups
function addPopupListeners() {
    //Allows selection between ban/unban options
    banBox.addEventListener("click", function(e) {
        banBox.style.backgroundColor = "lightgray";
        unbanBox.style.backgroundColor = "white";
        selection = "ban";

    });
    unbanBox.addEventListener('click', function(e) {
        unbanBox.style.backgroundColor = "lightgray";
        banBox.style.backgroundColor = "white";
        selection = "unban";
    });
    //Close popup
    cancel.addEventListener('click', function(e) {
        popup.style.visibility = "hidden";
        background.style.visibility = "hidden";
    });
    //Unbans selected user
    confirm.addEventListener('click', function(e) {
        accId = data[0];
        accName = data[1];
        console.log(accId + " " + accName + "Confirmed selection");
        if (selection == "unban") {
            unbanUser(accId);
            alert("User unbanned!");
        }
        window.location.reload();
    })

}





