const express = require("express");
const mercadopago = require('mercadopago');
const bodyParser = require('body-parser');
const router = express.Router();
router.use(bodyParser.urlencoded({ extended: false }))
// parse application/x-www-form-urlencoded

// agregar credenciales
mercadopago.configure({
    access_token:'TEST-2128347873363886-021515-78b911d25917e2c138880ba81875eeaf-85401631'
})





async function getMp (req, res){
           
          let preference = {
              items:[
                  {
                      title: req.body.title,       //"reserve",
                      unit_price:parseInt(req.body.price),    //precio   100, 
                      quantity:1,           //cantidad
                  }
              ]
          };
       
          mercadopago.preferences.create(preference)
          .then(function(response){
          console.log(response)
          res.redirect(response.body.init_point)
          
          }).catch(function(error){
              console.log(error)
          })
}

module.exports = getMp