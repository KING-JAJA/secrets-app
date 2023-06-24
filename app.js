const express = require("express");
const bodyparser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({extended: true}));

// mongoose.connect('mongodb://127.0.0.1:27017/userDB').catch(error => handleError(error));


// Connect to MongoDB using Mongoose
mongoose.connect('mongodb://127.0.0.1:27017/userDB', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});



const userSchema = {
  email: String,
  password: String
}

const User = new mongoose.model("User", userSchema)

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  })
  newUser.save().then(() => {
      res.render("secrets");
  }).catch (err => handleError(err));
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}).then(
    (foundUser) => {
      if (!foundUser) {
        res.render("register");
      }
      if (foundUser) {
        if (foundUser.password === password) {
          res.render("secrets")
        }
      }
    }
  ).catch(err => {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  });
});
  

// app.post('/login', async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     // Find the user by the provided username
//     const user = await User.findOne({ username });

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Compare the provided password with the stored hashed password
//     const isMatch = await bcrypt.compare(password, user.password);

//     if (isMatch) {
//       return res.status(200).json({ message: 'Login successful' });
//     } else {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: 'Server error' });
//   }
// });

  // }).catch (err => handleError(err));

// (err) => {
//   if (err) {
//     console.log(err);
//   } else {
//     res.render("secrets");
//   }
// });

// .then(result => {
//         console.log(result)
//     })

app.listen(3000, () => {
  console.log("Server is started at port 3000");
});