function applycert(i) {
  if (i == 1) {
    applyinstructions1();
  }
  else if (i == 2) {
    applyinstructions2();
  }
  else if (i == 3) {
    applyinstructions3();
  }
  else if (i == 4) {
    applyinstructions4();
  }
  else if (i == 5) {
    applyinstructions5();
  }
}

function closeapplycert(i) {
  if (i == 1) {
    closeapplyinstructions1();
  }
  else if (i == 2) {
    closeapplyinstructions2();
  }
  else if (i == 3) {
    closeapplyinstructions3();
  }
  else if (i == 4) {
    closeapplyinstructions4();
  }
  else if (i == 5) {
    closeapplyinstructions5();
  }
}

function applyinstructions1() {
  var x = document.getElementById("applycert1");
  x.style.top = "15vh";
  x.style.transform = "scale(1)";
  x.style.visibility = "visible";
}
function closeapplyinstructions1() {
  var x = document.getElementById("applycert1");
  x.style.top = "-20vh";
  x.style.transform = "scale(0.1)";
  x.style.visibility = "hidden";
}

function applyinstructions2() {
  var x = document.getElementById("applycert2");
  x.style.top = "15vh";
  x.style.transform = "scale(1)";
  x.style.visibility = "visible";
}
function closeapplyinstructions2() {
  var x = document.getElementById("applycert2");
  x.style.top = "-20vh";
  x.style.transform = "scale(0.1)";
  x.style.visibility = "hidden";
}

function applyinstructions3() {
  var x = document.getElementById("applycert3");
  x.style.top = "15vh";
  x.style.transform = "scale(1)";
  x.style.visibility = "visible";
}
function closeapplyinstructions3() {
  var x = document.getElementById("applycert3");
  x.style.top = "-20vh";
  x.style.transform = "scale(0.1)";
  x.style.visibility = "hidden";
}

function applyinstructions4() {
  var x = document.getElementById("applycert4");
  x.style.top = "15vh";
  x.style.transform = "scale(1)";
  x.style.visibility = "visible";
}
function closeapplyinstructions4() {
  var x = document.getElementById("applycert4");
  x.style.top = "-20vh";
  x.style.transform = "scale(0.1)";
  x.style.visibility = "hidden";
}

function applyinstructions5() {
  var x = document.getElementById("applycert5");
  x.style.top = "15vh";
  x.style.transform = "scale(1)";
  x.style.visibility = "visible";
}
function closeapplyinstructions5() {
  var x = document.getElementById("applycert5");
  x.style.top = "-20vh";
  x.style.transform = "scale(0.1)";
  x.style.visibility = "hidden";
}