document.addEventListener("DOMContentLoaded", function () {
    document.querySelector("form").addEventListener("submit", function (event) {
        event.preventDefault(); // Override normal for submission

        var username = document.getElementById("usernameInput").value;
        var password = document.getElementById("passwordInput").value;
        var rememberme = document.getElementById("remembermeInput").checked;

        sendLogin(username, password, rememberme);
    });
});