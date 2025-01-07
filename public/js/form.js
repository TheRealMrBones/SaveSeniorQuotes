const form = document.querySelector('form');

form.addEventListener('keypress', function (event) {
    if (event.key.toLowerCase() == "enter" && event.target.tagName.toLowerCase() == "input" && event.target.type.toLowerCase() == "text") {
        event.preventDefault();
        form.submit();
    }
});

function showError(message) {
    // Display error using Bootstrap alert
    var alertDiv = document.createElement("div");
    alertDiv.className = "erroralert";
    alertDiv.textContent = message;

    // Insert the alert above the form
    form.parentNode.insertBefore(alertDiv, form.nextSibling);

    // Remove the alert after a few seconds
    setTimeout(function () {
        alertDiv.parentNode.removeChild(alertDiv);
    }, 5000);
}

function showSuccess(message) {
    // Display error using Bootstrap alert
    var alertDiv = document.createElement("div");
    alertDiv.className = "successalert";
    alertDiv.textContent = message;

    // Insert the alert above the form
    form.parentNode.insertBefore(alertDiv, form.nextSibling);

    // Remove the alert after a few seconds
    setTimeout(function () {
        alertDiv.parentNode.removeChild(alertDiv);
    }, 5000);
}