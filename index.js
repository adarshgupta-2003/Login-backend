var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');

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

var server = app.listen(4000,function(){
    console.log("go to the port number 4000");
});