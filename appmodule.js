module.exports.getyear = getyear;

function getyear() {
    var date = new Date();
    var year = date.getFullYear();
    return year;
}

module.exports.commentprototype = commentprototype;

function commentprototype() {
    var commentinput = Commentinput.find({}, function (err, allDatas) {
        if (allDatas) {
            const CommentLength = allDatas.length;
            Replyinput.find({}, function (err, allInfos) {
                console.log("m");
                const ReplyLength = allInfos.length;
                const sumLength = CommentLength + ReplyLength;
                res.render("review", {
                    allcomments: foundComments,
                    totalcomment: sumLength,
                    //                                        danielaccess: admiinme.username,
                    //                                        validid: admiinme.googleId,
                    admin: ""
                });
            })
        }
    });
    return commentinput;
}
