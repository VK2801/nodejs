// // const http = require("http"); //Now we're importing from module
// import http from "http";
// import name from "./Features.js";
// console.log(name);
// const server = http.createServer((req,res)=>{ // req => Request send to server, res => Responce get from server
//     if(req.url==='/about'){ // Navigating the pages with link
//         res.end("<h1>About</h1>");
//     }
//     else if(req.url==='/'){
//         res.end("<h1>Home</h1>");
//     }
//     else if(req.url==='/contact'){
//         res.end("<h1>Contact Page</h1>");
//     }
//     else{
//         res.end("<h1>Page Not Found</h1>");
//     }
// })
// server.listen(5000,()=>{    // To create the Server
//     console.log("server is working");
// });

// Using Express


// Api created



// app.get("/success", (req, res) => {
//   res.render("success"); //rendering success page
// });
// Post request from form
// app.post("/success", (req, res) => {
//   // users.push({
//   //   useremail: req.body.email,
//   //   password: req.body.password,
//   // });
//   const { email, password } = req.body;
//   user
//     .create({ email: email, password: password })
//     .then((c) => console.log("Done"))
//     .catch((e) => console.log("Done1"));
//   console.log(users);
//   res.redirect("/success");
// });

// app.get("/users", (req, res) => {
//   //pushing user data into array and showing in particular page
//   res.json({
//     users,
//   });
// });

// app.get("/app", async(req, res) => {
//   // const {name,email}=req.body;
//   res.send("Nice1");
//   console.log("Done");
// });
  


//app.get("/", (req, res) => {
// Creating api first we have to give path and second request and response.
//res.sendStatus(404); // to send the status code
//res.json({
// to get response for json data
//     success: true,
//     product: [],
//   });
// });
//app.get("/products", (req, res) => {
// Creating api first we have to give path and second request and response.
//  res.status(404).send("Vinay"); // to send data with status code
//   const pathlocation = path.resolve();// to get the current path
//   res.sendFile(path.join(pathlocation,"./index.html"))//to read the file
// res.render("index", { name: "Kumar" }); //rendering the data
//}) 

// app.get("/", (req, res) => {
//   // res.sendFile("index"); //sending the data to static file
//   res.render("login"); //rendering the data
// });

 // if(token){                // checking if there is cookes present then we have to show as logout button otherwise login button
  //   res.render("logut") // logut == logout change in spelling
  // }
  // else{
  //   res.render("login")
  // }

import express from "express";
import fs from "fs"; //For file read
import path from "path"; // to read write to know the location of file
import mongoose from "mongoose"; // importing mongoose
import cookieParser  from "cookie-parser"; // importing cookie-parser
import jwt from "jsonwebtoken";

const app = express();


//Using MiddleWares
app.use(express.static(path.join(path.resolve(), "public"))); // set the static folder locations
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());//Defining and using cookie parser

mongoose
  .connect("mongodb://127.0.0.1:27017", {
    //connecting to database
    dbName: "TodoUsersDetails",
  })
  .then((c) => console.log("Database Connected"))
  .catch((e) => console.log("Error"));

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const loginuserSchema = new mongoose.Schema({
  email: String,
  password: String,
});


const loginuser = mongoose.model("userData", loginuserSchema); // connecting with collection
const user = mongoose.model("user", userSchema); // connecting with collection



const users = []; // Define a empty array

app.set("view engine", "ejs"); //defining the engine



const isAuthentication = async(req,res,next)=>{
  const {token}=req.cookies;
  if(token){                // checking if there is cookes present then we have to show as logout button otherwise login button
    //next() // is check and pass to the next handeler
    const decoded = jwt.verify(token,"VinayKumar")// decoded the data
    // console.log(decoded);
    req.user= await loginuser.findById(decoded._id) // assigning the id if token is there then by req storing all the data user
    next();
  }
  else{
    res.render("login")
  }
}
app.get("/",isAuthentication, (req, res) => { // Authentication
  const {token}=req.cookies;//destructure other wise we have to write as req.cookies.token
  res.render("logut", {email:req.user.email})
  console.log(req.user)
});

app.post("/register", async(req, res) => { // Creating api for login and adding data
  const {email,password}=req.body;
  let user = await loginuser.findOne({email}) // To check weather user is there in db or not
  if (user){
    return res.redirect("/login")
  }
  user = await loginuser.create({
    email,password
  });
  const token = jwt.sign({_id:user._id},"VinayKumar") // created token from the jwt and added secet as vinay kumar
  console.log(token);


  res.cookie("token",token,{ //fetching the ID
    httpOnly:true,expires:new Date(Date.now()+60*1000) // creating cookies to login
  })
  res.redirect("/");
});

app.get("/register", (req, res) => {
  res.render("register");
})
app.post("/login",async(req,res)=>{
  const{email,password}=req.body;
  let user = await loginuser.findOne({email});
  if(user) return res.redirect("/register")
})

app.get("/logout", (req, res) => { // Creating api for login
  res.cookie("token",null,{
    httpOnly:true,expires:new Date(Date.now()) // creating cookies for logout
  })
  res.redirect("/");
});


app.listen(5000, () => {
  console.log("server is working");
});
