const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

let titleLengthChecker = (title)=>{
    if(!title){
        return false
    }
    else{
        if(title.length <5 || title.length >50){
            return false;
        }
        else{
            return true;
        }
    }
}

let alphanumnericTitleChecker = (title)=>{
    if(!title){
        return false;
    }
    else{
        const regex = new RegExp(/[^a-zA-z0-9]+$/);

        return regex.test(title);
    }
}

const titleValidators = [
    {
        validator: titleLengthChecker , message: 'title must be atleast 5 characters and no more than 50'
    }   ,
    {
        validator : alphanumnericTitleChecker , message : "Title must be Alphanumeric"
    }
];

let bodyLengthChecker = (body)=>{
    if(!body){
        return false
    }
    else{
        if(body.length < 20 || body.length >100){
            return false
        }
        else{
            return true;
        }
    }
}

const bodyValidator = [
    {
        validator: bodyLengthChecker , message: 'body must be atleast 20 characters and no more than 100'
    } 
];

let commentLengthChecker = (comment)=>{
    if(!comment[0]){
        return false
    }
    else{
        if(comment[0].length < 1 || comment[0].length >50){
            return false;
        }
        else{
            return true;
        }
    }
}

const commentValidator =[
    {
        validator: commentLengthChecker , message: "Comment should be greater than 1 and less than 50"
    }
];


const blogSchema = new Schema({
    title: {type: String, required: true, validate: titleValidators},
    body: {type: String, required: true, validate: bodyValidator},
    createdBy: {type: String},
    createdAt:{type:Date, default: Date.now()},
    likes:{type: Number, default: 0},
    likedBy: {type:Array},
    dislikes: {type: String, default : 0},
    dislikedBy: {type: Array},
    comments : [ 
        {
            comment: { type: String, validate: commentValidator},
            commentator: {type: String}
        }
    ]
})

module.exports = mongoose.model('Blog' , blogSchema);