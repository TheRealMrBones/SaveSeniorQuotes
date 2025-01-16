document.addEventListener("DOMContentLoaded", function () {
    document.querySelector("form").addEventListener("submit", async function (event) {
        event.preventDefault(); // Override normal for submission

        var username = document.querySelector('[name="username"]').value;
        var password = document.querySelector('[name="password"]').value;
        var confirmPassword = document.querySelector('[name="confirmPassword"]').value;
        var rememberme = document.querySelector('[name="rememberme"]').checked;

        // Check if passwords match
        if (password !== confirmPassword) {
            showError("Passwords do not match.");
            return;
        }

        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/user/register", true);
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 201) {
                    // Registration successful
                    sendLogin(username, password, rememberme);
                } else {
                    var data = JSON.parse(xhr.responseText);

                    // Display the error message from the server
                    showError("Registration failed: " + data.error);
                }
            }
        };

        // Convert the data to JSON format
        var jsonData = JSON.stringify({
            username: username,
            password: password,
            rememberme: rememberme,
        });

        // Send the request
        xhr.send(jsonData);
    });
});