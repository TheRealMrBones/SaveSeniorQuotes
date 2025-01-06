document.addEventListener("DOMContentLoaded", function () {
    document.querySelector("form").addEventListener("submit", async function (event) {
        event.preventDefault(); // Override normal for submission

        var password = document.querySelector('[name="password"]').value;
        var confirmPassword = document.querySelector('[name="confirmPassword"]').value;

        // Check if passwords match
        if (password !== confirmPassword) {
            showError("Passwords do not match.");
            return;
        }

        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/user/resetpassword", true);
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 201) {
                    // Password update successful
                    var data = JSON.parse(xhr.responseText);
                    // Display the success message from the server
                    showSuccess("Success: Updated password for " + data.username);
                } else {
                    var data = JSON.parse(xhr.responseText);
                    // Display the error message from the server
                    showError("Registration failed: " + data.error);
                }
            }
        };

        // Convert the data to JSON format
        var jsonData = JSON.stringify({
            password: password
        });

        // Send the request
        xhr.send(jsonData);
    });
});