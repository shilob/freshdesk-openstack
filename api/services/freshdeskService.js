/**
 * Freshdesk interface
 *
 * @description :: Interacts with Freshdesk API endpoints
 * @author      :: <a href='https://github.com/shilob/'>Shilo Banihit</a>
 */
module.exports = {
  
  addNote: function(ticketId, noteText, cb) {
    var apiUrl = sails.config.freshdesk.noteApiPath.replace(/<ticketId>/, ticketId);
    var request = require('request');
    request.debug = sails.config.debugHttp;
    var reqData = {
      helpdesk_note: {
        body:noteText,
        body_html: '<div>' + noteText.replace(/(?:\r\n|\r|\n)/g, '<br />') + '</div>',
        private:sails.config.freshdesk.isNotePrivate
      }
    };
    var options = {
      uri: apiUrl,
      baseUrl: sails.config.freshdesk.protocol + sails.config.freshdesk.hostname,
      method: sails.config.freshdesk.noteApiMethod,
      json:true,
      proxy: sails.config.httpProxy,
      body: reqData,
      auth: {
        username: sails.config.freshdesk.username,
        password: sails.config.freshdesk.pw
      }
    };
    
    request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        if (sails.config.debugHttp) sails.log.debug(body);
        if (cb) cb(true, body);
      } else {
        sails.log.error("Error updating Freshdesk note, using request:");
        sails.log.error(options);
        sails.log.error("Actual Error message is:");
        sails.log.error(error);
        if (cb) cb(false);
      }
    });
  }
};