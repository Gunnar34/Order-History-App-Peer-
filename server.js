var express = require("express");
var app = express();
var path  = require('path');
var pg = require('pg');
var bodyParser = require('body-parser');

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

var config= {
    database:'omega',
    host: 'localhost',
    max: 12
};

var pool = new pg.Pool(config);

app.listen(5439, function() {
    console.log('server up on port', 5439);
});

app.get("/", function(req, res) {
    console.log('base url hit');
    res.sendFile(path.resolve("public/views/index.html"));
});

app.get('/customers', function(req, res) {
    console.log('');
    pool.connect()
        .then(function (client) {
            console.log('client,', client);
            client.query("SELECT * FROM customers")

                .then(function(customers) {
                    client.release();
                    res.send(customers.rows);
            });
        })
        .catch(function(err) {
            client.release();
            res.send(500);
        });
});

app.get('/:id', function(req, res) {
    var id = req.params.id;

    pool.connect()
        .then(function (client) {
            var resultSet = client.query("SELECT customers.id, street, city, state, zip, address_type, orders.id, description, quantity, line_items.unit_price,"+
             " (quantity * line_items.unit_price) AS total FROM customers " +
              "JOIN addresses ON customers.id = addresses.customer_id " +
              "JOIN orders ON orders.address_id = addresses.id " +
              "JOIN line_items ON line_items.order_id = orders.id " +
              "JOIN products ON line_items.product_id = products.id " +
              "WHERE customers.id = $1;", [id])
                .then(function(resultSet) {
                    client.release();
                    res.send(resultSet.rows);
            });
        })
        .catch(function(err) {
            client.release();
            res.send(500);
        });
});
