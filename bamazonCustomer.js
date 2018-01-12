
// import { createConnection } from "net";
var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localHost",
    port: 3306,


    //your username 
    user: "root",
    //your password 
    password: "",
    database: "bamazon"

});
let productNames = []
let products;
let prodByDept = [];
let productPrice = []

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    connection.query("SELECT * FROM products;", function (err, res) {
        if (err) throw err;
        products = res
        runSearch()
    });

})

function enterQuantity() {
    inquirer
        .prompt([{
                name: "quantity",
                type: "input",
                message: "How many would you like to buy?"
            }

        ]).then(function (answer) {
            for (var i = 0; i < products.length; i++) {
                // console.log(answer.quantity)
                // console.log(answer.product)
                if (answer.product === products[i].product_name) {
                    console.log(products[i].stock_quantity)
                    console.log(products[i].item_id)
                    // quantityUpdate(products[i].stock_quantity)
                    var newQuantity = products[i].stock_quantity - answer.quantity;
                    if (answer.quantity > products[i].stock_quantity) {
                        console.log("Insufficient quantity!");
                        enterQuantity();

                    } else {
                        console.log(newQuantity);
                    }
                }
            }
        })

}

function findProduct_Quantity() {
    inquirer
        .prompt([{
                name: "product",
                type: "list",
                message: "What product would like to buy?",
                choices: productNames
            },
            {
                name: "quantity",
                type: "input",
                message: "How many would you like to buy?",
            }

        ]).then(function (answer) {
            for (var i = 0; i < products.length; i++) {
                
                if (answer.product === products[i].product_name) {
                    //database stock quantity
                    var productStockQ = products[i].stock_quantity
                    //user quantity
                    var answerQ = answer.quantity;
                    //product id
                    var itemId = products[i].item_id
                    console.log(itemId)
                    console.log(productStockQ);
                    //after the user enters input
                    var newQuantity = productStockQ - answer.quantity;
                    // console.log("$" + products[i].price)
                    var price = parseInt(products[i].price);
                    // console.log("$" + price)
            
                    //Validate 
                    quantityValid(answerQ, newQuantity, productStockQ);
                    quantityUpdate(newQuantity, itemId);  
                    priceOfProduct(price, answerQ)           
                }
            }
        })
}
function priceOfProduct(price, quantity){
    var newPrice = price * quantity
    console.log("The price of your purchase is $" + newPrice)
}
function runSearch() {
    inquirer
        .prompt([{
            //find departments run search on array
            name: "department",
            type: "list",
            message: "What dept are you looking for?",
            choices: [
                "Electronics",
                "Clothing & Shoes",
                "Food & Grocery"
            ]


        }])
        .then(function (answer) {
            for (let i = 0; i < products.length; i++) {
                if (answer.department === products[i].department_name) {
                    prodByDept.push(products[i])
                    productNames.push(products[i].product_name)
                    productPrice.push(products[i].price)
                }

            }
            // console.log(productNames + "||" + productPrice  )
            findProduct_Quantity();


            // idSelection(answer.idSelect)
            // connection.query("SELECT * FROM products WHERE ?",{item_id: answer.idSelect}, function(err, res) {
            //     console.log(
            //         "Product: " +
            //         res[0].product_name +
            //         " || Dept Name: " +
            //         res[0].department_name +
            //         " || Price: " +
            //         res[0].price +
            //         " || Stock Up: " +
            //         res[0].stock_quantity
            //     )
            // })
            // console.log(answer.quantity)
        });
}
//get selection input from user and call the database.
// function idSelection(item_id) {
//     connection.query("SELECT * FROM products WHERE ?", {
//         item_id: item_id
//     }, function (err, res) {
//         console.log(
//             "Product: " +
//             res[0].product_name +
//             " || Dept Name: " +
//             res[0].department_name +
//             " || Price: " +
//             res[0].price +
//             " || Stock Up: " +
//             res[0].stock_quantity
//         )

//     })
// }

//decrement the quantity 
function quantityUpdate(answerQuantity, item_id) {
    // console.log(answerQuantity)
    // console.log()
    connection.query("UPDATE products SET ? WHERE ?", [
        {
        "stock_quantity": answerQuantity,
       },
       {
        "item_id": item_id
       }
    ], 
       function (err, res) {
        if(err){
        console.log(err)
        }
       console.log(
         "Stock Up: " +
         answerQuantity
        )
    })
}
function quantityValid(answerQ, newQuantity, productStockQ){
    if (answerQ > productStockQ) {
        console.log("Insufficient quantity!");
    } else {
        return console.log(newQuantity);
    }
};
