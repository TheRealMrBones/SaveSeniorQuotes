const googlebutton = document.getElementById("googlebutton");

function navigate(url){
    window.location.href = url;
}

googlebutton.addEventListener("click", async function() {
    navigate("/auth/google");
});