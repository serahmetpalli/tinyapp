const express = require("express");
const cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser());

const PORT = 8080; //default port 8080

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
"user2RandomID":{
  id: "user2RandomID",
  email: "user2@example.com",
  password:"dishwasher-funk"
}
}

function getUsers(user_id) {
  // console.log("user_id:",user_id);
  // console.log("users:", users); 
  return users[user_id];
}

// You have a user database(Obj) {user1:{id1, email1, PW1}, user2:{id2, email2, PW2}}
// You are given a email 
// You want to check which item in user database has that particular email
// For.....of(Arrays) ? For....in(Objects) ?  << what's the difference
// Need to get the email value from the key to do compare
// 


function checkEmail (users, email){
  for (key in users){
    if (email === users.key.email){
      res.status(400).send("Registration failed. Email already exists.");
    }
  }
}

function generateRandomString() {
 return Math.random().toString(36).substr(2, 6);
 }

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));


app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2" : "http://www.lighthouselabs.ca",
  "9sm5xk" : "http://www.google.com"
};

app.get("/",(req,res)=> {
  res.send("Hello!");
});

app.get("/urls.json", (req,res)=> {
  res.json(urlDatabase);
});

app.get("/hello", (req,res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req,res) => {
  console.log(req.cookies);
  const user = getUsers(req.cookies["user_id"]);
  const templateVars = { urls: urlDatabase, user:user};
  console.log('users:',users);
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const user = getUsers(req.cookies["user_id"]);
  const templateVars = {user:user};
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const user = getUsers(req.cookies["user_id"]);
  const templateVars = { user:user, shortURL, longURL: urlDatabase[shortURL] };
  res.render("urls_show", templateVars);
});

app.post("/urls/new", (req, res) => {
  console.log(req.body);  // 
  const key = generateRandomString();
  urlDatabase[key]=req.body.longURL;
  res.redirect(`/urls/${key}`);    
  // res.redirect("/urls");       
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  // console.log('longURL:',longURL);
  
  if (!longURL){
    res.status(404).send();
  } else {
    res.redirect(longURL);
  } 
});

app.post("/urls/:shortURL/delete", (req, res) => {
  console.log(req.body);   
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");

 
});

app.post("/urls/:id", (req,res) => {
  console.log(req.body);
  urlDatabase[req.params.id] = req.body.longURL;
  res.redirect("/urls");

});

app.post("/login", (req,res) => {
  console.log(req.body);
  res.cookie('username', req.body.username)
  res.redirect("/urls");
});

app.post("/logout", (req,res) => {
  console.log(req.body);
  res.clearCookie("username");
  res.redirect("/urls");
});

app.get("/register", (req, res) => {
  res.render("register",{user:null});
});

//adding user object to global users object
app.post("/register", (req, res) => {
  const user_id = generateRandomString();
  // console.log(req.body);
  if (!req.body.email || !req.body.password) {
    // console.log('user_id:',user_id);
    res.status(400).send("Registration failed. Email and/or Password fields cannot be empty.");
  } else {
    users[user_id]={id:user_id, email:req.body.email, password:req.body.password}; 
    res.cookie('user_id', user_id);
    res.redirect("/urls");  
  }
  let email = req.body.email;
  checkEmail(users, email);
  // if (req.body.email === users)function checkEmail (users, email){
  //     for (key in users){
  //       if (email === users.key.email){
  //         res.status(400).send("Registration failed. Email already exists.");
  //       }
  //     }
  //   }

});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});