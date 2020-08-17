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

    } else {
        const reply = $(`.${this.id}234`);
        reply.addClass("form-show");
        const viewHide = $(`.${this.id}987`);
        viewHide.html("Hide");
        const reversearrow = $(`#${this.id}159 `);
        reversearrow.attr("class", "fas fa-1x fa-sort-up arrow-style");
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
setTimeout(function () {
    flashAlert.fadeOut("fast");
}, 2000);

const flashAlertsign = $(".alertcsssign");
setTimeout(function () {
    flashAlertsign.fadeOut("fast");
}, 4000);

const flashAlertforg = $(".alertcssforpass");
setTimeout(function () {
    flashAlertforg.fadeOut("fast");
}, 20000);

const flashAlertsign2 = $(".alertcsssign2");
setTimeout(function () {
    flashAlertsign2.fadeOut("fast");
}, 6000);
