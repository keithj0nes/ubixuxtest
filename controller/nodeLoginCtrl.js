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
  ///////// should be used in db.users.insert, but need to get org_id before userAccount object is created
  var userAccount = {
    name_first: req.body.name_first,
    name_last: req.body.name_last,
    email: req.body.email,
    password: req.body.password
  }
  db.users.find({email:req.body.email}, function(err, result){
    if(err){
      console.log(err);
      req.status(500).send(err)
    } else {
      if(result.length > 0){
        var exists = {accountExists: true}
        return res.send(exists);
      } else {
              ///////////////find org_name in database and set that id to org_id in userAccount
        return db.organization.findOne({org_name: req.body.org_name}, function(err, result){
          if(result !== undefined){
             insertUsers(userAccount, result, req, res);
          } else {
            return db.organization.insert({org_name: req.body.org_name}, function(err, result){
              if(err){
                console.log(err);
                res.status(500).send(err);
              }
               insertUsers(userAccount, result, req, res);
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

  let loginData = {
    email: req.body.email,
    password: req.body.password
  }

  db.users.find(loginData, function(err, result){
    console.log(result, "result");
    if(err){
      console.log(err);
      res.status(500).send(err);
    }
    if(result.length < 1){
      var incorrect = {accountCredentials: false}
      return res.send(incorrect)
    } else {
      db.getOrganization([result[0].id], function(err, user){
        if(err){
          console.log(err);
          res.status(500).send(err);
        }
        req.session.currentUser = user[0];
        res.status(200).send(req.session.currentUser)
      })
    }
  })
}


function logout(req, res, next){
  req.session.currentUser = null;
  res.status(200).send(req.session.currentUser);
}

function getUsername(req, res, next){
  res.status(200).send(req.session.currentUser)
}

function getUsersInOrg(req, res, next){
  const db = app.get('db');
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
  }
}

function insertUsers(userAccount, result, req, res){            //refactor same call into single function
  const db = app.get('db');
  userAccount.org_id = result.id;
  db.users.insert( userAccount, function(err, newAccount){
    if(err){
      console.log(err);
      res.status(500).send(err)
    }
    db.getOrganization([newAccount.id], function(err, fullAccount){
      if(err){
        console.log(err);
      }
      req.session.currentUser = fullAccount[0];
      res.status(200).send(req.session.currentUser)
    })
  })
}
