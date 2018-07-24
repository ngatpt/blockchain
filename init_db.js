var express = require("express");  
var app = express(); 
var server = require("http").createServer(app);
server.listen(8080);
// var io = require("socket.io")(server);

var Web3 = require("web3");

web3 = new Web3(new Web3.providers.HttpProvider("http://192.168.0.225:8545"));	

//connect db
var mysql = require('mysql');
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "coin"
});

// db init
app.get("/", function(req, res){
	accounts = web3.personal.listAccounts;
	accounts = JSON.stringify(accounts);
	accounts = accounts.split("[");
	accounts = accounts[1].split("]");
	accounts = accounts[0].replaceAll('"', '');
	accounts = accounts.split(",")

	// var acc_infos = new Array();
	con.connect(function(err) {
		if (err)console.log(err);
		accounts.forEach(function(account){
			blance = web3.eth.getBalance(account).toNumber();
			Eth = web3.fromWei(blance, "ether");
			console.log(Eth);
			var sql = "INSERT INTO coins (address, blance) VALUES (" + "'" + account + "'" + "," + "'" + Eth + "'" + ")";
			// var sql = "UPDATE coins SET blance = '" + Eth + "' WHERE address = '" + account + "'";
		  	con.query(sql, function (err, result) {
			    if (err) throw err;
			    console.log(result.affectedRows + " record(s) updated");
		 	});
		});
	});
})

// app.get("/", function(req, res){
// 	console.log(web3.fromWei(2.964e+21, "ether"));
// })

// Replaces all instances of the given substring.
String.prototype.replaceAll = function(
strTarget, // The substring you want to replace
strSubString // The string you want to replace in.
){
var strText = this;
var intIndexOfMatch = strText.indexOf( strTarget );
 
// Keep looping while an instance of the target string
// still exists in the string.
while (intIndexOfMatch != -1){
// Relace out the current instance.
strText = strText.replace( strTarget, strSubString )
 
// Get the index of any next matching substring.
intIndexOfMatch = strText.indexOf( strTarget );
}
 
// Return the updated string with ALL the target strings
// replaced out with the new substring.
return( strText );
}
