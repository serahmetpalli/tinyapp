const express = require("express");
const { checkEmail, getUsers, generateRandomString, urlsForUser } = require('./helpers'); //reference the check email func
// const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');


const app = express();
const bcrypt = require('bcrypt');
const PORT = 8080; //default port 8080

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

// app.use(cookieParser());
app.use(cookieSession({
  name: "session",
  keys: ["key1"]
}));

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync(("dishwasher-funk"), 10)
  }
}

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "user2RandomID" },
  "9sm5xk": { longURL: "http://www.google.com", userID: "userRandomID" }
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  const user = getUsers(req.session["user_id"], users);
  console.log('user:', user);

  if (user) {
    const urls = urlsForUser(user.id, urlDatabase);
    const templateVars = { urls: urls, user: user };
    res.render("urls_index", templateVars);
  } else {
    res.status(401).send("Unauthorized. Please login first before trying to access this page.");
  }
});

app.get("/urls/new", (req, res) => {
  const user = getUsers(req.session["user_id"], users);
  const templateVars = { user: user };
  if (user) {
    res.render("urls_new", templateVars);
  } else {
    res.status(401).send("Unauthorized. Please login first before trying to access this page.");
  }
});

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  console.log("shorturl:", shortURL);
  const user = getUsers(req.session["user_id"], users);
  const templateVars = { user: user, shortURL: shortURL, longURL: urlDatabase[shortURL].longURL };
  console.log("templateVars:", templateVars);

  if (user) {
    res.render("urls_show", templateVars);
  } else {
    res.status(401).send("Unauthorized. Please login first before trying to access this page.");
  }

});

app.post("/urls/new", (req, res) => {
  const key = generateRandomString();
  urlDatabase[key] = { longURL: req.body.longURL, userID: req.session["user_id"] };
  console.log('urlDatabase:', urlDatabase);
  res.redirect(`/urls/${key}`);

});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL]["longURL"];

  if (!longURL) {
    res.status(404).send();
  } else {
    res.redirect(longURL);
  }
});

app.post("/urls/:shortURL/delete", (req, res) => {
  console.log(req.body);

  const userid = req.session["user_id"];
  const shortURL = req.params.shortURL;
  const obj = urlDatabase[shortURL];

  if (obj.userID !== userid) {
    res.status(401).send("Unauthorized. Please login first before trying to access this page.");
    return;
  }

  delete urlDatabase[shortURL];
  res.redirect("/urls");

});

app.post("/urls/:shortURL", (req, res) => {
  console.log(req.body);
  const user = req.session["user_id"];
  const shortURL = req.params.shortURL;
  const templateVars = { user: user, shortURL: shortURL, longURL: urlDatabase[shortURL].longURL };

  if (user) {
    const longUrl = urlDatabase[shortURL].longURL;
    res.redirect("/urls");
  } else {
    res.status(401).send("Unauthorized. Please login first before trying to access this page.");
  }
});

app.post("/logout", (req, res) => {
  req.session["user_id"] = null;
  res.redirect("/login");
});

app.get("/register", (req, res) => {
  res.render("register", { user: null });
});

//adding user object to global users object
app.post("/register", (req, res) => {
  const user_id = generateRandomString();
  const { email, password } = req.body;

  const hashedPassword = bcrypt.hashSync(password, 10);

  if (!email || !password) {
    res.status(400).send("Registration failed. Email and/or Password fields cannot be empty.");
  } else if (checkEmail(email, users)) {
    res.status(400).send("Registration failed. Email already exists. Please login.");
  } else {
    users[user_id] = { id: user_id, email, password: hashedPassword };
    req.session['user_id'] = user_id;
    res.redirect("/urls");
  }

});

app.post("/login", (req, res) => {
  console.log(req.body.email);
  console.log(req.body.password);

  const email = req.body.email;
  const password = req.body.password;
  const userExists = checkEmail(email, users);

  if (!userExists) {
    res.status(403).send("Forbidden.")
  } else if (!bcrypt.compareSync(password, users[userExists].password)) {
    console.log("Here's my pwd:", users[userExists].password)
    res.status(403).send("Incorrect Password.");
  } else {
    req.session['user_id'] = userExists;
    res.redirect("/urls");
  }
});

app.get("/login", (req, res) => {
  res.render("loginForm", { user: null });
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});