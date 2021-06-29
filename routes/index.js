
/// adding to cart
// router.post('/addcart/:price/:imageid', function (req, res) {
//   const usernum = req.session.number
//   const downloadId = req.params.imageid
//   const price = req.params.price
//   const today = new Date();
//   if (req.session.loggedin ) {
//     con.query('SELECT * FROM photos WHERE photo_id=?', [downloadId], function (err, result) {
//       if (err)
//         console.log('error happend')
//       else
//         if (result.length) {
//           for (i = 0; i < result.length; i++) {
//           cart.push(result[i])
//           }
//           // req.session.cart = cart
//           res.redirect("/user")
//         }
//     });
//   }
//   else {
//     res.redirect("/loginuser")
//   }
// })
  

// cart route 
// router.get("/cartpage", function (req, res) {
//   var cart = req.session.cart
//   const userId = req.session.userid
//   const username = req.session.username
//   const email = req.session.email
//   const image = req.session.pic

//   if (req.session.loggedin ) {
//     var totalprice = 0
//     for (let i = 0; i < cart.length; i++) {
//         totalprice += cart[i]['photo_price']
//        newtotal = totalprice
//       }
//       // console.log(cart)
//     res.render("cart",
//      { 
//        amount: totalprice,
//        cartimage: cart, 
//        name: username,
//         mymail: email 
//     })
//   }

//   else {
//     res.redirect("/loginuser")
//   }
// })



// deleting cart

// router.post("/cart/:cartid", function (req, res) {
//   const cartimageId = req.params.cartid
//   // console.log(cartimageId)
  
//   if (req.session.loggedin) {
  
//     for (let i = 0; i < cart.length; i++) 
//     {
//         if (cart[i]['photo_id'] === cartimageId) 
//         {
//           cart.splice(i,1)
//           // console.log(cart)
//          break
//         }
//     }
   
//   res.redirect("/cartpage")  
// }
// })