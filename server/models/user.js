
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const userSchema = new Schema({
    username:{
        type: String,
        unique: true,
        required: true
    },
    email:{
        type: String,
        unique: true,
        validate: {
            validator: (v) => { return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);},
            message: props => `${props.value} is not a valid email!`
        },
        required: true
    },
    password:{
        type: String,
        required:true,
        minlength: 6 
    }
});

module.exports = mongoose.model('user', userSchema);


