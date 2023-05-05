let firstcont = document.getElementById("defaultmemberlist");
let secondcont = document.getElementById("deletememberlist");

secondcont.style.display = "none";

function deletemembers() {
    firstcont.style.display = "none";
    secondcont.style.display = "block";
}
function canceldelete() {
    secondcont.style.display = "none";
    firstcont.style.display = "block";
}