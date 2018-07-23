var express = require("express");  
var app = express(); 
var server = require("http").createServer(app);
server.listen(3000);
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

//get info of user, ":userid" is userid
app.get("/info/:userid", function(req, res){
	var userid = req.params.userid;
	con.connect(function(err) {
	  if (err) console.log(err);
	  con.query("SELECT * FROM users INNER JOIN address ON users.userid = address.userid WHERE users.userid = " + userid, function (err, result) {
	    if (err) console.log(err);
	    res.send(result);
	  });
	});
})

app.get("/walletFeed", function(req, res){
	var vallet = [];
	con.connect(function(err) {
	  if (err) console.log(err);
	  con.query("SELECT * FROM coins", function (err, result, fields) {
	    if (err) console.log(err);
		//get info trans by hash
		result.forEach(function(element) {
			vallet.push({address: element.address, balance: element.blance});			
		});
		res.send(vallet);
	  });
	});
})

//get trans of address, param: address_id
app.get("/getTransaction/:add_id", function(req, res){
	var add_id = req.params.add_id;
	con.connect(function(err) {
		if (err) console.log(err);
		con.query("SELECT * FROM address INNER JOIN trans ON address.address = trans.add_to OR address.address = trans.add_from WHERE address.address = '" + add_id + "'" , function(err, result) {
			if (err) console.log(err);
			//get info trans by hash
			result.forEach(function(element) {
				var trans = web3.eth.getTransactionReceipt(element.hash, function(err, result){
					console.log(err);
					res.send(result);
				});
			});
		})
	})

})

//create user , ":email" is email of user, ":pass" is passward of user
app.get("/createUser/:email/:pass", function(req, res){
	var email = req.params.email;
	var password = req.params.pass;
	con.connect(function(err) {
		if (err) console.log(err);
		  	console.log("Connected!");
		  	var sql = "INSERT INTO users (email, password) VALUES (" + "'" + email + "'" + "," + "'" + password + "'" + ")";
		  	con.query(sql, function (err, result) {
			if (err) console.log(err);
			res.send(result);	
	  	});	
	});
})

//create address of user, ":email" is email of user, ":pass" is passward of address
app.get("/createAcc/:userid/:pass" , function(req, res){
	con.connect(function(err) {
		if (err) throw err;
		  console.log("Connected!");
		  var newAcc = web3.personal.newAccount(req.params.pass);
		  var sql = "INSERT INTO address (userid, address, pass_add) VALUES ('" + req.params.userid + "','" + newAcc + "','" + req.params.pass + "')";
		  con.query(sql, function (err, result) {
		if (err) throw err;
		    res.send("OK");	
	  	});	
	});
})

//list user
app.get("/listAcc", function(req, res){	
	// accounts = web3.personal.listAccounts;
	// accounts = JSON.stringify(accounts);
	// accounts = {listAcc: accounts}
	// res.send(accounts);	
	con.connect(function(err) {
	  if (err) console.log(err);
	  con.query("SELECT * FROM users", function (err, result, fields) {
	    if (err) console.log(err);
		res.send(result);	
	  });
	});
})


//send trans
app.get("/sendTransaction", function(req, res){
	web3.personal.unlockAccount(web3.eth.accounts[20], "12345");
	var txnHash = web3.eth.sendTransaction({
	     from: web3.eth.accounts[20],
	     to:  '0x380a4dcc578922d1028108f60dc537a14378ba9b',
	     // value: web3.toWei("0.001", "ether"),
	     value: 10,
	     gas: 2000000,
	     gasPrice: 2000
	}, function(err, res){
		if (err) console.log(err);
		
		var acc = '0x380a4dcc578922d1028108f60dc537a14378ba9b';
		var value = 10;
		blance_from = web3.eth.getBalance(web3.eth.accounts[20]).toNumber();
		blance_to = web3.eth.getBalance('0x380a4dcc578922d1028108f60dc537a14378ba9b').toNumber();
		//update database
		con.connect(function(err) {		  
		  if (err) console.log(err);

		  //insert hash to trans
		  var sql = "INSERT INTO trans (hash, add_from, add_to, value) VALUES ('" + res + "','" + web3.eth.accounts[20] + "','" + acc + "','" + value + "')";
		  con.query(sql, function (err, result) {
		    if (err) console.log(err);
		    console.log(result.affectedRows + " record(s) updated");
		  });

		  //update balance to address table
		  var sql = "UPDATE address SET balance = '" + web3.fromWei(blance_from, "ether") + "' WHERE address = '" + web3.eth.accounts[20] + "'";
		  con.query(sql, function (err, result) {
		    if (err) console.log(err);
		    console.log(result.affectedRows + " record(s) updated");
		  });

		  var sql = "UPDATE address SET balance = '" + web3.fromWei(blance_to, "ether") + "' WHERE address = '" + acc + "'";
		  con.query(sql, function (err, result) {
		    if (err) console.log(err);
		    console.log(result.affectedRows + " record(s) updated");
		  });
		});		
	});	
	res.send("OK");	
})


