function anncformvalidation(i) {
    let a1 = document.getElementById("anncnewsimg1").value;
    let a2 = document.getElementById("anncnewsheader1").value;
    let a3 = document.getElementById("anncnewsbody1").value;
    let b1 = document.getElementById("anncnewsimg2").value;
    let b2 = document.getElementById("anncnewsheader2").value;
    let b3 = document.getElementById("anncnewsbody2").value;
    let c1 = document.getElementById("annceventimg1").value;
    let c2 = document.getElementById("annceventheader1").value;
    let c3 = document.getElementById("annceventbody1").value;
    let d1 = document.getElementById("annceventimg2").value;
    let d2 = document.getElementById("annceventheader2").value;
    let d3 = document.getElementById("annceventbody2").value;
    let e = document.getElementById("anncflashimg1").value;
    let f = document.getElementById("anncflashimg2").value;

    let msg = "";
    let valid = true;
    if (i == 1) {
        if(a1 == "") {
            msg = "\nNEWS SECTION 1:"
            msg = msg + "\n\n>>>   News image should be uploaded!   <<<";
            valid = false;
        }
        if(a2 == "") {
            msg = msg + "\n>>>   News header should be filled out!   <<<";
            valid = false;
        }
        if(a3 == "") {
            msg = msg + "\n>>>   News body should be filled out!    <<<";
            valid = false;
        }
    }
    else if (i == 2) {
        if(b1 == "") {
            msg = "\nNEWS SECTION 2:";
            msg = msg + "\n\n>>>   News image should be uploaded!   <<<";
            valid = false;
        }
        if(b2 == "") {
            msg = msg + "\n>>>   News header should be filled out!   <<<";
            valid = false;
        }
        if(b3 == "") {
            msg = msg + "\n>>>   News body should be filled out!    <<<";
            valid = false;
        }
    }
    else if (i == 3) {
        if(c1 == "") {
            msg = "\nEVENTS SECTION 1:"
            msg = msg + "\n\n>>>   Event image should be uploaded!   <<<";
            valid = false;
        }
        if(c2 == "") {
            msg = msg + "\n>>>   Event header should be filled out!   <<<";
            valid = false;
        }
        if(c3 == "") {
            msg = msg + "\n>>>   Event body should be filled out!    <<<";
            valid = false;
        }
    }
    else if (i == 4) {
        if(d1 == "") {
            msg = "\nEVENTS SECTION 2:";
            msg = msg + "\n\n>>>   Event image should be uploaded!   <<<";
            valid = false;
        }
        if(d2 == "") {
            msg = msg + "\n>>>   Event header should be filled out!   <<<";
            valid = false;
        }
        if(d3 == "") {
            msg = msg + "\n>>>   Event body should be filled out!    <<<";
            valid = false;
        }
    }
    else if (i == 5) {
        if(e == "") {
            msg = "\nFLASH NEWS SECTION 1:";
            msg = msg + "\n\n>>>   Flash news image should be uploaded!   <<<";
            valid = false;
        }
    }
    else if (i == 6) {
        if(f == "") {
            msg = "\nFLASH NEWS SECTION 2:";
            msg = msg + "\n\n>>>   Flash news image should be uploaded!   <<<";
            valid = false;
        }
    }
    if (msg != "") {
        alert(msg);
    }
    return valid;
}

function anncformclear(i, j) {
    if (i == 1) {
        if (j == 1) {
            let isfilled = anncformvalidation(i);
            if (isfilled) {
                window.location.href = "admannouncements.html";
            }
        }
        else if (j == 2) {
            if (confirm("Are you sure you want to clear the News Section 1?") == true) {
                document.getElementById("newsimg1").setAttribute("src", "images/admannc-icon1.png")
                document.getElementById("anncnewsimg1").value = "";
                document.getElementById("anncnewsheader1").value = "";
                document.getElementById("anncnewsbody1").value = "";
                document.getElementById("anncnewslink1").value = "";
                return true;
            }
            else {
                return false;
            }
        }
    }
    else if (i == 2) {
        if (j == 1) {
            let isfilled = anncformvalidation(i);
            if (isfilled) {
                window.location.href = "admannouncements.html";
            }
        }
        else if (j == 2) {
            if (confirm("Are you sure you want to clear the News Section 2?") == true) {
                document.getElementById("newsimg2").setAttribute("src", "images/admannc-icon1.png")
                document.getElementById("anncnewsimg2").value = "";
                document.getElementById("anncnewsheader2").value = "";
                document.getElementById("anncnewsbody2").value = "";
                document.getElementById("anncnewslink2").value = "";
                return true;
            }
            else {
                return false;
            }
        }
    }
    else if (i == 3) {
        if (j == 1) {
            let isfilled = anncformvalidation(i);
            if (isfilled) {
                window.location.href = "admannouncements.html";
            }
        }
        else if (j == 2) {
            if (confirm("Are you sure you want to clear the Events Section 1?") == true) {
                document.getElementById("eventimg1").setAttribute("src", "images/admannc-icon1.png")
                document.getElementById("annceventimg1").value = "";
                document.getElementById("annceventheader1").value = "";
                document.getElementById("annceventbody1").value = "";
                document.getElementById("annceventlink1").value = "";
                return true;
            }
            else {
                return false;
            }
        }
    }
    else if (i == 4) {
        if (j == 1) {
            let isfilled = anncformvalidation(i);
            if (isfilled) {
                window.location.href = "admannouncements.html";
            }
        }
        else if (j == 2) {
            if (confirm("Are you sure you want to clear the Events Section 2?") == true) {
                document.getElementById("eventimg2").setAttribute("src", "images/admannc-icon1.png")
                document.getElementById("annceventimg2").value = "";
                document.getElementById("annceventheader2").value = "";
                document.getElementById("annceventbody2").value = "";
                document.getElementById("annceventlink2").value = "";
                return true;
            }
            else {
                return false;
            }
        }
    }
    else if (i == 5) {
        if (j == 1) {
            let isfilled = anncformvalidation(i);
            if (isfilled) {
                window.location.href = "admannouncements.html";
            }
        }
        else if (j == 2) {
            if (confirm("Are you sure you want to clear the Flash News Section 1?") == true) {
                document.getElementById("flashimg1").setAttribute("src", "images/admannc-icon1.png")
                return true;
            }
            else {
                return false;
            }
        }
    }
    else if (i == 6) {
        if (j == 1) {
            let isfilled = anncformvalidation(i);
            if (isfilled) {
                window.location.href = "admannouncements.html";
            }
        }
        else if (j == 2) {
            if (confirm("Are you sure you want to clear the Flash News Section 2?") == true) {
                document.getElementById("flashimg2").setAttribute("src", "images/admannc-icon1.png")
                return true;
            }
            else {
                return false;
            }
        }
    }
}