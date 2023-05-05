let aButton = document.getElementById("certupload1");
let aImage = document.getElementById("cert1");
let bButton = document.getElementById("certupload2");
let bImage = document.getElementById("cert2");

aButton.onchange = () => {
    let reader = new FileReader();
    reader.readAsDataURL(aButton.files[0]);
    reader.onload = () => {
        aImage.setAttribute("src",reader.result);
    }
}
bButton.onchange = () => {
    let reader = new FileReader();
    reader.readAsDataURL(bButton.files[0]);
    reader.onload = () => {
        bImage.setAttribute("src",reader.result);
    }
}