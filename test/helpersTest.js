const { assert } = require('chai');

const { checkEmail, getUsers, generateRandomString, urlsForUser } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

const testUrlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "user2RandomID" },
  "9sm5xk": { longURL: "http://www.google.com", userID: "userRandomID" }
};

describe('checkEmail', function () {
  it('should return a user with valid email', function () {
    const user = checkEmail("user@example.com", testUsers)
    const expectedOutput = "userRandomID";
    assert.equal(user, expectedOutput);

  });

  it('should return undefined', function () {
    const user = checkEmail("user3@example.com", testUsers)
    const expectedOutput = undefined;
    assert.equal(user, expectedOutput);
  });

});

describe('getUsers', function () {
  it('should return users that match the user_id key', function () {
    const users = getUsers("userRandomID", testUsers);
    const expectedOutput = {
      id: "userRandomID",
      email: "user@example.com",
      password: "purple-monkey-dinosaur"
    }
    assert.deepEqual(users, expectedOutput);
  });

  it('should return undefined', function () {
    const users = getUsers("user3RandomID", testUsers)
    const expectedOutput = undefined;
    assert.equal(users, expectedOutput);
  });

});

describe('urlsForUser', function () {
  it('should return urls that are in the urlDatabase', function () {
    const filteredUrls = urlsForUser("userRandomID", testUrlDatabase)
    const expectedOutput = "http://www.google.com";
    assert.equal(filteredUrls["9sm5xk"].longURL, expectedOutput);
  });

  it('should return undefined', function () {
    const filteredUrls = urlsForUser("user3RandomID", testUrlDatabase)
    const expectedOutput = 0;
    assert.equal(Object.keys(filteredUrls).length, expectedOutput);
  });

});

