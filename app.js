require('dotenv').config();
const express = require('express');
const bodyParser = require("body-parser");
const ejs = require("ejs");
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const app = express();
const _ = require('lodash');
const mongoose = require('mongoose');
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(session({
    secret: "Danielgpa",
    cookie: {
        maxAge: 60000
    },
    resave: false,
    saveUninitialized: false
}));
app.use(flash())
app.use(cookieParser())
////app.use(cookieParser());
////app.configure(function () {
//    app.use(express.cookieParser({"gpaapp": config.cookieSecret}));   
// //   app.use(express.cookieParser('gpaapp'));
//    app.use(flash());
////});



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

// Collection grade Schema.
const gradeSchema = new mongoose.Schema({
    grade1: {
        type: String,
        required: [true, '#']
    },
    points: {
        type: Number,
        required: [true, '#']
    }

});

const Gradesystemvalue = mongoose.model("Gradesystemvalue", gradeSchema);

const calculateSchema = new mongoose.Schema({
    coursecode: {
        type: String,
        required: [true, '#']
    },
    grade2: {
        type: String,
        required: [true, '#']
    },
    unitpercourse: {
        type: Number,
        required: [true, '#']
    },
    multiplyunit: String
});

// Collection calculate Schema.
const Calculategpavalue = mongoose.model("Calculategpavalue", calculateSchema);

// Collection overallstructure Schema.
const overallstrtSchema = new mongoose.Schema({
    username1: String,
    username: String,
    password: String,
    gradesystemoverall: [gradeSchema],
    calculategpaoverall: [calculateSchema]
});

overallstrtSchema.plugin(passportLocalMongoose);

const Overallstrt = new mongoose.model("Overallstrt", overallstrtSchema);

passport.use(Overallstrt.createStrategy());

passport.serializeUser(Overallstrt.serializeUser());
passport.deserializeUser(Overallstrt.deserializeUser());

app.route("/")
    .get(function (req, res) {
        res.render("gpalandingpage");
    });

app.route("/grade-system")
    // Work on this.
    .get(function (req, res) {
        if (req.isAuthenticated()) {
            Overallstrt.findById(req.user.id, function (err, gradeperperson) {
                if (gradeperperson) {
                    res.render("gradesystem", {
                        allgradeitems: gradeperperson.gradesystemoverall,
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

    .post(function (req, res) {
        const gradealpha = _.upperCase(req.body.grade1);
        const pointalpha = req.body.point;
        //        Overallstrt.findById(req.user.id, function (err, foundUser) {
        //            if (err) {
        //                console.log(err);
        //            } else {
        //                if (foundUser) {
        //        Gradesystemvalue.findOne({
        //            grade1: gradealpha
        //        }, function (err, grade) {
        //            if (!grade) {
        const gradesystem = new Gradesystemvalue({
            grade1: gradealpha,
            points: pointalpha
        });
        //        Overallstrt.findById(req.user.id, function (err, foundUser) {
        //            if (!foundUser) {
        //                console.log("No User")
        //            } else {
        //                foundUser.updateOne({
        //                        _id: req.user.id
        //
        //                    }, {
        //
        //                        $addToSet: {
        //                            gradesystemoverall: gradesystem
        //                        }
        //                    },
        //                    function (err, result) {
        //                        if (err) {
        //                            res.send(err);
        //                        } else {
        //                            res.redirect("/grade-system");
        //                        }
        //                    }
        //                )
        //
        //            }
        //
        //        });
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
                    req.flash("message", "Saved Successfully!")
                    res.redirect("/grade-system");
                }
            }
        );
        //        gradesystem.save(function (err) {
        //            if (!err) {
        //                console.log(gradesystem);
        //                Overallstrt.findByIdAndUpdate(
        //                    req.user.id, {
        //                        $addToSet: {
        //                            gradesystemoverall: {
        //                                kind: 'tortoise',
        //                                hashtag: 'foo'
        //
        //                            }
        //                        }
        //                    })
        //
        //            } else {
        //                console.log("Couldn't Saved");
        //            }
        //
        //    });


        //                Overallstrt.findById(req.user.id, function (err, foundUser) {
        //                    if (!foundUser) {
        //                        console("No found user")
        //                    } else {
        //                        const usercoll = foundUser.gradesystemoverall;
        //                         
        //                        foundUser.gradesystemoverall.push(gradesystem);
        //                        foundUser.save(function () {
        //                            res.redirect("/grade-system");
        //                        });
        //                    }
        //
        //                });
        //            } else {
        //                console.log("Couldn't Saved");
        //            }

        //                                        }else{
        //                        console.log("Couldn't find data in database signup");    
        //                                        }


        //   gradesystem.save(function (err) {
        //  if (!err) {
        //    console.log("Saved");
        //  res.redirect("/grade-system");
        //         } else {
        //   console.log("Couldn't Saved");
        //                  }
        //         });
        //            } else {
        //                console.log("Grade already there");
        //            }
        //        });
        //                } else {
        //                    console.log("Couldn't find user in database signup");
        //                }
        //            }
        //
        //        });
    });

app.route("/calculate")
    .get(function (req, res) {
        if (req.isAuthenticated()) {
            Overallstrt.findById(req.user.id, function (err, calculategpaperson) {
                if (calculategpaperson) {
                    res.render("calculate", {
                        allcalculateitems: calculategpaperson.calculategpaoverall
                    });
                } else {
                    console.log("Nothing found");
                }
            });
        } else {
            res.redirect("/signin");
        }
    })
    .post(function (req, res) {
        _.upperCase(req.body.coursecode);
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
                                foundUser.save(function () {
                                    res.redirect("/calculate");
                                });
                            }
                        });
                    } else {
                        console.log("No it");
                    }
                })
            }

        });

        //             
        //        const coursecodebeta = req.body.coursecode;
        //        const gradebeta = req.body.grade2;
        //        const unitpercoursebeta = req.body.unitpercourse;
        //        Gradesystemvalue.findOne({
        //            grade1: gradebeta
        //        }, function (err, founds) {
        //            if (!founds) {
        //                console.log("Bitch go to grade system.")
        //                res.redirect("/grade-system");
        //            } else {
        //                if (founds.grade1 === gradebeta) {
        //                    const multipyunits = founds.points * unitpercoursebeta;
        //                    const calculategpa = new Calculategpavalue({
        //                        coursecode: coursecodebeta,
        //                        grade2: gradebeta,
        //                        unitpercourse: unitpercoursebeta,
        //                        multiplyunit: multipyunits
        //                    });
        //                    calculategpa.save(function (err) {
        //                        if (!err) {
        //                            res.redirect("/calculate");
        //                        }
        //                    });
        //                } else {
        //                    console.log("No");
        //                    res.redirect("/calculate");
        //                }
        //            }
        //        });
    });

app.get("/history", function (req, res) {
    if (req.isAuthenticated()) {
        //  Calculategpavalue.find(function (err, foundunits) {
        //      if (foundunits) {
        //          foundunits.forEach(function (foundunit) {
        //              var a = foundunit.multiplyunit;
        //
        //              var b = a + foundunit.multiplyunit;
        //              console.log(b);
        //              //var pusharrays = [];
        //              // pusharrays.push(foundunit.multiplyunit)
        //              //   const letsum = _.sum();
        //              //console.log(pusharrays);
        //          })
        //
        //
        //      }
        // // });
        res.render("history");
    } else {
        res.redirect("/signin");
    }
});

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
            res.redirect("/grade-system");
            console.log("Successfully deleted");
        } else {
            console.log("Couldn't delete");
        }
    });

});

app.post("/deleteitem2", function (req, res) {
    const calculatedeleteitem = req.body.deleteitemcalculate;
    const UserID = req.user.id;
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
            res.redirect("/calculate");
            console.log("Successfully deleted");
        } else {
            console.log("Couldn't delete");
        }
    });

    //    Overallstrt.findById(req.user.id, function (err, foundUser) {
    //        if (!foundUser) {
    //            console.log("Something went wrong could not delete.");
    //        } else {
    //   const calcitems =  foundUser.calculategpaoverall;
    //    calcitems.
    //        }
    //
    //    });

});

app.get("/signup", function (req, res) {
    res.render("signup");
});

app.post("/signup", function (req, res) {
    const regUsername = req.body.regusername;
    const regEmail = req.body.username;
    const regPassword = req.body.password;
    const regConpassword = req.body.regconpassword;
    //    const overallreg = new Overallstrt({
    //        username1: regUsername,
    //    });
    //    overallreg.save(function (err) {
    //        if (!err) {
    //            res.redirect("/");
    //        }
    //    });
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

app.get("/signin", function (req, res) {
    res.render("signin");
});

app.post("/signin", function (req, res) {
    const loginEmail = req.body.username;
    const loginPassword = req.body.password;
    const user = new Overallstrt({
        username: loginEmail,
        password: loginPassword
    });

    req.login(user, function (err) {
        if (err) {
            console.log(err);
            res.redirect("/signin");
        } else {
            passport.authenticate("local")(req, res, function () {
                res.redirect("/grade-system");
            });
        }
    });
});

app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
});

app.listen(3000, function () {
    console.log("server started on port 3000");
});
