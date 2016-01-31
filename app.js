/*
 *  Express server 
 */

var bodyParser = require('body-parser');
var express = require('express');
var mongoose = require('mongoose');

var app = express();

var db = require('./db');
var User = require('./models/user');

var data = {username:'username',
            email:'email@email.com', 
            password:'password'};
            
app.use(bodyParser.json());

app.get('/', function(req, res){ 
              
    new User(data).save(function(err, user){
       if(err) console.log(err);
       
       return res.send(user);  
        
    });
    
});


app.listen(3000);