var express                 = require ("express"),
    app                     = express(),
    bodyParser              = require("body-parser"),
    mongoose                = require("mongoose"),
    passport                = require("passport"),
    LocalStrategy           = require("passport-local"),
    passportLocalMongoose   = require("passport-local-mongoose"),
    methodOverride          = require("method-override"),
    User                    = require("./models/user"),
    Receipe                 = require("./models/receipe");


var indexRoutes  = require("./routes/index")


//DB connection

mongoose.connect('mongodb+srv://cookbook:cookbook@cluster0.bo11c.mongodb.net/<dbname>?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));


// mongoose.connect(process.env.DATABASEURL || "mongodb://localhost:27017/cookbook" , {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useFindAndModify: false,
//     useCreateIndex: true
// })
// .then(() => console.log("Conected to DB.."))
// .catch(error => console.log(error.message));

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"))
app.use(methodOverride("_method"));


//passport authentication
app.use(require("express-session")({
    secret: "this is a type of key",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy (User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	next();
});

app.use("/",indexRoutes);


//PORT
const port = process.env.PORT || 3001;

//Starting a server
app.listen(port, () => {
  console.log(`app is running at ${port}`);
});