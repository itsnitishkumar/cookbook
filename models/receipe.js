var mongoose              = require("mongoose");

var ReceipeSchema = new mongoose.Schema({
    image: String,
    title: String,
    ingredients: String,
    receipe: String,
    cuisine: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    } 
});

module.exports = mongoose.model("Receipe", ReceipeSchema);