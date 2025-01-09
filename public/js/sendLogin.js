function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
}

function sendLogin(username, password) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/user/login", true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                var data = JSON.parse(xhr.responseText);
                console.log(data);

                // Check if login was successful
                if (data.token) {
                    // Redirect to a new page or perform other actions
                    window.location.href = "/profile"; // Change this URL as needed
                } else {
                    // Display the error message from the server
                    showError("Login failed: " + data.error);
                }
            } else if (xhr.status == 401) {
                // Unauthorized - Incorrect username or password
                showError("Invalid username or password. Please try again.");
            } else {
                // Handle other server errors or HTTP status codes
                showError("Failed to make the login request. Please try again later.");
            }
        }
    };

    // Convert the data to JSON format
    var jsonData = JSON.stringify({
        username: username,
        password: password
    });

    // Send the request
    xhr.send(jsonData);
}