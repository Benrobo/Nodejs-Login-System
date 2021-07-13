const { conn } = require("../model/authModel");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);

const registerUser = (req, res, data) => {
  // check if user with email in db already exist
  let { name, email, password } = data;
  let sql = `SELECT * FROM users WHERE email='${email}'`;
  conn.query(sql, (err, data) => {
    console.log(data);
    if (err) {
      console.log(err);
      return res.send(
        JSON.stringify({
          status: "fail",
          msg: "something went wrong ",
        })
      );
    } else if (data.length > 0) {
      return res.send(
        JSON.stringify({
          status: "fail",
          msg: "User with that email already exist ",
        })
      );
    } else {
      // insert data in db
      insertData(name, email, password);
    }
  });

  function insertData(name, email, password) {
    const status = 0;
    let newPwd = bcrypt.hashSync(password, salt);
    let newUserId = uuidv4();
    let sql = `INSERT INTO users(userid, name, email, hashed, status) VALUES('${newUserId}','${name}', '${email}','${newPwd}','${status}')`;

    // query DB
    conn.query(sql, (err, data) => {
      if (err) {
        return res.send(
          JSON.stringify({
            status: "fail",
            msg: "something went wrong ",
          })
        );
      } else {
        return res.send(
          JSON.stringify({
            status: "success",
            msg: "Account created successfully",
          })
        );
      }
    });
  }
};

// login user
const logUser = (req, res, data) => {
  // check if user with email in db already exist
  let { email, password } = data;
  let sql = `SELECT * FROM users WHERE email='${email}'`;
  conn.query(sql, (err, data) => {
    if (err) {
      return res.send(
        JSON.stringify({
          status: "fail",
          msg: "something went wrong " + err,
        })
      ); 
    } else if (data.length == 0) {
      return res.send(
        JSON.stringify({
          status: "fail",
          msg: "User with that email dont exist ",
        })
      );
    } else {
      // check if users password match hash in db
      let hash = data[0].hashed;

      if (!bcrypt.compareSync(password, hash)) {
        return res.send(
          JSON.stringify({
            status: "fail",
            msg: "Password given is incorrect",
          })
        );
      }else{ 
        const status = 1;
        let sql = `UPDATE users SET status='${status}' WHERE email='${email}'`;
        conn.query(sql, (err)=>{
          if(err){
            return console.log(err)
          }else{
            // set cookies
            res.cookie("email", email, {expire: 360000 + Date.now()})
            return res.send({
              status: "success",
              msg: "logged in succesfull",
              name: req.cookies.email
            })
          }
        })
      }
    }
  });
};

// Logout users
const logOut = (req, res, body)=>{
  const userMail = req.cookies.email;
  
  if(body && body == true){
    let sql = `UPDATE users SET status = '0' WHERE email = '${userMail}'`;

    conn.query(sql, (err)=>{
      if(err){
        return console.log(err)
      }
      else{
        res.clearCookie("email")
        return res.send({status: "success", msg: "Logged out successfull"})
      }
    })
  }
}

module.exports = {
  registerUser,
  logUser,
  logOut,
};
