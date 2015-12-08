/**
 * Running external processes service
 *
 * @description :: Running OS processes convenience service.
 * @author      :: <a href='https://github.com/shilob/'>Shilo Banihit</a>
 */
module.exports = {
  
  runCmd: function(cmdName, params, cbExit) {
    var cmd = sails.config.cmds[cmdName].mainCmd;
    if (params) {
      for (var j=0; j<params.length; j++) {
        cmd = cmd.replace(params[j].fieldRegex, params[j].fieldValue);
      }
    }
    sails.log.debug("Running cmd: " + cmd);
    var exec = require('child_process').exec;
    var statusProc = exec(cmd, function(error, stdout, stderr) {
      cbExit(error, stdout, stderr);
    });
  }
};