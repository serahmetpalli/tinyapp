// function getUserByEmail(email,users) {
//   for (key in users) {
//     if (email === users[key].email) {
//       console.log(users[key]);
//       return users[key];
//     } else {
//       return {};
//     }
//   }
// }

function checkEmail(email, users) {
  for (key in users) {
    if (email === users[key].email) {
      return key;
    }
  }
}

function getUsers(user_id, users) {
  return users[user_id];
}

function generateRandomString() {
  return Math.random().toString(36).substr(2, 6);
}

function urlsForUser(id, urlDatabase) {
  const filteredUrl = {};

  for (let shortUrl in urlDatabase) {
    if (urlDatabase[shortUrl].userID === id) {
      filteredUrl[shortUrl] = urlDatabase[shortUrl];
    }
  }
  return filteredUrl;
}

module.exports = {checkEmail, getUsers, generateRandomString, urlsForUser};
