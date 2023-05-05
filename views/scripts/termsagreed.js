function termschecked() {
    var x = document.getElementById("check");
    var y = document.getElementById("nextbtn");
    if (x.checked)
    {
        y.style.display = "block";
    }
    else
    {
        y.style.display = "none";
    }
}

function termsunchecked() {
    document.getElementById("check").checked = false;
}