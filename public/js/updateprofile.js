document.addEventListener("DOMContentLoaded", function () {
    document.querySelector("form").addEventListener("submit", function (event) {
        event.preventDefault(); // Override normal for submission

        var firstname = document.querySelector('[name="firstname"]').value;
        var lastname = document.querySelector('[name="lastname"]').value;
        var quote = document.querySelector('[name="quote"]').value;

        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/user/updateprofile", true);
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    window.location.href = "/profile";
                } else if (xhr.status == 401) {
                    showError("Unauthorized access. Please log in.");
                } else {
                    showError("Failed to make the profile edit request. Please try again later.");
                }
            }
        };

        var jsonData = JSON.stringify({
            firstname: firstname,
            lastname: lastname,
            quote: quote,
        });

        xhr.send(jsonData);
    });
});