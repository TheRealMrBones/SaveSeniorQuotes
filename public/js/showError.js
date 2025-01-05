function showError(message) {
    // Display error using Bootstrap alert
    var alertDiv = document.createElement("div");
    alertDiv.className = "alert alert-danger mt-3";
    alertDiv.textContent = message;

    // Insert the alert above the form
    var form = document.querySelector("form");
    form.parentNode.insertBefore(alertDiv, form.nextSibling);

    // Remove the alert after a few seconds
    setTimeout(function () {
        alertDiv.parentNode.removeChild(alertDiv);
    }, 5000);
}