/**
 * Universal Analytics Tracker
 * 
 * Compatible with universial.js
 *
 * @package		tw_googleanalytics
 * @copyright	Copyright © 2013 tollwerk® GmbH (http://tollwerk.de)
 * @author		Dipl.-Ing. Joschi Kuphal <joschi@tollwerk.de>
 */

/**
 * Install the Universal tracking prerequisites (part of original Universal tracking code)
 */
(function(i, r) {
	i['GoogleAnalyticsObject'] = r;
	i[r] = i[r] || function() {
		(i[r].q = i[r].q || []).push(arguments)
	}, i[r].l = 1 * new Date();
})(window, 'ga');

/**
 * Universal Analytics Tracker
 * 
 * @type {Object} 
 */
var tw_gat = {
    /**
     * Custom Variables
     * 
     * @type {Array} 
     */
    '_customVariables': [null, null, null, null, null],
    /**
     * Currently active custom variables
     * 
     * @type {Array} 
     */
    '_activeCustomVariables': [false, false, false, false, false],
    /**
     * Google Analytics account ID
     * 
     * @type {String} 
     */
    '_accountId': null,
    /**
     * Debug mode
     * 
     * @type {Boolean}
     */
    '_debug': false,
    /**
     * Most recently tracked page URL
     * 
     * @type {String} 
     */
    '_lastPageUrl': '',
    /**
     * Domain name
     * 
     * @type {String}
     */
    '_domainName': 'auto',
    /**
     * Tracking of client info
     * 
     * @type {Boolean}
     */
    '_clientInfo': true,
    /**
     * Tracking of flash version
     * 
     * @type {Boolean}
     */
    '_flashVersion': true,
    /**
     * Tracking of page title
     * 
     * @type {Boolean}
     */
    '_pageTitle': true,
    /**
     * Allow cross domain linking
     * 
     * @type {Boolean}
     */
    '_linker': false,
    /**
     * Domains for cross domain tracking
     * 
     * @type {Array}
     */
    '_crossDomains': [],
    /**
     * Click handler
     * 
     * @type {Function}
     */
    '_clickHandler': null,
    /**
     * External URL tracking configuration
     * 
     * @type {Object}
     */
    '_trackExternal': null,
    /**
     * E-Mail tracking configuration
     * 
     * @type {Object}
     */
    '_trackEmail': null,
    /**
     * Download tracking configuration
     * 
     * @type {Object}
     */
    '_trackDownload': null,
    /**
     * Tracking handler ready state
     * 
     * @type {Number}
     */
    '_trackReady': 0,
    /**
     * IP address anonymization
     * 
     * @type {Boolean}
     */
    '_anonymizeIP': false,
    /**
     * Tracker has been created
     * 
     * @type {Boolean}
     */
    '_created': false
};

/**
 * Check if the given argument is an Array (with a certain number of elements)
 * 
 * @param {Mixed} array                 Array argument
 * @param {Number} length               Optional: Expected number of elements
 * @return {Boolean}                    The argument is an array (with the expected number of elements)
 */
tw_gat.isArray = function(array, length) {
    length      = length || 0;
    return (typeof(array) == 'object') && ('length' in array) && (typeof(array.length) == 'number') && (length ? (array.length == length) : true);
}

/**
 * Strip whitespaces off a string
 * 
 * @param {String} str                  String
 * @return {String} str                 Whitespace-stripped string
 */
tw_gat.trim = function(str) {
    var str = (new String(str)).replace(/^\s\s*/, ''), ws = /\s/, i = str.length;
    while (ws.test(str.charAt(--i)));
    return str.slice(0, i + 1);
}

/**
 * Activate / deactivate the debug mode
 * 
 * In debug mode the requests sent to Google Analytics are logged to the javascript console (if
 * available). By passing 2 as argument the "Debug only" mode is enabled so that no real tracking
 * takes place and any requests are just logged to the console.  
 * 
 * @param {Number} debugMode            Activate debug mode (0 = Off, 1 = On, 2 = Debug only)
 * @return {Object}                     Self reference (liquid interface)
 */
tw_gat.debug = function(debugMode) {
    this._debug = Math.max(0, Math.min(2, parseInt(debugMode)));
    return this;
}

/**
 * Registration of custom dimensions & metrics
 * 
 * Custom dimensions and metrics have to be registered at your Universal Analytics prior to submitting them.
 * You have to pass an object of custom dimensions and metrics to this method. The property names are used
 * as dimension / metric indices:
 * 
 * {
 * 		'dimension1': 'value 1',
 * 		'dimension2': 'value 2',
 * 		'metric1': 800,
 * 		'metric2': 29.50,
 * }
 * 
 * Once set, the custom dimensions will be submitted to Universal Analytics along with every pageview and
 * event submission.
 * 
 * For a full documentation:
 * @see https://developers.google.com/analytics/devguides/collection/analyticsjs/custom-dims-mets
 * 
 * @param {Array} customDimensionsMetrics      Custom dimensions and metrics
 * @return {Object}                     		Self reference (liquid interface)
 */
tw_gat.registerCustomDimensionsMetrics = function(customDimensionsMetrics) {
    if (this._createTracker() && (typeof(customDimensionsMetrics) == 'object')) {
    	for (var dm in customDimensionsMetrics) {
    		if (this._debug && console) {
		        console.log('Universal Analytics', 'set', customDimensionsMetrics);
		    }
		    if (this._debug < 2) {
		        ga('set', customDimensionsMetrics);
		    }
		    break;
    	}
    }
    return this;
}

/**
 * Setting the Google Analytics account / web property ID
 * 
 * @param {String} accountId            Google Analytics account ID
 * @return {Object}                     Self reference (liquid interface)
 */
tw_gat.setAccount = function(accountId) {
    this._accountId         = this.trim(accountId);
    if (document.cookie.indexOf('ga-disable-' + this._accountId + '=true') > -1) {
    	if (this._debug && console) {
	        console.log('Universal Analytics', 'optOut', true);
	    }
		window['ga-disable-' + this._accountId] = true;
	}
    return this;
}

/**
 * Set domain name
 * 
 * @param {Boolean} domainName          Domain name
 * @return {Object}                     Self reference (liquid interface)
 */
tw_gat.setDomainName = function(domainName) {
    domainName              = this.trim(domainName);
    if (domainName.length && (domainName != this._domainName)) {
        this._domainName    = domainName;
    }
    return this;
}

/**
 * One time creation of the tracker object
 * 
 * @return {Boolean}					Success
 */
tw_gat._createTracker = function() {
	if (!this._created && this._accountId) {
		if (this._linker) {
			if (this._debug && console) {
		        console.log('Universal Analytics', 'create', this._accountId, {'allowLinker': true});
		        console.log('Universal Analytics', 'require', 'linker');
		        console.log('Universal Analytics', 'linker:autoLink', this._crossDomains);
		    }
		    if (this._debug < 2) {
		        ga('create', this._accountId, {'allowLinker': true});
		        ga('require', 'linker');
		        ga('linker:autoLink', this._crossDomain);
		    }
		    
		} else {
			if (this._debug && console) {
		        console.log('Universal Analytics', 'create', this._accountId);
		    }
		    if (this._debug < 2) {
		        ga('create', this._accountId);
		    }
		}
		if (this._anonymizeIP) {
			if (this._debug && console) {
				console.log('Universal Analytics', 'set', 'anonymizeIp', true);
			}
			ga('set', 'anonymizeIp', true);
		}
	    this._created = true;
	}
	return this._created;
}

/**
 * IP address anonymization
 * 
 * @param {Boolean} anonymizeIP         Anonymize IP address
 * @return {Object}                     Self reference (liquid interface)
 */
tw_gat.anonymizeIP = function(anonymizeIP) {
    if (!!anonymizeIP && this._accountId) {
        this._anonymizeIP = true;
    }
    return this;
}

/**
 * Track client info
 * 
 * @param {Boolean} clientInfo          Track client info
 * @return {Object}                     Self reference (liquid interface)
 */
tw_gat.trackClientInfo = function(clientInfo) {
    // Currently not available for Universal Analytics
    return this;
}

/**
 * Track flash version
 * 
 * @param {Boolean} flashVersion        Track flash version
 * @return {Object}                     Self reference (liquid interface)
 */
tw_gat.trackFlashVersion = function(flashVersion) {
    // Currently not available for Universal Analytics
    return this;
}

/**
 * Track page title
 * 
 * @param {Boolean} pageTitle           Track page title
 * @return {Object}                     Self reference (liquid interface)
 */
tw_gat.trackPageTitle = function(pageTitle) {
    // Currently not available for Universal Analytics
    return this;
}

/**
 * Registering of (top level) domains to be tracked across
 * 
 * @param {Array} crossDomains          Domains
 * @return {Object}                     Self reference (liquid interface)
 */
tw_gat.setCrossDomains = function(crossDomains) {
    if (this._accountId && this.isArray(crossDomains)) {
        for (var d = 0, dl = crossDomains.length, dn; d < dl; ++d) {
            dn          = this.trim(crossDomains[d]);
            if (dn.length) {
                this._crossDomains.push(dn.toLowerCase());
            }
        }
        if (this._crossDomains.length && !this._linker) {
            this._linker        = true;
            this.installTrackingHandlers(1);
        }
    }
    return this;
}

/**
 * Activate the click & submit handlers for crossdomain and / or download tracking
 * 
 * @param {Number} readyState			Tracking handler ready state
 * @return {Object}                     Self reference (liquid interface)
 */
tw_gat.installTrackingHandlers = function(readyState) {
    if (this._accountId && !this._clickHandler) {
    	this._trackReady				|= readyState;
    	if (this._trackReady == 3) {
        
	        // Click-Handler for links / submit handler for forms
	        this._clickHandler          = function(e) { tw_gat.click(e); };
	        var installFormHandlers     = function() {
	            var submitHandler       = function(e) { return tw_gat.submit(e, this); };
	            for (var f = 0, fl = document.forms.length; f < fl; ++f) {
	                if (window.addEventListener){
	                    document.forms[f].addEventListener('submit', submitHandler, false);
	                } else {
	                    document.attachEvent('onsubmit', submitHandler);
	                }
	            }
	        }
	        
	        if (window.addEventListener){
	            document.addEventListener('click', this._clickHandler, false);
	            window.addEventListener('load', installFormHandlers, false)
	        } else {
	            document.attachEvent('onclick', this._clickHandler);
	            document.attachEvent('onload', installFormHandlers);
	        }
    	}
    }
}

/**
 * Click handler for crossdomain and / or download tracking
 * 
 * @return {Boolean}                    Go on with regular event processing
 */
tw_gat.click = function(e) {
    if (this._accountId) {
        e                   = e || window.event;
        var elem            = e.srcElement? e.srcElement : e.target,
        tag                 = elem.tagName.toLowerCase();
        while((tag != 'a')) {
            if (elem.parentNode && elem.parentNode.tagName) {
                elem        = elem.parentNode;
                tag         = elem.tagName.toLowerCase();
            } else {
                return true;
            }
        }
        var url             = elem.getAttribute('href') || '',
        lcUrl               = url.toLowerCase(); 
        if (url && url.length) {
            
            // E-Mail link
            if (lcUrl.indexOf('mailto:') === 0) {
                this._doTrackEmail('Click', url.split(':')[1].split('?').shift());
                
            // Regular URL
            } else {
                return this._doTrackURL(e, url, null);
            }
        }
    }
    return true;
}

/**
 * Submit handler for crossdomain and / or download tracking
 * 
 * @param {Event} e                     Event
 * @param {Element} form                Form element
 * @return {Boolean}                    Go on with regular event processing
 */
tw_gat.submit = function(e, form) {
    if (this._accountId) {
        var url             = form.action || document.location.href,
        lcUrl               = url.toLowerCase(); 
        if (url && url.length) {
            
            // E-Mail link
            if (lcUrl.indexOf('mailto:') === 0) {
                this._doTrackEmail('Post', url.split(':')[1].split('?').shift());
                
            // Regular URL
            } else {
                this._doTrackURL(e, url, form);
            }
        }
    }
    
    return true;
}

/**
 * Cancel an event
 * 
 * @return {Boolean}                    Always FALSE
 */
tw_gat.cancel = function(e) {
    e.cancelBubble      = true;
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    e.returnValue       = false;
    if (e.preventDefault) {
        e.preventDefault();
    }
    return false;
}

/**
 * Crossdomain linking to an URL
 * 
 * @param {String} url                  URL
 * @return {Object}                     Self reference (liquid interface)
 */
tw_gat.link = function(url) {
    // Currently not available for Universal Analytics
    return this;
}

/**
 * Crossdomain linking to an URL by POST
 * 
 * @param {Element} form                Form element
 * @return {Object}                     Self reference (liquid interface)
 */
tw_gat.linkByPost = function(form) {
   // Currently not available for Universal Analytics
    return this;
}

/**
 * Track external URLs
 * 
 * @param {Number} mode                 Tracking mode (0 = off, 1 = as pageViews, 2 = as events)
 * @param {String} prefix               Tracking prefix
 * @param {Array} restrict              Restrict to domains
 * @return {Object}                     Self reference (liquid interface)
 */
tw_gat.trackExternals = function(mode, prefix, restrict) {
    if (this._accountId) {
        if (mode) {
            this._trackExternal = {'mode': mode, 'prefix': this.trim(prefix), 'restrict': []};
            for (var d = 0, domains = restrict || [], dl = domains.length; d < dl; ++d) {
                this._trackExternal.restrict.push(domains[d].toLowerCase());
            }
            this.installTrackingHandlers(1);
        } else {
            this._trackExternal = null; 
        }
    }
    return this;
}

/**
 * Track E-Mail addresses
 * 
 * @param {Number} mode                 Tracking mode (0 = off, 1 = as pageViews, 2 = as events)
 * @param {String} prefix               Tracking prefix
 * @param {Array} restrict              Restrict to addresses
 * @return {Object}                     Self reference (liquid interface)
 */
tw_gat.trackEmails = function(mode, prefix, restrict) {
    if (this._accountId) {
        if (mode) {
            this._trackEmail    = {'mode': mode, 'prefix': this.trim(prefix), 'restrict': []};
            for (var e = 0, emails = restrict || [], el = emails.length; e < el; ++e) {
                this._trackEmail.restrict.push(emails[e].toLowerCase());
            }
            this.installTrackingHandlers(1);
        } else {
            this._trackEmail    = null; 
        }
    }
    return this;
}

/**
 * Track downloads
 * 
 * @param {Number} mode                 Tracking mode (0 = off, 1 = as pageViews, 2 = as events)
 * @param {String} prefix               Tracking prefix
 * @param {String} template				Tracking template string
 * @param {Array} list                  Folder & extension configuration
 * @return {Object}                     Self reference (liquid interface)
 */
tw_gat.trackDownloads = function(mode, prefix, template, list) {
    if (this._accountId) {
        mode                                = parseInt(mode || 0);
        mode                                = isNaN(mode) ? 0 : Math.max(0, Math.min(2, mode));
        this._trackDownload                 = mode ? {'mode': mode, 'prefix': this.trim(prefix), 'template': this.trim(template) || '{pathname}', 'list': {}} : null;
        if (mode) {
            list                            = list || {};
            var length                      = 0;
            paths: for (var p in list) {
                if (this.isArray(list[p]) && list[p].length) {
                    var ps                  = ((p.substr(0, 1) != '/') ? '/' : '') + p.toLowerCase();
                    this._trackDownload.list[ps]        = [];
                    extensions: for (var e = 0, el = list[p].length, ex; e < el; ++e) {
                        ex                  = this.trim(list[p][e] || '');
                        if (ex.length) {
                            if (ex == '*') {
                                this._trackDownload.list[ps] = '*';
                                ++length;
                                continue paths;
                            } else {
                                this._trackDownload.list[ps].push(ex.toLowerCase());
                            }
                        }
                    }
                    if (this._trackDownload.list[ps].length) {
                        ++length;
                    } else {
                        delete this._trackDownload.list[ps];
                    }
                }
            }
            if (!length) {
                this._trackDownload.list    = null;
            }
        }
        if (this._trackDownload && this._trackDownload.list) {
            this.installTrackingHandlers(1);
        }
    }
    return this;
}

/**
 * Tracking a page view
 * 
 * @param {String} pageUrl              Optional: Document URL
 * @return {Object}                     Self reference (liquid interface)
 */
tw_gat.trackPageview = function(pageUrl) {
    if (this._createTracker()) {
        pageUrl                 = (arguments.length ? this.trim(pageUrl) : this._lastPageUrl) || '';
        if (this._debug && console) {
            pageUrl.length ? console.log('Universal Analytics', 'send', 'pageview', pageUrl) : console.log('Universal Analytics', 'send', 'pageview');
        }
        if (this._debug < 2) {
        	pageUrl.length ? ga('send', 'pageview', pageUrl) : ga('send', 'pageview');
        }
        this._lastPageUrl       = pageUrl;
    }
    return this;
}

/**
 * Tracking an event
 * 
 * For a detailed explanation of the available arguments please
 * @see https://developers.google.com/analytics/devguides/collection/analyticsjs/events
 * 
 * @param {String} category             Event category
 * @param {String} action               Event action
 * @param {String} label                Optional: Event label
 * @param {Number} value                Optional: Event value
 * @return {Object}                     Self reference (liquid interface)
 */
tw_gat.trackEvent = function(category, action, label, value) {
    if (this._createTracker()) {
        category                        = (category ? this.trim(category) : '') || '';
        action                          = (action ? this.trim(action) : '') || '';
        if (category.length && action.length) {
            var evt                     = {'eventCategory': category, 'eventAction': action};
            if (arguments.length > 2) {
            	evt.eventLabel			= (label ? this.trim(label) : '') || '';
                if (arguments.length > 3) {
                    value               = parseInt(value);
                    evt.eventValue		= isNaN(value) ? 0 : value;
                }
            }
            if (this._debug && console) {
                console.log('Universal Analytics', 'send', 'event', evt);
            }
            if (this._debug < 2) {
                ga('send', 'event', evt);
            }
        }
    }
    return this;
}

/**
 * Social interaction tracking
 * 
 * @param {String} network              Social network name (e.g. Facebook, Twitter, LinkedIn)
 * @param {String} action               Social action (e.g. Like, Share, Tweet)
 * @param {String} target               Optional interaction target (e.g. an ID or the page title, which is the default if omitted)
 * @return {Object}                     Self reference (liquid interface)
 */
tw_gat.trackSocial = function(network, action, target) {
    if (this._createTracker()) {
        network                         = (network ? this.trim(network) : '') || '';
        action                          = (action ? this.trim(action) : '') || '';
        if (network.length && action.length) {
            var evt                     = {'socialNetwork': network, 'socialAction': action};
            if (arguments.length > 2) {
            	evt.socialTarget		= (target ? this.trim(target) : '') || '';
            }
            if (this._debug && console) {
                console.log('Universal Analytics', 'send', 'social', evt);
            }
            if (this._debug < 2) {
                 ga('send', 'social', evt);
            }
        }
    }
    return this;
}

/**
 * Track an email link click
 * 
 * @param {String} action               Event action
 * @param {String} email                E-mail address
 * @return {Object}                     Self reference (liquid interface)
 */
tw_gat._doTrackEmail = function(action, email) {
    if (this._accountId && (this._trackEmail.mode > 0)) {
        var lcEmail     = email.toLowerCase(),
        trackEmail      = email,
        restrictEmails  = this._trackEmail.restrict.length;
        if (restrictEmails) {
            trackEmail  = null;
            for (var e = 0; e < restrictEmails; ++e) {
                if (this._trackEmail.restrict[e] == lcEmail) {
                    trackEmail      = email;
                    break;
                }
            }
        }
        if (trackEmail !== null) {
            switch(this._trackEmail.mode) {
                case 1:
                    this.trackPageview((this._trackEmail.prefix.length ? (this._trackEmail.prefix + ':') : '') + trackEmail);
                    break;
                case 2:
                    this.trackEvent(this._trackEmail.prefix, action, trackEmail);
                    break;
            }
        }
    }
    return this;
}

/**
 * Track an URL link click
 * 
 * @param {Event} e                     Click event
 * @param {String} url                  URL
 * @param {Element} Form                Form element
 * @return {Boolean}                    Continue regular event processing
 */
tw_gat._doTrackURL = function(e, url, form) {
    if (this._accountId) {
        var host                    = window.location.hostname.toLowerCase(),
        regex                       = new RegExp('^(?:f|ht)tp(?:s)?\://(?:[^\@]\@)?([^:/]+)', 'im'),
        match                       = url.match(regex),
        domain                      = ((match ? match[1].toString() : ((url.indexOf(':') < 0) ? host : ''))).toLowerCase();
        
        // Same domain
        if (domain == host) {
            if (this._trackDownload && (this._trackDownload.mode > 0) && (this._trackDownload.list !== null)) {
                var a                   = document.createElement('a');
                a.href                  = url;
                var filePath            = a.pathname.toLowerCase();
                while (filePath.indexOf('../') === 0) {
                    filePath            = filePath.substr(3);
                }
                var fileName            = filePath.split('/').pop(),
                fileExt                 = fileName.substring(fileName.indexOf('.') + 1).toLowerCase(),
                trackDownload           = false;
                for (var p in this._trackDownload.list) {
                    if ((p == '/') || (filePath.indexOf(p) === 0)) {
                        var ext         = this._trackDownload.list[p];
                        if (ext == '*') {
                            trackDownload           = true;
                            break;
                        } else if (this.isArray(ext)) {
                            for (var e = 0, el = ext.length; e < el; ++e) {
                                if (ext[e] == fileExt) {
                                    trackDownload   = true;
                                    break;                                  
                                }
                            }
                        }
                    }
                }
                if (trackDownload) {
                	var data			= {
                		'{hash}'		: a.hash,
						'{host}'		: a.host,
						'{hostname}'	: a.hostname,
						'{href}'		: a.href,
						'{pathname}'	: a.pathname,
						'{filename}'	: fileName,
						'{extension}'	: fileExt,
						'{port}'		: a.port,
						'{protocol}'	: a.protocol,
						'{search}'		: a.search
                	},
                	track				= this._trackDownload.template;
                	for (var subst in data) {
                		track			= track.split(subst).join(data[subst]);
                	}
                    switch(this._trackDownload.mode) {
                        case 1:
                            this.trackPageview((this._trackDownload.prefix.length ? (this._trackDownload.prefix + ':') : '') + track);
                            break;
                        case 2:
                            this.trackEvent(this._trackDownload.prefix, 'Click', track);
                            break;
                    }
                }
            }
            
        // External domain
        } else {
            
            // Crossdomain tracking
            if (this._crossDomains.length) {
                for (var cd = 0, cdl = this._crossDomains.length; cd < cdl; ++cd) {
                    if (this._crossDomains[cd] == domain) {
                        return form ? this.linkByPost(form) : this.link(url).cancel(e);
                    }
                }
            }
            
            // External URL tracking
            if (this._trackExternal && (this._trackExternal.mode > 0)) {
                var trackUrl            = url,
                restrictDomains         = this._trackExternal.restrict.length;
                if (restrictDomains) {
                    trackUrl    = null;
                    for (var d = 0; d < restrictDomains; ++d) {
                        if (this._trackExternal.restrict[d] == domain) {
                            trackUrl    = url;
                            break;
                        }
                    }
                }
                if (trackUrl !== null) {
                    switch(this._trackExternal.mode) {
                        case 1:
                            this.trackPageview((this._trackExternal.prefix.length ? (this._trackExternal.prefix + ':') : '') + trackUrl);
                            break;
                        case 2:
                            this.trackEvent(this._trackExternal.prefix, 'Click', trackUrl);
                            break;
                    }
                }
            }
        }
    }
    return true;
}

/**
 * Opt-out of tracking by setting an opt-out cookie
 * 
 * @var {Boolean} out					Opt-out
 * @return {Object}                     Self reference (liquid interface)
 */
tw_gat.optOut = function(out) {
	out												= out || false;
	if (this._debug && console) {
        console.log('Universal Analytics', 'optOut', out);
    }
	document.cookie									= 'ga-disable-' + this._accountId + '=' + (out ? 'true; expires=Thu, 31 Dec 2099 23:59:59 UTC' : '; expires=Thu, 01 Jan 1970 00:00:01 UTC') + '; path=/';
	if (out) {
		window['ga-disable-' + this._accountId]		= true;
	} else {
		window['ga-disable-' + this._accountId]		= false;
		delete window['ga-disable-' + this._accountId];
	}
	return this;
}
