let firstcont = document.getElementById("adminlistcont1");
let secondcont = document.getElementById("adminlistcont2");

secondcont.style.display = "none";
thirdcont.style.display = "none";

function addadmin() {
    openpopup();
}
function openpopup() {
    var x = document.getElementById("popup");
    x.style.top = "5vh";
    x.style.transform = "scale(1)";
    x.style.visibility = "visible";
}
function closepopup() {
    var x = document.getElementById("popup");
    x.style.top = "-20vh";
    x.style.transform = "scale(0.1)";
    x.style.visibility = "hidden";
  }
function deleteadmin() {
    firstcont.style.display = "none";
    secondcont.style.display = "block";
}
function canceldelete() {
    secondcont.style.display = "none";
    firstcont.style.display = "block";
}