require('dotenv').config();
const express = require("express");
const app = express()
const mongoose = require('mongoose');

const path = require("path");

const templatePath = path.join(__dirname,'../templates');
const publicPath = path.join(__dirname, '../public');

const PORT = process.env.PORT || 3000;
mongoose.set('strictQuery',false);


const { collection } = require("./mongodb");

const connectDB = async () => {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  }



app.use(express.static(publicPath));


app.use(express.json())
app.set("view engine","hbs")
app.set("views", templatePath)
app.use(express.urlencoded({extended: false}))


app.get('/signup', (req, res) => {
    res.render('signup')
})
app.get('/', (req, res) => {
    res.render('login')
})

app.get("/home", (req, res) => {
    // Render the home.hbs template or serve any necessary content
    res.render("home");
});


app.post("/signup", async (req, res) => {
    try {
        // Check if the username already exists in the database
        const existingUser = await collection.findOne({ name: req.body.name });
        if (existingUser) {
            // If the username already exists, return an error message
            return res.status(400).json({ success: false, message: "Username already exists. Please try with a different username." });
        }

        // If the username is not found in the database, proceed with signup
        const data = {
            name: req.body.name,
            password: req.body.password
        };
     
        const result = await collection.insertOne(data);
        console.log(result)
        //console.log("New user inserted:", result.ops[0]);

        // After successful signup, redirect the user to the login page
        res.status(200).json({ success: true, message: "Signup successful" });

        //res.redirect("/");
    } catch (error) {
        console.error("Error:", error);
        // If an error occurs during signup, return a generic error message
        res.status(500).json({ success: false, message: "An error occurred during signup. Please try again later." });
    }
});



app.post("/login", async (req, res) => {
    try {
        const check = await collection.findOne({ name: req.body.name });
        if (check){
            if (check.password === req.body.password){
                res.status(200).json({ success: true, message: "Login successful" });

                res.render("home");
            }
            else{
                res.status(400).json({ success: false, message: "*The password is incorrect" });

            }
        }
        else {
            res.status(400).json({ success: false, message: "Account does not exist! Sign up?" });

        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, message: "An error occurred. Please try again later." });
    }
});


//Connect to the database before listening
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("listening for requests");
    })
})

// app.listen(PORT, () => {
//     console.log("listening for requests");
// })