const loginbutton = document.getElementById("loginButton");

function navigate(url){
    window.location.href = url;
}

loginbutton.addEventListener("click", async function() {
    const response = await fetch('http://localhost:3000/user/login', {method: 'post'});
    const data = await response.json();
    navigate(data.url);
});

/*document.addEventListener("DOMContentLoaded", function () {
    document.querySelector("form").addEventListener("submit", function (event) {
        event.preventDefault(); // Override normal for submission

        var username = document.getElementById("usernameInput").value;
        var password = document.getElementById("passwordInput").value;

        sendLogin(username, password);
    });
});*/