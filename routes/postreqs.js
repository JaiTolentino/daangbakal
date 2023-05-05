const express = require('express');
const app = express();
const pool = require('./dbconfig')
const session = require('express-session');
const {render} = require('./postreqs');
const crypto = require('crypto');
const mysecret = crypto.randomBytes(32).toString('hex');
const multer = require('multer');
const fs = require('fs');
const functions = require('./functions');
const bcrypt = require('bcrypt');

app.use(session ({
    secret: mysecret,
    resave: false,
    saveUninitialized: true
}))

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './views/uploads');
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

app.post("/verificationReq", (req, res) => {
    const {username} = req.body;
    pool.query('SELECT * FROM familyheadtable where email = ?', [username], (error, results) => {
        if (error) console.log(error);
        else {}
        if (results.length > 0) {
            const phoneNumber = functions.text(results[0].phoneNumber);
            const rawverificationCode = Math.floor(Math.random() * 900000) + 100000;
            console.log(rawverificationCode);
            const verificationCode = rawverificationCode.toString();
            req.session.verificationCode = verificationCode;
            req.session.email = username;
            res.redirect('/verificationsub');
        }
        else {
        pool.query("SELECT * FROM familymembertable WHERE email = ?", [username], (error, results) => {
            if (error) console.log(error)
            else {
            if (results.length > 0) {
                const phoneNumber = functions.text(results[0].phoneNumber);
                const rawverificationCode = Math.floor(Math.random() * 900000) + 100000;
                console.log(rawverificationCode);
                const verificationCode = rawverificationCode.toString();
                req.session.verificationCode = verificationCode;
                req.session.email = username;
                res.redirect('/verificationsub');
            }
            else {
                pool.query("SELECT * FROM admintable WHERE email = ?", [username], (error, results) => {
                if(error) console.log(error)
                else{
                    if (results.length > 0) {
                    const phoneNumber = functions.text(results[0].phoneNumber);
                    const rawverificationCode = Math.floor(Math.random() * 900000) + 100000;
                    console.log(rawverificationCode);
                    const verificationCode = rawverificationCode.toString();             
                    req.session.verificationCode = verificationCode;
                    req.session.email = username;
                    res.redirect('/verificationsub');
                    }
                    else {
                    res.render('verificationReq')
                    }
                }
                })
            }
            }
        })
        }
    });    
});

app.post("/OTPVerify", (req, res) => {
    const {OTP} = req.body;
    console.log(req.session.verificationCode)
    if(OTP === req.session.verificationCode){
        req.session.loggedIn = true;
        res.redirect('/changepassword');
    } else if (OTP === "") {
        res.render('verificationSub')
    } else {
        res.render('login')
        req.session.destroy();
    } 
})

app.post("/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) console.log(err);
      else{
        res.redirect('/');
      }
    })
})

app.post("/data", (req, res) => { // app.post is used to retreive data from forms. "/data" is the action of the form. (see register.hbs)

    const {firstname, lastname, email, contactnum, sex, maritalstatus, birthdate, address, password, confirmpassword} = req.body; // used to get the data from the html or hbs 
    const familycode = firstname.toUpperCase() + lastname.toUpperCase() + "FAMILY";
    var contactnumchecked = functions.phonenumcheck(contactnum);

    pool.query("SELECT phoneNumber FROM familyheadtable WHERE phoneNumber = ?", [contactnumchecked], async (error, results) => {
        if(error) console.log(error)
        else {
            if(results.length > 0) {
            return res.render('register', {message: "Phone number is already Registered"})
            } else {
                pool.query('SELECT email FROM familyheadtable WHERE email = ?', [email], async (error, results) => { //pool.query is used for communicating with the database. can add mysql syntaxes
                if (error) {
                    console.log(error);
                } else {
                    if (results.length > 0) {
                    return res.render('register', {
                        message: 'Email is already Registered'
                    });
                    } else if (password !== confirmpassword) {
                    return res.render('register', {
                        message: 'Password do not match! Please check.'
                    });
                    } else {
                        var age = functions.createage(birthdate);
                        var birthdatemodified = functions.dobconvert(birthdate.toString());
                        bcrypt.hash(password, 10, function (err, encryptedpassword) { // use salt in the bcrypt.hash to work bcrypt.hash(password, 8) doesnt work.. needs salt
                        pool.query('INSERT INTO familyheadtable SET ?', { email: email, fname: firstname, lname: lastname, age: age, phoneNumber: contactnumchecked, sex: sex, maritalStatus: maritalstatus, birthdate: birthdatemodified, address: address, passwords: encryptedpassword, familyCode: familycode}, (err, result) => {
                        if (err) {
                            console.log(err);
                        } else {
                            res.render('successfulregister')
                            
                        }
                        });
                    });
                    }
                }
            });
            }
        }
    })
})

app.post("/datamember", (req, res) => { // app.post is used to retreive data from forms. "/data" is the action of the form. (see register.hbs)
    const {firstname, lastname, email, contactnum, sex, maritalstatus, birthdate, password, confirmpassword} = req.body; // used to get the data from the html or hbs 
    const emaillogin = req.session.email;
    pool.query("SELECT * FROM familyheadtable WHERE email = ?", [emaillogin], async (error, result) => {
      if(error) console.log(error);
      else {
        const familycode = result[0].familycode;
        const address = result[0].address;
        var contactnumchecked = functions.phonenumcheck(contactnum);
        if (firstname === "" || lastname ==="" || email === "" || contactnum ==="" || sex === "" || maritalstatus === "" || birthdate === "" || address === "" || password === "" || confirmpassword === "") {
            return res.render('headregister', {
              message: 'Please do not leave the fields blank'
            });
        }
        else {
          pool.query("SELECT phoneNumber FROM familyheadtable WHERE phoneNumber = ?", [contactnumchecked], async (error, results) => {
            if(error) console.log(error)
            else {
              if(results.length > 0) {
                return res.render('headregister', {message: "Phone number is already Registered"})
              } else {
                    pool.query('SELECT email FROM familymembertable WHERE email = ?', [email], async (error, results) => { //pool.query is used for communicating with the database. can add mysql syntaxes
                    if (error) {
                      console.log(error);
                    } else {
                      if (results.length > 0) {
                        return res.render('headregister', {
                          message: 'Email is already Registered'
                        });
                      } else if (password !== confirmpassword) {
                        return res.render('headregister', {
                          message: 'Password do not match! Please check.'
                        });
                      } else {
                          var age = functions.createage(birthdate);
                          var birthdatemodified = functions.dobconvert(birthdate.toString());
                        bcrypt.hash(password, 10, function (err, encryptedpassword) { // use salt in the bcrypt.hash to work bcrypt.hash(password, 8) doesnt work.. needs salt
                          pool.query('INSERT INTO familymembertable SET ?', { email: email, fname: firstname, lname: lastname, age: age, phoneNumber: contactnumchecked, sex: sex, maritalStatus: maritalstatus, birthdate: birthdatemodified, address: address, passwords: encryptedpassword, familyCode: familycode}, (err, result) => {
                            if (err) {
                              console.log(err);
                            } else {
                              res.render('headsuccessfulregister')
                              
                            }
                          });
                        });
                      }
                    }
                });
              }
            }
          })     
        }
      }
    })
})

app.post("/datahead", (req, res) => { // app.post is used to retreive data from forms. "/data" is the action of the form. (see register.hbs)
    const {adminusername, admincontactnum, adminfname, adminlname, adminpassword, confirmadminpassword} = req.body; // used to get the data from the html or hbs
    var contactnumchecked = functions.phonenumcheck(admincontactnum);
    if (adminusername === "" || admincontactnum ==="" || adminfname === "" || adminlname ==="" || adminpassword === "" || confirmadminpassword === "") {
        return res.render('register', {
          message: 'Please do not leave the fields blank'
        });
    }
    else {
      pool.query("SELECT phoneNumber FROM admintable WHERE phoneNumber = ?", [contactnumchecked], async (error, results) => {
        if(error) console.log(error)
        else {
          if(results.length > 0) {
            return res.render('register', {message: "Phone number is already Registered"})
          } else {
                pool.query('SELECT email FROM admintable WHERE email = ?', [adminusername], async (error, results) => { //pool.query is used for communicating with the database. can add mysql syntaxes
                if (error) {
                  console.log(error);
                } else {
                  if (results.length > 0) {
                    return res.render('chmaddadmin', {
                      message: 'Email is already Registered'
                    });
                  } else if (adminpassword !== confirmadminpassword) {
                    return res.render('chmaddadmin', {
                      message: 'Password do not match! Please check.'
                    });
                  } else {
                    bcrypt.hash(adminpassword, 10, function (err, encryptedpassword) { // use salt in the bcrypt.hash to work bcrypt.hash(password, 8) doesnt work.. needs salt
                      pool.query('INSERT INTO admintable SET ?', { email: adminusername, fname: adminfname, lname: adminlname, phoneNumber: admincontactnum, phoneNumber: contactnumchecked, passwords: encryptedpassword}, (err, result) => {
                        if (err) {
                          console.log(err);
                        } else {
                          res.redirect('chmaddadmin')
                          
                        }
                      });
                    });
                  }
                }
            });
          }
        }
      })   
    }
})

app.post("/login", upload.none(), (req, res) => {
    const {emaillogin, passwordlogin} = req.body;
    req.session.emaillogin = emaillogin;
    if (emaillogin === "" || passwordlogin === "") {
        console.log("Please do not leave the fields blank");
        res.render('login',{message: "Please do not leave the fields blank!"})
    }
    else {
        pool.query("SELECT * FROM familyheadtable where email = ?", [emaillogin], async (error, results) => {
            if (error){
                console.log(error);
            } else {
                if (results.length > 0) {
                    const hashedpassword = results[0].passwords;
                    bcrypt.compare(passwordlogin, hashedpassword, function(err, isMatch) {
                        if (err) console.log(err);
                        if (isMatch) {
                            req.session.familyhead = true;
                            req.session.email  = results[0].email;
                            req.session.familycode = results[0].familycode
                            res.redirect("/headhome");
                        } else {
                            res.render('login',{message: "Password does not match!"})
                        }
                    });
                } else {
                  pool.query("SELECT * FROM kapitanadmintable WHERE email = ?", [emaillogin], async (error, results) => {
                    if (error) console.log(error);
                    else {
                      if (results.length > 0) {
                        const hashedpassword = results[0].passwords;
                        bcrypt.compare(passwordlogin, hashedpassword, function(err, isMatch) {
                            if (err) console.log(err);
                            if (isMatch) {
                                req.session.kapadmin = true;
                                req.session.sessionid  = results[0].session_id;
                                res.redirect("/chmhome");
                            } else {
                                res.render('login',{message: "Password does not match!"})
                            }
                        });
                      } else {
                        pool.query("SELECT * FROM admintable WHERE email = ?", [emaillogin], async (error, results) => {
                          if (error) console.log(error);
                          else {
                            if(results.length > 0) {
                              const hashedpassword = results[0].passwords;
                              bcrypt.compare(passwordlogin, hashedpassword, function(err, isMatch) {
                                  if (err) console.log(err);
                                  if (isMatch) {
                                      req.session.admin = true;
                                      req.session.sessionid  = results[0].session_id;
                                      res.redirect("/admhome");
                                  } else {
                                      res.render('login',{message: "Password does not match!"})
                                  }
                              });
                            } else {
                              pool.query("SELECT * FROM familymembertable WHERE email = ?", [emaillogin], async (error, results) => {
                                if (error) console.log(error);
                                else {
                                  if(results.length > 0) {
                                    const hashedpassword = results[0].passwords;
                                    bcrypt.compare(passwordlogin, hashedpassword, function(err, isMatch) {
                                        if (err) console.log(err);
                                        if (isMatch) {
                                            req.session.familymember = true;
                                            req.session.sessionid  = results[0].session_id;
                                            res.redirect("/loggedin");
                                        } else {
                                            res.render('login',{message: "Password does not match!"})
                                        }
                                    });
                                  } else {
                                    res.render('login', {message: "Account is not yet registered"})
                                  }
                                }
                              })
                            }
                          }
                        })
                      }
                    }
                  })
                }
            }
        })
    }
})

app.post("/changepassword", (req, res) => {
    const {pass, passconf} = req.body;
    if (pass !== passconf) {
        console.log("password do not match")
        return res.render('changepassword', {
          message: 'Password do not match! Please check.'
        });
    } else {
        bcrypt.hash(pass, 10, function (err, encryptedpassword) { // use salt in the bcrypt.hash to work bcrypt.hash(password, 8) doesnt work.. needs salt
            pool.query('UPDATE familyheadtable SET passwords = ? WHERE email = ?', [encryptedpassword, req.session.username])
            console.log("Password has been resetted! Redirecting you to Login Page");
            res.redirect('/successfulchange');
            
        });
    }
})

app.post("/news1", upload.single('anncnewsimg1'), (req, res) => {
    if (!req.file) console.log("Please Insert a Image");
    else {
      const anncnewsimg1 = req.file;
      const {anncnewsheader1, anncnewsbody1, anncnewslink1} = req.body;
      const email = req.session.emaillogin;
      const newsid = 1;
      if(anncnewsheader1 === "" || anncnewsbody1 === "") {
        res.render("admannouncements", {message: "Please Do not Leave the Fields Blank!"})
      } else {
        pool.query("SELECT * FROM posttable WHERE news_id = 1", (error, results) => {
          if (error) console.log(error);
          else {
            if(results.length === 1) {
              pool.query("DELETE FROM posttable WHERE news_id = 1", (error) => {
                if (error) console.log(error);
              });
              pool.query("INSERT INTO posttable SET ?", {Header: anncnewsheader1, Body: anncnewsbody1, Link: anncnewslink1, news_id: newsid}, (err, result) => {
                if (err) console.log(err);
                else {
                  console.log("Data Posted in Database!")
                }
              })
              pool.query("SELECT * FROM familyheadtable where email = ?", [email], (error, results) => {
                if (error) console.log(error);
                else {
                  fs.rename(anncnewsimg1.path, './views/uploads/news/' + anncnewsimg1.fieldname + '.ico', (err) => {
                    if (err) console.log(err);
                    else {
                      const anncnewsimg1Path = '/views/uploads/news/' + anncnewsimg1.fieldname + '.ico';
                      req.session.anncnewsimg1Path = anncnewsimg1Path;
                      console.log("File Uploaded Successfuly!")
                    }
                  })
                }
              })
            } else {
              pool.query("INSERT INTO posttable SET ?", {Header: anncnewsheader1, Body: anncnewsbody1,Link: anncnewslink1, news_id: newsid}, (err, result) => {
                if (err) console.log(err);
                else {
                  console.log("Data Posted in Database!")
                }
              })
              pool.query("SELECT * FROM familyheadtable where email = ?", [email], (error, results) => {
                if (error) console.log(error);
                else {
                  fs.rename(anncnewsimg1.path, './views/uploads/news/' + anncnewsimg1.fieldname + '.ico', (err) => {
                    if (err) console.log(err);
                    else {
                      const anncnewsimg1Path = '/views/uploads/news/' + anncnewsimg1.fieldname + '.ico';
                      req.session.anncnewsimg1Path = anncnewsimg1Path;
                      console.log("File Uploaded Successfuly!")
                    }
                  })
                }
              })
            }
          }
        })
      }
    }
})

app.post("/news2", upload.single('anncnewsimg2'), (req, res) => {
    if (!req.file) console.log("Please Insert a Image");
    else {
      const anncnewsimg2 = req.file;
      const {anncnewsheader2, anncnewsbody2, anncnewslink2} = req.body;
      const email = req.session.emaillogin;
      const newsid = 2;
      if(anncnewsheader2 === "" || anncnewsbody2 === "") {
        res.render("admannouncements", {message: "Please Do not Leave the Fields Blank!"})
      } else {
        pool.query("SELECT * FROM posttable WHERE news_id = 2", (error, results) => {
          if (error) console.log(error);
          else {
            if(results.length === 1) {
              pool.query("DELETE FROM posttable WHERE news_id = 2", (error) => {
                if (error) console.log(error);
              });
              pool.query("INSERT INTO posttable SET ?", {Header: anncnewsheader2, Body: anncnewsbody2, Link: anncnewslink2, news_id: newsid}, (err, result) => {
                if (err) console.log(err);
                else {
                  console.log("Data Posted in Database!")
                }
              })
              pool.query("SELECT * FROM familyheadtable where email = ?", [email], (error, results) => {
                if (error) console.log(error);
                else {
                  fs.rename(anncnewsimg2.path, './views/uploads/news/' + anncnewsimg2.fieldname + '.ico', (err) => {
                    if (err) console.log(err);
                    else {
                      const anncnewsimg2Path = '/views/uploads/news/' + anncnewsimg2.fieldname + '.ico';
                      req.session.anncnewsimg2Path = anncnewsimg2Path;
                      console.log("File Uploaded Successfuly!")
                    }
                  })
                }
              })
            } else {
              pool.query("INSERT INTO posttable SET ?", {Header: anncnewsheader2, Body: anncnewsbody2,Link: anncnewslink2, news_id: newsid}, (err, result) => {
                if (err) console.log(err);
                else {
                  console.log("Data Posted in Database!")
                }
              })
              pool.query("SELECT * FROM familyheadtable where email = ?", [email], (error, results) => {
                if (error) console.log(error);
                else {
                  fs.rename(anncnewsimg2.path, './views/uploads/news/' + anncnewsimg2.fieldname + '.ico', (err) => {
                    if (err) console.log(err);
                    else {
                      const anncnewsimg2Path = '/views/uploads/news/' + anncnewsimg2.fieldname + '.ico';
                      req.session.anncnewsimg2Path = anncnewsimg2Path;
                      console.log("File Uploaded Successfuly!")
                    }
                  })
                }
              })
            }
          }
        })
      }
    }
})

app.post("/events1", upload.single('annceventimg1'), (req, res) => {
    if (!req.file) console.log("Please Insert a Image");
    else {
      const annceventimg1 = req.file;
      const {annceventheader1, annceventbody1, annceventlink1} = req.body;
      const email = req.session.emaillogin;
      const newsid = 3;
      if(annceventheader1 === "" || annceventbody1 === "") {
        res.render("admannouncements", {message: "Please Do not Leave the Fields Blank!"})
      } else {
        pool.query("SELECT * FROM posttable WHERE news_id = 3", (error, results) => {
          if (error) console.log(error);
          else {
            if(results.length === 1) {
              pool.query("DELETE FROM posttable WHERE news_id = 3", (error) => {
                if (error) console.log(error);
              });
              pool.query("INSERT INTO posttable SET ?", {Header: annceventheader1, Body: annceventbody1, Link: annceventlink1, news_id: newsid}, (err, result) => {
                if (err) console.log(err);
                else {
                  console.log("Data Posted in Database!")
                }
              })
              pool.query("SELECT * FROM familyheadtable where email = ?", [email], (error, results) => {
                if (error) console.log(error);
                else {
                  fs.rename(annceventimg1.path, './views/uploads/news/' + annceventimg1.fieldname + '.ico', (err) => {
                    if (err) console.log(err);
                    else {
                      const annceventimg1Path = '/views/uploads/news/' + annceventimg1.fieldname + '.ico';
                      req.session.annceventimg1Path = annceventimg1Path;
                      console.log("File Uploaded Successfuly!")
                    }
                  })
                }
              })
            } else {
              pool.query("INSERT INTO posttable SET ?", {Header: annceventheader1, Body: annceventbody1, Link: annceventlink1, news_id: newsid}, (err, result) => {
                if (err) console.log(err);
                else {
                  console.log("Data Posted in Database!")
                }
              })
              pool.query("SELECT * FROM familyheadtable where email = ?", [email], (error, results) => {
                if (error) console.log(error);
                else {
                  fs.rename(annceventimg1.path, './views/uploads/news/' + annceventimg1.fieldname + '.ico', (err) => {
                    if (err) console.log(err);
                    else {
                      const annceventimg1Path = '/views/uploads/news/' + annceventimg1.fieldname + '.ico';
                      req.session.annceventimg1Path = annceventimg1Path;
                      console.log("File Uploaded Successfuly!")
                    }
                  })
                }
              })
            }
          }
        })
      }
    }
})

app.post("/events2", upload.single('annceventimg2'), (req, res) => {
    if (!req.file) console.log("Please Insert a Image");
    else {
      const annceventimg2 = req.file;
      const {annceventheader2, annceventbody2, annceventlink2} = req.body;
      const email = req.session.emaillogin;
      const newsid = 4;
      if(annceventheader2 === "" || annceventbody2 === "") {
        res.render("admannouncements", {message: "Please Do not Leave the Fields Blank!"})
      } else {
        pool.query("SELECT * FROM posttable WHERE news_id = 4", (error, results) => {
          if (error) console.log(error);
          else {
            if(results.length === 1) {
              pool.query("DELETE FROM posttable WHERE news_id = 4", (error) => {
                if (error) console.log(error);
              });
              pool.query("INSERT INTO posttable SET ?", {Header: annceventheader2, Body: annceventbody2, Link: annceventlink2, news_id: newsid}, (err, result) => {
                if (err) console.log(err);
                else {
                  console.log("Data Posted in Database!")
                }
              })
              pool.query("SELECT * FROM familyheadtable where email = ?", [email], (error, results) => {
                if (error) console.log(error);
                else {
                  fs.rename(annceventimg2.path, './views/uploads/news/' + annceventimg2.fieldname + '.ico', (err) => {
                    if (err) console.log(err);
                    else {
                      const annceventimg2Path = '/views/uploads/news/' + annceventimg2.fieldname + '.ico';
                      req.session.annceventimg2Path = annceventimg2Path;
                      console.log("File Uploaded Successfuly!")
                    }
                  })
                }
              })
            } else {
              pool.query("INSERT INTO posttable SET ?", {Header: annceventheader2, Body: annceventbody2, Link: annceventlink2, news_id: newsid}, (err, result) => {
                if (err) console.log(err);
                else {
                  console.log("Data Posted in Database!")
                }
              })
              pool.query("SELECT * FROM familyheadtable where email = ?", [email], (error, results) => {
                if (error) console.log(error);
                else {
                  fs.rename(annceventimg2.path, './views/uploads/news/' + annceventimg2.fieldname + '.ico', (err) => {
                    if (err) console.log(err);
                    else {
                      const annceventimg2Path = '/views/uploads/news/' + annceventimg2.fieldname + '.ico';
                      req.session.annceventimg2Path = annceventimg2Path;
                      console.log("File Uploaded Successfuly!")
                    }
                  })
                }
              })
            }
          }
        })
      }
    }
})

app.post("/flash1", upload.single('anncflashimg1'), (req, res) =>{
    if (!req.file) console.log("Please Insert a Image");
    else {
      const anncflashimg1 = req.file;
      fs.rename(anncflashimg1.path, './views/uploads/news/' + anncflashimg1.fieldname + '.ico', (err) => {
        if (err) console.log(err);
        else {
          const anncflashimg1Path = '/views/uploads/news/' + anncflashimg1.fieldname + '.ico';
          req.session.anncflashimg1Path = anncflashimg1Path;
          console.log("File Uploaded Successfuly!")
        }
      })
    }
})

app.post("/flash2", upload.single('anncflashimg2'), (req, res) =>{
    if (!req.file) console.log("Please Insert a Image");
    else {
      const anncflashimg2 = req.file;
      fs.rename(anncflashimg2.path, './views/uploads/news/' + anncflashimg2.fieldname + '.ico', (err) => {
        if (err) console.log(err);
        else {
          const anncflashimg2Path = '/views/uploads/news/' + anncflashimg2.fieldname + '.ico';
          req.session.anncflashimg2Path = anncflashimg2Path;
          console.log("File Uploaded Successfuly!")
        }
      })
    }
})

app.post("/certview", (req, res) => {
    res.render("login")
})

app.post("/deletefammember", (req, res) => {
    const {selected} = req.body;
    pool.query("DELETE FROM familymembertable WHERE email = ?", [selected], (error, results) => {
      if (error) console.log(error)
      else {
        res.redirect("/headviewmembers")
      }
    })
})

app.post("/deleteadmin", (req, res) => {
    const {selected} = req.body;
    console.log(selected);
    pool.query("DELETE FROM admintable WHERE email = ?", [selected], (error, results) => {
      if (error) console.log(error)
      else {
        console.log("deleted admin")
        res.redirect("chmaddadmin")
      }
    })
})

app.post("/submitresidency", upload.fields([
    { name: 'validid', maxCount: 1 },
    { name: 'proofofresidency', maxCount: 1 }])
    , (req, res) => {
    if (!req.files) console.log("Please Insert a Image");
    else {
      const validid = req.files['validid'][0]
      const proofofresidency = req.files['proofofresidency'][0]
      const email = req.session.emaillogin
      const document = "Certificate of Residency"
      const status = "In Verification"
      const requestcode = email+document;
      pool.query("INSERT INTO pendingcertificates SET ?", {email: email, document: document, status:status, requestcode: requestcode}, (error, results) => {
        if(error) console.log(error)
        else {
          console.log("successful insert")
        }
      })
      pool.query("SELECT * FROM familyheadtable WHERE email = ?", [email], (error, results) => {
        if (error) console.log(error);
        else {
          fs.rename(validid.path, './views/uploads/application/' + results[0].fname + results[0].lname + "-" + validid.fieldname + "-" + document + '.PNG', (err) => {
            if (err) console.log(err);
            else {
              const valididPath = '/views/uploads/application/' + results[0].fname + results[0].lname + "-" + validid.fieldname + "-" + document + '.PNG';
              req.session.valididPath = valididPath;
              console.log("File Uploaded Successfuly!")
            }
          })
          fs.rename(proofofresidency.path, './views/uploads/application/' + results[0].fname + results[0].lname + "-" + proofofresidency.fieldname + "-" + document + '.PNG', (err) => {
            if (err) console.log(err);
            else {
              const proofofresidencyPath = '/views/uploads/application/' + results[0].fname + results[0].lname + "-" + proofofresidency.fieldname + "-" + document + '.PNG';
              req.session.proofofresidencyPath = proofofresidencyPath;
              console.log("File Uploaded Successfuly!")
            }
          })
          res.redirect("/headcertificates")
        }
      })
    }
})

app.post("/submitclearance", upload.fields([
    { name: 'validid', maxCount: 1 },
    { name: 'proofofresidency', maxCount: 1 }])
    , (req, res) => {
    if (!req.files) console.log("Please Insert a Image");
    else {
      const validid = req.files['validid'][0]
      const proofofresidency = req.files['proofofresidency'][0]
      const email = req.session.emaillogin
      const document = "Barangay Clearance"
      const status = "In Verification"
      const requestcode = email+document;
      pool.query("INSERT INTO pendingcertificates SET ?", {email: email, document: document, status:status, requestcode: requestcode}, (error, results) => {
        if(error) console.log(error)
        else {
          console.log("successful insert")
        }
      })
      pool.query("SELECT * FROM familyheadtable WHERE email = ?", [email], (error, results) => {
        if (error) console.log(error);
        else {
          fs.rename(validid.path, './views/uploads/application/' + results[0].fname + results[0].lname + "-" + validid.fieldname + "-" + document +'.PNG', (err) => {
            if (err) console.log(err);
            else {
              const valididPath = '/views/uploads/application/' + results[0].fname + results[0].lname + "-" + validid.fieldname + "-" + document + '.PNG';
              req.session.valididPath = valididPath;
              console.log("File Uploaded Successfuly!")
            }
          })
          fs.rename(proofofresidency.path, './views/uploads/application/' + results[0].fname + results[0].lname + "-" + proofofresidency.fieldname + "-" + document + '.PNG', (err) => {
            if (err) console.log(err);
            else {
              const proofofresidencyPath = '/views/uploads/application/' + results[0].fname + results[0].lname + "-" + proofofresidency.fieldname + "-" + document + '.PNG';
              req.session.proofofresidencyPath = proofofresidencyPath;
              console.log("File Uploaded Successfuly!")
            }
          })
          res.redirect("/headcertificates")
        }
      })
    }
})

app.post("/submitindigent", upload.fields([
    { name: 'validid', maxCount: 1 },
    { name: 'barangayclearance', maxCount: 1 }])
    , (req, res) => {
    if (!req.files) console.log("Please Insert a Image");
    else {
      const validid = req.files['validid'][0]
      const barangayclearance = req.files['barangayclearance'][0]
      const email = req.session.emaillogin
      const document = "Certificate of Being Indigent"
      const status = "In Verification"
      const requestcode = email+document;
      pool.query("INSERT INTO pendingcertificates SET ?", {email: email, document: document, status:status, requestcode: requestcode}, (error, results) => {
        if(error) console.log(error)
        else {
          console.log("successful insert")
        }
      })
      pool.query("SELECT * FROM familyheadtable WHERE email = ?", [email], (error, results) => {
        if (error) console.log(error);
        else {
          fs.rename(validid.path, './views/uploads/application/' + results[0].fname + results[0].lname + "-" + validid.fieldname + "-" + document +'.PNG', (err) => {
            if (err) console.log(err);
            else {
              const valididPath = '/views/uploads/application/' + results[0].fname + results[0].lname + "-" + validid.fieldname + "-" + document + '.PNG';
              req.session.valididPath = valididPath;
              console.log("File Uploaded Successfuly!")
            }
          })
          fs.rename(barangayclearance.path, './views/uploads/application/' + results[0].fname + results[0].lname + "-" + barangayclearance.fieldname + "-" + document + '.PNG', (err) => {
            if (err) console.log(err);
            else {
              const barangayclearancePath = '/views/uploads/application/' + results[0].fname + results[0].lname + "-" + barangayclearance.fieldname + "-" + document + '.PNG';
              req.session.barangayclearancePath = barangayclearancePath;
              console.log("File Uploaded Successfuly!")
            }
          })
          res.redirect("/headcertificates")
        }
      })
    }
})

app.post("/submitnewbspermit", upload.fields([
    { name: 'validid', maxCount: 1 },
    { name: 'businessownership', maxCount: 1 },
    { name: 'barangayclearance', maxCount: 1 },
    { name: 'mayorpermit', maxCount: 1 },
    { name: 'firesafetyinspection', maxCount: 1 },
    { name: 'environmentalclearance', maxCount: 1 }
  ])
    , (req, res) => {
    if (!req.files) console.log("Please Insert a Image");
    else {
      const validid = req.files['validid'][0]
      const businessownership = req.files['businessownership'][0]
      const barangayclearance = req.files['barangayclearance'][0]
      const mayorpermit = req.files['mayorpermit'][0]
      const firesafetyinspection = req.files['firesafetyinspection'][0]
      const environmentalclearance = req.files['environmentalclearance'][0]
      const email = req.session.emaillogin
      const document = "Business Permit Application"
      const status = "In Verification"
      const requestcode = email+document;
      pool.query("INSERT INTO pendingcertificates SET ?", {email: email, document: document, status:status, requestcode: requestcode}, (error, results) => {
        if(error) console.log(error)
        else {
          console.log("successful insert")
        }
      })
      pool.query("SELECT * FROM familyheadtable WHERE email = ?", [email], (error, results) => {
        if (error) console.log(error);
        else {
          fs.rename(validid.path, './views/uploads/application/' + results[0].fname + results[0].lname + "-" + validid.fieldname + "-" + document +'.PNG', (err) => {
            if (err) console.log(err);
            else {
              const valididPath = '/views/uploads/application/' + results[0].fname + results[0].lname + "-" + validid.fieldname + "-" + document + '.PNG';
              req.session.valididPath = valididPath;
              console.log("File Uploaded Successfuly!")
            }
          })
          fs.rename(businessownership.path, './views/uploads/application/' + results[0].fname + results[0].lname + "-" + businessownership.fieldname + "-" + document + '.PNG', (err) => {
            if (err) console.log(err);
            else {
              const businessownershipPath = '/views/uploads/application/' + results[0].fname + results[0].lname + "-" + businessownership.fieldname + "-" + document + '.PNG';
              req.session.businessownershipPath = businessownershipPath;
              console.log("File Uploaded Successfuly!")
            }
          })
          fs.rename(barangayclearance.path, './views/uploads/application/' + results[0].fname + results[0].lname + "-" + barangayclearance.fieldname + "-" + document + '.PNG', (err) => {
            if (err) console.log(err);
            else {
              const barangayclearancePath = '/views/uploads/application/' + results[0].fname + results[0].lname + "-" + barangayclearance.fieldname + "-" + document + '.PNG';
              req.session.barangayclearancePath = barangayclearancePath;
              console.log("File Uploaded Successfuly!")
            }
          })
          fs.rename(mayorpermit.path, './views/uploads/application/' + results[0].fname + results[0].lname + "-" + mayorpermit.fieldname + "-" + document + '.PNG', (err) => {
            if (err) console.log(err);
            else {
              const mayorpermitPath = '/views/uploads/application/' + results[0].fname + results[0].lname + "-" + mayorpermit.fieldname + "-" + document + '.PNG';
              req.session.mayorpermitPath = mayorpermitPath;
              console.log("File Uploaded Successfuly!")
            }
          })
          fs.rename(firesafetyinspection.path, './views/uploads/application/' + results[0].fname + results[0].lname + "-" + firesafetyinspection.fieldname + "-" + document + '.PNG', (err) => {
            if (err) console.log(err);
            else {
              const firesafetyinspectionPath = '/views/uploads/application/' + results[0].fname + results[0].lname + "-" + firesafetyinspection.fieldname + "-" + document + '.PNG';
              req.session.firesafetyinspectionPath = firesafetyinspectionPath;
              console.log("File Uploaded Successfuly!")
            }
          })
          fs.rename(environmentalclearance.path, './views/uploads/application/' + results[0].fname + results[0].lname + "-" + environmentalclearance.fieldname + "-" + document + '.PNG', (err) => {
            if (err) console.log(err);
            else {
              const environmentalclearancePath = '/views/uploads/application/' + results[0].fname + results[0].lname + "-" + environmentalclearance.fieldname + "-" + document + '.PNG';
              req.session.environmentalclearancePath = environmentalclearancePath;
              console.log("File Uploaded Successfuly!")
            }
          })
          res.redirect("/headcertificates")
        }
      })
    }
})

app.post("/submitrenewbspermit", upload.fields([
    { name: 'validid', maxCount: 1 },
    { name: 'oldbusinesspermit', maxCount: 1 },
    { name: 'barangayclearance', maxCount: 1 },
    { name: 'mayorpermit', maxCount: 1 },
    { name: 'firesafetyinspection', maxCount: 1 },
    { name: 'environmentalclearance', maxCount: 1 }
  ])
    , (req, res) => {
    if (!req.files) console.log("Please Insert a Image");
    else {
      const validid = req.files['validid'][0]
      const oldbusinesspermit = req.files['oldbusinesspermit'][0]
      const barangayclearance = req.files['barangayclearance'][0]
      const mayorpermit = req.files['mayorpermit'][0]
      const firesafetyinspection = req.files['firesafetyinspection'][0]
      const environmentalclearance = req.files['environmentalclearance'][0]
      const email = req.session.emaillogin
      const document = "Business Permit Renewal"
      const status = "In Verification"
      const requestcode = email+document;
      pool.query("INSERT INTO pendingcertificates SET ?", {email: email, document: document, status:status, requestcode: requestcode}, (error, results) => {
        if(error) console.log(error)
        else {
          console.log("successful insert")
        }
      })
      pool.query("SELECT * FROM familyheadtable WHERE email = ?", [email], (error, results) => {
        if (error) console.log(error);
        else {
          fs.rename(validid.path, './views/uploads/application/' + results[0].fname + results[0].lname + "-" + validid.fieldname + "-" + document +'.PNG', (err) => {
            if (err) console.log(err);
            else {
              const valididPath = '/views/uploads/application/' + results[0].fname + results[0].lname + "-" + validid.fieldname + "-" + document + '.PNG';
              req.session.valididPath = valididPath;
              console.log("File Uploaded Successfuly!")
            }
          })
          fs.rename(oldbusinesspermit.path, './views/uploads/application/' + results[0].fname + results[0].lname + "-" + oldbusinesspermit.fieldname + "-" + document + '.PNG', (err) => {
            if (err) console.log(err);
            else {
              const oldbusinesspermitPath = '/views/uploads/application/' + results[0].fname + results[0].lname + "-" + oldbusinesspermit.fieldname + "-" + document + '.PNG';
              req.session.oldbusinesspermitPath = oldbusinesspermitPath;
              console.log("File Uploaded Successfuly!")
            }
          })
          fs.rename(barangayclearance.path, './views/uploads/application/' + results[0].fname + results[0].lname + "-" + barangayclearance.fieldname + "-" + document + '.PNG', (err) => {
            if (err) console.log(err);
            else {
              const barangayclearancePath = '/views/uploads/application/' + results[0].fname + results[0].lname + "-" + barangayclearance.fieldname + "-" + document + '.PNG';
              req.session.barangayclearancePath = barangayclearancePath;
              console.log("File Uploaded Successfuly!")
            }
          })
          fs.rename(mayorpermit.path, './views/uploads/application/' + results[0].fname + results[0].lname + "-" + mayorpermit.fieldname + "-" + document + '.PNG', (err) => {
            if (err) console.log(err);
            else {
              const mayorpermitPath = '/views/uploads/application/' + results[0].fname + results[0].lname + "-" + mayorpermit.fieldname + "-" + document + '.PNG';
              req.session.mayorpermitPath = mayorpermitPath;
              console.log("File Uploaded Successfuly!")
            }
          })
          fs.rename(firesafetyinspection.path, './views/uploads/application/' + results[0].fname + results[0].lname + "-" + firesafetyinspection.fieldname + "-" + document + '.PNG', (err) => {
            if (err) console.log(err);
            else {
              const firesafetyinspectionPath = '/views/uploads/application/' + results[0].fname + results[0].lname + "-" + firesafetyinspection.fieldname + "-" + document + '.PNG';
              req.session.firesafetyinspectionPath = firesafetyinspectionPath;
              console.log("File Uploaded Successfuly!")
            }
          })
          fs.rename(environmentalclearance.path, './views/uploads/application/' + results[0].fname + results[0].lname + "-" + environmentalclearance.fieldname + "-" + document + '.PNG', (err) => {
            if (err) console.log(err);
            else {
              const environmentalclearancePath = '/views/uploads/application/' + results[0].fname + results[0].lname + "-" + environmentalclearance.fieldname + "-" + document + '.PNG';
              req.session.environmentalclearancePath = environmentalclearancePath;
              console.log("File Uploaded Successfuly!")
            }
          })
          res.redirect("/headcertificates")
        }
      })
    }
  })
  
app.post("/membsubmitresidency", upload.fields([
    { name: 'validid', maxCount: 1 },
    { name: 'proofofresidency', maxCount: 1 }])
    , (req, res) => {
    if (!req.files) console.log("Please Insert a Image");
    else {
      const validid = req.files['validid'][0]
      const proofofresidency = req.files['proofofresidency'][0]
      const email = req.session.emaillogin
      const document = "Certificate of Residency"
      const status = "In Verification"
      const requestcode = email+document;

      pool.query("INSERT INTO pendingcertificates SET ?", {email: email, document: document, status:status, requestcode:requestcode}, (error, results) => {
        if(error) console.log(error)
        else {
          console.log("successful insert")
        }
      })
      pool.query("SELECT * FROM familymembertable WHERE email = ?", [email], (error, results) => {
        if (error) console.log(error);
        else {
          fs.rename(validid.path, './views/uploads/application/' + results[0].fname + results[0].lname + "-" + validid.fieldname + "-" + document + '.PNG', (err) => {
            if (err) console.log(err);
            else {
              const valididPath = '/views/uploads/application/' + results[0].fname + results[0].lname + "-" + validid.fieldname + "-" + document + '.PNG';
              req.session.valididPath = valididPath;
              console.log("File Uploaded Successfuly!")
            }
          })
          fs.rename(proofofresidency.path, './views/uploads/application/' + results[0].fname + results[0].lname + "-" + proofofresidency.fieldname + "-" + document + '.PNG', (err) => {
            if (err) console.log(err);
            else {
              const proofofresidencyPath = '/views/uploads/application/' + results[0].fname + results[0].lname + "-" + proofofresidency.fieldname + "-" + document + '.PNG';
              req.session.proofofresidencyPath = proofofresidencyPath;
              console.log("File Uploaded Successfuly!")
            }
          })
          res.redirect("/certificates")
        }
      })
    }
})

app.post("/membsubmitclearance", upload.fields([
    { name: 'validid', maxCount: 1 },
    { name: 'proofofresidency', maxCount: 1 }])
    , (req, res) => {
    if (!req.files) console.log("Please Insert a Image");
    else {
      const validid = req.files['validid'][0]
      const proofofresidency = req.files['proofofresidency'][0]
      const email = req.session.emaillogin
      const document = "Barangay Clearance"
      const status = "In Verification"
      const requestcode = email+document;
      pool.query("INSERT INTO pendingcertificates SET ?", {email: email, document: document, status:status, requestcode: requestcode}, (error, results) => {
        if(error) console.log(error)
        else {
          console.log("successful insert")
        }
      })
      pool.query("SELECT * FROM familymembertable WHERE email = ?", [email], (error, results) => {
        if (error) console.log(error);
        else {
          fs.rename(validid.path, './views/uploads/application/' + results[0].fname + results[0].lname + "-" + validid.fieldname + "-" + document +'.PNG', (err) => {
            if (err) console.log(err);
            else {
              const valididPath = '/views/uploads/application/' + results[0].fname + results[0].lname + "-" + validid.fieldname + "-" + document + '.PNG';
              req.session.valididPath = valididPath;
              console.log("File Uploaded Successfuly!")
            }
          })
          fs.rename(proofofresidency.path, './views/uploads/application/' + results[0].fname + results[0].lname + "-" + proofofresidency.fieldname + "-" + document + '.PNG', (err) => {
            if (err) console.log(err);
            else {
              const proofofresidencyPath = '/views/uploads/application/' + results[0].fname + results[0].lname + "-" + proofofresidency.fieldname + "-" + document + '.PNG';
              req.session.proofofresidencyPath = proofofresidencyPath;
              console.log("File Uploaded Successfuly!")
            }
          })
          res.redirect("/certificates")
        }
      })
    }
})

app.post("/membsubmitindigent", upload.fields([
    { name: 'validid', maxCount: 1 },
    { name: 'barangayclearance', maxCount: 1 }])
    , (req, res) => {
    if (!req.files) console.log("Please Insert a Image");
    else {
      const validid = req.files['validid'][0]
      const barangayclearance = req.files['barangayclearance'][0]
      const email = req.session.emaillogin
      const document = "Certificate of Being Indigent"
      const status = "In Verification"
      const requestcode = email+document;
      pool.query("INSERT INTO pendingcertificates SET ?", {email: email, document: document, status:status, requestcode: requestcode}, (error, results) => {
        if(error) console.log(error)
        else {
          console.log("successful insert")
        }
      })
      pool.query("SELECT * FROM familymembertable WHERE email = ?", [email], (error, results) => {
        if (error) console.log(error);
        else {
          fs.rename(validid.path, './views/uploads/application/' + results[0].fname + results[0].lname + "-" + validid.fieldname + "-" + document +'.PNG', (err) => {
            if (err) console.log(err);
            else {
              const valididPath = '/views/uploads/application/' + results[0].fname + results[0].lname + "-" + validid.fieldname + "-" + document + '.PNG';
              req.session.valididPath = valididPath;
              console.log("File Uploaded Successfuly!")
            }
          })
          fs.rename(barangayclearance.path, './views/uploads/application/' + results[0].fname + results[0].lname + "-" + barangayclearance.fieldname + "-" + document + '.PNG', (err) => {
            if (err) console.log(err);
            else {
              const barangayclearancePath = '/views/uploads/application/' + results[0].fname + results[0].lname + "-" + barangayclearance.fieldname + "-" + document + '.PNG';
              req.session.barangayclearancePath = barangayclearancePath;
              console.log("File Uploaded Successfuly!")
            }
          })
          res.redirect("/certificates")
        }
      })
    }
})

app.post("/membsubmitnewbspermit", upload.fields([
    { name: 'validid', maxCount: 1 },
    { name: 'businessownership', maxCount: 1 },
    { name: 'barangayclearance', maxCount: 1 },
    { name: 'mayorpermit', maxCount: 1 },
    { name: 'firesafetyinspection', maxCount: 1 },
    { name: 'environmentalclearance', maxCount: 1 }
  ])
    , (req, res) => {
    if (!req.files) console.log("Please Insert a Image");
    else {
      const validid = req.files['validid'][0]
      const businessownership = req.files['businessownership'][0]
      const barangayclearance = req.files['barangayclearance'][0]
      const mayorpermit = req.files['mayorpermit'][0]
      const firesafetyinspection = req.files['firesafetyinspection'][0]
      const environmentalclearance = req.files['environmentalclearance'][0]
      const email = req.session.emaillogin
      const document = "Business Permit Application"
      const status = "In Verification"
      const requestcode = email+document;
      pool.query("INSERT INTO pendingcertificates SET ?", {email: email, document: document, status:status, requestcode: requestcode}, (error, results) => {
        if(error) console.log(error)
        else {
          console.log("successful insert")
        }
      })
      pool.query("SELECT * FROM familymembertable WHERE email = ?", [email], (error, results) => {
        if (error) console.log(error);
        else {
          fs.rename(validid.path, './views/uploads/application/' + results[0].fname + results[0].lname + "-" + validid.fieldname + "-" + document +'.PNG', (err) => {
            if (err) console.log(err);
            else {
              const valididPath = '/views/uploads/application/' + results[0].fname + results[0].lname + "-" + validid.fieldname + "-" + document + '.PNG';
              req.session.valididPath = valididPath;
              console.log("File Uploaded Successfuly!")
            }
          })
          fs.rename(businessownership.path, './views/uploads/application/' + results[0].fname + results[0].lname + "-" + businessownership.fieldname + "-" + document + '.PNG', (err) => {
            if (err) console.log(err);
            else {
              const businessownershipPath = '/views/uploads/application/' + results[0].fname + results[0].lname + "-" + businessownership.fieldname + "-" + document + '.PNG';
              req.session.businessownershipPath = businessownershipPath;
              console.log("File Uploaded Successfuly!")
            }
          })
          fs.rename(barangayclearance.path, './views/uploads/application/' + results[0].fname + results[0].lname + "-" + barangayclearance.fieldname + "-" + document + '.PNG', (err) => {
            if (err) console.log(err);
            else {
              const barangayclearancePath = '/views/uploads/application/' + results[0].fname + results[0].lname + "-" + barangayclearance.fieldname + "-" + document + '.PNG';
              req.session.barangayclearancePath = barangayclearancePath;
              console.log("File Uploaded Successfuly!")
            }
          })
          fs.rename(mayorpermit.path, './views/uploads/application/' + results[0].fname + results[0].lname + "-" + mayorpermit.fieldname + "-" + document + '.PNG', (err) => {
            if (err) console.log(err);
            else {
              const mayorpermitPath = '/views/uploads/application/' + results[0].fname + results[0].lname + "-" + mayorpermit.fieldname + "-" + document + '.PNG';
              req.session.mayorpermitPath = mayorpermitPath;
              console.log("File Uploaded Successfuly!")
            }
          })
          fs.rename(firesafetyinspection.path, './views/uploads/application/' + results[0].fname + results[0].lname + "-" + firesafetyinspection.fieldname + "-" + document + '.PNG', (err) => {
            if (err) console.log(err);
            else {
              const firesafetyinspectionPath = '/views/uploads/application/' + results[0].fname + results[0].lname + "-" + firesafetyinspection.fieldname + "-" + document + '.PNG';
              req.session.firesafetyinspectionPath = firesafetyinspectionPath;
              console.log("File Uploaded Successfuly!")
            }
          })
          fs.rename(environmentalclearance.path, './views/uploads/application/' + results[0].fname + results[0].lname + "-" + environmentalclearance.fieldname + "-" + document + '.PNG', (err) => {
            if (err) console.log(err);
            else {
              const environmentalclearancePath = '/views/uploads/application/' + results[0].fname + results[0].lname + "-" + environmentalclearance.fieldname + "-" + document + '.PNG';
              req.session.environmentalclearancePath = environmentalclearancePath;
              console.log("File Uploaded Successfuly!")
            }
          })
          res.redirect("/certificates")
        }
      })
    }
})

app.post("/membsubmitrenewbspermit", upload.fields([
    { name: 'validid', maxCount: 1 },
    { name: 'oldbusinesspermit', maxCount: 1 },
    { name: 'barangayclearance', maxCount: 1 },
    { name: 'mayorpermit', maxCount: 1 },
    { name: 'firesafetyinspection', maxCount: 1 },
    { name: 'environmentalclearance', maxCount: 1 }
  ])
    , (req, res) => {
    if (!req.files) console.log("Please Insert a Image");
    else {
      const validid = req.files['validid'][0]
      const oldbusinesspermit = req.files['oldbusinesspermit'][0]
      const barangayclearance = req.files['barangayclearance'][0]
      const mayorpermit = req.files['mayorpermit'][0]
      const firesafetyinspection = req.files['firesafetyinspection'][0]
      const environmentalclearance = req.files['environmentalclearance'][0]
      const email = req.session.emaillogin
      const document = "Renewal of Business Permit";
      const status = "In Verification";
      const requestcode = email+document;
      pool.query("INSERT INTO pendingcertificates SET ?", {email: email, document: document, status:status, requestcode: requestcode}, (error, results) => {
        if(error) console.log(error)
        else {
          console.log("successful insert in renew bs permit")
        }
      })
      pool.query("SELECT * FROM familymembertable WHERE email = ?", [email], (error, results) => {
        if (error) console.log(error);
        else {
          fs.rename(validid.path, './views/uploads/application/' + results[0].fname + results[0].lname + "-" + validid.fieldname + "-" + document +'.PNG', (err) => {
            if (err) console.log(err);
            else {
              const valididPath = '/views/uploads/application/' + results[0].fname + results[0].lname + "-" + validid.fieldname + "-" + document + '.PNG';
              req.session.valididPath = valididPath;
              console.log("File Uploaded Successfuly!")
            }
          })
          fs.rename(oldbusinesspermit.path, './views/uploads/application/' + results[0].fname + results[0].lname + "-" + oldbusinesspermit.fieldname + "-" + document + '.PNG', (err) => {
            if (err) console.log(err);
            else {
              const oldbusinesspermitPath = '/views/uploads/application/' + results[0].fname + results[0].lname + "-" + oldbusinesspermit.fieldname + "-" + document + '.PNG';
              req.session.oldbusinesspermitPath = oldbusinesspermitPath;
              console.log("File Uploaded Successfuly!")
            }
          })
          fs.rename(barangayclearance.path, './views/uploads/application/' + results[0].fname + results[0].lname + "-" + barangayclearance.fieldname + "-" + document + '.PNG', (err) => {
            if (err) console.log(err);
            else {
              const barangayclearancePath = '/views/uploads/application/' + results[0].fname + results[0].lname + "-" + barangayclearance.fieldname + "-" + document + '.PNG';
              req.session.barangayclearancePath = barangayclearancePath;
              console.log("File Uploaded Successfuly!")
            }
          })
          fs.rename(mayorpermit.path, './views/uploads/application/' + results[0].fname + results[0].lname + "-" + mayorpermit.fieldname + "-" + document + '.PNG', (err) => {
            if (err) console.log(err);
            else {
              const mayorpermitPath = '/views/uploads/application/' + results[0].fname + results[0].lname + "-" + mayorpermit.fieldname + "-" + document + '.PNG';
              req.session.mayorpermitPath = mayorpermitPath;
              console.log("File Uploaded Successfuly!")
            }
          })
          fs.rename(firesafetyinspection.path, './views/uploads/application/' + results[0].fname + results[0].lname + "-" + firesafetyinspection.fieldname + "-" + document + '.PNG', (err) => {
            if (err) console.log(err);
            else {
              const firesafetyinspectionPath = '/views/uploads/application/' + results[0].fname + results[0].lname + "-" + firesafetyinspection.fieldname + "-" + document + '.PNG';
              req.session.firesafetyinspectionPath = firesafetyinspectionPath;
              console.log("File Uploaded Successfuly!")
            }
          })
          fs.rename(environmentalclearance.path, './views/uploads/application/' + results[0].fname + results[0].lname + "-" + environmentalclearance.fieldname + "-" + document + '.PNG', (err) => {
            if (err) console.log(err);
            else {
              const environmentalclearancePath = '/views/uploads/application/' + results[0].fname + results[0].lname + "-" + environmentalclearance.fieldname + "-" + document + '.PNG';
              req.session.environmentalclearancePath = environmentalclearancePath;
              console.log("File Uploaded Successfuly!")
            }
          })
          res.redirect("/certificates")
        }
      })
    }
})

app.post("/showfullcert", (req, res) => {
    const {email,document,code} = req.body;
    req.session.certemail = email
    req.session.reqcode = code
    if(document === "Certificate of Residency") {
      res.redirect("/admcertresidency")
    } else if ( document === "Barangay Clearance") {
      res.redirect("/admcertclearance")
    } else if (document === "Certificate of Being Indigent") {
      res.redirect("/admcertindigent")
    }else if (document === "Business Permit Application") {
      res.redirect("/admcertnewbspermit")
    }else if (document === "Business Permit Renewal")
    res.redirect("/admcertrenewbspermit")
})

app.post("/changestatus", (req, res) => {
    const {certstatus} = req.body;
    const code = req.session.reqcode;
    if(req.session.admin === true){
      if(certstatus === "processing"){
            pool.query("UPDATE pendingcertificates SET status = 'processing' WHERE requestcode = ?", [code], (error, results) => {
              if(error) console.log(error)
              else{
                res.redirect("/admcertificates")
              }
            })
          }else if (certstatus === "forpickup") {
            pool.query("UPDATE pendingcertificates SET status = 'forpickup' WHERE requestcode = ?", [code], (error, results) => {
              if(error) console.log(error)
              else{
                res.redirect("/admcertificates")
              }})
          } else if (certstatus === "denied") {
            pool.query("UPDATE pendingcertificates SET status = 'denied' WHERE requestcode = ?", [code], (error, results) => {
              if(error) console.log(error)
              else{
                res.redirect("/admcertificates")
              }
            })
          }
    } else if(req.session.kapadmin === true) {
      if(certstatus === "processing"){
        pool.query("UPDATE pendingcertificates SET status = 'processing' WHERE requestcode = ?", [code], (error, results) => {
          if(error) console.log(error)
          else{
            res.redirect("/chmcertificates")
          }
        })
      }else if (certstatus === "forpickup") {
        pool.query("UPDATE pendingcertificates SET status = 'forpickup' WHERE requestcode = ?", [code], (error, results) => {
          if(error) console.log(error)
          else{
            res.redirect("/chmcertificates")
          }})
      } else if (certstatus === "denied") {
        pool.query("UPDATE pendingcertificates SET status = 'denied' WHERE requestcode = ?", [code], (error, results) => {
          if(error) console.log(error)
          else{
            res.redirect("/chmcertificates")
          }
        })
      }
    }
})

module.exports = app;