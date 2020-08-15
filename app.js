// Env.
require('dotenv').config();
// Express.
const express = require('express');
// Body parser.
const bodyParser = require("body-parser");
// Ejs.
const ejs = require("ejs");
// Express session.
const session = require('express-session');
// Passport.
const passport = require('passport');
// Passport local mongoose.
const passportLocalMongoose = require('passport-local-mongoose');
// Connect flash.
const flash = require('connect-flash');
// Cookie parser.
const cookieParser = require('cookie-parser');
// Nodemailer.
const nodemailer = require("nodemailer");
// uuid4.
const {
    v4: uuidv4
} = require('uuid');
// Moment js.
const moment = require("moment");
moment().format();
// Morgan.
const morgan = require('morgan')
// Module require date.
const date = require(__dirname + "/appmodule.js");
const app = express();
// Lodash.
const _ = require('lodash');
// Mongoose.
const mongoose = require('mongoose');
// Google strategy.
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.locals.recentyear = date.getyear()
app.locals.moment = require('moment');
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(session({
    secret: process.env.SECRET,
    cookie: {
        maxAge: null
    },
    resave: false,
    saveUninitialized: false
}));
app.use(flash())
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

// Mongoose connection.
mongoose.connect("mongodb://localhost:27017/gpaDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => {
    console.log("Successfully connected to server port 27017");
});
mongoose.set('useFindAndModify', false);
mongoose.set("useCreateIndex", true);

// Collection reply Schema. Comment route
const replySchema = new mongoose.Schema({
    commentid: String,
    replyOne: {
        type: String,
        required: [true, 'Comment required']
    },
    timereplycreated: String

});

const Replyinput = mongoose.model("Replyinput", replySchema);

// Collection comment Schema.
const commentSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: [true, 'Comment required']
    },
    reply: [replySchema],
    replylength: [],
    timecreated: [String]
});

const Commentinput = mongoose.model("Commentinput", commentSchema);


// Collection grade Schema.
const gradeSchema = new mongoose.Schema({
    grade1: {
        type: String,
        required: [true, 'Grade required']
    },
    points: {
        type: Number,
        required: [true, 'Point required ']
    }

});

// Collection grade system Schema.
const Gradesystemvalue = mongoose.model("Gradesystemvalue", gradeSchema);

const calculateSchema = new mongoose.Schema({
    coursecode: {
        type: String,
        required: [true, 'Coursecode required']
    },
    grade2: {
        type: String,
        required: [true, 'Grade required']
    },
    unitpercourse: {
        type: Number,
        required: [true, 'Unit required']
    },
    multiplyunit: Number
});

// Collection calculate Schema.
const Calculategpavalue = mongoose.model("Calculategpavalue", calculateSchema);

// Collection overallstructure Schema.
const overallstrtSchema = new mongoose.Schema({
    username1: String,
    username: String,
    password: String,
    resetpasswordtoken: String,
    gradesystemoverall: [gradeSchema],
    calculategpaoverall: [calculateSchema],
    totalcalcunits: [Number],
    totalunit: [Number],
    finalresult: [],
    googleId: String,
    googlename: String
});

overallstrtSchema.plugin(passportLocalMongoose);
overallstrtSchema.plugin(findOrCreate);

const Overallstrt = new mongoose.model("Overallstrt", overallstrtSchema);

passport.use(Overallstrt.createStrategy());

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    Overallstrt.findById(id, function (err, user) {
        done(err, user);
    });
});

passport.use(new GoogleStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/google/grade-system",
        userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
    },
    function (accessToken, refreshToken, profile, cb) {
        console.log(profile);
        Overallstrt.findOrCreate({
            googleId: profile.id,
            googlename: profile.displayName
        }, function (err, user) {
            return cb(err, user);
        });
    }
));

// Get request for home route.
app.route("/")
    .get(function (req, res) {
        res.render("gpalandingpage");
    });

app.get('/auth/google',
    passport.authenticate('google', {
        scope: ["profile"]
    }));

app.get("/auth/google/grade-system",
    passport.authenticate("google", {
        failureRedirect: "/signin"
    }),
    function (req, res) {
        // Successful authentication, redirect grade-system.
        res.redirect('/grade-system');
    });

// Get request for grade system route.
app.route("/grade-system")
    // Work on this.
    .get(authgradesystem, function (req, res) {
        if (req.isAuthenticated()) {
            Overallstrt.findById(req.user.id, function (err, gradeperperson) {
                if (gradeperperson) {
                    res.render("gradesystem", {
                        allgradeitems: gradeperperson.gradesystemoverall,
                        message: req.flash("message"),
                        message1: req.flash("message"),
                    });
                } else {
                    console.log("Nothing found");
                }
            });
        } else {
            res.redirect("/signin");
        }
    })

    // Post request for grade system route.
    .post(function (req, res) {
        const gradealpha = _.upperCase(req.body.grade1);
        const pointalpha = req.body.point;
        const gradesystem = new Gradesystemvalue({
            grade1: gradealpha,
            points: pointalpha
        });
        Overallstrt.updateOne({
                _id: req.user.id
            }, {
                $addToSet: {
                    gradesystemoverall: gradesystem
                }
            },
            function (err, result) {
                if (err) {
                    res.send(err);
                } else {
                    req.flash("message", "Saved Successfully.")
                    res.redirect("/grade-system");
                }
            }
        );
    });

// Middleware for grade system.
function authgradesystem(req, res, next) {
    console.log("Worked");
    next();
    //    const filterGrade = _.upperCase(req.body.grade1);
    //    Overallstrt.findById(req.user.id, function (err, foundUser) {
    //        if (foundUser) {
    //            const foundGrades = foundUser.gradesystemoverall;
    //            foundGrades.forEach(function (foundGrade) {
    //                if (foundGrade.length >= 2) {
    //                    console.log(foundGrade);
    //                    next();
    //                    //s  console.log("Princess");
    //                }
    //            });
    //        }
    //    });

}


// Get request for calculate route.
app.route("/calculate")
    .get(function (req, res) {
        if (req.isAuthenticated()) {
            Overallstrt.findById(req.user.id, function (err, calculategpaperson) {
                if (calculategpaperson) {
                    res.render("calculate", {
                        allcalculateitems: calculategpaperson.calculategpaoverall,
                        message: req.flash("message")
                    });
                } else {
                    console.log("Nothing found");
                }
            });
        } else {
            res.redirect("/signin");
        }
    })

    // Post request for calculate route.
    .post(function (req, res) {
        const coursecodebeta = _.upperCase(req.body.coursecode);
        const gradebeta = _.upperCase(req.body.grade2);
        const unitpercoursebeta = req.body.unitpercourse;
        Overallstrt.findById(req.user.id, function (err, foundUser) {
            if (!foundUser) {
                console.log(err);
            } else {
                const foundUsergrades = foundUser.gradesystemoverall;
                foundUsergrades.forEach(function (foundUsergrade) {
                    //Come back and put length that check how many and redirect them to another page.
                    if (foundUsergrade.grade1 === gradebeta) {
                        const multipyunits = foundUsergrade.points * unitpercoursebeta;
                        const calculategpa = new Calculategpavalue({
                            coursecode: coursecodebeta,
                            grade2: gradebeta,
                            unitpercourse: unitpercoursebeta,
                            multiplyunit: multipyunits
                        });
                        calculategpa.save(function (err) {
                            if (!err) {
                                foundUser.calculategpaoverall.push(calculategpa);
                                foundUser.save(function (err) {
                                    if (!err) {
                                        //The total Calculated units
                                        const userId = mongoose.Types.ObjectId(req.user.id);
                                        Overallstrt.aggregate([{
                                                $match: {
                                                    _id: userId
                                                }
                                            },
                                            {
                                                $group: {
                                                    _id: null,
                                                    "totalcalculateunits": {
                                                        $sum: {
                                                            $sum: "$calculategpaoverall.multiplyunit"
                                                        }
                                                    }
                                                }
                                            }
                ]).exec(function (err, sumcalcData) {
                                            if (!err) {
                                                sumcalcData.forEach(function (sumcalcDate) {
                                                    const sum1 = sumcalcDate.totalcalculateunits;
                                                    foundUser.totalcalcunits.pop();
                                                    foundUser.totalcalcunits.push(sum1);
                                                    foundUser.save(function (err) {
                                                        if (!err) {
                                                            //The total Calculated units
                                                            const userId = mongoose.Types.ObjectId(req.user.id);
                                                            Overallstrt.aggregate([{
                                                                    $match: {
                                                                        _id: userId
                                                                    }
                                            },
                                                                {
                                                                    $group: {
                                                                        _id: null,
                                                                        "totaleachunits": {
                                                                            $sum: {
                                                                                $sum: "$calculategpaoverall.unitpercourse"
                                                                            }
                                                                        }
                                                                    }
                                            }
                ]).exec(function (err, sumData) {
                                                                if (!err) {
                                                                    sumData.forEach(function (sumDate) {
                                                                        const sum2 = sumDate.totaleachunits;
                                                                        foundUser.totalunit.pop();
                                                                        foundUser.totalunit.push(sum2);
                                                                        foundUser.save(function (err) {
                                                                            if (!err) {
                                                                                req.flash("message", "Saved Successfully.");
                                                                                res.redirect("/calculate");
                                                                            }
                                                                        });
                                                                    });
                                                                }
                                                            });
                                                        }
                                                    })
                                                });
                                            } else {
                                                res.redirect("/grade-system");
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    } else {
                        console.log("Not it");
                    }
                })
            }
        });
    });

// Get request for history route.
app.get("/history", function (req, res) {
    if (req.isAuthenticated()) {
        Overallstrt.findById(req.user.id, function (err, foundUser) {
            if (foundUser) {
                const calc1 = foundUser.totalcalcunits[0];
                const calc = foundUser.totalunit[0];
                const divCal1 = Math.round((calc1 / calc) * 100);
                const divCal = (divCal1 / 100);
                const lastarrayResult = foundUser.finalresult;
                lastarrayResult.pop();
                lastarrayResult.push(divCal);
                foundUser.save(function (err) {
                    if (!err) {
                        res.render("history", {
                            allitems: foundUser.calculategpaoverall,
                            allfinalresults: foundUser
                        });
                    }
                })
            }

        });
    } else {
        res.redirect("/signin");
    }
});

// Delete request from grade system.
app.post("/deleteitem1", function (req, res) {
    const gradedeleteitem = req.body.deleteitemgrade;
    const UserID = req.user.id;
    Overallstrt.findOneAndUpdate({
        _id: UserID
    }, {
        $pull: {
            gradesystemoverall: {
                _id: gradedeleteitem
            }
        }
    }, function (err, results) {
        if (!err) {
            req.flash("message", "Successfully deleted grade.");
            res.redirect("/grade-system");
        } else {
            console.log("Couldn't delete");
        }
    });

});

// Delete request from calculate gpa.
app.post("/deleteitem2", function (req, res) {
    const UserID = req.user.id;
    const calculatedeleteitem = req.body.deleteitemcalculate;
    Overallstrt.findById(UserID, function (err, foundUser) {
        const foundcalcresult = foundUser.totalcalcunits;
        const foundresult = foundUser.totalunit;
        const arrayLength = (foundcalcresult.length - 1);
        const arrayLengths = (foundresult.length - 1);
        const gottencalcValue = foundcalcresult[arrayLength];
        const lottencalcValue = foundresult[arrayLengths];
        if (foundUser) {
            const usercalcs = foundUser.calculategpaoverall;
            usercalcs.forEach(function (usercalc) {
                if (usercalc.id === calculatedeleteitem) {

                    const gottenValue = usercalc.multiplyunit;
                    const gottenresult = (gottencalcValue - gottenValue);
                    foundcalcresult.pop();
                    foundcalcresult.push(gottenresult);
                    foundUser.save(function (err) {
                        if (!err) {
                            const lottenValue = usercalc.unitpercourse;
                            const lottenresult = (lottencalcValue - lottenValue);
                            foundresult.pop();
                            foundresult.push(lottenresult);
                            foundUser.save(function (err) {
                                if (!err) {
                                    Overallstrt.findOneAndUpdate({
                                        _id: UserID
                                    }, {
                                        $pull: {
                                            calculategpaoverall: {
                                                _id: calculatedeleteitem
                                            }
                                        }
                                    }, function (err, results) {
                                        if (!err) {
                                            req.flash("message", "Successfully deleted course.");
                                            res.redirect("/calculate");
                                        } else {
                                            console.log("Couldn't delete");
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        } else {
            res.redirect("/logout");
        }
    });
});

// Delete all.
app.post("/delete/:deleteall", function (req, res) {
    const deletereq = _.lowerCase(req.params.deleteall);
    if (deletereq === "deleteallcalculate") {
        Overallstrt.updateOne({
            _id: req.user.id
        }, {
            $set: {
                calculategpaoverall: []
            }
        }, function (err, result) {
            console.log("Successfully deleted all!");
            res.redirect("/calculate");
        });
    } else {
        Overallstrt.updateOne({
            _id: req.user.id
        }, {
            $set: {
                gradesystemoverall: []
            }
        }, function (err, result) {
            req.flash("message", "Successfully deleted all.");
            res.redirect("/grade-system");
        });
    }
});

// Get request for review route.
app.get("/review", function (req, res) {
    Commentinput.find({}, function (err, foundComments) {
        if (!foundComments) {
            res.redirect("/review");
        } else {
            Commentinput.find({}, function (err, allDatas) {
                if (allDatas) {
                    const CommentLength = allDatas.length;
                    Replyinput.find({}, function (err, allInfos) {
                        const ReplyLength = allInfos.length;
                        const sumLength = CommentLength + ReplyLength;
                        res.render("review", {
                            allcomments: foundComments,
                            totalcomment: sumLength
                        });
                    })
                }
            });

        }
    });
});

// Post request for reply route.
app.post("/reply", function (req, res) {
    const gottenreply = req.body.replycomment;
    const commentID = req.body.commentId;
    const getDatereply = moment().format("YYYY-MM-DD h:m:s.SS a");
    const insertreply = new Replyinput({
        commentid: commentID,
        replyOne: gottenreply,
        timereplycreated: getDatereply
    });
    insertreply.save(function (err) {
        if (!err) {
            Commentinput.findOne({
                _id: commentID
            }, function (err, founddata) {
                if (founddata) {
                    founddata.reply.push(insertreply);
                    founddata.save(function (err) {
                        if (!err) {
                            Replyinput.find({
                                commentid: commentID
                            }, function (err, founddata1) {
                                const dataLength = founddata1.length;
                                founddata.replylength.pop();
                                founddata.replylength.push(dataLength);
                                founddata.save(function (err) {
                                    if (!err) {

                                        res.redirect("/review");
                                    }
                                })
                            });

                        } else {
                            console.log("Reply couldn't save");
                        }
                    })
                }
            })
        } else {
            console.log("Reply couldn't save");
        }
    })

});

// Get request for comment route.
app.route("/comment")
    .post(function (req, res) {
        const getDate = moment().format("YYYY-MM-DD h:m:s.SS a");
        const commentPost = req.body.commentpost;
        const mainID = req.body.mainid;
        const insertcomment = new Commentinput({
            comment: commentPost,
        });
        insertcomment.save(function (err) {
            if (!err) {
                Commentinput.find(function (err, foundUser) {
                    if (foundUser) {
                        const userLength = foundUser.length;
                        const calcLength = userLength - 1
                        const userFound = foundUser[calcLength];
                        userFound.timecreated.push(getDate);
                        userFound.save(function (err) {
                            if (!err) {
                                res.redirect("/review");
                            }
                        })
                    }
                })
            }
        });
    });

// Get request for siginup route.
app.get("/signup", function (req, res) {
    res.render("signup");
});



// Post request for siginup route.
app.post("/signup", authsignup, function (req, res) {
    const regUsername = req.body.regusername;
    const regEmail = req.body.username;
    const regPassword = req.body.password;
    const regConpassword = req.body.reqconpassword;
    Overallstrt.register({
        username: regEmail,
        username1: regUsername
    }, regPassword, function (err, user) {
        if (err) {
            console.log(err);
            res.redirect("/signup");
        } else {
            passport.authenticate("local")(req, res, function () {
                res.redirect("/signin");
            });
        }
    });
});

// Middleware for signup.
function authsignup(req, res, next) {
    Overallstrt.findOne({
        username: req.body.username
    }, function (err, foundUser) {
        if (foundUser) {
            req.flash("message", "Email is invalid or already taken.")
            res.render("signup", {
                userexists: req.flash("message")
            });
        } else {
            if (req.body.password === req.body.reqconpassword) {
                const passwformat = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
                if (req.body.password.match(passwformat)) {
                    next();
                } else {
                    req.flash("message", "Password didn't meet required format. Try again")
                    res.render("signup", {
                        passwordformat: req.flash("message")
                    });
                }
            } else {
                req.flash("message", "Those passwords didn't match. Try again.")
                res.render("signup", {
                    invalidpassword: req.flash("message")
                });
            }
        }
    })
}

// Get request for siginin route.
app.get("/signin", function (req, res) {
    res.render("signin");
});

// Post request for siginin route.
app.post("/signin", function (req, res, next) {
    passport.authenticate("local", function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            req.flash("message", "Invalid email or password.")
            res.render("signin", {
                emailexists: req.flash("message")
            });
        } else {
            req.login(user, function (err) {
                if (err) {
                    return next(err);
                }
                return res.redirect("/grade-system");
            });
        }
    })(req, res, next);
});

// Get request for forgetpassword route.
app.get("/forgotpassword", function (req, res) {
    res.render("forgetpassword");
});


// Post request for forgetpassword route.
app.post("/forgotpassword", authforgotpassword, function (req, res) {
    const resetUUIDuser = (`${req.resetUUID}`);
    const checkGPAurl = "http://localhost:3000/resetpassword/" + resetUUIDuser;
    // const emailUSER = (`${req.eMAIL}`);
    const output = `
        <p>We heard that you lost your checkGPA password. Sorry about that!</p>
        <p>But don’t worry! You can use the following link below to reset your password.</p>
<a href="${checkGPAurl}">${checkGPAurl}</a>
  <p>If you don’t use this link within 3 hours, it will expire.</p>
  <p>Note: if you are not the one that required a reset in password just ignore.</p>
      `;

    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: 'checkgpa2020@gmail.com',
            pass: process.env.AUTHPASSWORD
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    let mailOptions = {
        from: '"checkGPA" checkgpa2020@yahoo.com',
        to: `${req.eMAIL}`,
        subject: 'checkGPA password reset',
        text: 'checkGPA password reset',
        html: output
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        } else {
            req.flash("message", "Check your email for a link to reset your password. If it doesn’t appear within a few minutes, check your spam folder.")
            res.render("forgetpassword", {
                successalert: req.flash("message")
            });
        }
    });
});

// Middleware for forgot password.
function authforgotpassword(req, res, next) {
    Overallstrt.findOne({
        username: req.body.username
    }, function (err, foundUser) {
        if (foundUser) {
            const userFound = foundUser.username;
            const resetuuid = uuidv4();
            foundUser.resetpasswordtoken = resetuuid;
            foundUser.save(function (err) {
                if (!err) {
                    req.eMAIL = userFound;
                    req.resetUUID = resetuuid;
                    next();
                } else {
                    console.log("Couldn't generate");
                }
            })
        } else {
            req.flash("message", "Email is invalid or doesn't exist.")
            res.render("forgetpassword", {
                emailexists: req.flash("message")
            });
        }

    });
}

app.get("/resetpassword", function (req, res) {
    res.render("resetpassword");
})


// Get request for reset password route.
app.get("/resetpassword/:uuiduser", function (req, res) {
    const uuidUSER = req.params.uuiduser;
    Overallstrt.findOne({
        resetpasswordtoken: uuidUSER
    }, function (err, foundUser) {
        if (foundUser) {
            res.render("resetpassword", {
                resetpass: foundUser.username,
                resetuuid: uuidUSER
            });
        } else {
            res.redirect("/*")
        }
    });
});

// Post request for reset password route.
app.post("/resetpassword/:uuiduser", function (req, res) {
    const uuidUSER = req.params.uuiduser;
    Overallstrt.findOne({
        resetpasswordtoken: uuidUSER
    }, function (err, foundUser) {
        if (foundUser) {
            console.log("Found USER BITCH");
        } else {
            res.redirect("/*")
        }
    });

});

// Get request for privary policy route.
app.get("/privacy-policy", function (req, res) {
    res.render("privacypolicy");
});

// Get request for terms & conditions route.
app.get("/terms&conditions", function (req, res) {
    res.render("conditions");
});

// Get request for logout route.
app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
});



// 404 error route.
app.get("*", function (req, res, next) {

    res.render("404error")
})

// Listen at port 3000.
app.listen(process.env.PORT, function () {
    console.log("server started on port 3000");
});
