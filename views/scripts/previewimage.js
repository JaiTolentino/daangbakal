let aButton = document.getElementById("anncnewsimg1");
let aImage = document.getElementById("newsimg1");
let bButton = document.getElementById("anncnewsimg2");
let bImage = document.getElementById("newsimg2");
let cButton = document.getElementById("annceventimg1");
let cImage = document.getElementById("eventimg1");
let dButton = document.getElementById("annceventimg2");
let dImage = document.getElementById("eventimg2");
let eButton = document.getElementById("anncflashimg1");
let eImage = document.getElementById("flashimg1");
let fButton = document.getElementById("anncflashimg2");
let fImage = document.getElementById("flashimg2");

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