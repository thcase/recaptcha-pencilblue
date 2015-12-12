/**
 * Google ReCaptcha for PencilBlue ReCaptcha Service
 * @copyright Thomas H Case 2015 
 * @author Thomas H Case
 * @license This code is licensed under MIT license (see the LICENSE file for details)
 */
//dependencies
var https = require('https');

module.exports = function (pb) {
  //Dependencies
  var util = pb.util;
  var PluginService = pb.PluginService;
  var pluginService = new PluginService();

  // Initialize the service object
  function ReCaptchaService() { };

  /**
	* The name the service
	* @private
	* @static
	* @readonly
	* @property SERVICE_NAME
	* @type {String}
	*/
  var SERVICE_NAME = 'ReCaptchaService'; 
	
  // This function will be called when PencilBlue loads the service
  ReCaptchaService.init = function (cb) {
    pb.log.debug(SERVICE_NAME + ": Initialized");
    cb(null, true);
  };

  /**
	* A service interface function designed to allow developers to name the handle 
	* to the service object what ever they desire. The function must return a 
	* valid string and must not conflict with the names of other services for the 
	* plugin that the service is associated with.
	*
	* @static
	* @method getName
	* @return {String} The service name
	*/
  ReCaptchaService.getName = function () {
    return SERVICE_NAME;
  };
  
  /**
    * Plugin Name
    * @private
	* @static
	* @readonly
	* @property PLUGIN_NAME
	* @type {String}
    */
  var PLUGIN_NAME = 'recaptcha-pencilblue';
  
  /**
   * Private Key Setting Name
   * @private
   * @static
   * @readonly
   * @property RECAPTCHA_PRIVATE_KEY_SETTING_NAME
   * @type {String}
   */
  var RECAPTCHA_PRIVATE_KEY_SETTING_NAME = 'google_recaptcha_secret_key';
  
  /**
   * Validate passed key
   * @param data Post Data
   * @param {function}cb Callback in format of (err,result)
   */
  ReCaptchaService.validateResponse = function (data, cb) {
    var key = data["g-recaptcha-response"];
    if (key) {
      pluginService.getSetting(RECAPTCHA_PRIVATE_KEY_SETTING_NAME, PLUGIN_NAME, function (err, privateKey) {
        if (util.isError(err)) {
          cb(err, false);
        }
        var url = "https://www.google.com/recaptcha/api/siteverify?secret=" + privateKey + "&response=" + key;
        https.get(url, function (res) {
          var data = "";
          res.on('data', function (chunk) {
            data += chunk.toString();
          });
          res.on('end', function () {
            try {
              var parsedData = JSON.parse(data);
              if (parsedData.success) {
                cb(null, parsedData.success);
              } else {
                var msg = "The following errors occurred: ";
                msg += parsedData['error-codes'].join();
                var err = new Error(msg);
                cb(err, parsedData.success);
              }
            } catch (err) {
              cb(err, false);
            }
          });
        });
      });
    } else {
      var err = new Error("ReCaptcha response not present");
      cb(err, null);
    }
  };

  return ReCaptchaService;
};