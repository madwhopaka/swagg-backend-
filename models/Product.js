import mongoose from 'mongoose' ; 


const productSchema = mongoose.Schema({
    title:{type: String, required: true}, 
    brand: {type: String, required: true},   
    desc: {type:String, required:true}  , 
    image: {type:String, required: true}, 
    categories: {type:Array, required:true} , 
    size: {type:Array, required: true},
    color: {type:Array, required: true} , 
    price : {type: Number ,required: true} ,
    cutprice : {type:Number, required: true}, 
    inStock : {type:Boolean, default:true }
},  {timestamps:true}) ; 

const Products = mongoose.model('Products', productSchema) ; 

export default  Products; 