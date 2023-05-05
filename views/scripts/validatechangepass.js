function validatepass() {
    let pass1 = document.getElementById("password").value;
    let pass2 = document.getElementById("confirmpassword").value;
    if (pass1 === pass2) {
        return true;
    }
    else {
        alert("Passwords do not match!!");
        return false;
    }
}