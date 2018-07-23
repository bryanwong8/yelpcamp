var express       = require("express"),
    app           = express(),
    bodyParser    = require("body-parser"),
    mongoose      = require("mongoose"),
    flash         = require("connect-flash"),
    methodOverride= require("method-override"),
    passport      = require("passport"),
    LocalStrategy = require("passport-local"),
    seedDB        = require("./seeds");

//Models    
var Comment       = require("./models/comment"),
    Campground    = require("./models/campground"),
    User          = require("./models/user");

//Routes
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    authRoutes       = require("./routes/index");

var url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp_v13";
mongoose.connect(url);

// mongoose.connect("mongodb://bmwong:Hearthstone1@ds145871.mlab.com:45871/yelpcampv13bmw");
//uses body parser
app.use(bodyParser.urlencoded({extended: true}));
//Connects stylesheets
app.use(express.static(__dirname + "/public"));
//uses method-override
app.use(methodOverride("_method"));
app.use(flash());
app.set("view engine", "ejs");
//seedDB();

//Passport
app.use(require("express-session")({
    secret: "memezzzzzzzzzzzzz",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//shorten route links
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use(authRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has started!");
});