const mongoose = require ("mongoose");
const mongoosePaginate = require ("mongoose-paginate-v2"); 

const productSchema = new mongoose.Schema({
    title: String, 
    description: String, 
    price: Number, 
    stock: Number,
    code: String   
})

productSchema.plugin(mongoosePaginate);

const productModel = mongoose.model("products", productSchema);

module.exports = productModel; 