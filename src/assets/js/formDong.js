// Function ResizeHeight TextArea
function setHeightArea() {
  this.style.height = this.scrollHeight + "px";
}
var textarea = document.getElementsByTagName("textarea");
if (textarea) {
  for (var i = 0; i <= textarea.length; i++) {
    if (!textarea[i]) break;
    textarea[i].addEventListener("keyup", setHeightArea, false);
    setHeightArea.call(textarea[i]);
  }
}
//

// Function ResizeWidth Input
function setWidthInput() {
  this.style.width = (this.value.length + 3) * 8.5 + "px";
}

var input = document.querySelectorAll(".tableHeader input, .tableFooter input");
if (input) {
  for (var i = 0; i < input.length; i++) {
    input[i].addEventListener("keyup", setWidthInput, false);
  }
}
