const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');

const Order = require('./models/order');
const OrderItem = require('./models/order-item');


const errorController = require('./controllers/error');


const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// add a middleware to add a user with request. 
app.use((req,res,next)=>{
    User.findByPk(1)
    .then(user =>{
         if (!user){
          return User.create({name:'Ajay Bilgaiyan', email:'test@node-eshop.com'})
         }
        return new Promise((resolve, reject) =>{
           resolve(user);
        }); 
        //next();
    })
    .then(user=>{
      req.user = user;
      console.log('user...', user);
      next();
    })
    .catch(err=> {
      console.log(err);
    });
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, {through: CartItem});
Product.belongsToMany(Cart, {through: CartItem});
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, {through: OrderItem});
Product.belongsToMany(Order, {through: OrderItem});


sequelize
//.sync({force: true})
  .sync()
  .then((result) =>{
    //console.log(result);
    app.listen(3000);
  })
  .catch(err =>{
      console.log(err);
  })

