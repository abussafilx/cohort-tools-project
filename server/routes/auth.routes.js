// routes/auth.routes.js

const express = require("express");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const {isAuthenticated} = require("../middleware/jwt.middleware")

const router = express.Router();
const saltRounds = 10;

// routes/auth.routes.js

// ... all imports stay unchanged

// POST /auth/signup  - Creates a new user in the database
router.post('/signup', (req, res, next) => {
    const { email, password, name } = req.body;
  
    // Check if the email or password or name is provided as an empty string 
    if (!email || !password || !name) {
      res.status(400).json({ message: "Provide email, password and name" });
      return;
    }
  
    // Use regex to validate the email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ message: 'Provide a valid email address.' });
      return;
    }
    
    // Use regex to validate the password format
    const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!passwordRegex.test(password)) {
      res.status(400).json({ message: 'Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.' });
      return;
    }
  
  
    // Check the users collection if a user with the same email already exists
    User.findOne({ email })
      .then((foundUser) => {
        // If the user with the same email already exists, send an error response
        if (foundUser) {
          res.status(400).json({ message: "User already exists." });
          return;
        }
  
        // If the email is unique, proceed to hash the password
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(password, salt);
  
        // Create a new user in the database
        // We return a pending promise, which allows us to chain another `then` 
        const newUser = { email, password: hashedPassword, name };
        return User.create(newUser)
      })
      .then((createdUser) => {
        // Deconstruct the newly created user object to omit the password
        // We should never expose passwords publicly
        const { email, name, _id } = createdUser;
      
        // Create a new object that doesn't expose the password
        const user = { email, name, _id };
  
        // Send a json response containing the user object
        res.status(201).json({ user: user });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" })
      });
  });
  
  
  
  // POST  /auth/login
  
  router.post("/login", (req, res, next) => {
    const {password, email} = req.body

    if (!password || !email) {
        res.status(400).json({message: "Provide e-mail and password"})
        return
    }
  
    User.findOne({email})
        .then((foundUser) => {
            if (!foundUser){
                res.status(401).json({message: "User not found"})
                return
            }

            const passwordCorrect = bcrypt.compareSync(password, foundUser.password)

            if (passwordCorrect) {
                const {_id, email} = foundUser
                const payload = {_id, email}
                const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {algorithm: 'HS256', expiresIn: "6h"})
                res.json({authToken})
            }

            else {res.status(401).json({message: "Unable to authenticate the user"})}
        })

        .catch(err => {
            console.log("Error trying to login...\n\n", err);
            res.status(500).json({ message: "Internal Server Error" })
  }
  )})
  
  
  // GET  /auth/verify
  
  router.get("/verify", isAuthenticated, (req, res, next) => {
    console.log(`req.payload`, req.payload)
    res.json(req.payload)
  })
  
  module.exports = router;
  