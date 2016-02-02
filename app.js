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
              
    return res.send('hey');
    
});

app.get('/register', function(req, res){ 
              
    return res.send('hey');
    
});

app.get('/login', function(req, res){
    
    return res.send('hey');
    
});

app.get('/logout', function(req, res){
    
    res.writeHead('302', {'location': "/login"});
    res.end('hey');
    
});



app.listen(3000);

module.exports = app;

// new User(data).save(function(err, user){
//        if(err) console.log(err);
       
//        return res.send(user);  
        
//     });