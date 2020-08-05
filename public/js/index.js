const replyquestionButtons = document.querySelectorAll(".reply");
const replycancelButtons = document.querySelectorAll(".cancel");
const replyanswerButtons = document.querySelectorAll(".button-js");
//const replyForms = document.querySelector("#${this.id}");



//Getting the reply button
replyquestionButtons.forEach(replyquestionButton => {
    replyquestionButton.addEventListener("click", selectItem)
});

replyanswerButtons.forEach(replyanswerButton => {
    replyanswerButton.addEventListener("click", submitItem)
});

replycancelButtons.forEach(replycancelButton => {
    replycancelButton.addEventListener("click", cancelItem)
});

function selectItem(event) {
    console.log(this.id);
    const reply = document.getElementById(`${this.id}123`);
    // reply.classList.add("mystyle");
    reply.setAttribute("class", "form-show");
}

function submitItem(event) {
    const reply1 = document.getElementById(`${this.id}123`);
    reply1.setAttribute("class", "form-hide");
}

function cancelItem(event) {
    const reply12 = document.getElementById(`${this.id}123`);
    reply12.setAttribute("class", "form-hide");
}


//const getLengthreplies = document.querySelectorAll(".h1-contorl");
//getLengthreplies.forEach(function (getLengthreply) {
//    console.log(getLengthreply.innerHTML);
//})

//const idlength = document.getElementById("htmlh1Control");
//const replyanswerButtonsLength = idlength.length;
//
//console.log(replyanswerButtonsLength);

//Controlling the view reply and hide reply
const replycancelButtons1 = $(".view-reply");
replycancelButtons1.click(selectItem1);

function selectItem1(event) {
    console.log("Yeah");
    const viewHide1 = $(`.${this.id}987`);
    const innerValue = viewHide1.html();
    if (innerValue === "Hide") {
        const reply = $(`.${this.id}234`);
        reply.removeClass("form-show");
        const viewHide = $(`.${this.id}987`);
        viewHide.html("View");
        const reversearrow = $(`#${this.id}159`);
        reversearrow.attr("class", "fas fa-1x fa-caret-down arrow-style");
        reversearrow.addClass("arrow-up");

    } else {
        const reply = $(`.${this.id}234`);
        reply.addClass("form-show");
        const viewHide = $(`.${this.id}987`);
        viewHide.html("Hide");
        const reversearrow = $(`#${this.id}159 `);
        reversearrow.attr("class", "fas fa-1x fa-sort-up arrow-adjust  arrow-style");
        reversearrow.addClass("arrow-up");
    }
}

//Monitoring Comment Numbers
const comment = document.querySelector(".totalcomment");
commentHtml = comment.innerHTML;
if (commentHtml === "0") {
    console.log("Yeah");
    const comment1 = document.querySelector(".totalcomment1");
    comment1.innerHTML = "Comment";
}

//Monitoring the replies
const replys = document.querySelectorAll(".replyLength");
replys.forEach(function (reply) {
    const replyHtml = reply.innerHTML;
    if (replyHtml > 1) {
        const viewreplys = $(`#${reply.id + 2}`);
        viewreplys.html("replies");
    } else {
        console.log("err");
    }

})

//Click menu
//const menuButton = document.querySelector(".menu-button");
//menuButton.addEventListener("click", menuclick);
//
//
//function menuclick() {
//    const showMenu = document.querySelector(".dropdown");
//    showMenu.classList.remove("drop-hide");
//}
//
//$(window).click(function () {
//    const showMenu1 = $(".dropdown");
//    showMenu1.
//});

//const replycancelButtons1 = document.querySelectorAll(".view-replyq");
//replycancelButtons1.forEach(replycancelButton1 => {
//    replycancelButton1.addEventListener("click", selectItem1)
//});
//
//
//function selectItem2(event) {
//
//
//}
//
//

//const viewHide1 = $(".view-hide");
//const innerValue = viewHide1.html();
//if (innerValue == "View") {


//}
//    const replycancelButtons1 = document.querySelectorAll(".view-reply");
//    replycancelButtons1.forEach(replycancelButton1 => {
//        replycancelButton1.addEventListener("click", selectItem1)
//    });
//
//    function selectItem1(event) {
//        const reply = $(`.${this.id}234`);
//        reply.addClass("form-show");
//        const viewHide = $(`.${this.id}987`);
//        viewHide.html("Hide");
//    }
//
//} else {
//    const replycancelButtons1 = document.querySelectorAll(".view-reply");
//    replycancelButtons1.forEach(replycancelButton1 => {
//        replycancelButton1.addEventListener("click", selectItem1)
//    });
//
//    function selectItem1(event) {
//        const reply = $(`.${this.id}234`);
//        reply.addClass("form-hide");
//        const viewHide = $(`.${this.id}987`);
//        viewHide.html("View");
//    }
//
//}



// Flash timer.
const flashAlert = $(".alert-css");
setTimeout(function () {
    flashAlert.fadeOut('fast');
}, 2000);


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
