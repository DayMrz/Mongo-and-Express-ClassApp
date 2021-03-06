const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');

const Product = require('./models/product');
const methodOverride = require('method-override');
const { truncate } = require('fs');

mongoose.connect('mongodb://localhost:27017/farmStand', { userNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Mongo CONNECTION OPEN!')
    })
    .catch(err => {
        console.log('Mongo OHH no error!')
        console.log(err)
    })

app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method')) //used for override the method

//category 
const categories = ['fruit', 'vegetable', 'dairy'];
//

app.get('/', (req, res) => {
    // res.send("Holi :)")
    res.render('products/home')
})

    //  app.get('/products', async (req, res) => { 
    // const products = await Product.find({})
    // console.log(products) 1step
    // res.send('ALL PRODUCTS WILL BE HERE!') 1step
    // res.render('products/index', { products })
// })  

app.get('/products', async (req, res) => { 
     // finding by category!!
     const {category} = req.query;
     if(category){ 
        const products = await Product.find({ category })
            res.render('products/index', { products, category })
     } else {
        const products = await Product.find({})
             res.render('products/index', { products, category: 'All' })
     }
    })
    //


app.get('/products/new', (req, res) => {
    res.render('products/new', {categories})
})
app.post('/products', async (req, res) => {
    // console.log(req.body)
    const newProduct = new Product(req.body)
    await newProduct.save();
    console.log(newProduct)
    // res.send('Making Your product')
    res.redirect(`/products/${newProduct._id}`)

})

app.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id)
    // console.log(product);
    // res.send('details page')
    res.render('products/show', { product })
})
// edit
app.get('/products/:id/edit', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render('products/edit', {product, categories})
})

app.put('/products/:id', async(req, res) => {
//     console.log(req.body);
//     res.send('PUT :)');
const { id } = req.params;
const product = await Product.findByIdAndUpdate(id, req.body, {runValidators: true, new: true, useFindAndModify: false});
res.redirect(`/products/${product._id}`);
})
// Delete
app.delete('/products/:id', async (req, res) => {
    // res.send("Yay, this is working!")
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    res.redirect('/products');
}) 

app.listen(3000, () => {
    console.log('APP IS LISTENING ON PORT 3000')
})

