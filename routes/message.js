const express = require('express');
const router = express.Router();
var http = require('http').Server(express());
const io = require('socket.io')(http);
const  Message = require('../models/message')

router.get('/messages', (req, res) => {
    Message.find({},(err, messages)=> {
      res.send(messages);
    })
  })
  
  
router.get('/messages/:user', (req, res) => {
    var user = req.params.user
    Message.find({name: user},(err, messages)=> {
      res.send(messages);
    })
  })
  
router.post('/messages', async (req, res) => {
    try{
      
      let newmessage = {
          name:req.body.name,
          message: req.body.message
      }  

      var message = new Message(newmessage);
  
      var savedMessage = await message.save()
        console.log('saved');
  
      var censored = await Message.findOne({message:'badword'});
        if(censored)
          await Message.remove({_id: censored.id})
        else
          io.emit('message', req.body);
        res.sendStatus(200);
    }
    catch (error){
      res.sendStatus(500);
      return console.log('error',error);
    }
    finally{
      console.log('Message Posted')
    }
  
  })
module.exports =router