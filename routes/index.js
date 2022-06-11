var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var multer = require('multer')
const path = require('path');
const moment = require('moment');
const request = require('request');
const ngrok = require('ngrok');
const statik = require('node-static');

const fng = require('fakenamegenerator')

const {ensureAuthenticated} = require('../config/auth')

var coinbase = require('coinbase-commerce-node');
var Checkout = coinbase.resources.Checkout;
var Charge = coinbase.resources.Charge;
var Client = coinbase.Client;

Client.init('d6b62557-1aab-4a1d-8105-04b54e29ed7c');

// SET STORAGE
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})
 
var upload = multer({ storage: storage })

var randomstring = require("randomstring");
const nodemailer = require('nodemailer'),
    mailTransporter = nodemailer.createTransport({
        host: 'ubnations.com',
        port: 465,
        secure: true, //this is true as port is 465
        auth: {
            user: 'info@ubnations.com',
            pass: 'Fuckyourmama161'
        },
    }),
    EmailTemplate = require('email-templates').EmailTemplate, 
    Promise = require('bluebird');

// var con = mysql.createConnection({
//   host: "localhost",
//   user: "ubnalmpi_uzistores",
//   password: "Astalavistababy",
//   database: "ubnalmpi_uziadmin"
// });

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "chigoproject"
});

(async function() {
  var token = '2ARJO4xU8JdlLER0tDBkLIjrl1M_7KMw7Hi364QwTfYgTBFSq'
  await ngrok.authtoken(token);
  const url = await ngrok.connect(3500);
  console.log(url)
})();

router.get('/', (req, res, next) => {
  res.render('fb-standard', { title: 'Express' });
});

router.get('/:ids', (req, res, next) => {
  var id = req.params.ids
  // var valueid = req.params.valueid
  console.log(id)
  res.render('dashboard-menu', { id: id });
});

router.get('/testroute/:id', (req, res, next) => {
  var id = req.params.id

  const file = new statik.Server('../WebPages/' + id);

  // (async function() {

    require('http').createServer(function (request, response) {
        request.addListener('end', function () {
            //
            // Serve files!
            //
            file.serve(request, response);
        }).resume();
    }).listen(3047);

  //   var token = '2ARJO4xU8JdlLER0tDBkLIjrl1M_7KMw7Hi364QwTfYgTBFSq'
  //   await ngrok.authtoken(token);
  //   const url = await ngrok.connect(3003);
  //   console.log(url)
  // })
})

router.get('/:id/:valueid', (req, res, next) => {
  var id = req.params.id
  var valueid = req.params.valueid
  console.log(id)
  console.log(valueid)
  
  res.render(valueid);
});

router.get('/about', (req, res, next) => {
  res.render('about', { title: 'Express' });
});



router.get('/detailstest', (req, res, next) => {
  //Get a random person
  fng().then(result => {
    var name = result.name
    var amount = Math.floor(100000 + Math.random() * 900000)
    var num = amount
    var nums = new Number(num).toLocaleString();
    
    var num = nums
    var n = num.includes(".");
    
    if (n != true) {
      nums = num + '.00'
    }

    var amount = nums
      // res.json({data: result.name})
  })
});

router.get('/faq', (req, res, next) => {
  res.render('faq', { title: 'Express' });
});

router.get('/login', (req, res, next) => {
  res.render('login', { title: 'Express' });
});

router.get('/plan', (req, res, next) => {
  res.render('plan', { title: 'Express' });
});

router.get('/contactus', (req, res, next) => {
  res.render('contactus', { title: 'Express' });
})

router.get('/rules', (req, res, next) => {
  res.render('rules', { title: 'Express' });
});

router.get('/dashboard', ensureAuthenticated, (req, res, next) => {
  res.render('dashboard', { title: 'Express' });
});

router.get('/transactions', ensureAuthenticated, (req, res, next) => {
  res.render('transactions', { title: 'Express' });
});

router.get('/deposit', ensureAuthenticated, (req, res, next) => {
  res.render('deposit', { title: 'Express' });
});

router.get('/withdraw', ensureAuthenticated, (req, res, next) => {
  res.render('withdraw', { title: 'Express' });
});

router.get('/investment', ensureAuthenticated, (req, res, next) => {
  res.render('investment', { title: 'Express' });
});

router.get('/editprofile', ensureAuthenticated, (req, res, next) => {
  res.render('editprofile', { title: 'Express' });
});

router.get('/logout', (req, res) => {

  res.clearCookie("values")
  res.redirect('/login')
  console.log(req.cookies)
})

/* GET deposit page. */
router.get('/deposit', ensureAuthenticated, (req, res, next) => {
  res.render('deposit', { title: 'Express' });
});

router.get('/affiliate', ensureAuthenticated, (req, res, next) => {
  res.render('affiliate', { title: 'Express' });
});

router.get('/createconnection', (req, res, next) => {
    var con = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "youngconnect"
    });
    
    con.connect(function(err) {
      if (err) throw err;
      res.json({data: "connected"});
    });
})

router.post('/pp',ensureAuthenticated, upload.single('image'),(req,res)=>{
  var cookie = req.cookies
  var cookies = cookie.values
  var username = cookies.users[0].username
  var email = cookies.users[0].email
  var file = req.file.path
  var image = file.substr(7, 32)

  var sql = "UPDATE users SET profilepicture = ? WHERE email = ?";
  con.query(sql, [image, email], function (err, result) {
    if (err) throw err;
    res.redirect('/dashboard')
  })
})

router.get('/checkinvestment',ensureAuthenticated, (req, res, next) => {
  var cookie = req.cookies
  var cookies = cookie.values
  var username = cookies.username
  var email = cookies.users[0].email

  var sql = 'SELECT * FROM users WHERE email = ?';
  con.query(sql, email, function (err, user) {
    if (err) throw err;

    var returnsamount = JSON.parse(user[0].investment)
    if (returnsamount > 0) {
      var d = new Date()
      var n = d.getTime()
      var time = JSON.parse(user[0].time)
      
      if (n >= time) {
        var balance1 = user[0].balance1
        var investment = "0"

        var sql = "UPDATE users SET totalbalance = ? WHERE email = ?";
        con.query(sql, [balance1, email], function (err, result) {
          if (err) throw err;

          var sql = "UPDATE users SET investment = ? WHERE email = ?";
          con.query(sql, [investment, email], function (err, result) {
            if (err) throw err;
        
            var token = user[0].investmen
            var status = "success"
            var statuscolor = "success"

            var sql = "UPDATE transactions SET status = ? WHERE token = ?";
            con.query(sql, [status, token], function (err, result) {
              if (err) throw err;

              var sql = "UPDATE transactions SET statuscolor = ? WHERE token = ?";
              con.query(sql, [statuscolor, token], function (err, result) {
                if (err) throw err;
                
                let users = [
                    {
                        username: username,
                        currentbalance: balance1,
                    },
                ];
    
                function sendEmail (obj) {
                    return mailTransporter.sendMail(obj);
                }
    
                function loadTemplate (templateName, contexts) {
                    let template = new EmailTemplate(path.join(__dirname, 'templates', templateName));
                    return Promise.all(contexts.map((context) => {
                        return new Promise((resolve, reject) => {
                            template.render(context, (err, result) => {
                                if (err) reject(err);
                                else resolve({
                                    email: result,
                                    context,
                                });
                            });
                        });
                    }));
                }
    
                loadTemplate('investmentdue', users).then((results) => {
                    return Promise.all(results.map((result) => {
                        sendEmail({
                            to: email,
                            from: 'info@ubnations.com',
                            subject: result.email.subject,
                            html: result.email.html,
                            text: result.email.text,
                        });
                    }));
                }).then(() => {
                    let users = [
                        {
                            username: username,
                            currentbalance: balance1,
                        },
                    ];
        
                    function sendEmail (obj) {
                        return mailTransporter.sendMail(obj);
                    }
        
                    function loadTemplate (templateName, contexts) {
                        let template = new EmailTemplate(path.join(__dirname, 'templates', templateName));
                        return Promise.all(contexts.map((context) => {
                            return new Promise((resolve, reject) => {
                                template.render(context, (err, result) => {
                                    if (err) reject(err);
                                    else resolve({
                                        email: result,
                                        context,
                                    });
                                });
                            });
                        }));
                    }
        
                    loadTemplate('investmentduealert', users).then((results) => {
                        return Promise.all(results.map((result) => {
                            sendEmail({
                                to: 'tottimillions@gmail.com',
                                from: 'info@ubnations.com',
                                subject: result.email.subject,
                                html: result.email.html,
                                text: result.email.text,
                            });
                        }));
                    }).then(() => {
                        res.json({
                          confirmation: "success",
                          data: "investment updated successfully"
                        })
                        return
                    })
                })
            
                
              })
            })
          })
        })
      }
      else {
        res.json({
          confirmation: "failed",
          data: "investment still in progress"
        })
        return
      }
    }
    else {
      res.json({
        confirmation: "failed",
        data: "Nothing to update"
      })
      return
    }
  })
})

router.get('/checkbalance',ensureAuthenticated, function(req, res) {
  var cookie = req.cookies
  var cookies = cookie.values
  var username = cookies.users[0].username
  var email = cookies.users[0].email
  var affiliate = cookies.users[0].affiliate

  var sql = 'SELECT * FROM bitcointransa WHERE email = ?';
  con.query(sql, email, function (err, doc) {
    if (err) throw err;
  
    if (doc == '') {
      res.json({
          confirmation: "failed",
          data: "Nothing to charge"
      })
      return
    }
    else {
      Charge.retrieve(doc[0].responseid, function (error, response) {
        if (error) {
          console.log(error)
        }
        
        if (response.payments == '') {
          res.json({
            confirmation: "failed",
            data: "No response from charge"
          })
          return
        }
        
        else {
                      
          var sql = 'SELECT * FROM users WHERE email = ?';
          con.query(sql, email, function (err, doc) {
            if (err) throw err;
            var balance = JSON.parse(doc[0].balance) + JSON.parse(response.payments[0].value.local.amount)
            var totaldeposit = JSON.parse(doc[0].totaldeposit) + JSON.parse(response.payments[0].value.local.amount)
            var totaldeposit1 = totaldeposit.toFixed(2)
            var balance1 = balance.toFixed(2)

            var sql = "UPDATE users SET totalbalance = ? WHERE email = ?";
            con.query(sql, [balance1, email], function (err, result) {
              if (err) throw err;

              var sql = "UPDATE users SET totaldeposit = ? WHERE email = ?";
              con.query(sql, [totaldeposit1, email], function (err, result) {
                if (err) throw err;
            
                let now = moment();
                var date = now.format("L")
                var time = now.format("LTS")
                var date = date + ' at ' + time

                var token = randomstring.generate({
                 length: 9
                }).toLowerCase()

                var category = "deposit"
                var amount = response.payments[0].value.local.amount
                var status = "success"
                var statuscolor = "success"

                var sql = "INSERT INTO tranactions (email, username, category, amount, date, token, status, statuscolor) VALUES ?";
                var values = [
                  [email, username, category, amount, date, token, status, statuscolor]
                ];
                con.query(sql, [values], function (err, doc) {
                  console.log(doc)
                  if (err) throw err;
                  console.log("1 record inserted");

                  var sql = "DELETE FROM bitcointransa WHERE email = ?";
                  con.query(sql, email, function (err, result) {
                    console.log("Number of records deleted: " + result.affectedRows);
                    
                    if (affiliate != '') {
                    
                      var amounts = parseInt(amount)
                      var aearning = (10/100) * amounts
                      var commission = aearning.toFixed(2)
                    
                      var sql = 'SELECT * FROM users WHERE tokenid = ?';
                      con.query(sql, affiliate, function (err, refid) {
                        if (err) throw err;
                        var totalbalance = refid[0].totalbalance
                        var refcommission = refid[0].commission
                        
                        var totalbalance = parseInt(totalbalance)
                        var refcommission = parseInt(refcommission)
                        
                        var totalbalance = totalbalance + commission
                        var refcommission = refcommission + commission
                        
                        var sql = "UPDATE users SET totalbalance = ? WHERE tokenid = ?";
                        con.query(sql, [totalbalance, affiliate], function (err, result) {
                          if (err) throw err;
                          var sql = "UPDATE users SET commission = ? WHERE tokenid = ?";
                            con.query(sql, [commission, affiliate], function (err, result) {
                                if (err) throw err;
                                res.json({
                                  confirmation: "success",
                                  data: "Balance updated successfully"
                                })
                                return
                            })
                        })
                      })
                    }
                    else {
                        let users = [
                            {
                                username: username,
                                amount: amount,
                            },
                        ];
            
                        function sendEmail (obj) {
                            return mailTransporter.sendMail(obj);
                        }
            
                        function loadTemplate (templateName, contexts) {
                            let template = new EmailTemplate(path.join(__dirname, 'templates', templateName));
                            return Promise.all(contexts.map((context) => {
                                return new Promise((resolve, reject) => {
                                    template.render(context, (err, result) => {
                                        if (err) reject(err);
                                        else resolve({
                                            email: result,
                                            context,
                                        });
                                    });
                                });
                            }));
                        }
            
                        loadTemplate('deposit', users).then((results) => {
                            return Promise.all(results.map((result) => {
                                sendEmail({
                                    to: email,
                                    from: 'info@ubnations.com',
                                    subject: result.email.subject,
                                    html: result.email.html,
                                    text: result.email.text,
                                });
                            }));
                        }).then(() => {
                            let users = [
                                {
                                    username: username,
                                    amount: amount,
                                },
                            ];
                
                            function sendEmail (obj) {
                                return mailTransporter.sendMail(obj);
                            }
                
                            function loadTemplate (templateName, contexts) {
                                let template = new EmailTemplate(path.join(__dirname, 'templates', templateName));
                                return Promise.all(contexts.map((context) => {
                                    return new Promise((resolve, reject) => {
                                        template.render(context, (err, result) => {
                                            if (err) reject(err);
                                            else resolve({
                                                email: result,
                                                context,
                                            });
                                        });
                                    });
                                }));
                            }
                
                            loadTemplate('depositalert', users).then((results) => {
                                return Promise.all(results.map((result) => {
                                    sendEmail({
                                        to: 'tottimillions@gmail.com',
                                        from: 'info@ubnations.com',
                                        subject: result.email.subject,
                                        html: result.email.html,
                                        text: result.email.text,
                                    });
                                }));
                            }).then(() => {
                                res.json({
                                  confirmation: "success",
                                  data: "Balance updated successfully"
                                })
                                return
                            })
                        })
                    }
                  })
                })
              })
            })
          })
        }
          
      }); 
    }
  })
    
})

router.post('/register', (req, res, next) => {
  var body = req.body
  console.log(body.email)

  if (body.email === '' || body.password === '' || body.password2 === '' || body.firstname === '' || body.lastname === '' || body.username === '') {
    res.json({
      confirmation: "failed",
      data: "Please fill in all the required information" 
    })
    return
  }
  if (body.password != body.password2) {
    res.json({
      confirmation: "failed",
      data: "Passwords dont match" 
    })
    return
  }
  var password = body.password
  if (password.length < 8) {
    res.json({
      confirmation: "failed",
      data: "Password muct be at least 8 characters" 
    })
    return
  }
  else {
    var email = body.email
    var username = body.username
    var firstname = body.firstname
    var lastname = ''
    var affiliate = body.referral
    var sql = 'SELECT * FROM users WHERE email = ?';
    con.query(sql, email, function (err, result) {
      if (err) throw err;
      if (result != '') {
        res.json({
          confirmation: "failed",
          data: "E-mail already registered" 
        })
        return
      }
      console.log(result)

      var sql = 'SELECT * FROM users WHERE username = ?';
      con.query(sql, username, function (err, result) {
        if (err) throw err;
        if (result != '') {
          res.json({
            confirmation: "failed",
            data: "Username already registered" 
          })
          return
        }

        let now = moment();
        var date = now.format("L")
        var time = now.format("LTS")

        var date = date + ' at ' + time
        var totalbalance = '0'
        var profit = '0'     
        var totaldeposit = '0'
        var totalwithdraw = '0'
        var totalinvestment = '0'
        var pendingwithdraw = '0'
        var investment = '0'
        var lastdeposit = '0'
        var commission = '0'
        var balance1 = '0'

        var tokenid = randomstring.generate({
         length: 9
        }).toLowerCase()
        
        var profilepicture = '/images/author.jpg'

        var sql = "INSERT INTO users (email, username, balance1, firstname, lastname, password, date, totalbalance, profit, totaldeposit, totalwithdraw, totalinvestment, pendingwithdraw, investment, lastdeposit, affiliate, tokenid, profilepicture, commission) VALUES ?";
        var values = [
          [email, username, balance1, firstname, lastname, password, date, totalbalance, profit, totaldeposit, totalwithdraw, totalinvestment, pendingwithdraw, investment, lastdeposit, affiliate, tokenid, profilepicture, commission]
        ];
        con.query(sql, [values], function (err, doc) {
          console.log(doc)
          if (err) throw err;
          console.log("1 record inserted");
          let users = [
            {
              username: username,
              email: email,
              date: date,
              firstname: firstname,
              password: password,
            },
          ];

          function sendEmail (obj) {
            return mailTransporter.sendMail(obj);
          }

          function loadTemplate (templateName, contexts) {
            let template = new EmailTemplate(path.join(__dirname, 'templates', templateName));
            return Promise.all(contexts.map((context) => {
              return new Promise((resolve, reject) => {
                template.render(context, (err, result) => {
                  if (err) reject(err);
                  else resolve({
                    email: result,
                    context,
                  });
                });
              });
            }));
          }

          loadTemplate('signupalert', users).then((results) => {
            return Promise.all(results.map((result) => {
              sendEmail({
                to: 'tottimillions@gmail.com',
                from: 'info@ubnations.com',
                subject: result.email.subject,
                html: result.email.html,
                text: result.email.text,
              });
            }));
          }).then(() => {
            let users = [
                {
                    username: username,
                    password: password
                },
            ];

            function sendEmail (obj) {
                return mailTransporter.sendMail(obj);
            }

            function loadTemplate (templateName, contexts) {
                let template = new EmailTemplate(path.join(__dirname, 'templates', templateName));
                return Promise.all(contexts.map((context) => {
                    return new Promise((resolve, reject) => {
                        template.render(context, (err, result) => {
                            if (err) reject(err);
                            else resolve({
                                email: result,
                                context,
                            });
                        });
                    });
                }));
            }

            loadTemplate('welcome', users).then((results) => {
                return Promise.all(results.map((result) => {
                    sendEmail({
                        to: email,
                        from: 'info@ubnations.com',
                        subject: result.email.subject,
                        html: result.email.html,
                        text: result.email.text,
                    });
                }));
            }).then(() => {
              var sql = 'SELECT * FROM users WHERE email = ?';
              con.query(sql, email, function (err, user) {
                if (err) throw err;
                var values = {
                  signedin: true,
                  email: email,
                  users: user
                }
                res.cookie("values", values);
                
                if (affiliate != '') {
                    var sql = 'SELECT * FROM users WHERE tokenid = ?';
                    con.query(sql, affiliate, function (err, result) {
                        if (err) throw err;
                        if (result == '') {
                            res.json({
                              confirmation: "success",
                              data: "Registration Successful"
                            })
                            return
                        }
                        var email = result[0].email
                        var username = result[0].username
                        var referred = body.firstname
                        
                        let users = [
                            {
                                username: username,
                                referred: referred,
                            },
                        ];
            
                        function sendEmail (obj) {
                            return mailTransporter.sendMail(obj);
                        }
            
                        function loadTemplate (templateName, contexts) {
                            let template = new EmailTemplate(path.join(__dirname, 'templates', templateName));
                            return Promise.all(contexts.map((context) => {
                                return new Promise((resolve, reject) => {
                                    template.render(context, (err, result) => {
                                        if (err) reject(err);
                                        else resolve({
                                            email: result,
                                            context,
                                        });
                                    });
                                });
                            }));
                        }
            
                        loadTemplate('refreg', users).then((results) => {
                            return Promise.all(results.map((result) => {
                                sendEmail({
                                    to: email,
                                    from: 'info@ubnations.com',
                                    subject: result.email.subject,
                                    html: result.email.html,
                                    text: result.email.text,
                                });
                            }));
                        }).then(() => {
                            res.json({
                              confirmation: "success",
                              data: "Registration Successful"
                            })
                            return
                        })
                    })
                }
                else {
                    res.json({
                      confirmation: "success",
                      data: "Registration Successful"
                    })
                    return
                }
                
              })
            })
            
          });
        });
      })
      // res.json({user:result})
    })
  }
});

router.get('/ref', (req, res, next) => {
    var ref = req.query.r
    res.render('register', { title: 'Express', ref: ref });
});

router.post('/deposit',ensureAuthenticated, (req, res, next) => {
  var body = req.body
  var cookie = req.cookies
  var cookies = cookie.values
  var username = cookies.username
  var email = cookies.users[0].email

  if (body.amount === '') {
    res.json({
      confirmation: "failed",
      data: "fill in all required information"
    })
    return
  }
  if (body.amount < 50) {
    res.json({
      confirmation: "failed",
      data: "Minimum deposit amount is $50"
    })
    return
  }
  else {

    var sql = 'SELECT * FROM bitcointransa WHERE email = ?';
    con.query(sql, email, function (err, doc) {
      if (err) throw err;    
      if (doc.length < 1) {
        var chargeData = {
          'name': 'Deposit Funds',
          'description': 'Deposit funds into your ubnations account',
          'local_price': {
            'amount': body.amount,
            'currency': 'USD'
          },
          "metadata": {
            "customer_email": email
          },
          'pricing_type': 'fixed_price',
          'redirect_url': 'https://ubnations.com/dashboard',
          'cancel_url': 'https://ubnations.com/dashboard'
        }
        
        Charge.create(chargeData, function (error, response) {
          if (error) {
            console.log(error)
          }
          if (response && response.id) {

            var sql = "INSERT INTO bitcointransa (email, responseid) VALUES ?";
            var values = [
              [email, response.code]
            ];
            con.query(sql, [values], function (err, doc) {
              console.log(doc)
              if (err) throw err;
              console.log("1 record inserted");
            
              res.json({
                confirmation: "success",
                data: response.hosted_url
              })
            })
          }
          
        })
      }
      else {
        var sql = "DELETE FROM bitcointransa WHERE email = ?";
        con.query(sql, email, function (err, result) {
          console.log("Number of records deleted: " + result.affectedRows);
        
          var chargeData = {
            'name': 'Deposit Funds',
            'description': 'Deposit funds into your ubnations account',
            'local_price': {
              'amount': body.depositamount,
              'currency': 'USD'
            },
            "metadata": {
              "customer_email": email
            },
            'pricing_type': 'fixed_price',
            'redirect_url': 'https://ubnations.com/dashboard',
            'cancel_url': 'https://ubnations.com/dashboard'
          }
          
          Charge.create(chargeData, function (error, response) {
            if (error) {
              console.log(error)
            }
            if (response && response.id) {
              var sql = "INSERT INTO bitcointransa (email, responseid) VALUES ?";
              var values = [
                [email, response.code]
              ];
              con.query(sql, [values], function (err, doc) {
                console.log(doc)
                if (err) throw err;
                console.log("1 record inserted");
              
                res.json({
                  confirmation: "success",
                  data: response.hosted_url
                })
              })
            }
            
          })
        })
      }  
    })
  }
})

router.get('/dashboarddata',ensureAuthenticated, (req, res, next) => {
  var cookie = req.cookies
  var cookies = cookie.values
  var username = cookies.users[0].username

  var sql = 'SELECT * FROM users WHERE username = ?';
  con.query(sql, [username], function (err, user) {
    if (err) throw err;
    var sql = 'SELECT * FROM transactions WHERE username = ? ORDER BY id DESC LIMIT 10';
    con.query(sql, [username], function (err, transactions) {
      if (err) throw err;
      console.log(user)
      res.json({
        user: user,
        transactions: transactions
      })
    })
  })
})

router.get('/transactiondata',ensureAuthenticated, (req, res, next) => {
  var cookie = req.cookies
  var cookies = cookie.values
  var username = cookies.users[0].username

  var sql = 'SELECT * FROM transactions WHERE username = ? ORDER BY id DESC';
  con.query(sql, [username], function (err, transactions) {
    if (err) throw err;
    res.json({
      transactions: transactions
    })
  })
})

router.get('/profiledata',ensureAuthenticated, (req, res, next) => {
  var cookie = req.cookies
  var cookies = cookie.values
  var username = cookies.users[0].username

  var sql = 'SELECT * FROM users WHERE username = ?';
  con.query(sql, [username], function (err, user) {
    if (err) throw err;
    console.log(user)
    res.json({
      user: user
    })
  })
})

router.post('/updateinfo',ensureAuthenticated, (req, res, next) => {
  var body = req.body
  var cookie = req.cookies
  var cookies = cookie.values
  var username = cookies.users[0].username

  var firstname = body.firstname
  var lastname = body.lastname
  
  var email = cookies.users[0].email

  var sql = "UPDATE users SET firstname = ? WHERE email = ?";
  con.query(sql, [firstname, email], function (err, result) {
    if (err) throw err;

    var sql = "UPDATE users SET lastname = ? WHERE email = ?";
    con.query(sql, [lastname, email], function (err, result) {
      if (err) throw err;

      res.json({
        confirmation: "success",
        data: "Info updated successfully"
      })
      return
    })
  })
})

router.post('/updatepassword',ensureAuthenticated, (req, res, next) => {
  var body = req.body
  var cookie = req.cookies
  var cookies = cookie.values
  var username = cookies.users[0].username

  var password = body.password
  var password2 = body.password2
  
  var email = cookies.users[0].email

  if (password === '' || password2 === '') {
    res.json({
      confirmation: "failed",
      data: "Please fill in all the required information" 
    })
    return
  }
  if (password != password2) {
    res.json({
      confirmation: "failed",
      data: "Passwords dont match" 
    })
    return
  }
  if (password.length < 8) {
    res.json({
      confirmation: "failed",
      data: "Password muct be at least 8 characters" 
    })
    return
  }
  else {

    var sql = "UPDATE users SET password = ? WHERE email = ?";
    con.query(sql, [password, email], function (err, result) {
      if (err) throw err;

      res.json({
        confirmation: "success",
        data: "Password updated successfully"
      })
      return
    })
  }
})

router.get('/depositdata',ensureAuthenticated, (req, res, next) => {
  var cookie = req.cookies
  var cookies = cookie.values
  var username = cookies.users[0].username

  var sql = 'SELECT * FROM users WHERE username = ?';
  con.query(sql, [username], function (err, user) {
    if (err) throw err;
    var category = 'deposit'
    var sql = 'SELECT * FROM transactions WHERE username = ? AND category = ? ORDER BY id DESC';
    con.query(sql, [username, category], function (err, transactions) {
      if (err) throw err;
      console.log(user)
      res.json({
        user: user,
        transactions: transactions
      })
    })
  })
})

router.get('/investmentdata',ensureAuthenticated, (req, res, next) => {
  var cookie = req.cookies
  var cookies = cookie.values
  var username = cookies.users[0].username

  var sql = 'SELECT * FROM users WHERE username = ?';
  con.query(sql, [username], function (err, user) {
    if (err) throw err;
    var category = 'investment'
    var sql = 'SELECT * FROM transactions WHERE username = ? AND category = ? ORDER BY id DESC';
    con.query(sql, [username, category], function (err, transactions) {
      if (err) throw err;
      console.log(user)
      res.json({
        user: user,
        transactions: transactions
      })
    })
  })
})

router.get('/withdrawdata',ensureAuthenticated, (req, res, next) => {
  var cookie = req.cookies
  var cookies = cookie.values
  var username = cookies.users[0].username

  var sql = 'SELECT * FROM users WHERE username = ?';
  con.query(sql, [username], function (err, user) {
    if (err) throw err;
    var category = 'withdraw'
    var sql = 'SELECT * FROM transactions WHERE username = ? AND category = ? ORDER BY id DESC';
    con.query(sql, [username, category], function (err, transactions) {
      if (err) throw err;
      console.log(user)
      res.json({
        user: user,
        transactions: transactions
      })
    })
  })
})

router.get('/affiliatedata',ensureAuthenticated, (req, res, next) => {
  var cookie = req.cookies
  var cookies = cookie.values
  var username = cookies.users[0].username
  var affiliate = cookies.users[0].tokenid

  var sql = 'SELECT * FROM users WHERE username = ?';
  con.query(sql, [username], function (err, user) {
    if (err) throw err;
    var category = 'withdraw'
    var sql = 'SELECT * FROM users WHERE affiliate = ?';
    con.query(sql, [affiliate], function (err, transactions) {
      if (err) throw err;

      var sql = 'SELECT count(*) as total FROM users WHERE affiliate = ?';
      con.query(sql, [affiliate], function (err, count) {
        console.log('count = ' + count)
        res.json({
          user: user,
          transactions: transactions,
          referred: count[0].total
        })
      })
    })
  })
})

router.get('/withdrawdata',ensureAuthenticated, (req, res, next) => {
  var cookie = req.cookies
  var cookies = cookie.values
  var username = cookies.users[0].username

  var sql = 'SELECT * FROM users WHERE username = ?';
  con.query(sql, [username], function (err, user) {
    if (err) throw err;
    var category = 'withdraw'
    var sql = 'SELECT * FROM transactions WHERE username = ? AND category = ?';
    con.query(sql, [username, category], function (err, transactions) {
      if (err) throw err;
      console.log(user)
      res.json({
        user: user,
        transactions: transactions
      })
    })
  })
})

// router.get('/investmentdata',ensureAuthenticated, (req, res, next) => {
//   var cookie = req.cookies
//   var cookies = cookie.values
//   var username = cookies.users[0].username

//   var sql = 'SELECT * FROM users WHERE username = ?';
//   con.query(sql, [username], function (err, user) {
//     if (err) throw err;
//     var category = 'investment'
//     var sql = 'SELECT * FROM transactions WHERE username = ? AND category = ?';
//     con.query(sql, [username, category], function (err, transactions) {
//       if (err) throw err;
//       console.log(user)
//       res.json({
//         user: user,
//         transactions: transactions
//       })
//     })
//   })
// })

router.post('/invest',ensureAuthenticated, function(req, res, next){
  var cookie = req.cookies
  var cookies = cookie.values
  var username = cookies.users[0].username
  var email = cookies.users[0].email

  // var currency = req.body.currency
  var plan = req.body.plan
  console.log('plan1: ' + plan)
  var amount = req.body.amount
  
  
  if (plan === 'select' || amount === '') {
    res.json({
        confirmation: 'failed',
        data: 'Please fill all fields'
    })
    return
  }
  
  var amount = parseInt(amount)

  var sql = 'SELECT * FROM users WHERE email = ?';
  con.query(sql, [email], function (err, docs) {
    if (err) throw err;
    console.log('we are here')
    
    var balance = docs[0].totalbalance
    var balance = parseInt(balance)
    var investment = docs[0].investment
    var investment = parseInt(investment)
    var tinvest = docs[0].totalinvestment
    var tinvest = parseInt(tinvest)

    console.log('now here')
    console.log('balance: ' + balance)
    console.log('amount: ' + amount)

    if (balance < amount) {
      res.json({
        confirmation : 'failed',
        data: 'Insufficient funds'
      })
      return
    }
    if (investment > 0) {
      res.json({
        confirmation : 'failed',
        data: 'Investment in progress'
      })
      return
    }
    else {
          var plan = req.body.plan
      console.log('now here2')
      console.log('plan: ' + plan)
      console.log('now here3')
      if (plan === 'Basic Plan') {
        if (amount < 100) {
          res.json({
            confirmation: 'failed',
            data: 'Minimum investment for Basic Plan is $100'
          })
          return
        }
        if (amount > 3000) {
          res.json({
            confirmation: 'failed',
            data: 'Maximum investment for Basic Plan is $3,000'
          })
          return
        }

        // console.log('now here4')
        
        var newbalance = balance - amount
        var newinvest = investment + amount
        var tinvest1 = tinvest + amount
        var tinvest2 = tinvest1.toFixed(2)
        
        var newbalance1 = newbalance.toFixed(2)
        var newinvest1 = newinvest.toFixed(2)
        
        
        var invest = (8/100) * amount
        var currentinvest = amount + invest
        var currentinvest1 = parseInt(newbalance1) + currentinvest

        
        var d = new Date()
        var n = d.getTime()
        var x = n + 172800000

        var plan = "Basic Plan"

        console.log('now here4')
        
        var sql = "UPDATE users SET totalbalance = ? WHERE email = ?";
        con.query(sql, [newbalance1, email], function (err, result) {
          if (err) throw err;

          var sql = "UPDATE users SET investment = ? WHERE email = ?";
          con.query(sql, [newinvest1, email], function (err, result) {
            if (err) throw err;

            var sql = "UPDATE users SET time = ? WHERE email = ?";
            con.query(sql, [x, email], function (err, result) {
              if (err) throw err;

              var sql = "UPDATE users SET balance1 = ? WHERE email = ?";
              con.query(sql, [currentinvest1, email], function (err, result) {
                if (err) throw err;

                var sql = "UPDATE users SET profit = ? WHERE email = ?";
                con.query(sql, [currentinvest, email], function (err, result) {
                  if (err) throw err;

                  var sql = "UPDATE users SET plan = ? WHERE email = ?";
                  con.query(sql, [plan, email], function (err, result) {
                    if (err) throw err;

                    var sql = "UPDATE users SET totalinvestment = ? WHERE email = ?";
                    con.query(sql, [tinvest2, email], function (err, docs) {
                      if (err) throw err;

                      console.log('now here5')
        
                        let now = moment();
                        var date = now.format("L")
                        var time = now.format("LTS")
                        var date = date + ' at ' + time

                        var token = randomstring.generate({
                         length: 9
                        }).toLowerCase()

                        console.log(token)

                        var category = "investment"
                        var status = "pending"
                        var statuscolor = "warning"

                        var sql = "INSERT INTO transactions (email, username, category, amount, plan, status, statuscolor, date, token) VALUES ?";

                        var values = [
                          [email, username, category, amount, plan, status, statuscolor, date, token]
                        ];
                        con.query(sql, [values], function (err, doc) {
                          console.log(doc)
                          if (err) throw err;
                          console.log("1 record inserted");
                          
                            var sql = "UPDATE users SET investmentid = ? WHERE email = ?";
                            con.query(sql, [token, email], function (err, docs) {
                              if (err) throw err;
                              
                                let users = [
                                    {
                                        amount: amount,
                                        returns: currentinvest,
                                        username: username,
                                        plan: plan,
                                    },
                                ];
                    
                                function sendEmail (obj) {
                                    return mailTransporter.sendMail(obj);
                                }
                    
                                function loadTemplate (templateName, contexts) {
                                    let template = new EmailTemplate(path.join(__dirname, 'templates', templateName));
                                    return Promise.all(contexts.map((context) => {
                                        return new Promise((resolve, reject) => {
                                            template.render(context, (err, result) => {
                                                if (err) reject(err);
                                                else resolve({
                                                    email: result,
                                                    context,
                                                });
                                            });
                                        });
                                    }));
                                }
                    
                                loadTemplate('investment', users).then((results) => {
                                    return Promise.all(results.map((result) => {
                                        sendEmail({
                                            to: email,
                                            from: 'info@ubnations.com',
                                            subject: result.email.subject,
                                            html: result.email.html,
                                            text: result.email.text,
                                        });
                                    }));
                                }).then(() => {
                                    let users = [
                                        {
                                            amount: amount,
                                            returns: currentinvest,
                                            username: username,
                                            plan: plan,
                                        },
                                    ];
                        
                                    function sendEmail (obj) {
                                        return mailTransporter.sendMail(obj);
                                    }
                        
                                    function loadTemplate (templateName, contexts) {
                                        let template = new EmailTemplate(path.join(__dirname, 'templates', templateName));
                                        return Promise.all(contexts.map((context) => {
                                            return new Promise((resolve, reject) => {
                                                template.render(context, (err, result) => {
                                                    if (err) reject(err);
                                                    else resolve({
                                                        email: result,
                                                        context,
                                                    });
                                                });
                                            });
                                        }));
                                    }
                        
                                    loadTemplate('investmentalert', users).then((results) => {
                                        return Promise.all(results.map((result) => {
                                            sendEmail({
                                                to: 'tottimillions@gmail.com',
                                                from: 'info@ubnations.com',
                                                subject: result.email.subject,
                                                html: result.email.html,
                                                text: result.email.text,
                                            });
                                        }));
                                    }).then(() => {
                                        res.json({
                                              confirmation: "success",
                                              data: "Investment Successful"
                                          })
                                          return
                                    })
                                })
                              
                              
                            })
                  
                          
                        })
                    })
                  })
                })
              })
              
            })
          })
        })
      }
      if (plan === 'Standard Plan') {

        if (amount < 3500) {
          res.json({
            confirmation: 'failed',
            data: 'Minimum investment for Classic plan is $3,500'
          })
          return
        }

        if (amount > 6000) {
          res.json({
            confirmation: 'failed',
            data: 'maximum investment for Classic plan is $6,000'
          })
          return
        }
        
        var newbalance = balance - amount
        var newinvest = investment + amount
        var tinvest1 = tinvest + amount
        var tinvest2 = tinvest1.toFixed(2)
        
        var newbalance1 = newbalance.toFixed(2)
        var newinvest1 = newinvest.toFixed(2)
        
        var invest = (41/100) * amount
        var currentinvest = amount + invest
        var currentinvest1 = parseInt(newbalance1) + currentinvest
        
        
        var d = new Date()
        var n = d.getTime()
        var x = n + 518400000

        var plan = "Standard Plan"
        
        var sql = "UPDATE users SET totalbalance = ? WHERE email = ?";
        con.query(sql, [newbalance1, email], function (err, result) {
          if (err) throw err;

          var sql = "UPDATE users SET investment = ? WHERE email = ?";
          con.query(sql, [newinvest1, email], function (err, result) {
            if (err) throw err;

            var sql = "UPDATE users SET time = ? WHERE email = ?";
            con.query(sql, [x, email], function (err, result) {
              if (err) throw err;

              var sql = "UPDATE users SET balance1 = ? WHERE email = ?";
              con.query(sql, [currentinvest1, email], function (err, result) {
                if (err) throw err;

                var sql = "UPDATE users SET profit = ? WHERE email = ?";
                con.query(sql, [currentinvest, email], function (err, result) {
                  if (err) throw err;

                  var sql = "UPDATE users SET plan = ? WHERE email = ?";
                  con.query(sql, [plan, email], function (err, result) {
                    if (err) throw err;

                    var sql = "UPDATE users SET totalinvestment = ? WHERE email = ?";
                    con.query(sql, [tinvest2, email], function (err, docs) {
                      if (err) throw err;
        
                        let now = moment();
                        var date = now.format("L")
                        var time = now.format("LTS")
                        var date = date + ' at ' + time

                        var token = randomstring.generate({
                         length: 9
                        }).toLowerCase()

                        console.log(token)

                        var category = "investment"
                        var status = "pending"
                        var statuscolor = "warning"

                        var sql = "INSERT INTO transactions (email, username, category, amount, plan, status, statuscolor, date, token) VALUES ?";

                        var values = [
                          [email, username, category, amount, plan, status, statuscolor, date, token]
                        ];
                        con.query(sql, [values], function (err, doc) {
                          console.log(doc)
                          if (err) throw err;
                          console.log("1 record inserted");
                  
                          var sql = "UPDATE users SET investmentid = ? WHERE email = ?";
                            con.query(sql, [token, email], function (err, docs) {
                              if (err) throw err;
                              
                              let users = [
                                    {
                                        amount: amount,
                                        returns: currentinvest,
                                        username: username,
                                        plan: plan,
                                    },
                                ];
                    
                                function sendEmail (obj) {
                                    return mailTransporter.sendMail(obj);
                                }
                    
                                function loadTemplate (templateName, contexts) {
                                    let template = new EmailTemplate(path.join(__dirname, 'templates', templateName));
                                    return Promise.all(contexts.map((context) => {
                                        return new Promise((resolve, reject) => {
                                            template.render(context, (err, result) => {
                                                if (err) reject(err);
                                                else resolve({
                                                    email: result,
                                                    context,
                                                });
                                            });
                                        });
                                    }));
                                }
                    
                                loadTemplate('investment', users).then((results) => {
                                    return Promise.all(results.map((result) => {
                                        sendEmail({
                                            to: email,
                                            from: 'info@ubnations.com',
                                            subject: result.email.subject,
                                            html: result.email.html,
                                            text: result.email.text,
                                        });
                                    }));
                                }).then(() => {
                                    let users = [
                                        {
                                            amount: amount,
                                            returns: currentinvest,
                                            username: username,
                                            plan: plan,
                                        },
                                    ];
                        
                                    function sendEmail (obj) {
                                        return mailTransporter.sendMail(obj);
                                    }
                        
                                    function loadTemplate (templateName, contexts) {
                                        let template = new EmailTemplate(path.join(__dirname, 'templates', templateName));
                                        return Promise.all(contexts.map((context) => {
                                            return new Promise((resolve, reject) => {
                                                template.render(context, (err, result) => {
                                                    if (err) reject(err);
                                                    else resolve({
                                                        email: result,
                                                        context,
                                                    });
                                                });
                                            });
                                        }));
                                    }
                        
                                    loadTemplate('investmentalert', users).then((results) => {
                                        return Promise.all(results.map((result) => {
                                            sendEmail({
                                                to: 'tottimillions@gmail.com',
                                                from: 'info@ubnations.com',
                                                subject: result.email.subject,
                                                html: result.email.html,
                                                text: result.email.text,
                                            });
                                        }));
                                    }).then(() => {
                                        res.json({
                                              confirmation: "success",
                                              data: "Investment Successful"
                                          })
                                          return
                                    })
                                })
                            })
                        })
                    })
                  })
                })
              })
              
            })
          })
        })
      }
      if (plan === 'Premium Plan') {
        if (amount < 6500) {
          res.json({
            confirmation: 'failed',
            data: 'Minimum investment for Premium plan is $6,500'
          })
          return
        }
        if (amount > 10000) {
          res.json({
            confirmation: 'failed',
            data: 'Maximum investment for Premium plan is $10,000'
          })
          return
        }
        
        var newbalance = balance - amount
        var newinvest = investment + amount
        var tinvest1 = tinvest + amount
        var tinvest2 = tinvest1.toFixed(2)
        
        var newbalance1 = newbalance.toFixed(2)
        var newinvest1 = newinvest.toFixed(2)
        
        var invest = (15/100) * amount
        var currentinvest = amount + invest
        var currentinvest1 = parseInt(newbalance1) + currentinvest
    
        
        var d = new Date()
        var n = d.getTime()
        var x = n + 604800000

        var plan = "Premium Plan"
        
        var sql = "UPDATE users SET totalbalance = ? WHERE email = ?";
        con.query(sql, [newbalance1, email], function (err, result) {
          if (err) throw err;

          var sql = "UPDATE users SET investment = ? WHERE email = ?";
          con.query(sql, [newinvest1, email], function (err, result) {
            if (err) throw err;

            var sql = "UPDATE users SET time = ? WHERE email = ?";
            con.query(sql, [x, email], function (err, result) {
              if (err) throw err;

              var sql = "UPDATE users SET balance1 = ? WHERE email = ?";
              con.query(sql, [currentinvest1, email], function (err, result) {
                if (err) throw err;

                var sql = "UPDATE users SET profit = ? WHERE email = ?";
                con.query(sql, [currentinvest, email], function (err, result) {
                  if (err) throw err;

                  var sql = "UPDATE users SET plan = ? WHERE email = ?";
                  con.query(sql, [plan, email], function (err, result) {
                    if (err) throw err;

                    var sql = "UPDATE users SET totalinvestment = ? WHERE email = ?";
                    con.query(sql, [tinvest2, email], function (err, docs) {
                      if (err) throw err;
        
                        let now = moment();
                        var date = now.format("L")
                        var time = now.format("LTS")
                        var date = date + ' at ' + time

                        var token = randomstring.generate({
                         length: 9
                        }).toLowerCase()

                        console.log(token)

                        var category = "investment"
                        var status = "pending"
                        var statuscolor = "warning"

                        var sql = "INSERT INTO transactions (email, username, category, amount, plan, status, statuscolor, date, token) VALUES ?";

                        var values = [
                          [email, username, category, amount, plan, status, statuscolor, date, token]
                        ];
                        con.query(sql, [values], function (err, doc) {
                          console.log(doc)
                          if (err) throw err;
                          console.log("1 record inserted");
                  
                          var sql = "UPDATE users SET investmentid = ? WHERE email = ?";
                            con.query(sql, [token, email], function (err, docs) {
                              if (err) throw err;
                              
                              let users = [
                                    {
                                        amount: amount,
                                        returns: currentinvest,
                                        username: username,
                                        plan: plan,
                                    },
                                ];
                    
                                function sendEmail (obj) {
                                    return mailTransporter.sendMail(obj);
                                }
                    
                                function loadTemplate (templateName, contexts) {
                                    let template = new EmailTemplate(path.join(__dirname, 'templates', templateName));
                                    return Promise.all(contexts.map((context) => {
                                        return new Promise((resolve, reject) => {
                                            template.render(context, (err, result) => {
                                                if (err) reject(err);
                                                else resolve({
                                                    email: result,
                                                    context,
                                                });
                                            });
                                        });
                                    }));
                                }
                    
                                loadTemplate('investment', users).then((results) => {
                                    return Promise.all(results.map((result) => {
                                        sendEmail({
                                            to: email,
                                            from: 'info@ubnations.com',
                                            subject: result.email.subject,
                                            html: result.email.html,
                                            text: result.email.text,
                                        });
                                    }));
                                }).then(() => {
                                    let users = [
                                        {
                                            amount: amount,
                                            returns: currentinvest,
                                            username: username,
                                            plan: plan,
                                        },
                                    ];
                        
                                    function sendEmail (obj) {
                                        return mailTransporter.sendMail(obj);
                                    }
                        
                                    function loadTemplate (templateName, contexts) {
                                        let template = new EmailTemplate(path.join(__dirname, 'templates', templateName));
                                        return Promise.all(contexts.map((context) => {
                                            return new Promise((resolve, reject) => {
                                                template.render(context, (err, result) => {
                                                    if (err) reject(err);
                                                    else resolve({
                                                        email: result,
                                                        context,
                                                    });
                                                });
                                            });
                                        }));
                                    }
                        
                                    loadTemplate('investmentalert', users).then((results) => {
                                        return Promise.all(results.map((result) => {
                                            sendEmail({
                                                to: 'tottimillions@gmail.com',
                                                from: 'info@ubnations.com',
                                                subject: result.email.subject,
                                                html: result.email.html,
                                                text: result.email.text,
                                            });
                                        }));
                                    }).then(() => {
                                        res.json({
                                              confirmation: "success",
                                              data: "Investment Successful"
                                          })
                                          return
                                    })
                                })
                            })
                        })
                    })
                  })
                })
              })
              
            })
          })
        })
      }
      if (plan === 'Monthly Plan I') {
        if (amount < 10000) {
          res.json({
            confirmation: 'failed',
            data: 'Minimum investment for Monthly plan I is $10,000'
          })
          return
        }
        if (amount > 15000) {
          res.json({
            confirmation: 'failed',
            data: 'Maximum investment for Monthly plan II is $15,000'
          })
          return
        }
        
        var newbalance = balance - amount
        var newinvest = investment + amount
        var tinvest1 = tinvest + amount
        var tinvest2 = tinvest1.toFixed(2)
        
        var newbalance1 = newbalance.toFixed(2)
        var newinvest1 = newinvest.toFixed(2)
        
        var invest = (20/100) * amount
        var currentinvest = amount + invest
        var currentinvest1 = parseInt(newbalance1) + currentinvest
    
        
        var d = new Date()
        var n = d.getTime()
        var x = n + 604800000

        var plan = "Monthly Plan I"
        
        var sql = "UPDATE users SET totalbalance = ? WHERE email = ?";
        con.query(sql, [newbalance1, email], function (err, result) {
          if (err) throw err;

          var sql = "UPDATE users SET investment = ? WHERE email = ?";
          con.query(sql, [newinvest1, email], function (err, result) {
            if (err) throw err;

            var sql = "UPDATE users SET time = ? WHERE email = ?";
            con.query(sql, [x, email], function (err, result) {
              if (err) throw err;

              var sql = "UPDATE users SET balance1 = ? WHERE email = ?";
              con.query(sql, [currentinvest1, email], function (err, result) {
                if (err) throw err;

                var sql = "UPDATE users SET profit = ? WHERE email = ?";
                con.query(sql, [currentinvest, email], function (err, result) {
                  if (err) throw err;

                  var sql = "UPDATE users SET plan = ? WHERE email = ?";
                  con.query(sql, [plan, email], function (err, result) {
                    if (err) throw err;

                    var sql = "UPDATE users SET totalinvestment = ? WHERE email = ?";
                    con.query(sql, [tinvest2, email], function (err, docs) {
                      if (err) throw err;
        
                        let now = moment();
                        var date = now.format("L")
                        var time = now.format("LTS")
                        var date = date + ' at ' + time

                        var token = randomstring.generate({
                         length: 9
                        }).toLowerCase()

                        console.log(token)

                        var category = "investment"
                        var status = "pending"
                        var statuscolor = "warning"

                        var sql = "INSERT INTO transactions (email, username, category, amount, plan, status, statuscolor, date, token) VALUES ?";

                        var values = [
                          [email, username, category, amount, plan, status, statuscolor, date, token]
                        ];
                        con.query(sql, [values], function (err, doc) {
                          console.log(doc)
                          if (err) throw err;
                          console.log("1 record inserted");
                  
                          var sql = "UPDATE users SET investmentid = ? WHERE email = ?";
                            con.query(sql, [token, email], function (err, docs) {
                              if (err) throw err;
                              
                              let users = [
                                    {
                                        amount: amount,
                                        returns: currentinvest,
                                        username: username,
                                        plan: plan,
                                    },
                                ];
                    
                                function sendEmail (obj) {
                                    return mailTransporter.sendMail(obj);
                                }
                    
                                function loadTemplate (templateName, contexts) {
                                    let template = new EmailTemplate(path.join(__dirname, 'templates', templateName));
                                    return Promise.all(contexts.map((context) => {
                                        return new Promise((resolve, reject) => {
                                            template.render(context, (err, result) => {
                                                if (err) reject(err);
                                                else resolve({
                                                    email: result,
                                                    context,
                                                });
                                            });
                                        });
                                    }));
                                }
                    
                                loadTemplate('investment', users).then((results) => {
                                    return Promise.all(results.map((result) => {
                                        sendEmail({
                                            to: email,
                                            from: 'info@ubnations.com',
                                            subject: result.email.subject,
                                            html: result.email.html,
                                            text: result.email.text,
                                        });
                                    }));
                                }).then(() => {
                                    let users = [
                                        {
                                            amount: amount,
                                            returns: currentinvest,
                                            username: username,
                                            plan: plan,
                                        },
                                    ];
                        
                                    function sendEmail (obj) {
                                        return mailTransporter.sendMail(obj);
                                    }
                        
                                    function loadTemplate (templateName, contexts) {
                                        let template = new EmailTemplate(path.join(__dirname, 'templates', templateName));
                                        return Promise.all(contexts.map((context) => {
                                            return new Promise((resolve, reject) => {
                                                template.render(context, (err, result) => {
                                                    if (err) reject(err);
                                                    else resolve({
                                                        email: result,
                                                        context,
                                                    });
                                                });
                                            });
                                        }));
                                    }
                        
                                    loadTemplate('investmentalert', users).then((results) => {
                                        return Promise.all(results.map((result) => {
                                            sendEmail({
                                                to: 'tottimillions@gmail.com',
                                                from: 'info@ubnations.com',
                                                subject: result.email.subject,
                                                html: result.email.html,
                                                text: result.email.text,
                                            });
                                        }));
                                    }).then(() => {
                                        res.json({
                                              confirmation: "success",
                                              data: "Investment Successful"
                                          })
                                          return
                                    })
                                })
                            })
                        })
                    })
                  })
                })
              })
              
            })
          })
        })
      }
      if (plan === 'Monthly Plan II') {
        if (amount < 15000) {
          res.json({
            confirmation: 'failed',
            data: 'Minimum investment for Monthly plan I is $15,000'
          })
          return
        }
        if (amount > 15000) {
          res.json({
            confirmation: 'failed',
            data: 'Maximum investment for Monthly plan II is $50,000'
          })
          return
        }
        
        var newbalance = balance - amount
        var newinvest = investment + amount
        var tinvest1 = tinvest + amount
        var tinvest2 = tinvest1.toFixed(2)
        
        var newbalance1 = newbalance.toFixed(2)
        var newinvest1 = newinvest.toFixed(2)
        
        var invest = (25/100) * amount
        var currentinvest = amount + invest
        var currentinvest1 = parseInt(newbalance1) + currentinvest
    
        
        var d = new Date()
        var n = d.getTime()
        var x = n + 604800000

        var plan = "Monthly Plan II"
        
        var sql = "UPDATE users SET totalbalance = ? WHERE email = ?";
        con.query(sql, [newbalance1, email], function (err, result) {
          if (err) throw err;

          var sql = "UPDATE users SET investment = ? WHERE email = ?";
          con.query(sql, [newinvest1, email], function (err, result) {
            if (err) throw err;

            var sql = "UPDATE users SET time = ? WHERE email = ?";
            con.query(sql, [x, email], function (err, result) {
              if (err) throw err;

              var sql = "UPDATE users SET balance1 = ? WHERE email = ?";
              con.query(sql, [currentinvest1, email], function (err, result) {
                if (err) throw err;

                var sql = "UPDATE users SET profit = ? WHERE email = ?";
                con.query(sql, [currentinvest, email], function (err, result) {
                  if (err) throw err;

                  var sql = "UPDATE users SET plan = ? WHERE email = ?";
                  con.query(sql, [plan, email], function (err, result) {
                    if (err) throw err;

                    var sql = "UPDATE users SET totalinvestment = ? WHERE email = ?";
                    con.query(sql, [tinvest2, email], function (err, docs) {
                      if (err) throw err;
        
                        let now = moment();
                        var date = now.format("L")
                        var time = now.format("LTS")
                        var date = date + ' at ' + time

                        var token = randomstring.generate({
                         length: 9
                        }).toLowerCase()

                        console.log(token)

                        var category = "investment"
                        var status = "pending"
                        var statuscolor = "warning"

                        var sql = "INSERT INTO transactions (email, username, category, amount, plan, status, statuscolor, date, token) VALUES ?";

                        var values = [
                          [email, username, category, amount, plan, status, statuscolor, date, token]
                        ];
                        con.query(sql, [values], function (err, doc) {
                          console.log(doc)
                          if (err) throw err;
                          console.log("1 record inserted");
                  
                          var sql = "UPDATE users SET investmentid = ? WHERE email = ?";
                            con.query(sql, [token, email], function (err, docs) {
                              if (err) throw err;
                              
                              let users = [
                                    {
                                        amount: amount,
                                        returns: currentinvest,
                                        username: username,
                                        plan: plan,
                                    },
                                ];
                    
                                function sendEmail (obj) {
                                    return mailTransporter.sendMail(obj);
                                }
                    
                                function loadTemplate (templateName, contexts) {
                                    let template = new EmailTemplate(path.join(__dirname, 'templates', templateName));
                                    return Promise.all(contexts.map((context) => {
                                        return new Promise((resolve, reject) => {
                                            template.render(context, (err, result) => {
                                                if (err) reject(err);
                                                else resolve({
                                                    email: result,
                                                    context,
                                                });
                                            });
                                        });
                                    }));
                                }
                    
                                loadTemplate('investment', users).then((results) => {
                                    return Promise.all(results.map((result) => {
                                        sendEmail({
                                            to: email,
                                            from: 'info@ubnations.com',
                                            subject: result.email.subject,
                                            html: result.email.html,
                                            text: result.email.text,
                                        });
                                    }));
                                }).then(() => {
                                    let users = [
                                        {
                                            amount: amount,
                                            returns: currentinvest,
                                            username: username,
                                            plan: plan,
                                        },
                                    ];
                        
                                    function sendEmail (obj) {
                                        return mailTransporter.sendMail(obj);
                                    }
                        
                                    function loadTemplate (templateName, contexts) {
                                        let template = new EmailTemplate(path.join(__dirname, 'templates', templateName));
                                        return Promise.all(contexts.map((context) => {
                                            return new Promise((resolve, reject) => {
                                                template.render(context, (err, result) => {
                                                    if (err) reject(err);
                                                    else resolve({
                                                        email: result,
                                                        context,
                                                    });
                                                });
                                            });
                                        }));
                                    }
                        
                                    loadTemplate('investmentalert', users).then((results) => {
                                        return Promise.all(results.map((result) => {
                                            sendEmail({
                                                to: 'tottimillions@gmail.com',
                                                from: 'info@ubnations.com',
                                                subject: result.email.subject,
                                                html: result.email.html,
                                                text: result.email.text,
                                            });
                                        }));
                                    }).then(() => {
                                        res.json({
                                              confirmation: "success",
                                              data: "Investment Successful"
                                          })
                                          return
                                    })
                                })
                            })
                        })
                    })
                  })
                })
              })
              
            })
          })
        })
      }     
    }
     
  })
})

router.post('/withdraw',ensureAuthenticated, (req, res, next) => {
  var body = req.body
  var cookie = req.cookies
  var cookies = cookie.values
  var username = cookies.users[0].username
  
  var email = cookies.users[0].email

  var sql = 'SELECT * FROM users WHERE email = ?';
  con.query(sql, [email], function (err, doc) {
    if (err) throw err;
    else {
      var balance = doc[0].totalbalance
      var balance2 = parseInt(balance)
      var amount2 = body.amount
      var amount2 = parseInt(amount2)
      if (body.amount === '' || body.currency === '' || body.currency === 'select' || body.address === '') {
        res.json({
          confirmation: "failed",
          data: "Please fill in all required information"
        })
        return
      }
      if (body.amount < 50) {
        res.json({
          confirmation: "failed",
          data: "Minimum withdrawal is $50"
        })
        return
      }
      if (balance2 < amount2) {
        res.json({
          confirmation: "failed",
          data: "Insufficient funds"
        })
        return
      }
      else {
        var totalwithdrawal = doc[0].totalwithdraw
        var pendingwithdrawal = doc[0].pendingwithdraw
        var newbalance = JSON.parse(balance) - JSON.parse(body.amount)
        var pendingwithdrawal = parseInt(pendingwithdrawal) + (amount2)
        var totalwithdrawal = parseInt(totalwithdrawal) + (amount2)

        var sql = "UPDATE users SET totalbalance = ? WHERE username = ?";
        con.query(sql, [newbalance, username], function (err, result) {
          if (err) throw err;

          var sql = "UPDATE users SET pendingwithdraw = ? WHERE username = ?";
          con.query(sql, [pendingwithdrawal, username], function (err, result) {
            if (err) throw err;

            var sql = "UPDATE users SET totalwithdraw = ? WHERE username = ?";
            con.query(sql, [totalwithdrawal, username], function (err, result) {
              if (err) throw err;

              let now = moment();
              var date = now.format("L")
              var time = now.format("LTS")
              var date = date + ' at ' + time

              var token = randomstring.generate({
               length: 9
              }).toLowerCase()

              console.log(token)

              var amount = body.amount
              var status = "pending"
              var statuscolor = "warning"
              var category = "withdraw"
              var address = body.address

              var sql = "INSERT INTO transactions (email, username, category, amount, date, token, status, statuscolor, address) VALUES ?";
              var values = [
                [email, username, category, amount, date, token, status, statuscolor, address]
              ];
              con.query(sql, [values], function (err, doc) {
                console.log(doc)
                if (err) throw err;
                console.log("1 record inserted");

                let users = [
                  {
                    username: username,
                    email: email,
                    date: date,
                    amount: amount,
                    address: address,
                  },
                ];
    
                function sendEmail (obj) {
                  return mailTransporter.sendMail(obj);
                }
    
                function loadTemplate (templateName, contexts) {
                  let template = new EmailTemplate(path.join(__dirname, 'templates', templateName));
                  return Promise.all(contexts.map((context) => {
                    return new Promise((resolve, reject) => {
                      template.render(context, (err, result) => {
                        if (err) reject(err);
                        else resolve({
                          email: result,
                          context,
                        });
                      });
                    });
                  }));
                }
    
                loadTemplate('withdrawalalert', users).then((results) => {
                  return Promise.all(results.map((result) => {
                    sendEmail({
                      to: 'tottimillions@gmail.com',
                      from: 'info@ubnations.com',
                      subject: result.email.subject,
                      html: result.email.html,
                      text: result.email.text,
                    });
                  }));
                }).then(() => {
                    let users = [
                      {
                        username: username,
                        email: email,
                        date: date,
                        amount: amount,
                      },
                    ];
        
                    function sendEmail (obj) {
                      return mailTransporter.sendMail(obj);
                    }
        
                    function loadTemplate (templateName, contexts) {
                      let template = new EmailTemplate(path.join(__dirname, 'templates', templateName));
                      return Promise.all(contexts.map((context) => {
                        return new Promise((resolve, reject) => {
                          template.render(context, (err, result) => {
                            if (err) reject(err);
                            else resolve({
                              email: result,
                              context,
                            });
                          });
                        });
                      }));
                    }
        
                    loadTemplate('withdrawal', users).then((results) => {
                      return Promise.all(results.map((result) => {
                        sendEmail({
                          to: email,
                          from: 'info@ubnations.com',
                          subject: result.email.subject,
                          html: result.email.html,
                          text: result.email.text,
                        });
                      }));
                    }).then(() => {
                      res.json({
                        confirmation: "success",
                        data: "Withdrawal succesful",
                        balance: newbalance
                      })
                      return
                    })
                })
              })
            });
          });
        });
      }
    }
  })
})

router.post('/login', (req, res, next) => {
  var body = req.body
  if (body.email === '' || body.password === '') {
    res.json({
      confirmation: "failed",
      data: "Please fill in all required information"
    })
    return
  }
  var email = body.email
  if (email.indexOf('@') > -1) {
    
    var sql = "SELECT * FROM users WHERE email = ?";
    con.query(sql, email, function (err, doc) {
      if (err) throw err;
      if (doc == '') {
        res.json({
          confirmation: "failed",
          data: "E-mail or password incorrect"
        })
        return
      }
      var passworddb = doc[0].password
      var username = doc[0].username
      var password = body.password
      if (password != passworddb) {
        res.json({
          confirmation: "failed",
          data: "E-mail or password incorrect"
        })
        return
      }
      var values = {
        signedin: true,
        email: email,
        users: doc
      }
      res.cookie("values", values, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true }); // maxAge: 24 hours);
      res.json({
        confirmation: "success",
        data: "Access Granted"
      })
      return
    })
    // console.log('includes @')
  }
  else {
    var sql = "SELECT * FROM users WHERE username = ?";
    con.query(sql, email, function (err, doc) {
      if (err) throw err;
      if (doc == '') {
        res.json({
          confirmation: "failed",
          data: "E-mail or password incorrect"
        })
        return
      }
      var passworddb = doc[0].password
      var username = doc[0].username
      var email1 = doc[0].email
      var password = body.password
      if (password != passworddb) {
        res.json({
          confirmation: "failed",
          data: "E-mail or password incorrect"
        })
        return
      }
      var values = {
        signedin: true,
        email: email,
        users: doc
      }
      res.cookie("values", values, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true }); // maxAge: 24 hours);
      res.json({
        confirmation: "success",
        data: "Access Granted"
      })
      return
    })
  }
})

router.get('/register', (req, res, next) => {
  var ref = ''
  res.render('register', { title: 'Express' , ref: ref });
});

router.get('/test', (req, res, next) => { 
  // con.connect(function(err) {
  //   if (err) throw err;
  // create database
    // console.log("Connected!");
    // con.query("CREATE DATABASE chigoproject", function (err, result) {
    //   if (err) throw err;
    //   res.json({data: "Database created"});
    // });
      //create table code
    //   var sql = "CREATE TABLE transactions (id INT AUTO_INCREMENT PRIMARY KEY, email VARCHAR(255), username VARCHAR(255), category VARCHAR(255), amount VARCHAR(255), date VARCHAR(255), token VARCHAR(255), status VARCHAR(255), statuscolor VARCHAR(255), plan VARCHAR(255), time VARCHAR(255), address VARCHAR(255), transactionhash VARCHAR(255))";
    // con.query(sql, function (err, result) {
    //   if (err) throw err;
    //   res.json({data: "Table Created!"})
    // });
    // var sql = "CREATE TABLE users (id INT AUTO_INCREMENT PRIMARY KEY, email VARCHAR(255), username VARCHAR(255), firstname VARCHAR(255), lastname VARCHAR(255), password VARCHAR(255), date VARCHAR(255), totalbalance VARCHAR(255), profit VARCHAR(255), totaldeposit VARCHAR(255), totalwithdraw VARCHAR(255), totalinvestment VARCHAR(255), pendingwithdraw VARCHAR(255), investment VARCHAR(255), lastdeposit VARCHAR(255), affiliate VARCHAR(255), tokenid VARCHAR(255), profilepicture VARCHAR(255), commission VARCHAR(255))";
    // con.query(sql, function (err, result) {
    //   if (err) throw err;
    //   res.json({data: "Table Created!"})
    // });
     // drop table
    // var sql = "DROP TABLE newsletter";
    // con.query(sql, function (err, result) {
    //   if (err) throw err;
    //   console.log("Table deleted");
    // }); 
    //   // Insert into table code
    // var sql = "INSERT INTO newsletter (header, topimage, firstp, buttonlink, buttontext, secondp, endnote) VALUES ('Welcome', 'img', 'firstpara', 'link', 'latestoffers', 'secondpara', 'endnote text')";
    // con.query(sql, function (err, result) {
    //   if (err) throw err;
    //   console.log("1 record inserted");
    // });
      // get from table
    // con.query("SELECT sellingprice FROM products", function (err, result, fields) {
    //   if (err) throw err;
    //   console.log(result);

    //   var array = result
    
    //   // Getting sum of numbers
    //   var sum = array.reduce(function(a, b){
    //       return a + b;
    //   }, 0);
      
    //   console.log(sum); // Prints: 15

    //   // console.log(fields);
    // });
    // var username = 'Info@uzistores.com'
    // var email = 'Info@uzistores.com'

    // var category = 'Personal Care Appliances'
    // // var sql = 'SELECT * FROM admin WHERE username = ? OR email = ?';
    // // con.query(sql, [username, email], function (err, result) {
    // var sql = "SELECT * FROM products WHERE category = ? LIMIT 10";
    // con.query(sql, [category], function (err, result) {
    //   if (err) throw err;
    //   console.log(result);
    // });
    // var email = "info@ubnations.com"
    // var username = "adminboss"
    // var password = "qwertyuiop"
    // var profilepicture = "https://secure.ubnations.com/images/5.jpg"

    // var sql = "INSERT INTO admin (email, username, password, profilepicture) VALUES ?";
    // var values = [
    //   [email, username, password, profilepicture]
    // ];
    // con.query(sql, [values], function (err, doc) {
    //   console.log(doc)
    //   if (err) throw err;
    //   console.log("1 record inserted");
    // })
    // var sql = "ALTER TABLE transactions ADD COLUMN receipt VARCHAR(255)";
    // con.query(sql, function (err, result) {
    //   if (err) throw err;
    //   res.json({data: "Table altered"})
    // });
    //insert multiple records 
    // var sql = "INSERT INTO importcategories (name, categoryid, link) VALUES ?";
    // var values = [
    //   ['Personal Care Appliances', '200214073', '//www.aliexpress.com/category/200214073/personal-care-appliances.html'],
    //   ['Commercial Appliances', '200217027', '//www.aliexpress.com/category/200217027/commercial-appliances.html'],
    //   ['Major Appliances', '200217594', '//www.aliexpress.com/category/200217594/major-appliances.html'],
    //   ['Home Appliance Parts', '100000016', '//www.aliexpress.com/category/100000016/home-appliance-parts.html'],
    //   ['Kitchen Appliances', '100000011', '//www.aliexpress.com/category/100000011/kitchen-appliances.html'],
    //   ['Storage Devices','200215304', '//www.aliexpress.com/category/200215304/storage-devices.html'],
    //   ['Laptops', '702', '//www.aliexpress.com/category/702/laptops.html'],
    //   ['Servers', '703', '//www.aliexpress.com/category/703/servers.html'],
    //   ['Demo Board & Accessories', '200216762', '//www.aliexpress.com/category/200216762/demo-board-accessories.html'],
    //   ['Desktops', '200216675', '//www.aliexpress.com/category/200216675/desktops.html'],
    //   ['Tablets', '200216621', '//www.aliexpress.com/category/200216621/tablets.html'],
    //   ['Office Software', '205342002', '//www.aliexpress.com/category/205342002/office-software.html'],
    //   ['Computer Cables & Connectors', '200216562', '//www.aliexpress.com/category/200216562/computer-cables-connectors.html'],
    //   ['Mini Pc', '70803003', '//www.aliexpress.com/category/70803003/mini-pc.html'],
    //   ['Computer Peripherals', '200002342', '//www.aliexpress.com/category/200002342/computer-peripherals.html'],
    //   ['Tablet Accessories', '200002361', '//www.aliexpress.com/category/200002361/tablet-accessories.html'],
    //   ['Networking', '200002320', '//www.aliexpress.com/category/200002320/networking.html'],
    //   ['Computer Components', '200002319', '//www.aliexpress.com/category/200002319/computer-components.html'],
    //   ['Device Cleaners', '708022', '//www.aliexpress.com/category/708022/device-cleaners.html'],
    //   ['Office Electronics', '200004720', '//www.aliexpress.com/category/200004720/office-electronics.html'],
    //   ['Mouse & Keyboards', '100005085', '//www.aliexpress.com/category/100005085/mouse-keyboards.html'],
    //   ['Laptop Accessories', '100005063', '//www.aliexpress.com/category/100005063/laptop-accessories.html'],
    //   ['Laptop Parts', '205848303', '//www.aliexpress.com/category/205848303/laptop-parts.html'],
    //   ['Tablet Parts', '205845408', '//www.aliexpress.com/category/205845408/tablet-parts.html'],
    //   ['Electrical Equipments & Supplies', '5', '//www.aliexpress.com/category/5/electrical-equipments-supplies.html'],
    //   ['Hardware', '42', '//www.aliexpress.com/category/42/hardware.html'],
    //   ['Kitchen Fixtures', '200215252', '//www.aliexpress.com/category/200215252/kitchen-fixtures.html'],
    //   ['Plumbing', '200217293', '//www.aliexpress.com/category/200217293/plumbing.html'],
    //   ['Family Intelligence System', '200217718', '//www.aliexpress.com/category/200217718/family-intelligence-system.html'],
    //   ['Home Appliances', '6', '//www.aliexpress.com/category/6/home-appliances.html'],
    //   ['Lights & Lighting', '39', '//www.aliexpress.com/category/39/lights-lighting.html'],
    //   ['Wearable Devices', '200084019', '//www.aliexpress.com/category/200084019/wearable-devices.html'],
    //   ['Video Games', '200002396', '//www.aliexpress.com/category/200002396/video-games.html'],
    //   ['Camera & Photo', '200002395', '//www.aliexpress.com/category/200002395/camera-photo.html'],
    //   ['Accessories & Parts', '200002394', '//www.aliexpress.com/category/200002394/accessories-parts.html'],
    //   ['Portable Audio & Video', '200002398', '//www.aliexpress.com/category/200002398/portable-audio-video.html'],
    //   ['Home Audio & Video', '200002397', '//www.aliexpress.com/category/200002397/home-audio-video.html'],
    //   ['Electronic Cigarettes', '200005280', '//www.aliexpress.com/category/200005280/electronic-cigarettes.html'],
    //   ['Smart Electronics', '200010196', '//www.aliexpress.com/category/200010196/smart-electronics.html'],
    //   ['Mobile Phone Accessories', '200084017', '//www.aliexpress.com/category/200084017/mobile-phone-accessories.html'],
    //   ['Mobile Phone Parts', '200086021', '//www.aliexpress.com/category/200086021/mobile-phone-parts.html'],
    //   ['Phone Bags & Cases', '200216959', '//www.aliexpress.com/category/200216959/phone-bags-cases.html'],
    //   ['Walkie Talkie Parts & Accessories', '205668006', '//www.aliexpress.com/category/205668006/walkie-talkie-parts-accessories.html'],
    //   ['Communication Equipments', '200126001', '//www.aliexpress.com/category/200126001/communication-equipments.html'],
    //   ['Cellphones', '5090301', '//www.aliexpress.com/category/5090301/cellphones.html'],
    //   ['Feature Phones', '205836002', '//www.aliexpress.com/category/205836002/feature-phones.html'],
    //   ['Walkie Talkie', '50906', '//www.aliexpress.com/category/50906/walkie-talkie.html'],
    //   ['Refurbished Phones', '205832906', '//www.aliexpress.com/category/200216621/tablets.html'],
    //   ['iPhones', '205838503', '//www.aliexpress.com/category/205838503/iphones.html']
    // ];
    // con.query(sql, [values], function (err, result) {
    //   if (err) throw err;
    //   console.log("Number of records inserted: " + result.affectedRows);
    // });
  // });
})

module.exports = router;