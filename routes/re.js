  //  console.log(usernum)
    //  console.log(downloadId)
    //  console.log(price)
    //  let cartid =  generateid({
    //   "id":usernum,
    //    randomLength:2
    // })
    // const cart = {
    //   "cart_id":cartid,
    //   "user_id":usernum,
    //   "photo_id":downloadId,
    //   "photo_price":price,
    //   "date_added": today
    // }
    // con.query('INSERT INTO cart SET ?',cart, function (error, results, fields) {
    //   if (error) {
    //     throw error
    //   }else{
    //       res.redirect("/cartpage")
    //   }
    // });



    //   const allcart = []
// con.query('SELECT * FROM cart WHERE user_id=?',[userId],function(err, rows, fields)
// {
//   if(err) throw error
//   else
//      rows.forEach(element => 
//  {
//      console.log(element.photo_id)
//      con.query('SELECT * FROM photos WHERE photo_id=?',[element.photo_id],function(error, rows2, fields2)
//       {
//          if(error)throw error
//          else
               
//                for(var i=0;i<rows2.length;i++)
//                { 
                
//                allcart.push(rows2[i])
//                }  
//       })
//       res.render("cart",{cart:allcart})
//   });  
// })
