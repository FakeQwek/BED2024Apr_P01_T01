 
 
 
 //Function is a post function that creates a question
 async function submitForm() {
    console.log("Triggered");
    username = document.getElementById("name").value;
    email = document.getElementById("email").value;
    question = document.getElementById("query").value;
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


    return response.json();
 }