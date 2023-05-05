function ifadmin() {
    var x = document.getElementById("username").value;
    var y = document.getElementById("password").value;
    if (x == "admin@aa" && y == "1234")
    {
        window.location.href = "admhome.html";
    }
    else if (x == "chrman@aa" && y == "1234")
    {
        window.location.href = "chmhome.html";
    }
    else if (x == "head@aa" && y == "1234")
    {
        window.location.href = "headhome.html";
    }
    else
    {
        window.location.href = "membhome.html";
    }
}