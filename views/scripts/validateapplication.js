function validateresidency(i) {
    let msg = "";
    let valid = true;
    if (i == 1) {
        let a = document.getElementById("certupload1").value;
        let b = document.getElementById("certupload2").value;
        if(a == "") {
            msg = "\nMissing Requirements:"
            msg = msg + "\n\n>>>   Requester Valid ID should be uploaded!";
            valid = false;
        }
        if(b == "") {
            msg = msg + "\n>>>   Proof of Residency should be uploaded!";
            valid = false;
        }
    }
    else if (i == 2) {
        let a = document.getElementById("certupload1").value;
        let b = document.getElementById("certupload2").value;
        if(a == "") {
            msg = "\nMissing Requirements:"
            msg = msg + "\n\n>>>   Requester Valid ID should be uploaded!";
            valid = false;
        }
        if(b == "") {
            msg = msg + "\n>>>   Barangay Clearance should be uploaded!";
            valid = false;
        }
    }
    else if (i == 3) {
        let a = document.getElementById("certupload1").value;
        let b = document.getElementById("certupload2").value;
        let c = document.getElementById("certupload3").value;
        let d = document.getElementById("certupload4").value;
        let e = document.getElementById("certupload5").value;
        let f = document.getElementById("certupload6").value;
        if(a == "") {
            msg = "\nMissing Requirements:"
            msg = msg + "\n\n>>>   Requester Valid ID should be uploaded!";
            valid = false;
        }
        if(b == "") {
            msg = msg + "\n>>>   Proof of Business Ownership should be uploaded!";
            valid = false;
        }
        if(c == "") {
            msg = msg + "\n>>>   Barangay Clearance should be uploaded!";
            valid = false;
        }
        if(d == "") {
            msg = msg + "\n>>>   Mayor's Permit should be uploaded!";
            valid = false;
        }
        if(e == "") {
            msg = msg + "\n>>>   Fire Safety Inspection Certificate should be uploaded!";
            valid = false;
        }
        if(f == "") {
            msg = msg + "\n>>>   Environmental Clearance Certificate should be uploaded!";
            valid = false;
        }
    }
    else if (i == 4) {
        let a = document.getElementById("certupload1").value;
        let b = document.getElementById("certupload2").value;
        let c = document.getElementById("certupload3").value;
        let d = document.getElementById("certupload4").value;
        let e = document.getElementById("certupload5").value;
        let f = document.getElementById("certupload6").value;
        if(a == "") {
            msg = "\nMissing Requirements:"
            msg = msg + "\n\n>>>   Requester Valid ID should be uploaded!";
            valid = false;
        }
        if(b == "") {
            msg = msg + "\n>>>   Former Business Permit should be uploaded!";
            valid = false;
        }
        if(c == "") {
            msg = msg + "\n>>>   Barangay Clearance should be uploaded!";
            valid = false;
        }
        if(d == "") {
            msg = msg + "\n>>>   Mayor's Permit should be uploaded!";
            valid = false;
        }
        if(e == "") {
            msg = msg + "\n>>>   Fire Safety Inspection Certificate should be uploaded!";
            valid = false;
        }
        if(f == "") {
            msg = msg + "\n>>>   Environmental Clearance Certificate should be uploaded!";
            valid = false;
        }
    }
    if (msg != "") {
        alert(msg);
    }
    return valid;
}

function submitapplication(i) {
    let isfilled = validateresidency(i);
    if (isfilled) {
        window.location.href = "membcertificates.html";
    }
}