# recaptcha-pencilblue
Google ReCaptcha Plugin for PencilBlue.  Use to display ReCAPTCHA on forms.
##Installation and Setup
1. Clone the recaptcha-pencilblue repository into the plugins folder of your PencilBlue installation

	```
	cd [pencilblue_directory]/plugins
	git clone https://github.com/thcase/recaptcha-pencilblue.git
	```
	
2. Install the recaptcha-pencilblue plugin through the manage plugins screen in the admin section (/admin/plugins).
3. On forms where you want the ReCaptcha to show include the following directive
	
	```
	^recaptcha_div^
	```
	
4. Also, on the form, include the ReCaptcha script by including the following directive
	
	```
	^recaptcha_script^
	```
	
5. In your controller, include the ReCaptchaService, by including the following command where you setup your dependencies.

	```javascript
	var ReCaptchaService = PluginService.getService('ReCaptchaService','recaptcha-pencilblue');
	```
	
6. To validate the ReCaptcha response, call the ReCaptchaService's validateResponse function passing in the POST variables and a callback function.  The callback function returns an error object as its first parameter, and a result (true/false) of whether the ReCaptcha validated. The following example is using the API Controller methods. See the PencilBlue Contact Page plugin for complete code for processing Contact form submittal via the API Controller.

	```javascript
	this.getJSONPostParams(function(err, post) {
	    if(util.isError(err)) {
	    	cb({
	    			code: 400,
	    			content: pb.BaseController.apiResponse(pb.BaseController.API_ERROR, err.message)
	    		});
	    	return;
	    }
	    ReCaptchaService.validateResponse(post,function(err,result){
	    	if(util.isError(err)){
	    		cb({
	    			code: 400,
	    			content: pb.BaseController.apiResponse(pb.BaseController.API_ERROR, self.ls.get('RECAPTCHA_FAIL'))
	    		});
	    		return;
	    	} else {
	    		var message = self.hasRequiredParams(post, ['first_name','last_name','email', 'message']);
	    		if(message) {
	    			cb({
	    				code: 400,
	    				content: pb.BaseController.apiResponse(pb.BaseController.API_ERROR, message)
	    			});
	    			return;
	    		};
	    		/// Process form here (e.g., submit to DB, send email, ...)
	    	}
	    });
	});
	```
If you have any issues, please submit via the issues link on github.
