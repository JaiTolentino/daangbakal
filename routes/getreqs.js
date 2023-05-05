const express = require('express');
const app = express();
const pool = require('./dbconfig');
const session = require('express-session');
const {create} = require('hbs');
const crypto = require('crypto');
const mysecret = crypto.randomBytes(32).toString('hex');

app.use(session ({
    secret: mysecret,
    resave: false,
    saveUninitialized: true
}))

app.get("/", (req, res) => {
    res.render("index")
})

app.get("/register", (req, res) => { // uses /register as path to register.hbs
    res.render("register")
})

app.get("/login", (req, res) => { // uses /login as path to login.hbs
    res.render( "login")
})

app.get("/loggedin", (req, res) => {
  if (req.session.familyhead){
    const email = req.session.emaillogin;
    pool.query("SELECT * FROM familyheadtable WHERE email = ?", [email], (error, results) => {
      if (error) console.log(error);
      else {
        res.render('loggedin', {familyheadtable: results})
      }
    })
  } else if (req.session.familymember) {
    const email = req.session.emaillogin;
    pool.query("SELECT * FROM familyheadtable WHERE email = ?", [email], (error, results) => {
      if (error) console.log(error);
      else {
        res.render('loggedin', {familyheadtable: results})
      }
    })
  }
  else if(!req.session.familymember || !req.session.familyhead){
    return res.redirect("/")
  }
  else {
    return res.redirect("/")
  }
})

app.get("/verificationReq", (req, res) => {
   res.render("verificationReq")
})

app.get("/verificationSub", (req, res) => {
  const email = req.session.email;
  pool.query("SELECT * FROM familyheadtable WHERE email = ?", [email], (error, results) => {
    if(error) console.log(error);
    else {
      res.render('verificationSub', {phonenumber: results});
    }
  })
})

app.get("/changepassword", (req, res) => {
    if (!req.session.loggedIn){
        return res.redirect("/");
      }
    res.render('changepassword')
})

app.get("/personalinfo", (req, res) => {
if (req.session.familymember) {
    const email = req.session.emaillogin;
    pool.query("SELECT * FROM familymembertable WHERE email = ?", [email], (error, results) => {
      if (error) console.log(error);
      else {
        pool.query("SELECT * FROM pendingcertificates WHERE email = ?", [email], (error, results2) => {
          if (error) console.log(error)
          else{
            res.render('personalinfo', {familyheadtable: results, pendingcert: results2})
          }
        })
        
      }
    })
  } else if (!req.session.familyhead || !req.session.familymember) {
    return res.redirect("/");
  }
  
})

app.get("/familymember", (req, res) => {
  res.render("familymember")
})

app.get("/admhome", (req, res) => {
  if (!req.session.admin){
    return res.redirect("/");
  }
  res.render("admhome")
})

app.get("/chmhome", (req, res) => {
  if (!req.session.kapadmin){
    return res.redirect("/");
  }
  res.render("chmhome")
})

app.get("/admannouncements", (req, res) => {
  if (req.session.admin === true){
    res.render("admannouncements")
  }
  else if (req.session.kapadmin === true){
    res.render("admannouncements")
  } else if (!req.session.admin || !req.session.kapadmin){
    return res.redirect("/")
  }
})

app.get("/announcements", (req, res) => {
  if (req.session.familyhead){
      pool.query("SELECT * FROM posttable WHERE news_id = 1", (error, results1) => {
      if(error) console.log(error);
      pool.query("SELECT * FROM posttable WHERE news_id = 2", (error, results2) => {
        if(error) console.log(error);
        pool.query("SELECT * FROM posttable WHERE news_id = 3", (error, results3) => {
          if(error) console.log(error);
          pool.query("SELECT * FROM posttable WHERE news_id = 4", (error, results4) => {
            if(error) console.log(error);
              res.render('announcements', {news1: results1, news2: results2, events1: results3, events2: results4})
          })
        })
      })
    })
  }
  else if (req.session.familymember){
    pool.query("SELECT * FROM posttable WHERE news_id = 1", (error, results1) => {
      if(error) console.log(error);
      pool.query("SELECT * FROM posttable WHERE news_id = 2", (error, results2) => {
        if(error) console.log(error);
        pool.query("SELECT * FROM posttable WHERE news_id = 3", (error, results3) => {
          if(error) console.log(error);
          pool.query("SELECT * FROM posttable WHERE news_id = 4", (error, results4) => {
            if(error) console.log(error);
              res.render('announcements', {news1: results1, news2: results2, events1: results3, events2: results4})
          })
        })
      })
    })
  } else if (!req.session.familyhead || !req.session.familymember) {
    return res.redirect("/");
  }
})

app.get("/successfulchange", (req, res) => {
  res.render("successfulchange")
})

app.get("/termsandcondi", (req, res) => {
  res.render("termsandcondi")
})

app.get("/successfulregister", (req, res) => {
  res.render("successfulregister")
})

app.get("/barangayofficials", (req, res) => {
  res.render("barangayofficials")
})

app.get("/certificates", (req, res) => {
  if (req.session.familyhead){
    res.render("certificates")
  }
  else if (req.session.familymember){
    res.render("certificates")
  } else if (!req.session.familyhead || !req.session.familymember){
    res.redirect("/")
  }
})

app.get("/admcertificates", (req, res) => {
  if(!req.session.admin) res.redirect("/")
  pool.query("SELECT * FROM pendingcertificates", (error, results) => {
    if(error) console.log(error);
    else{
      const email = results[0].email
      pool.query("SELECT * FROM familyheadtable WHERE email = ?", [email], (error, results2) => {
        if(error) console.log(error)
        else {
          if (results2.length > 0) {
            res.render("admcertificates", {certificates: results, names: results2})
          }
          else{
            pool.query("SELECT * FROM familymembertable WHERE email = ?", [email], (error, results3) => {
              if(error) console.log(error)
              else {
                if (results3.length > 0) {
                  res.render("admcertificates", {certificates: results, name: results3})
                }
              }
            })
          }
        }
      })
    }
  })
  
})

app.get("/chmannouncements", (req, res) => {
  res.render("chmannouncements")
})

app.get("/chmcertificates", (req, res) => {
  if(!req.session.kapadmin) res.redirect("/")
  pool.query("SELECT * FROM pendingcertificates", (error, results) => {
    if(error) console.log(error);
    else{
      const email = results[0].email
      pool.query("SELECT * FROM familyheadtable WHERE email = ?", [email], (error, results2) => {
        if(error) console.log(error)
        else {
          if (results2.length > 0) {
            res.render("chmcertificates", {certificates: results, names: results2})
          }
          else{
            pool.query("SELECT * FROM familymembertable WHERE email = ?", [email], (error, results3) => {
              if(error) console.log(error)
              else {
                if (results3.length > 0) {
                  res.render("chmcertificates", {certificates: results, name: results3})
                }
              }
            })
          }
        }
      })
    }
  })
})

app.get("/chmaddadmin", (req, res) => {
  if (!req.session.kapadmin) {
    res.redirect("/")
  }else {
    pool.query("SELECT * FROM admintable", (error, results) => {
      if (error) console.log(error)
      else {
        res.render("chmaddadmin", {admins: results})
      }
    })
  }
})

app.get("/headhome", (req, res) => {
  res.render("headhome")
})

app.get("/headannouncements", (req, res) => {
  if (req.session.familyhead){
    pool.query("SELECT * FROM posttable WHERE news_id = 1", (error, results1) => {
    if(error) console.log(error);
    pool.query("SELECT * FROM posttable WHERE news_id = 2", (error, results2) => {
      if(error) console.log(error);
      pool.query("SELECT * FROM posttable WHERE news_id = 3", (error, results3) => {
        if(error) console.log(error);
        pool.query("SELECT * FROM posttable WHERE news_id = 4", (error, results4) => {
          if(error) console.log(error);
            res.render('headannouncements', {news1: results1, news2: results2, events1: results3, events2: results4})
        })
      })
    })
  })
}
else if (req.session.familymember){
  pool.query("SELECT * FROM posttable WHERE news_id = 1", (error, results1) => {
    if(error) console.log(error);
    pool.query("SELECT * FROM posttable WHERE news_id = 2", (error, results2) => {
      if(error) console.log(error);
      pool.query("SELECT * FROM posttable WHERE news_id = 3", (error, results3) => {
        if(error) console.log(error);
        pool.query("SELECT * FROM posttable WHERE news_id = 4", (error, results4) => {
          if(error) console.log(error);
            res.render('headannouncements', {news1: results1, news2: results2, events1: results3, events2: results4})
        })
      })
    })
  })
} else if (!req.session.familyhead || !req.session.familymember) {
  return res.redirect("/");
}
})

app.get("/headbarangayofficials", (req, res) => {
  res.render("headbarangayofficials")
})

app.get("/headpersonalinfo", (req, res) => {
  if (req.session.familyhead){
    const email = req.session.emaillogin;
    pool.query("SELECT * FROM familyheadtable WHERE email = ?", [email], (error, results) => {
      if (error) console.log(error);
      else {
        pool.query("SELECT * FROM pendingcertificates WHERE email = ?", [email], (error, results2) => {
          if (error) console.log(error)
          else{
            res.render('headpersonalinfo', {familyheadtable: results, pendingcert: results2})
          }
        })
        
      }
    })
  } else if (!req.session.familyhead || !req.session.familymember) {
    return res.redirect("/");
  }
  
})

app.get("/headcertificates", (req, res) => {
  res.render("headcertificates")
})

app.get("/headviewmembers", (req, res) => {
  if (!req.session.familyhead) {
    res.redirect("/")
  }else {
    const emailogin = req.session.emaillogin
    pool.query("SELECT * FROM familyheadtable WHERE email = ?", [emailogin], async (error, resultss) => {
      if(error) console.log(error);
      else{
          const familycode = req.session.familycode 
          pool.query("SELECT * FROM familymembertable WHERE familycode = ?", [familycode], (error, results) => {
          if (error) console.log(error)
          else {
            res.render("headviewmembers", {familymembers: results, familyhead:resultss})
          }
        })
      }
    })
    
  }
  
})

app.get("/headtermsandcondi", (req, res) => {
  res.render("headtermsandcondi")
})

app.get("/headregister", (req, res) => {
  res.render("headregister")
})

app.get("/headsuccessfulregister", (req, res) => {
  res.render("headsuccessfulregister")
})

app.get("/headapplyresidency", (req, res) => {
  const email = req.session.emaillogin
  pool.query("SELECT * FROM familyheadtable WHERE email = ?", [email], (error, results) => {
    if (error) console.log(error)
    else {
      res.render("headapplyresidency", {info: results})
    }
  })
})

app.get("/headapplyclearance", (req, res) => {
  const email = req.session.emaillogin
  pool.query("SELECT * FROM familyheadtable WHERE email = ?", [email], (error, results) => {
    if (error) console.log(error)
    else {
      res.render("headapplyclearance", {info: results})
    }
  })
})

app.get("/headapplyindigent", (req, res) => {
  const email = req.session.emaillogin
  pool.query("SELECT * FROM familyheadtable WHERE email = ?", [email], (error, results) => {
    if (error) console.log(error)
    else {
      res.render("headapplyindigent", {info: results})
    }
  })
})

app.get("/headapplynewbspermit", (req, res) => {
  const email = req.session.emaillogin
  pool.query("SELECT * FROM familyheadtable WHERE email = ?", [email], (error, results) => {
    if (error) console.log(error)
    else {
      res.render("headapplynewbspermit", {info: results})
    }
  })
})

app.get("/headapplyrenewbspermit", (req, res) => {
  const email = req.session.emaillogin
  pool.query("SELECT * FROM familyheadtable WHERE email = ?", [email], (error, results) => {
    if (error) console.log(error)
    else {
      res.render("headapplyrenewbspermit", {info: results})
    }
  })
})

app.get("/membapplyresidency", (req, res) => {
  const email = req.session.emaillogin
  pool.query("SELECT * FROM familymembertable WHERE email = ?", [email], (error, results) => {
    if (error) console.log(error)
    else {
      res.render("membapplyresidency", {info: results})
    }
  })
})

app.get("/membapplyclearance", (req, res) => {
  const email = req.session.emaillogin
  pool.query("SELECT * FROM familymembertable WHERE email = ?", [email], (error, results) => {
    if (error) console.log(error)
    else {
      res.render("membapplyclearance", {info: results})
    }
  })
})

app.get("/membapplyindigent", (req, res) => {
  const email = req.session.emaillogin
  pool.query("SELECT * FROM familymembertable WHERE email = ?", [email], (error, results) => {
    if (error) console.log(error)
    else {
      res.render("membapplyindigent", {info: results})
    }
  })
})

app.get("/membapplynewbspermit", (req, res) => {
  const email = req.session.emaillogin
  pool.query("SELECT * FROM familymembertable WHERE email = ?", [email], (error, results) => {
    if (error) console.log(error)
    else {
      res.render("membapplynewbspermit", {info: results})
    }
  })
})

app.get("/membapplyrenewbspermit", (req, res) => {
  const email = req.session.emaillogin
  pool.query("SELECT * FROM familymembertable WHERE email = ?", [email], (error, results) => {
    if (error) console.log(error)
    else {
      res.render("membapplyrenewbspermit", {info: results})
    }
  })
})

app.get("/admcertclearance", (req,res) => {
  const certemail = req.session.certemail
  const code = req.session.reqcode
  pool.query("SELECT * FROM familyheadtable WHERE email = ?", [certemail], (error, results) => {
    if(error) console.log(error)
    else {
      if (results.length > 0) {
        pool.query("SELECT * FROM pendingcertificates WHERE requestcode = ? ", [code], (error, certresult) => {
          res.render("admcertclearance", {data: results, certificate: certresult})
        })
        
      }else {
        pool.query("SELECT * FROM familymembertable WHERE email = ?", [certemail], (error, results) => {
          if(error) console.log(error)
          else {
            pool.query("SELECT * FROM pendingcertificates WHERE requestcode = ? ", [code], (error, certresult) => {
              res.render("admcertclearance", {data: results, certificate: certresult})
            })
          }
        })
      }
    }
  })
})

app.get("/admcertindigent", (req, res) => {
  const certemail = req.session.certemail
  const code = req.session.reqcode
  pool.query("SELECT * FROM familyheadtable WHERE email = ?", [certemail], (error, results) => {
    if(error) console.log(error)
    else {
      if (results.length > 0) {
        pool.query("SELECT * FROM pendingcertificates WHERE requestcode = ? ", [code], (error, certresult) => {
          res.render("admcertindigent", {data: results, certificate: certresult})
        })
      }else {
        pool.query("SELECT * FROM familymembertable WHERE email = ?", [certemail], (error, results) => {
          if(error) console.log(error)
          else {
            pool.query("SELECT * FROM pendingcertificates WHERE requestcode = ? ", [code], (error, certresult) => {
              res.render("admcertindigent", {data: results, certificate: certresult})
            })
          }
        })
      }
    }
  })
})

app.get("/admcertrenewbspermit", (req, res) => {
  const certemail = req.session.certemail
  const code = req.session.reqcode
  pool.query("SELECT * FROM familyheadtable WHERE email = ?", [certemail], (error, results) => {
    if(error) console.log(error)
    else {
      if (results.length > 0) {
        pool.query("SELECT * FROM pendingcertificates WHERE requestcode = ? ", [code], (error, certresult) => {
          res.render("admcertrenewbspermit", {data: results, certificate: certresult})
        })
        
      }else {
        pool.query("SELECT * FROM familymembertable WHERE email = ?", [certemail], (error, results) => {
          if(error) console.log(error)
          else {
            pool.query("SELECT * FROM pendingcertificates WHERE requestcode = ? ", [code], (error, certresult) => {
              res.render("admcertrenewbspermit", {data: results, certificate: certresult})
            })
          }
        })
      }
    }
  })
})

app.get("/admcertresidency", (req, res) => {
  const certemail = req.session.certemail
  const code = req.session.reqcode
  pool.query("SELECT * FROM familyheadtable WHERE email = ?", [certemail], (error, results) => {
    if(error) console.log(error)
    else {
      if (results.length > 0) {
        pool.query("SELECT * FROM pendingcertificates WHERE requestcode = ? ", [code], (error, certresult) => {
          res.render("admcertresidency", {data: results, certificate: certresult})
        })
        
      }else {
        pool.query("SELECT * FROM familymembertable WHERE email = ?", [certemail], (error, results) => {
          if(error) console.log(error)
          else {
            pool.query("SELECT * FROM pendingcertificates WHERE requestcode = ? ", [code], (error, certresult) => {
              res.render("admcertresidency", {data: results, certificate: certresult})
            })
          }
        })
      }
    }
  })
})

app.get("/admcertnewbspermit", (req, res) => {
  const certemail = req.session.certemail
  const code = req.session.reqcode
  pool.query("SELECT * FROM familyheadtable WHERE email = ?", [certemail], (error, results) => {
    if(error) console.log(error)
    else {
      if (results.length > 0) {
        pool.query("SELECT * FROM pendingcertificates WHERE requestcode = ? ", [code], (error, certresult) => {
          res.render("admcertnewbspermit", {data: results, certificate: certresult})
        })
        
      }else {
        pool.query("SELECT * FROM familymembertable WHERE email = ?", [certemail], (error, results) => {
          if(error) console.log(error)
          else {
            pool.query("SELECT * FROM pendingcertificates WHERE requestcode = ? ", [code], (error, certresult) => {
              res.render("admcertnewbspermit", {data: results, certificate: certresult})
            })
          }
        })
      }
    }
  })
})
module.exports = app;