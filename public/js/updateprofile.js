var picturePreview = document.getElementById('picturePreview');

function handleFileSelect(evt) {
    var file = evt.target.files[0];

    if (!file.type.match('image.*')) {
        return;
    }

    var reader = new FileReader();

    reader.onload = (function (theFile) {
        return function (e) {
            picturePreview.setAttribute("src", e.target.result);
        };
    })(file);

    reader.readAsDataURL(file);
}

document.getElementById('pictureInput').addEventListener('change', handleFileSelect, false);

document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");

    document.querySelector(form).addEventListener("submit", function (event) {
        event.preventDefault(); // Override normal for submission

        const formData = new FormData(form);

        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/user/updateprofile", true);

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

        xhr.send(formData);
    });
});