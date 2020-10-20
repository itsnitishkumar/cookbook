const receipe = require("../models/receipe");

var express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    User = require("../models/user");
    Receipe = require("../models/receipe");

//login middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

var checkOwnership = function(req, res, next){
    if (req.isAuthenticated()){
        Receipe.findById(req.params.id, (err, foundReceipe)=>{
            if(err){
                res.redirect("back");
            }
            else{
                // does user own the receipe?
                if(foundReceipe.author.id.equals(req.user.id)){
                    next();
                }
                else{
                    res.redirect("back");
                }
            }
        })    
    }
    else{
        res.redirect("back");
    }
}

//Root route
router.get("/", (req,res)=>{
    res.render("landing");
});

//home page
router.get("/home", (req,res)=>{
    res.render("receipe/homepage");
})

//register get route
router.get("/register", (req, res)=>{
    res.render("register");
})

//register post route
router.post("/register", (req, res)=>{
    User.register(new User({username: req.body.username}), req.body.password, (err, user)=>{
        if(err){
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/home");
        });
    });
});

//login get route
router.get("/login", (req, res)=>{
    res.render("login");
})

//login post route
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/home",
        failureRedirect: "/login"
    }), function(req, res){
});

//logout route
router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/home");
 });


 //add receipe
router.get("/addreceipe", isLoggedIn, (req, res)=>{
    res.render("receipe/add");
});


router.post("/addreceipe", isLoggedIn,(req, res)=>{
    var image =  req.body.image;
    var title = req.body.title;
    var ingredients =  req.body.ingredients;
    var receipe     =  req.body.receipe;
    var cuisine     =  req.body.cuisine;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var new_receipe = {image:image, title:title ,ingredients:ingredients, receipe:receipe, cuisine:cuisine, author:author}
    //create a new receipe and save to the DB
    Receipe.create(new_receipe, function(err, newlyCreated){
        if(err){
            console.log(err);
        }
        else{
            //redirect back to show page
            console.log(newlyCreated);
            res.render("receipe/homepage");
        }
    })
});

//cuisine route
router.get("/indian", function(req,res){
    Receipe.find({cuisine: "Indian"}, function(err,  allcuisine){
        if(err){
            console.log(err);
        }
        else{
           res.render("receipe/show", {receipe: allcuisine, secret: "Indian"});
        }
    })
});
router.get("/american", function(req,res){
    Receipe.find({cuisine: "American"}, function(err,  allcuisine){
        if(err){
            console.log(err);
        }
        else{
           res.render("receipe/show", {receipe: allcuisine, secret: "American"});
        }
    })
});
router.get("/chinese", function(req,res){
    Receipe.find({cuisine: "Chinese"}, function(err,  allcuisine){
        if(err){
            console.log(err);
        }
        else{
           res.render("receipe/show", {receipe: allcuisine, secret: "Chinese"});
        }
    })
});
router.get("/russian", function(req,res){
    Receipe.find({cuisine: "Russian"}, function(err,  allcuisine){
        if(err){
            console.log(err);
        }
        else{
           res.render("receipe/show", {receipe: allcuisine, secret: "Russian"});
        }
    })
});
router.get("/mexican", function(req,res){
    Receipe.find({cuisine: "Mexican"}, function(err,  allcuisine){
        if(err){
            console.log(err);
        }
        else{
           res.render("receipe/show", {receipe: allcuisine, secret: "Mexican"});
        }
    })
});
router.get("/continental", function(req,res){
    Receipe.find({cuisine: "Continental"}, function(err,  allcuisine){
        if(err){
            console.log(err);
        }
        else{
            console.log(allcuisine)
           res.render("receipe/show", {receipe: allcuisine, secret: "Continental"});
        }
    })
});

router.get("/show/:id", (req,res)=>{
    Receipe.findById(req.params.id)
      .then(todo => res.render("receipe/info",{receipe: todo}))
      .catch(err => console.log(err));
});


router.get("/receipe/:id/edit", checkOwnership,(req, res)=>{
    Receipe.findById(req.params.id, (err, foundCampground)=>{
        if(err){
            console.log(err);
        }
        else{
        res.render("receipe/edit", {edited: foundCampground});
        }
    });    
});

router.put("/show/:id",checkOwnership, (req,res)=>{
    // find and update the correct campground
    Receipe.findByIdAndUpdate(req.params.id, req.body.receipe, (err, updated)=>{
        if(err){
            res.redirect("/home");
        }
        else{
            console.log(req.body.receipe)
            res.redirect("/show/"+req.params.id);
        }
    });
    // redirect somewhere (show page)
});

//Delete receipe
router.delete("/receipe/:id",checkOwnership, (req, res)=>{
    Receipe.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/home");
        }
        else{
            res.redirect("/home");
        }
    })
});

module.exports = router;