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
    secret: "Our little secret.",
    cookie: {
        maxAge: null
    },
    resave: false,
    saveUninitialized: false
}));
app.use(flash())
app.use(cookieParser());
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
        required: [true, 'Grade required']
    },
    points: {
        type: Number,
        required: [true, 'Point required ']
    }

});

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
    gradesystemoverall: [gradeSchema],
    calculategpaoverall: [calculateSchema],
    totalcalcunits: [],
    totalunit: []
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
                                                                    //                                                                    console.log("Yeah");
                                                                    //                                                                    res.redirect("/calculate");
                                                                    sumData.forEach(function (sumDate) {
                                                                        const sum2 = sumDate.totaleachunits;
                                                                        foundUser.totalunit.pop();
                                                                        foundUser.totalunit.push(sum2);
                                                                        foundUser.save(function (err) {
                                                                            if (!err) {
                                                                                res.redirect("/calculate");
                                                                            }
                                                                        });
                                                                    });
                                                                }
                                                            });
                                                        }
                                                    })
                                                });


                                                //                                                const overallall = new Overallstrt({
                                                //                                                    totalunit: sumcalcData
                                                //                                                });
                                                //                                                overallall.save(function (err) {
                                                //                                                    if (!err) {
                                                //                                                        res.redirect("/calculate");
                                                //                                                    }
                                                //                                                })
                                                //The total units
                                                //                                                const userId = mongoose.Types.ObjectId(req.user.id);
                                                //                                                Overallstrt.aggregate([{
                                                //                                                            $match: {
                                                //                                                                _id: userId
                                                //                                                            }
                                                //                                            },
                                                //                                                        {
                                                //                                                            $group: {
                                                //                                                                _id: null,
                                                //                                                                "totalunits": {
                                                //                                                                    $sum: {
                                                //                                                                        $sum: "$calculategpaoverall.unitpercourse"
                                                //                                                                    }
                                                //                                                                }
                                                //                                                            }
                                                //                                            }
                                                //                ]),
                                                //                                                    function (err, sumData) {
                                                //                                                        if (!err) {
                                                //                                                            const overallall = new Overallstrt({
                                                //                                                                totalcalcunits: sumData,
                                                //                                                                totalunit: sumcalcData
                                                //                                                            });
                                                //                                                            overallall.save(function (err) {
                                                //                                                                if (!err) {
                                                //                                                                    console.log(sumData);
                                                //                                                                    res.redirect("/calculate");
                                                //                                                                }
                                                //                                                            })
                                                //                                                        }
                                                //                                                    }
                                            } else {
                                                res.redirect("/grade-system");
                                            }
                                        });
                                    }
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
        const userId = mongoose.Types.ObjectId(req.user.id);
        Overallstrt.aggregate([{
                $match: {
                    _id: userId
                }
                },
            {
                $group: {
                    _id: null,
                    "totalunits": {

                        $sum: {
                            $sum: "$calculategpaoverall.multiplyunit"
                        }
                    }

                }
                        }
                ]).exec(function (err, sumData) {
            if (!err) {
                console.log(sumData);
                res.redirect("/grade-system");
            } else {
                res.redirect("/grade-system");
            }
        });
        ////////////////////////////////////////////////////////////////////////////////////
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
        //  
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
            res.redirect("/grade-system");
            console.log("Successfully deleted");
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
        //  const foundresult = foundUser.totalunit;
        const arrayLength = (foundcalcresult.length - 1);
        // const arrayLengths= (foundresult.length - 1);
        const gottencalcValue = foundcalcresult[arrayLength];
        // console.log(foundresult[arrayLengths]);
        if (foundUser) {
            const usercalcs = foundUser.calculategpaoverall;
            usercalcs.forEach(function (usercalc) {
                if (usercalc.id === calculatedeleteitem) {
                    const gottenValue = usercalc.multiplyunit;
                    const gottenresult = (gottencalcValue - gottenValue);
                    foundcalcresult.pop();
                    foundcalcresult.push(gottenresult);
                    foundUser.save();
                    res.redirect("/calculate");
                }
            });
        } else {
            res.redirect("/logout");
        }
    })


    //    Overallstrt.findOneAndUpdate({
    //        _id: UserID
    //    }, {
    //        $pull: {
    //            calculategpaoverall: {
    //                _id: calculatedeleteitem
    //            }
    //        }
    //    }, function (err, results) {
    //        if (!err) {
    //            res.redirect("/calculate");
    //            console.log("Successfully deleted");
    //        } else {
    //            console.log("Couldn't delete");
    //        }
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
