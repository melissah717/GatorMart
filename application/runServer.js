const express = require('express')
const app = express()
const mysql = require('mysql');
let path = require('path');

app.engine('html', require('ejs').renderFile);

app.get('/VPTestHome.html', search, (req, res) => {
    var searchResult = req.searchResult;
    for (var i = 0; i < searchResult.length; i++){
        console.log(searchResult[i]['Name']);
    }
    res.render('html/VPTestHome.html', {
        
        results: searchResult.length,
        searchTerm: req.searchTerm,
        searchResult: searchResult,
        category: req.category
    });
})

app.use(express.static('public/html'));
app.use(express.static('public/html/aboutPages'));
app.use(express.static('public/images'));
app.use(express.static('public/css'));


app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.listen(3000, () => console.log('Server running on port 3000'));


const database = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'Example'
});

database.connect((err) => {
    if (err) throw err;
    console.log('Connected!')
});


database.query('SELECT * FROM Posting', (error, results, fields) =>{
    if (error) throw error;
    //console.log(results);
});

function search(req, res, next) {
    var searchTerm = req.query.search;
    var category = req.query.category;
    let query = 'SELECT * FROM Posting'

    if (searchTerm != '' && category != ''){
        query = `SELECT * FROM Posting WHERE Category = '` + category + `' AND ( Name LIKE '%` + searchTerm + `%' OR Comment LIKE '%` + searchTerm + `%' OR Category LIKE '%` + searchTerm + `%')`;
    }
    else if (searchTerm != '' && category == ''){
        query = `SELECT * FROM Posting WHERE Name LIKE '%` + searchTerm + `%' OR Comment LIKE '%` + searchTerm + `%' OR Category LIKE '%` + searchTerm + `%'`;
    }
    else if (searchTerm == '' && category != ''){
        query = `SELECT * FROM Posting WHERE Category = '` + category + `'`;
    }

    database.query(query, (err, result) => {
        if (err){
            req.searchResult = "";
            req.searchTerm = "";
            req.category = "";

            next();
        }
        req.searchResult = result;
        req.searchTerm = searchTerm;
        req.category = "";
        next();
    });

}





