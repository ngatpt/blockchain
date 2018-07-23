CREATE TABLE IF NOT EXISTS `coins` (
  `id` int(11) NOT NULL primary key AUTO_INCREMENT,
  `username` varchar(45) DEFAULT NULL,
  `email` varchar(120) DEFAULT NULL,
  `password` varchar(200) DEFAULT NULL,
  `address` varchar(200) DEFAULT NULL,
  `blance` varchar(200) DEFAULT NULL
);

-- ALTER TABLE coins ADD hash VARCHAR(200) DEFAULT NULL;

-- Alter table address  DROP COLUM password;

CREATE TABLE IF NOT EXISTS `users` (
  `userid` int(11) NOT NULL primary key AUTO_INCREMENT,
  `email` varchar(120) DEFAULT NULL,
  `password` varchar(200) DEFAULT NULL
);


CREATE TABLE IF NOT EXISTS `address` (
  `address` varchar(120) NOT NULL,
  -- `addid` int(11) NOT NULL AUTO_INCREMENT, 
  `balance` varchar(200) DEFAULT NULL,
  `pass_add` varchar(200) DEFAULT NULL,
  `userid` varchar(200) DEFAULT NULL,
  PRIMARY KEY (address),
  FOREIGN KEY (userid) REFERENCES users(userid)
);

CREATE TABLE IF NOT EXISTS `trans` (
  `tranid` int(11) NOT NULL primary key AUTO_INCREMENT,
  `hash` varchar(120) DEFAULT NULL,
  `add_from` varchar(200) DEFAULT NULL,
  `add_to` varchar(200) DEFAULT NULL,
  `value` varchar(200) DEFAULT NULL,
  FOREIGN KEY (add_from) REFERENCES address(address),
  FOREIGN KEY (add_to) REFERENCES address(address)
);


