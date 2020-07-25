//const homeBoxes = document.querySelectorAll(".home-box");
//
//function selectItem(event) {
//    removeBorder();
//    this.classList.add("border-styles");
//    event.preventDefault()
//}
//
//// Remove border styles from former ones new as been click.
//function removeBorder() {
//    homeBoxes.forEach(homebox => {
//        homebox.classList.remove("border-styles")
//    })
//}
//
//Listen
//for click.
//homeBoxes.forEach(homeBox => {
//    homeBox.addEventListener("click", selectItem)
//});

const flashAlert = $(".alert-css");
setTimeout(function () {
    flashAlert.fadeOut('fast');
}, 2000);
