const express = require("express");
const app = express();
const PORT = 8080; //default port 8080

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

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req,res)=> {
  res.json(urlDatabase);
});

app.get("/hello", (req,res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req,res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const templateVars = { shortURL, longURL: urlDatabase[shortURL] };
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  const key = generateRandomString();
  urlDatabase[key]=req.body.longURL;
  res.redirect(`/urls/${key}`);         // Respond with 'Ok' (we will replace this)
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



