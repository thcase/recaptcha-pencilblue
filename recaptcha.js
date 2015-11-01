/**
 * Google ReCaptcha for PencilBlue Plugin
 * @copyright Thomas H Case 2015 
 * @author Thomas H Case
 * @license This code is licensed under MIT license (see the LICENSE file for details)
 */
module.exports = function ReCaptchaModule(pb) {

    //pb dependencies
    var util = pb.util;
    
    /**
     * ReCaptcha - Constructor
     * @class ReCaptcha
     * @constructor
     */
    function ReCaptcha(){}
    
    /**
     * The ID for the ReCaptcha provider
     * @private
     * @static
     * @readonly
     * @property PROVIDER_NAME
     * @type {String}
     */
    var PROVIDER_NAME = 'google_recaptcha';

    /**
     * Called when the application is being installed for the first time.
     *
     * @param cb A callback that must be called upon completion.  cb(err, result).
     * The result is ignored
     */
    ReCaptcha.onInstall = function(cb) {
        cb(null, true);
    };

    /**
     * Called when the application is uninstalling this plugin.  The plugin should
     * make every effort to clean up any plugin-specific DB items or any in function
     * overrides it makes.
     *
     * @param cb A callback that must be called upon completion.  cb(err, result).
     * The result is ignored
     */
    ReCaptcha.onUninstall = function(cb) {
        cb(null, true);
    };

    /**
     * Called when the application is starting up. The function is also called at
     * the end of a successful install. It is guaranteed that all core PB services
     * will be available including access to the core DB.
     *
     * @param cb A callback that must be called upon completion.  cb(err, result).
     * The result is ignored
     */
    ReCaptcha.onStartup = function(cb) {
        var pluginService = new pb.PluginService();
        pb.TemplateService.registerGlobal('recaptcha_div',function(flag,callback){
            pluginService.getSetting('google_recaptcha_site_key', 'recaptcha-pencilblue', function(err,setting){
                if(util.isError(err)){
                    callback(err,null);
                }
                var divText = '<div class="g-recaptcha" data-sitekey="' + setting +  '"></div>';
                callback(null, new pb.TemplateValue(divText,false));
            });
        });
        var script = "<script src='https://www.google.com/recaptcha/api.js'></script>";
        pb.TemplateService.registerGlobal('recaptcha_script',new pb.TemplateValue(script,false));
        cb(null, true);
    };

    /**
     * Called when the application is gracefully shutting down.  No guarantees are
     * provided for how much time will be provided the plugin to shut down.
     *
     * @param cb A callback that must be called upon completion.  cb(err, result).
     * The result is ignored
     */
    ReCaptcha.onShutdown = function(cb) {
        cb(null, true);
    };

    //exports
    return ReCaptcha;
};
