// load NODE_ENV.js
var fs = require('fs');
var configPath = 'config/env/' + process.env.NODE_ENV;
var config = undefined;
console.log("Checking if "+configPath+".js exists.");
if (fs.existsSync(configPath + '.js')) {
  console.log("Using "+configPath+" settings...");
  config = require('../'+configPath);
} else {
  console.log("Config does not exist.");
}
module.exports = config;