import mongoose from 'mongoose' ; 


const userSchema = mongoose.Schema({
    fullName:{type: String, required: true}, 
    email : {type: String, required: true},   
    password : {type: String, required: true}, 
    isAdmin  : { 
        type: Boolean, 
        default: false , 
    }
}, {timestamps:true}) ; 

const Users = mongoose.model('Users', userSchema) ; 

export default  Users; 