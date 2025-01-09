const form = document.querySelector('form');

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