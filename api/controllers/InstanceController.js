/**
 * InstanceController
 *
 * @description :: Instance Controller
 * @help        :: See http://links.sailsjs.org/docs/controllers
 * @author      :: Shilo Banihit
 */

module.exports = {

  
  /**
  *
  * addInfo - retrieves Nova instance information.
  *
  */
  addInfo: function(req, res) {
    if (req.body == null || req.body.srcText == null || req.body.ticketId == null) {
      return res.send(sails.config.error.noParam.code, sails.config.error.noParam.msg);
    }
    sails.log.debug("Getting instance IDs...");
    var srcText = req.body.srcText;
    var ticketId = req.body.ticketId;
    instanceService.getInstanceIds(srcText, function(instanceIds) {
      sails.log.debug("Instance IDS:");
      sails.log.debug(instanceIds);
      if (instanceIds.length == 0) {
          return res.json({foundMatch:false});
      }
      // continue with getting instance data....
      var instanceData = [];
      var blob = "";
      var addNote = function() {
        if (sails.config.freshdesk.updateNote) {
          freshdeskService.addNote(ticketId, blob, function(success, msg) {
            if (success) {
              return res.json({foundMatch:success, message:msg});
            } else {
              sails.log.error("Error adding note: " + msg);
              return res.send(525, JSON.stringify({message:msg}));
            }
          });     
        } else {
          return res.json({foundMatch:true, message:blob});
        }
      };
      for (var i=0; i < instanceIds.length; i++) {
        instanceService.getInstanceInfo(instanceIds[i], sails.config.stripTable, function(data) {
          instanceData.push(data);
          if (instanceData.length >= instanceIds.length) {
            // post data to Freshdesk
            // concatenate the instances as one string
            for (var j=0; j < instanceData.length; j++) {
              if (instanceData[j].error == null) {
                blob += instanceData[j].out + sails.config.instanceDelim;
              } else {
                sails.log.error("Error for instance:" + instanceData[j].error);
              }
            }
            addNote();
          }
        });
      }
    });
  }
}