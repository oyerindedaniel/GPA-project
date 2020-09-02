// OYERINDE DANIEL DIEKOLOLUWA.
// checkGPA PROJECT.
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
// Cron.
const cron = require("node-cron");
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
app.locals.myemail1 = process.env.DANIELYAHOOEMAIL;
app.locals.myemail2 = process.env.DANIELGMAILEMAIL;
app.locals.checkgpa1 = process.env.CHECKGPAYAHOOEMAIL;
app.locals.checkgpa2 = process.env.CHECKGPAGMAILEMAIL;
app.locals.id1 = process.env.DANIELGOOGLEID;
app.locals.id2 = process.env.CHECKGPAGOOGLEID;
app.locals.my123 = process.env.FREEACCESS;
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

//Jokes
const jokesSchema = new mongoose.Schema({
    jokesgpa: {
        type: String,
    }
});

// Collection jokes Schema.
const Jokes = mongoose.model("Jokes", jokesSchema);

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
    changepasswordtoken: String,
    gradesystemoverall: [gradeSchema],
    calculategpaoverall: [calculateSchema],
    totalcalcunits: [Number],
    totalunit: [Number],
    resethournow: Number,
    resetdaynow: Number,
    resetmonthnow: Number,
    resetyearnow: Number,
    resetampmnow: String,
    finalresult: [],
    googleId: String,
    googlefirstname: String,
    googlelastname: String,
    googlename: String,
    googleimage: String,
    googleyes: String
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
        Overallstrt.findOrCreate({
            googleId: profile.id,
            googlefirstname: profile.name.givenName,
            googlelastname: profile.name.familyName,
            googlename: profile.displayName,
            googleimage: profile.photos[0].value,
            googleyes: "yes"
        }, function (err, user) {
            return cb(err, user);
        });
    }
));

// Get request for home route.
app.route("/")
    .get(function (req, res) {
        res.locals.style = "styles.css"
        res.locals.title = "checkGPA - Calculate GPA"
        res.render("gpalandingpage");
    });


app.route("/jokes")
    .get(function (req, res) {
        Jokes.find({}, function (err, foundJokes) {
            if (!err) {
                foundJokes.forEach(function (foundJoke) {
                    console.log(foundJoke.jokesgpa);
                })
            }
        })
    })

app.route("/jokes")
    .post(function (req, res) {
        const jokesGPA = req.body.jokes;
        console.log(jokesGPA);
        const jokes = new Jokes({
            jokesgpa: jokesGPA
        });
        jokes.save(function (err) {
            if (!err) {
                console.log("Jokes inserted");
                res.send("Jokes inserted");
            } else {
                console.log(err);
                res.send(err);
            }
        })
    });

// Get request for raiseGPA route.
app.get("/how-to-raise-gpa", function (req, res) {
    res.locals.style = "checkGPAguide.css"
    res.locals.title = "checkGPA - How to raise your GPA"
    const randomNumb = Math.floor((Math.random() * 17));
    console.log(randomNumb)
    Jokes.find({}, function (err, foundJokes) {
        if (foundJokes) {
            //            cron.schedule("* * * * *", function () {
            const filterJoke = foundJokes[randomNumb].jokesgpa;
            res.render("raisegpa", {
                jokeone: filterJoke
            });
            //            });
        } else {
            console.log(err);
        }
    })
});

// Get request for raiseGPA route.
app.get("/how-to-calculate-gpa", function (req, res) {
    res.locals.style = "checkGPAguide.css"
    res.locals.title = "checkGPA - How to calculate your GPA"
    res.render("calculategpa");
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
            res.locals.title = "checkGPA - Grade-System"
            Overallstrt.findById(req.user.id, function (err, gradeperperson) {
                if (gradeperperson) {
                    res.render("gradesystem", {
                        allgradeitems: gradeperperson.gradesystemoverall,
                        gradepictures: gradeperperson.googleimage,
                        danielaccess: gradeperperson.username,
                        mysignupname: gradeperperson.username1,
                        googlesignupname: gradeperperson.googlename,
                        validid: gradeperperson.googleId,
                        googleyes: gradeperperson.googleyes,
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
        const gradealpha = _.toUpper(req.body.grade1);
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
                    req.flash("message1", "Didn't save. Try Again.")
                    res.redirect("/grade-system");
                } else {
                    req.flash("message", "Saved Successfully.")
                    res.redirect("/grade-system");
                }
            }
        );
    });

// Middleware for grade system.
function authgradesystem(req, res, next) {
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
            res.locals.title = "checkGPA - CalculateGPA"
            Overallstrt.findById(req.user.id, function (err, calculategpaperson) {
                if (calculategpaperson) {

                    res.render("calculate", {
                        allcalculateitems: calculategpaperson.calculategpaoverall,
                        gradepictures: calculategpaperson.googleimage,
                        danielaccess: calculategpaperson.username,
                        validid: calculategpaperson.googleId,
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

    // Post request for calculate route.
    .post(function (req, res) {
        const coursecodebeta = _.upperCase(req.body.coursecode);
        const gradebeta = _.toUpper(req.body.grade2);
        const unitpercoursebeta = req.body.unitpercourse;
        Overallstrt.findById(req.user.id, function (err, foundUser) {
            if (!foundUser) {
                console.log(err);
            } else {
                const foundUsergrades = foundUser.gradesystemoverall;
                foundUsergrades.forEach(function (foundUsergrade) {
                    //Come back and put length that check how many and redirect them to another page.
                    //         if (foundUsergrade.grade1.length > 1) {
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
                    //                    } else {
                    //                        req.flash("message1", "Grade letter was not indicated in your grade system.");
                    //                        res.redirect("/calculate");
                    //                    }
                })
            }
        });
    });

// Get request for history route.
app.get("/history", function (req, res) {
    if (req.isAuthenticated()) {
        res.locals.title = "checkGPA - History"
        Overallstrt.findById(req.user.id, function (err, foundUser) {
            if (foundUser) {
                const highGRADE = Math.max.apply(Math, foundUser.gradesystemoverall.map(function (hgrade) {
                    return hgrade.points
                }));
                const calc1 = foundUser.totalcalcunits[0];
                const calc = foundUser.totalunit[0];
                const divCal1 = Math.round((calc1 / calc) * 100);
                const divCal = (divCal1 / 100);
                const two2f = divCal.toFixed(2)
                const lastarrayResult = foundUser.finalresult;
                lastarrayResult.pop();
                lastarrayResult.push(two2f);
                foundUser.save(function (err) {
                    if (!err) {
                        res.render("history", {
                            allitems: foundUser.calculategpaoverall,
                            allfinalresults: foundUser,
                            highestgrade: highGRADE,
                            gradepictures: foundUser.googleimage,
                            danielaccess: foundUser.username,
                            validid: foundUser.googleId
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
    });
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
    res.render("signup", {
        message1: req.flash("message1")
    });
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
                req.flash("message", "Successfully Registered. Try signing in.")
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
            req.flash("message1", "Email is invalid or already taken.")
            res.redirect("/signup");
        } else {
            if (req.body.password === req.body.reqconpassword) {
                const passwformat = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
                if (req.body.password.match(passwformat)) {
                    next();
                } else {
                    req.flash("message1", "Password didn't meet required format. Try again")
                    res.redirect("/signup");
                }
            } else {
                req.flash("message1", "Those passwords didn't match. Try again.")
                res.redirect("/signup");
            }
        }
    })
}

// Get request for siginin route.
app.get("/signin", function (req, res) {
    res.render("signin", {
        message: req.flash("message"),
        message1: req.flash("message1")
    });
});

// Post request for siginin route.
app.post("/signin", function (req, res, next) {
    passport.authenticate("local", function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            req.flash("message1", "Invalid email or password.");
            res.redirect("/signin");
        } else {
            req.login(user, function (err) {
                if (err) {
                    return next(err);
                }
                const usernameUP = _.toUpper(user.username1);
                req.flash("message", usernameUP + ".");
                return res.redirect("/grade-system");
            });
        }
    })(req, res, next);
});

// Get request for forgotpassword route.
app.get("/forgotpassword", function (req, res) {
    res.render("forgetpassword", {
        message: req.flash("message"),
        message1: req.flash("message1")
    });
});

// Post request for forgotpassword route.
app.post("/forgotpassword", authforgotpassword, function (req, res) {
    const resetUUIDuser = (`${req.resetUUID}`);
    const checkGPAurl = "http://localhost:3000/resetpassword/" + resetUUIDuser;
    const emailUSER = (`${req.eMAIL}`);
    const output = `
        <p>We heard that you lost your checkGPA password. Sorry about that!</p>
        <p>But don’t worry! You can use the following link below to reset your password.</p>
<a href="${checkGPAurl}">${checkGPAurl}</a>
  <p>If you don’t use this link within a day, it will expire.</p>
  <p>Note: if you did not request this, please ignore this email and your password will remain  unchanged. </p>
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
            res.redirect("/forgotpassword");
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
            foundUser.resetyearnow = moment().format('YYYY');
            foundUser.resetmonthnow = moment().format('M');
            foundUser.resetdaynow = moment().format('D');
            foundUser.resethournow = moment().format('H');
            foundUser.resetampmnow = moment().format('a');
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
            req.flash("message1", "Email is invalid or doesn't exist.")
            res.redirect("/forgotpassword");
        }

    });
}

// Get request for reset password for other routes.
app.get("/resetpassword/:uuiduser", function (req, res) {
    const uuidUSER = req.params.uuiduser;
    Overallstrt.findOne({
        resetpasswordtoken: uuidUSER
    }, function (err, foundUser) {
        if (foundUser) {
            const year = foundUser.resetyearnow;
            const month = foundUser.resetmonthnow;
            const day = foundUser.resetdaynow;
            const hour = foundUser.resethournow;
            const ampm = foundUser.resetampmnow;
            if (year == moment().format('YYYY') && month == moment().format('M') && day == moment().format('D')) {
                console.log()
                if (hour == moment().format('H') || hour + 1 == moment().format('H')) {
                    if (ampm === moment().format('a')) {
                        res.render("resetpassword", {
                            resetuuid: uuidUSER,
                            resetpass: foundUser.username
                        });
                    } else {
                        req.flash("message1", "The link has expired. Try again.")
                        res.redirect("/forgotpassword");
                    }
                } else {
                    req.flash("message1", "The link has expired. Try again.")
                    res.redirect("/forgotpassword");
                }

            } else {
                req.flash("message1", "The link has expired. Try again.")
                res.redirect("/forgotpassword");
            }

        } else {
            req.flash("message1", "The link has expired. Try again.")
            res.redirect("/forgotpassword");
        }
    });
});

// Post request for reset password for other routes.
app.post("/resetpassword/:uuiduser", authresetpassword, function (req, res) {
    const uuidUSER = req.params.uuiduser;
    const newPASS = req.body.password;
    Overallstrt.findOne({
        resetpasswordtoken: uuidUSER
    }, function (err, foundUser) {
        if (foundUser) {
            const passwformat = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
            if (newPASS.match(passwformat)) {
                const newUUID = uuidv4();
                foundUser.resetpasswordtoken = process.env.ONEHOURRESET + newUUID
                foundUser.save(function (err) {
                    if (!err) {
                        foundUser.setPassword(newPASS, function () {
                            foundUser.save(function (err) {
                                if (!err) {
                                    const output = `
            <p>checkGPA Password has successfully been changed.</p>
            <p>Please try not to forget again.</p>
    <p>With love from checkGPA</p>
    <a href="/privacy-policy">Privacy Statement</a>
    <a href="/terms&conditions">Terms of Service</a>
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
                                        to: foundUser.username,
                                        subject: 'checkGPA Password successfully changed',
                                        text: 'checkGPA Password successfully changed',
                                        html: output
                                    };
                                    transporter.sendMail(mailOptions, (error, info) => {
                                        if (error) {
                                            return console.log(error);
                                        } else {
                                            req.flash("message", "Password has successfully been changed. Try signing in.")
                                            res.redirect("/signin")
                                        }
                                    });
                                } else {
                                    req.flash("message1", "Password couldn't  be changed. Try again later and please try to follow all instructions.")
                                    res.redirect("/signin");
                                }
                            })
                        })
                    } else {
                        req.flash("message", "Password didn't meet required format. Try again")
                        res.render("resetpassword", {
                            passwrld: req.flash("message"),
                            resetuuid: uuidUSER,
                            resetpass: foundUser.username
                        });
                    }
                });
            } else {
                req.flash("message", "Password didn't meet required format. Try again")
                res.render("resetpassword", {
                    passwrld: req.flash("message"),
                    resetuuid: uuidUSER,
                    resetpass: foundUser.username
                });
            }
        } else {
            res.redirect("/*");
        }
    });
});

// Middleware for reset password for other routes.
function authresetpassword(req, res, next) {
    next();
}

// Get request for change password route.
app.get("/changepassword", function (req, res) {
    res.render("changepassword", {
        message: req.flash("message"),
        message1: req.flash("message1")
    });
});

// Post request for change password route.
app.post("/changepassword", authchangepassword, function (req, res) {
    const resetUUIDuser = (`${req.resetUUID}`);
    const checkGPAurl = "http://localhost:3000/changeresetpassword/" + resetUUIDuser;
    const emailUSER = (`${req.eMAIL}`);
    const output = `
        <p>We heard that you want your checkGPA password change. </p>
        <p>You can use the following link below to change your password.</p>
<a href="${checkGPAurl}">${checkGPAurl}</a>
  <p>If you don’t use this link before 2 hours, it will expire.</p>
  <p>Note: if you did not request this, please ignore this email and your password will remain  unchanged. </p>
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
        subject: 'checkGPA change password',
        text: 'checkGPA change password',
        html: output
    };
    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        } else {
            req.flash("message", "Check your email for a link to change your password. If it doesn’t appear within a few minutes, check your spam folder.")
            res.redirect("/changepassword");
        }
    });
});

// Middleware for change password.
function authchangepassword(req, res, next) {
    Overallstrt.findOne({
        username: req.body.username
    }, function (err, foundUser) {
        if (foundUser) {
            const userFound = foundUser.username;
            const resetuuid = uuidv4();
            foundUser.changepasswordtoken = resetuuid;
            foundUser.resetyearnow = moment().format('YYYY');
            foundUser.resetmonthnow = moment().format('M');
            foundUser.resetdaynow = moment().format('D');
            foundUser.resethournow = moment().format('H');
            foundUser.resetampmnow = moment().format('a');
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
            req.flash("message1", "Email is invalid or doesn't exist.")
            res.redirect("/changepassword");
        }

    });
}

// Get request for changepassword other route
app.get("/changeresetpassword/:uuiduser", function (req, res) {
    const uuidUSER = req.params.uuiduser;
    Overallstrt.findOne({
        changepasswordtoken: uuidUSER
    }, function (err, foundUser) {
        if (foundUser) {
            const year = foundUser.resetyearnow;
            const month = foundUser.resetmonthnow;
            const day = foundUser.resetdaynow;
            const hour = foundUser.resethournow;
            const ampm = foundUser.resetampmnow;
            if (year == moment().format('YYYY') && month == moment().format('M') && day == moment().format('D')) {
                console.log()
                if (hour == moment().format('H') || hour + 1 == moment().format('H')) {
                    if (ampm === moment().format('a')) {
                        res.render("changeresetpassword", {
                            resetuuid: uuidUSER,
                            resetpass: foundUser.username
                        });
                    } else {
                        req.flash("message1", "The link has expired. Try again.")
                        res.redirect("/changepassword");
                    }
                } else {
                    req.flash("message1", "The link has expired. Try again.")
                    res.redirect("/changepassword");
                }

            } else {
                req.flash("message1", "The link has expired. Try again.")
                res.redirect("/changepassword");
            }

        } else {
            req.flash("message1", "The link has expired. Try again.")
            res.redirect("/changepassword");
        }
    });
})

// Post request for changepassword other route
app.post("/changeresetpassword/:uuiduser", authchangeresetpassword, function (req, res) {
    const oldPassword = req.body.oldpassword;
    const newPassword = req.body.newpassword;
    const newreqPassword = req.body.newreqpassword;
    const uuidUSER = req.params.uuiduser;
    Overallstrt.findOne({
        changepasswordtoken: uuidUSER
    }, function (err, foundUser) {
        if (foundUser) {
            if (req.body.newpassword === req.body.newreqconpassword) {
                const changepasswformat = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
                if (req.body.newpassword.match(changepasswformat)) {
                    foundUser.changePassword(oldPassword, newPassword, function (err) {
                        if (!err) {
                            const newUUID2 = uuidv4();
                            foundUser.changepasswordtoken = process.env.ONEHOURRESET2 + newUUID2
                            foundUser.save(function (err) {
                                if (!err) {
                                    const output = `
                <p>checkGPA Password has successfully been changed.</p>
                <p>Please try not to forget again.</p>
        <p>With love from checkGPA</p>
        <a href="/privacy-policy">Privacy Statement</a>
        <a href="/terms&conditions">Terms of Service</a>
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
                                        to: foundUser.username,
                                        subject: 'checkGPA Password successfully changed',
                                        text: 'checkGPA Password successfully changed',
                                        html: output
                                    };
                                    transporter.sendMail(mailOptions, (error, info) => {
                                        if (error) {
                                            return console.log(error);
                                        } else {
                                            req.flash("message", "Password has successfully been changed. Try signing in.")
                                            res.redirect("/signin");
                                        }
                                    });
                                } else {
                                    console.log("uuid insertion error");
                                    res.redirect("/signin")
                                }
                            });
                        } else {
                            req.flash("message", "Formal password is invalid. Try again.");
                            res.render("changeresetpassword", {
                                passwrld: req.flash("message"),
                                resetuuid: uuidUSER,
                                resetpass: foundUser.username
                            });
                        }
                    });
                } else {
                    req.flash("message", "Password didn't meet required format. Try again.")
                    res.render("changeresetpassword", {
                        passwrld: req.flash("message"),
                        resetuuid: uuidUSER,
                        resetpass: foundUser.username
                    });
                }
            } else {
                req.flash("message", "Those passwords didn't match. Try again.")
                res.render("changeresetpassword", {
                    passwrld: req.flash("message"),
                    resetuuid: uuidUSER,
                    resetpass: foundUser.username
                });
            }
        } else {
            res.redirect("/*");
        }
    });
});

// Middleware for reset change password.
function authchangeresetpassword(req, res, next) {
    next();
}

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
    console.log(`server started on port ${process.env.PORT}`);
});
