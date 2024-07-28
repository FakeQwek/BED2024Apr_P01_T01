 
 
 
 //Function is a post function that creates a question
 async function submitForm(username, email, question) {
    console.log("Triggered");
    url = "http://localhost:3000/question";
    const response = await fetch(url, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            'Content-Type': "application/json",
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify({
            name: username,
            email: email,
            query: question
            }),
    });

    window.location.href = "./contact-us-success.html";
    return response.json();
 
 }

 //Checks if all input is acceptable for contact us
 function validateForm() {
    username = document.getElementById("name").value;
    email = document.getElementById("email").value;
    question = document.getElementById("query").value;
    space = /\s/;
    specialchars = /[^a-zA-Z]/;
    email1 = /\.com{1}/;
    email2 = /@{1}/;
    query = /[^a-zA-Z0-9\s!?,']/;
    
    //Checks for spaces, space characters and blank input
    if (space.test(username) || specialchars.test(username) || username == "") {
        
        alert("Username invalid!");
        console.log(space.test(username), specialchars.test(username))
        return;
    }
    //Checks for .com, @ and blank input
    else if (!email1.test(email) || !email2.test(email) || space.test(email)) {
        alert("Email invalid");
        console.log('email invalid');
        return;
    }
    //Checks for blank input or special characters
    else if (query.test(question) || question == "") {
        alert("Question invalid");
        return;
    }
    else {
      
        submitForm(username, email, question);
    }

  
  



 }