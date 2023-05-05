document.addEventListener("DOMContentLoaded", function() {
    var elements = document.getElementsByTagName("INPUT");
    var isValid = true;
    for (var i = 0; i < elements.length; i++) {
        if (elements[i].id == "firstname") {
            elements[i].oninvalid = function(e) {
                e.target.setCustomValidity("");
                if (!e.target.validity.valid) {
                    e.target.setCustomValidity("Firstname cannot be left blank");
                }
            };
            isValid = false;
        }
        else if (elements[i].id == "lastname") {
            elements[i].oninvalid = function(e) {
                e.target.setCustomValidity("");
                if (!e.target.validity.valid) {
                    e.target.setCustomValidity("Lastname cannot be left blank");
                }
            };
            isValid = false;
        }
        else if (elements[i].id == "email") {
            elements[i].oninvalid = function(e) {
                e.target.setCustomValidity("");
                if (!e.target.validity.valid) {
                    e.target.setCustomValidity("Email Address cannot be left blank");
                }
            };
            isValid = false;
        }
        else if (elements[i].id == "contactnum") {
            elements[i].oninvalid = function(e) {
                e.target.setCustomValidity("");
                if (!e.target.validity.valid) {
                    e.target.setCustomValidity("Contact Number cannot be left blank");
                }
            };
            isValid = false;
        }
        else if (elements[i].id == "birthdate") {
            elements[i].oninvalid = function(e) {
                e.target.setCustomValidity("");
                if (!e.target.validity.valid) {
                    e.target.setCustomValidity("Birth Date cannot be left blank");
                }
            };
            isValid = false;
        }
        else if (elements[i].id == "address") {
            elements[i].oninvalid = function(e) {
                e.target.setCustomValidity("");
                if (!e.target.validity.valid) {
                    e.target.setCustomValidity("Home Address cannot be left blank");
                }
            };
            isValid = false;
        }
        else if (elements[i].id == "password") {
            elements[i].oninvalid = function(e) {
                e.target.setCustomValidity("");
                if (!e.target.validity.valid) {
                    e.target.setCustomValidity("Password cannot be left blank");
                }
            };
            isValid = false;
        }
        else if (elements[i].id == "confirmpassword") {
            elements[i].oninvalid = function(e) {
                e.target.setCustomValidity("");
                if (!e.target.validity.valid) {
                    e.target.setCustomValidity("Confirm Password cannot be left blank");
                }
            };
            isValid = false;
        }
        else {
            isValid = true;
        }
        elements[i].oninput = function(e) {
            e.target.setCustomValidity("");
        };
    }
})

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