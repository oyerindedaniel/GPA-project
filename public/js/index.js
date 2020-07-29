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


//value.forEach(function (value) {
//    console.log(value);
//})

//const values = $(".gradeget");
//const lengthValue = values.length;
//for (var i = 0; i < lengthValue; i++) {
//    const ans = values.eq(i).html();
//    const tables = $("#table-row");
//    const lengthtable = tables.length;
//    for (var i = 0; i < lengthtable; i++) {
//        tables.eq(i).attr("class", ans);
//    }
//}


//const values = $(".gradeget");
//const lengthValue = values.length;
//for (var i = 0; i < lengthValue; i++) {
//    const ans = values.eq(i).html();
//    if (ans === "A") {
//        $this.addClass("red");
//    }
//
//}

const values = $(".gradeget");
values.each(function (value) {
    value.addClass("red");
})




//const values = $(".gradeget");
//const lengthValue = values.length;
//for (var i = 0; i < lengthValue; i++) {
//    var ans = values.eq(i).html();
//    if (ans === "A") {
//        $("#table-row").addClass("green");
//    } else if (ans = "B") {
//        $("#table-row").addClass("red");
//    }
//
//}









//
//var values = $(".gradeget").eq(3).html();
//console.log(values);
////values.each(function (value) {
////    var eee = value.html();
////    console.log(eee);
////})
//////values.forEach(function (value) {
////$("#table-row").attr("class", values);
//////});

// Flash timer.
const flashAlert = $(".alert-css");
setTimeout(function () {
    flashAlert.fadeOut('fast');
}, 2000);
