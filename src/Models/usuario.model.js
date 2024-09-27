const mongoose = require ("mongoose");

const schema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        index: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    password: String,
    rol: {type: String ,
        enum: ["adimin", "user"],
        default: "user"
    }
});

const UserModels = mongoose.model("users", schema);

module.exports = UserModels