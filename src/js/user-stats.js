

userStats = [];
discussionStats = [];
discussionType = [];
userType = [];

//Triggers all the count functions to retreive and populate the user chart
getCountOfUsers();
getCountOfAdmins();
getCountOfUsersBanned();
getCountOfUsersMuted();
getCountOfComments();

//Triggers all the count functions to retreive and populate the discussion chart
getCountOfPosts();
getCountOfDiscussion();
getDiscussionAdminCount();
getCountOfPostReports();
getDiscussionReportCount();

//Triggers the type function to retrieve and populate the discussion type chart
getTypeOfDiscussions();


async function getCountOfUsers() {
    response = await fetch("http://localhost:3000/statistics/usercount")
    .then(response => {
        if(!response.ok){
            throw new Error('Response invalid!');
        }
        return response.json();
    })
    .then(countData => {
        
        userStats.push(["usercount", countData[0]["count"]]);
        if (userStats.length > 4) {
            populateUserChart(userStats);
        }
    })
    .catch(error => {
        console.error("Error:", error);
    });  
}

async function getCountOfUsersBanned() {
    response = await fetch("http://localhost:3000/statistics/bancount")
    .then(response => {
        if(!response.ok){
            throw new Error('Response invalid!');
        }
        return response.json();
    })
    .then(countData => {
        
        
        console.log(countData); 
        userStats.push(["bannedcount", countData[0]["count"]]);
        if (userStats.length > 4) {
            populateUserChart(userStats);
        }
    })
    .catch(error => {
        console.error("Error:", error);
    });  
}

async function getCountOfUsersMuted() {
    response = await fetch("http://localhost:3000/statistics/mutedcount")
    .then(response => {
        if(!response.ok){
            throw new Error('Response invalid!');
        }
        return response.json();
    })
    .then(countData => {
        
        
        console.log(countData); 
        userStats.push(["mutedcount", countData[0]["count"]]);
        if (userStats.length > 4) {
            populateUserChart(userStats);
        }
    })
    .catch(error => {
        console.error("Error:", error);
    });  
}

async function getCountOfAdmins() {
    response = await fetch("http://localhost:3000/statistics/admincount")
    .then(response => {
        if(!response.ok){
            throw new Error('Response invalid!');
        }
        return response.json();
    })
    .then(countData => {
        
        
        console.log(countData); 
        userStats.push(["admincount", countData[0]["count"]]);
        if (userStats.length > 4) {
            populateUserChart(userStats);
        }
    })
    .catch(error => {
        console.error("Error:", error);
    });  
}

async function getCountOfComments() {
    response = await fetch("http://localhost:3000/statistics/commentcount")
    .then(response => {
        if(!response.ok){
            throw new Error('Response invalid!');
        }
        return response.json();
    })
    .then(countData => {
        
        
        console.log(countData); 
        userStats.push(["commentcount", countData[0]["count"]]);
        if (userStats.length > 4) {
            populateUserChart(userStats);
        }
    })
    .catch(error => {
        console.error("Error:", error);
    });  
}

async function getCountOfDiscussion() {
    response = await fetch("http://localhost:3000/statistics/discussioncount")
    .then(response => {
        if(!response.ok){
            throw new Error('Response invalid!');
        }
        return response.json();
    })
    .then(countData => {
        
        
        console.log(countData); 
        discussionStats.push(["discussioncount", countData[0]["count"]]);
        if (discussionStats.length > 4) {
            populateDiscussionChart(discussionStats);
        }
    })
    .catch(error => {
        console.error("Error:", error);
    });  
}

async function getCountOfPosts() {
    response = await fetch("http://localhost:3000/statistics/postcount")
    .then(response => {
        if(!response.ok){
            throw new Error('Response invalid!');
        }
        return response.json();
    })
    .then(countData => {
        
        
        console.log(countData); 
        discussionStats.push(["postcount", countData[0]["count"]]);
        if (discussionStats.length > 4) {
            populateDiscussionChart(discussionStats);
        }
    })
    .catch(error => {
        console.error("Error:", error);
    });  
}

async function getDiscussionReportCount() {
    response = await fetch("http://localhost:3000/statistics/discussionreportcount")
    .then(response => {
        if(!response.ok){
            throw new Error('Response invalid!');
        }
        return response.json();
    })
    .then(countData => {
        
        
        console.log(countData); 
        discussionStats.push(["discussionreportcount", countData[0]["count"]]);
        if (discussionStats.length > 4) {
            populateDiscussionChart(discussionStats);
        }
    })
    .catch(error => {
        console.error("Error:", error);
    });  
}

async function getDiscussionAdminCount() {
    response = await fetch("http://localhost:3000/statistics/discussionadmincount")
    .then(response => {
        if(!response.ok){
            throw new Error('Response invalid!');
        }
        return response.json();
    })
    .then(countData => {
        
        
        console.log(countData); 
        discussionStats.push(["discussionadmincount", countData[0]["count"]]);
        if (discussionStats.length > 4) {
            populateDiscussionChart(discussionStats);
        }

    })
    .catch(error => {
        console.error("Error:", error);
    });  
}

async function getCountOfPostReports() {
    response = await fetch("http://localhost:3000/statistics/reportcount")
    .then(response => {
        if(!response.ok){
            throw new Error('Response invalid!');
        }
        return response.json();
    })
    .then(countData => {
        
        
        console.log(countData); 
        discussionStats.push(["postreportcount", countData[0]["count"]]);
        if (discussionStats.length > 4) {
            populateDiscussionChart(discussionStats);
        }

    })
    .catch(error => {
        console.error("Error:", error);
    });  
}

async function getTypeOfDiscussions() {
    response = await fetch("http://localhost:3000/statistics/discussiontypes")
    .then(response => {
        if(!response.ok){
            throw new Error('Response invalid!');
        }
        return response.json();
    })
    .then(typeData => {
        
        
        console.log(typeData); 
        
        populateDiscussionTypeChart(typeData);

    })
    .catch(error => {
        console.error("Error:", error);
    });  
}


function populateUserChart(userStats) {
    var usercount;
    var mutedcount;
    var bannedcount;
    var admincount;
    var commentcount;
    console.log("should be populating chart" , userStats);
    const userChart = document.getElementById('userChart');
    for(i = 0; i < userStats.length; i++) {
        if (userStats[i][0] == "usercount") {
            usercount = userStats[i][1];
        }
        else if (userStats[i][0] == "mutedcount"){
            mutedcount = userStats[i][1];
        }
        else if (userStats[i][0] == "bannedcount"){
            bannedcount = userStats[i][1];
        }
        else if (userStats[i][0] == "admincount"){
            admincount = userStats[i][1];
        }
        else if (userStats[i][0] == "commentcount"){
            commentcount = userStats[i][1];
        }
    }
    
   
    console.log(usercount, bannedcount, mutedcount, admincount, commentcount);
    new Chart(userChart, {
    type: 'bar',
    data: {
        labels: ['Accounts', 'Users Banned', 'Users Muted', 'Admins', "Comments"],
        datasets: [{
            label: 'User Statistics',
            data: [usercount, bannedcount, mutedcount, admincount, commentcount],
            borderWidth: 1
     }]
    },
    options: {
     scales: {
            y: {
                beginAtZero: true
            }
         }
        }

    });
}

function populateDiscussionChart(discussionStats) {
    var discussioncount;
    var discreportcount;
    var discadmincount;
    var postcount;
    var postreportcount;
    console.log("should be populating chart" , discussionStats);
    const discussionChart = document.getElementById('discussionChart');
    for(i = 0; i < discussionStats.length; i++) {
        if (discussionStats[i][0] == "discussioncount") {
            discussioncount = discussionStats[i][1];
        }
        else if (discussionStats[i][0] == "discussionreportcount"){
            discreportcount = discussionStats[i][1];
        }
        else if (discussionStats[i][0] == "discussionadmincount"){
            discadmincount = discussionStats[i][1];
        }
        else if (discussionStats[i][0] == "postcount"){
            postcount = discussionStats[i][1];
        }
        else if (discussionStats[i][0] == "postreportcount"){
            postreportcount = discussionStats[i][1];
        }
    }
    
   
    console.log(discussioncount, discreportcount, discadmincount, postcount, postreportcount);
    new Chart(discussionChart, {
    type: 'bar',
    data: {
        labels: ['Discussions', 'Discussion Reports', 'Discussion Admins', 'Posts', "Post Reports"],
        datasets: [{
            label: 'Discussion Statistics',
            data: [discussioncount, discreportcount, discadmincount, postcount, postreportcount],
            borderWidth: 1
     }]
    },
    options: {
     scales: {
            y: {
                beginAtZero: true
            }
         }
        }

    });
}





function populateDiscussionTypeChart(discussionType) {
    labels = [];
    counts = [];
    console.log(discussionType);
    for (i=0; i < discussionType.length; i++) {
       
        var discussionname = discussionType[i]["dscname"];
        console.log(discussionname);
        var discussioncount = discussionType[i]["count"];
        labels.push(discussionname);
        counts.push(discussioncount);
    }
  
   
    console.log("should be populating chart" , discussionType);
    const discussionChart = document.getElementById('discussionType');
    
    
   
    
    new Chart(discussionChart, {
    type: 'pie',
    data: {
        labels: labels,
        datasets: [{
            label: 'Posts',
            data: counts,
            

     }]
    },
    options: {
     scales: {
            y: {
                beginAtZero: true
            }
         }
        }

    });
}


                