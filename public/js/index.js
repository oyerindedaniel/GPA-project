const replyquestionButtons = document.querySelectorAll(".reply");
const replycancelButtons = document.querySelectorAll(".cancel");
const replyanswerButtons = document.querySelectorAll(".button-js");

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

});

// Flash alert timer.
const flashAlert = $(".alert-css");
console.log(flashAlert);
setTimeout(function () {
    flashAlert.fadeOut("fast");
}, 2000);


var mediaQuery = window.matchMedia("(max-width: 1400px)");

function setColor(mediaQuery) {
    if (mediaQuery.matches) {
        document.querySelector("grid-row").classList.remove("row");
    }
}
setColor(mediaQuery);
mediaQuery.addListener(myFunction);
