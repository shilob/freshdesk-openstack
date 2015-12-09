/**
 * Instance controller
 *
 * @description :: Controller for retrieving and pushing instance information to Freshdesk
 * @author      :: <a href='https://github.com/shilob/'>Shilo Banihit</a>
 */
module.exports = {
  
  /**
  *
  * Returns the instance IDs of IP addresses from source text
  *
  */
  getInstanceIds: function(srcText, cb) {
    var ips = srcText.match(/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/g);
    var instanceIdsSource = srcText.match(/([a-zA-Z0-9]{8})\-([a-zA-Z0-9]{4})\-([a-zA-Z0-9]{4})\-([a-zA-Z0-9]{4})\-([a-zA-Z0-9]{12})/g);
    var instanceIds = [];
    if (instanceIdsSource != null) {
      for (var x=0; x<instanceIdsSource.length; x++) {
        instanceIds.push({instanceId: instanceIdsSource[x]});
      }
    }
    var instanceCnt = 0; // we are using an instance count instead comparing the ips and instanceids since the ip may not match
    var trackingCb = function() {
      instanceCnt++;
      if (instanceCnt >= ips.length) {
        cb(instanceIds);
      }
    };
    if (ips == null) {
      return cb(instanceIds);
    }
    var cbExit = function(ip) { return function(error, stdout, stderr) {
      if (error) {
        sails.log.error("Error getting instance information");
        sails.log.error(error);
      } else {
        var outputJson = JSON.parse(stdout);
        for (var i=0; i<outputJson.length; i++) {
          var isMatch = outputJson[i][sails.config.ipField].indexOf(ip) != -1;
          if (isMatch) {
            instanceIds.push({instanceId:outputJson[i][sails.config.idField]});
          }
        }
        trackingCb();
      }
    }};
    
    // remove duplicate IP addresses
    ips = ips.unique();
    for (var i=0; i<ips.length; i++) {
      cmdService.runCmd('getInstanceList', [{fieldRegex:/<ipAddress>/g, fieldValue:ips[i]}], cbExit(ips[i]));
    }
  },
  
  /**
  *
  * 
  *
  */
  getInstanceInfo: function(instanceInfo, stripTableOutput, cb) {
    var data = {};
    var cbExit = function(error, stdout, stderr) {
      data.err = stderr;
      if (error) {
        data.error = error;
      } 
      data.out = stdout;
      cb(data);
    };
    cmdService.runCmd('showInstanceInfo', [{fieldRegex:/<instanceId>/g, fieldValue:instanceInfo.instanceId}],cbExit);
  }
};