let aButton = document.getElementById("certupload1");
let aImage = document.getElementById("cert1");
let bButton = document.getElementById("certupload2");
let bImage = document.getElementById("cert2");
let cButton = document.getElementById("certupload3");
let cImage = document.getElementById("cert3");
let dButton = document.getElementById("certupload4");
let dImage = document.getElementById("cert4");
let eButton = document.getElementById("certupload5");
let eImage = document.getElementById("cert5");
let fButton = document.getElementById("certupload6");
let fImage = document.getElementById("cert6");

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
cButton.onchange = () => {
    let reader = new FileReader();
    reader.readAsDataURL(cButton.files[0]);
    reader.onload = () => {
        cImage.setAttribute("src",reader.result);
    }
}
dButton.onchange = () => {
    let reader = new FileReader();
    reader.readAsDataURL(dButton.files[0]);
    reader.onload = () => {
        dImage.setAttribute("src",reader.result);
    }
}
eButton.onchange = () => {
    let reader = new FileReader();
    reader.readAsDataURL(eButton.files[0]);
    reader.onload = () => {
        eImage.setAttribute("src",reader.result);
    }
}
fButton.onchange = () => {
    let reader = new FileReader();
    reader.readAsDataURL(fButton.files[0]);
    reader.onload = () => {
        fImage.setAttribute("src",reader.result);
    }
}