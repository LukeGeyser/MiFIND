const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const express = require('express');

const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
const fs = require('fs');

const dataService = require('../services/dataService');
// const authService = require('../services/authService');

async function checkForToken(userID) {
    // Checks to see if the user already has a session
    const userTokenSession = await dataService.getToken(userID);
  
    // If the user does not have a session, reject the login request and log user out
    // TODO: LOG USER OUT
    if (Object.keys(userTokenSession).length <= 0) {
      // Response with Invalide Creds
      // res.status(200).send({ error: "User not found" }); // TODO: Make this error Response more fleshed out for logging the user out
      return false;
    }
  
    const successfulDelete = await dataService.removeToken(userTokenSession[0].TokenID);
  
    return successfulDelete;
}

router.post('/login', async (req, res) => {
  const { username } = req.body;
//   const { password } = req.body;

  const userObject = await dataService.getUser(username);

  // TODO: CHECK USERNAME AND PASSWORD

  if (Object.keys(userObject).length <= 0) {
    // Response with Invalide Creds
    res.status(403).send({ error: 'No such user found' }); // TODO: Make this error Response more fleshed out
    return;
  }

  const chkToken = checkForToken(userObject[0].UserId);

  if (!chkToken) {
    res.status(500).send({ error: 'Something unexpected happened :(' });
  }

  const certPriv = fs.readFileSync('rsa-private-key.pem');

  try {
    const token = jwt.sign({ id: username }, certPriv, {
      expiresIn: '1h', // expires in 5 Minutes
      algorithm: 'RS256',
    });

    const tokenCreationDate = new Date();

    const tokenExpireDate = new Date(tokenCreationDate.getTime() + 60 * 60000);

    const expiresIn = Math.abs(tokenExpireDate - tokenCreationDate) / 1000;

    // TODO: STORE SESSION TOKEN

    res.status(200).send({
      auth_status: 'Authorized',
      token_token: token,
      token_type: 'Bearer',
      expires_in: expiresIn,
      userName: username,
      '.issued': tokenCreationDate.toUTCString(),
      '.expires': tokenExpireDate.toUTCString(),
    });

    dataService.storeToken(userObject[0].UserId, '', '', '', tokenCreationDate.toUTCString(), tokenExpireDate.toUTCString(), token);
  } catch (error) {
    res.status(500).send({ error });
  }
});



// router.get("/hello", (req, res) => {

//     var header = req.headers.authorization || '';       // get the auth header
//     var token = header.split(/\s+/).pop() || '';

//     console.log(token);

//     if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

//     jwt.verify(token, process.env.SECRET, function(err, decoded) {
//       if (err) return res.status(500).send({ auth: false, message: err.message });

//       res.status(200).send(decoded);
//     });

//     console.log("hello");
// });

module.exports = router;
