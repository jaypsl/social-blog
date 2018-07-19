const User = require('../models/users');
const jwt = require('jsonwebtoken');
const config = require('../config/databse') // Import database configuration


module.exports = (router) => {

    router.post('/register', (req, res) => {
        if (!req.body.email) {
            res.send({ success: false, message: 'You must provide an email' })
        } else {
            if (!req.body.username) {
                res.send({ success: false, message: 'You must provide a username' })
            }
            else {
                if (!req.body.password) {
                    res.send({ success: false, message: 'You must provide a password' })
                }
                else {

                    let user = new User({
                        email: req.body.email.toLowerCase(),
                        username: req.body.username.toLowerCase(),
                        password: req.body.password
                    });

                    user.save((err, result) => {
                        if (err) {
                            if (err.code === 11000) {
                                res.send({
                                    success: false,
                                    message: 'username, email already exists'
                                })
                            }
                            else {
                                if (err.errors) {
                                    if (err.errors.email) {
                                        res.send({
                                            success: false,
                                            message: err.errors.email.message
                                        })
                                    }
                                }
                                res.send({
                                    success: false,
                                    message: 'Could not save user error', err
                                })
                            }
                            // console.log(err);

                        }
                        else {
                            res.send({
                                success: true,
                                message: 'Account registered',
                                registerInfo: result
                            })
                        }
                    })

                }

            }

        }

    });

    router.get('/checkEmail/:email', (req, res) => {
        if (!req.params.email) {
            res.send({
                success: false,
                message: "Email not provide"
            })
        }
        else {
            User.findOne({ email: req.params.email }, (err, result) => {
                if (err) {
                    res.send({success: false,message: err})
                }
                else {
                    if (result) {
                        res.send({ success: false, message: "email already taken" })
                    }
                    else {
                        res.send({ success: true, message: "Email available"})
                    }
                }
            })
        }
    })

    router.get('/checkUsername/:username', (req, res) => {
        if (!req.params.username) {
            res.send({
                success: false,
                message: "username not provided"
            })
        }
        else {
            User.findOne({ username: req.params.username }, (err, result) => {
                if (err) {
                    res.send({success: false,message: err})
                }
                else {
                    if (result) {
                        res.send({ success: false, message: "username already taken" })
                    }
                    else {
                        res.send({ success: true, message: "username available"})
                    }
                }
            })
        }
    })

  /* ========
  LOGIN ROUTE
  ======== */
  router.post('/login', (req, res) => {
    // Check if username was provided
    if (!req.body.username) {
      res.json({ success: false, message: 'No username was provided' }); // Return error
    } else {
      // Check if password was provided
      if (!req.body.password) {
        res.json({ success: false, message: 'No password was provided.' }); // Return error
      } else {
        // Check if username exists in database
        User.findOne({ username: req.body.username.toLowerCase() }, (err, user) => {
          // Check if error was found
          if (err) {
            res.json({ success: false, message: err }); // Return error
          } else {
            // Check if username was found
            if (!user) {
              res.json({ success: false, message: 'Username not found.' }); // Return error
            } else {
              const validPassword = user.comparePasword(req.body.password); // Compare password provided to password in database
              // Check if password is a match
              if (!validPassword) {
                res.json({ success: false, message: 'Password invalid' }); // Return error
              } else {
                const token = jwt.sign({ userId: user._id }, config.secret, { expiresIn: '24h' }); // Create a token for client
                res.json({ success: true, message: 'Success!', token: token, user: { username: user.username } }); // Return success and token to frontend
              }
            }
          }
        });
      }
    }
  });

  /* ================================================
  MIDDLEWARE - Used to grab user's token from headers
  ================================================ */
  router.use((req, res, next) => {
    const token = req.headers['authorization']; // Create token found in headers
    // Check if token was found in headers
    if (!token) {
      res.json({ success: false, message: 'No token provided' }); // Return error
    } else {
      // Verify the token is valid
      jwt.verify(token, config.secret, (err, decoded) => {
        // Check if error is expired or invalid
        if (err) {
          res.json({ success: false, message: 'Token invalid: ' + err }); // Return error for token validation
        } else {
          req.decoded = decoded; // Create global variable to use in any request beyond
          next(); // Exit middleware
        }
      });
    }
  });

    //  Route to get user's profile data

  router.get('/profile', (req, res) => {

    User.findOne({ _id: req.decoded.userId }).select('username email').exec((err, user) => {
      // Check if error connecting
      if (err) {
        res.json({ success: false, message: err }); // Return error
      } else {
        // Check if user was found in database
        if (!user) {
          res.json({ success: false, message: 'User not found' }); // Return error, user was not found in db
        } else {
          res.json({ success: true, user: user }); // Return success, send user object to frontend for profile
        }
      }
    });
  });

router.get('/publicProfile/:username' , (req,res)=>{
    console.log(req.params);
    if(!req.params.username){
        res.send({
            success: false,
            msg: 'No user found'
        })
    }
    else{
        User.findOne({username: req.params.username}).select('username email')((err,user)=>{
            if(err){
                res.send({
                    success: false,
                    msg: 'Something went wronf'
                })
            }
            else{
                if(!user){
                    res.send({
                        success:false,
                        msg: 'User not found'
                    })
                }
                else{
                    res.send({
                        success: true,
                        user: user
                    })

                }
            }
        })
    }
})

    return router;
}   