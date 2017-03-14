const app = require("../server.js");

module.exports = {
  createAccount: createAccount,
  login: login,
  logout: logout,
  getUsername: getUsername,
  getUsersInOrg: getUsersInOrg
}



function createAccount(req, res, next){
  const db = app.get('db');
  // console.log(req.session.currentUser, "current user in createAccount (before)");
  console.log(req.body.org_name, "org_name");

  ///////// should be used in db.users.insert, but need to get org_id before userAccount object is created
  var userAccount = {
    name_first: req.body.name_first,
    name_last: req.body.name_last,
    email: req.body.email,
    password: req.body.password
  }

  db.users.find({email:req.body.email}, function(err, result){
    // console.log(user);

    if(err){
      console.log(err);
      req.status(500).send(err)
    } else {
      if(result.length > 0){
        console.log("Account already exists for that email address");
        res.status(422).send("Account already exists for that email address");
      } else {
              ///////////////find org_name in database and set that id to org_id in userAccount
        db.organization.findOne({org_name: req.body.org_name}, function(err, result){

          console.log(result, "FOUND");

          if(result != undefined){
            console.log("result found");

            userAccount.org_id = result.id;
            // res.status(200).send(org);
            db.users.insert( userAccount, function(err, newAccount){

              if(err){
                console.log(err);
                res.status(500).send(err)
              }
              db.getOrganization([newAccount.id], function(err, fullAccount){
                if(err){
                  console.log(err);
                }
                console.log(fullAccount, "fullAccount in org_id found");
                req.session.currentUser = fullAccount[0];
                // res.status(200).send(req.session.currentUser);
                res.status(200).send(req.session.currentUser)
              })
            })

          } else {
            console.log("result undefined");
            db.organization.insert({org_name: req.body.org_name}, function(err, org){
              if(err){
                console.log(err);
                res.status(500).send(err);
              }
              userAccount.org_id = org.id;
              // res.status(200).send(org);
              db.users.insert( userAccount, function(err, newAccount){

                if(err){
                  console.log(err);
                  res.status(500).send(err)
                }
                db.getOrganization([newAccount.id], function(err, fullAccount){
                  if(err){
                    console.log(err);
                  }
                  console.log(fullAccount, "fullAccount in undefined");
                  req.session.currentUser = fullAccount[0];
                  // res.status(200).send(req.session.currentUser);
                  res.status(200).send(req.session.currentUser)
                })
                // console.log(newAccount, "newAccount");

                // console.log(req.session.currentUser, "req.session.currentUser (after)");
              })
            })
          }
        })
      }
    }
  })
}

// CHECK LOGIN CREDENTIALS TO DATABASE

function login(req, res, next){
  const db = app.get('db');
  // console.log(req.session.currentUser, "current user in login (before)");

  let loginData = {
    email: req.body.email,
    password: req.body.password
  }

  // console.log(req.body, "login node");
  db.users.find(loginData, function(err, result){
    console.log(result, "result");
    if(err){
      console.log(err);
      res.status(500).send(err);
    }
    if(result.length < 1){
      // res.status(200).send(result);
      res.status(401).send("Incorrect email/password combination")
    } else {
      db.getOrganization([result[0].id], function(err, user){
        if(err){
          console.log(err);
          res.status(500).send(err);
        }

        // console.log(user, "user");
        // console.log(fullAccount, "fullAccount");
        req.session.currentUser = user[0];
        // res.status(200).send(req.session.currentUser);
        res.status(200).send(req.session.currentUser)
      })
    }
  })
}


function logout(req, res, next){
  req.session.currentUser = undefined;
  console.log(req.session.currentUser, "userloggedout");
  res.status(200).send(req.session.currentUser);
}

function getUsername(req, res, next){
  const db = app.get('db');
  res.status(200).send(req.session.currentUser)
}

function getUsersInOrg(req, res, next){
  const db = app.get('db');
  // console.log(req.session.currentUser.org_id, "currentUser org_id");
  console.log(req.session.currentUser, "currentUser");
  if(req.session.currentUser){
    db.getUsersInOrg([req.session.currentUser.org_id], function(err, usersInOrg){
      if(err){
        console.log(err);
        res.status(500).send(err)
      }
      res.status(200).send(usersInOrg)
    })
  } else {
    console.log("no org_id found");
    // res.sendFile('/index.html')
  }

}
