/**
 * Api Key Auth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user with a valid api key.
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
module.exports = function(req, res, next) {

  // User is allowed, proceed to the next policy, 
  // or if this is the last policy, the controller
//  sails.log.debug("---- Headers ------");
//  sails.log.debug(req.headers);
//  sails.log.debug("====== Param =========");
//  sails.log.debug(req.params);
//  sails.log.debug("====== Body =========");
//  sails.log.debug(req.body);
  var auth = req.headers.authorization;
  if (auth == sails.config.authorization) {
//    sails.log.debug('Has Valid Authorization');
    return next();
  }

  // User is not allowed
  // (default res.forbidden() behavior can be overridden in `config/403.js`)
  return res.forbidden(sails.config.error.noAuth.msg);
};
