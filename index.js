var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');
var session = require('express-session');

app.use(function(req, res, next) {
    res.set('Cache-Control','no-cache, no-store, must-revalidate, private');
    next();
});

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json());

var conn = mysql.createConnection({
    host:'localhost',
    user: 'root',
    password: '',
    database: 'node'
});

conn.connect(function(err){
    if(err) throw err;
    console.log("connected to db");
});

app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    res.render('signup');
});

app.post('/signup', function(req, res){
    var email = req.body.email;
    var password = req.body.password;
    var country = req.body.country;
    var hobby = req.body.hobby;

    var sql = `insert into users(user_email, user_password, user_country,user_hobby) values('${email}', '${password}', '${country}','${hobby}')`;
    conn.query(sql,function(err,result){
        if(err) throw err;
        res.send("<h1>User successfully registered</h1>");
    });
});

// console.log(req.body.email);

app.get('/login',function(req,res){
    res.render('login');
});

app.post('/login',function(req, res){
    var email = req.body.email;
    var password = req.body.password;

    if(email && password){
        var sql = `select * from users where user_email='${email}' AND user_password = '${password}'`;
        conn.query(sql,function(err,result){
            if(result.length > 0){
                req.session.loggedin=true;
                req.session.email=email;
                res.redirect('/welcome');
            }
            else{
                // alert('Incorrect password');
                res.send("<h1>Incorrect password</h1>");
            }
        });
    }
    else{
        // alert("Please enter email or password");
        res.send("<h1>Please enter email or password</h1>");
    }
});

app.get('/welcome',function(req, res){
    if(req.session.loggedin){
        res.render('welcome',{user:`${req.session.email}`});
    }
    else{
        res.send("<h1>Please login to access this page</h1>");
    }
});

app.get('/logout',function(req, res){
    req.session.destroy((err)=>{
        res.redirect('/login');
    })
});

var server = app.listen(4000,function(){
    console.log("go to the port number 4000");
});