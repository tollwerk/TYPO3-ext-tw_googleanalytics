/**
 * Google Analytics Tracker
 * 
 * Compatible with ga.js
 *
 * @package		tw_googleanalytics
 * @copyright	Copyright © 2013 tollwerk® GmbH (http://tollwerk.de)
 * @author		Dipl.-Ing. Joschi Kuphal <joschi@tollwerk.de>
 */

/**
 * Google Analytics Queue
 * 
 * @type {Array} 
 */
var _gaq = _gaq || [];

/**
 * Google Analytics Tracker
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
     * Bitmask for custom variables set for subsequent tracking requests
     * 
     * @type {Number}
     */
    '_futureCustomVariables': 0,
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
    '_trackReady': 0
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
 * Registration of custom variables
 * 
 * Custom variables have to be registered prior to submitting them to Google Analytics. The latter
 * will be accomplished by tw_gat.setCustomVariables() on any subsequent pageView or event tracking
 * request, you don't have to take care about that.
 * 
 * You have to pass an array of custom variable definitions to this method, each being an array itself and
 * consisting of up to 4 elements (corresponding to the 4 arguments taken by the GA-method _setCustomVar):
 * 
 * index, key [, value [, level]] 
 * 
 * The third an forth element are optional. If the third element is present but empty, NULL or FALSE,
 * the custom variable will be unset. For a full documentation of the possible argument values
 * @link https://developers.google.com/analytics/devguides/collection/gajs/methods/gaJSApiBasicConfiguration#_gat.GA_Tracker_._setCustomVar
 * 
 * @param {Array} customVariables       Custom variables
 * @return {Object}                     Self reference (liquid interface)
 */
tw_gat.registerCustomVariables = function(customVariables) {
    if (this._accountId && this.isArray(customVariables)) {
        for (var i = 0; i < customVariables.length; ++i) {
            if (this.isArray(customVariables[i]) && (customVariables[i].length >= 2) && (customVariables[i].length <= 4)) {
                var index               = parseInt(customVariables[i][0]);
                if (!isNaN(index) && (index >= 1) && (index <= 5)) {
                    var key             = this.trim(customVariables[i][1]);
                    var value           = null;
                    var level           = 3;
                    if (customVariables[i].length > 2) {
                        if ((customVariables[i][2] !== null) && (customVariables[i][2] !== false)) {
                            value       = this.trim(customVariables[i][2]);
                            if (value.length) {
                                value   = value.substr(0, Math.min(value.length, 63 - key.length));
                            } else {
                                value   = null;
                            }
                        }
                        level           = 3;
                        if (customVariables[i].length > 3) {
                            var plevel  = parseInt(customVariables[i][3]);
                            level       = isNaN(plevel) ? 3 : plevel;
                        }
                    }
                    
                    if (value === null) {
                        this._customVariables[index - 1]    = null;
                        this._futureCustomVariables         &= ~Math.pow(2, index - 1);
                    } else {
                        this._customVariables[index - 1]    = [index, key, value, level];
                        this._futureCustomVariables         |= Math.pow(2, index - 1);
                    }
                }
            }
        }
    }
    return this;
}

/**
 * Transmission of (previously registered) custom variables
 * 
 * @return {Object}                     Self reference (liquid interface)
 */
tw_gat.setCustomVariables = function() {
    if (this._accountId) {
        for (var i = 0; i < this._customVariables.length; ++i) {
            if (this._customVariables[i] === null) {
                if (this._activeCustomVariables[i]) {
                    if (this._debug && console) {
                        console.log('Google Analytics', '_deleteCustomVar', i + 1);
                    }
                    if (this._debug < 2) {
                        this._activeCustomVariables[i] = false;
                        _gaq.push(['_deleteCustomVar', i + 1]);
                    }
                }
            } else {
                if (this._debug && console) {
                    console.log('Google Analytics', '_setCustomVar', this._customVariables[i][0], this._customVariables[i][1], this._customVariables[i][2], this._customVariables[i][3]);
                }
                if (this._debug < 2) {
                    this._activeCustomVariables[i] = true;
                    _gaq.push(['_setCustomVar', this._customVariables[i][0], this._customVariables[i][1], this._customVariables[i][2], this._customVariables[i][3]]);
                }
            }
        }
    }
    return this;
}

/**
 * Setting the Google Analytics account ID
 * 
 * @param {String} accountId            Google Analytics account ID
 * @return {Object}                     Self reference (liquid interface)
 */
tw_gat.setAccount = function(accountId) {
    this._accountId         = this.trim(accountId);
    if (this._debug && console) {
        console.log('Google Analytics', '_setAccount', this._accountId);
    }
    if (this._accountId && (this._debug < 2)) {
    	if (document.cookie.indexOf('ga-disable-' + this._accountId + '=true') > -1) {
    		if (this._debug && console) {
		        console.log('Google Analytics', 'optOut', true);
		    }
			window['ga-disable-' + this._accountId] = true;
		}
        _gaq.push(['_setAccount', this._accountId]);
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
    if (this._accountId) {
        domainName              = this.trim(domainName);
        if (domainName.length && (domainName != this._domainName)) {
            this._domainName    = domainName;
            if (this._debug && console) {
                console.log('Google Analytics', '_setDomainName', this._domainName);
            }
            if (this._debug < 2) {
                _gaq.push(['_setDomainName', this._domainName]);
            }
        }
    }
    return this;
}

/**
 * Adding a list of keywords treated as direct traffic
 * 
 * @param {Array} keywords              Keywords
 * @return {Object}                     Self reference (liquid interface)
 */
tw_gat.addDirectKeywords = function(keywords) {
    if (this._accountId && this.isArray(keywords) && keywords.length) {
        for (var k = 0, kl = keywords.length, kw; k < kl; ++k) {
            kw                  = this.trim(keywords[k]);
            if (kw.length) {
                if (this._debug && console) {
                    console.log('Google Analytics', '_addIgnoredOrganic', kw);
                }
                if (this._debug < 2) {
                    _gaq.push(['_addIgnoredOrganic', kw]);
                }
            }
        }
    }
    return this;
}

/**
 * Adding a list of referrers treated as direct traffic
 * 
 * @param {Array} referrers             Referrers
 * @return {Object}                     Self reference (liquid interface)
 */
tw_gat.addDirectReferrers = function(referrers) {
    if (this._accountId && this.isArray(referrers) && referrers.length) {
        for (var r = 0, rl = referrers.length, rf; r < rl; ++r) {
            rf                  = this.trim(referrers[r]);
            if (rf.length) {
                if (this._debug && console) {
                    console.log('Google Analytics', '_addIgnoredRef', rf);
                }
                if (this._debug < 2) {
                    _gaq.push(['_addIgnoredRef', rf]);
                }
            }
        }
    }
    return this;
}

/**
 * Adding a list of search engine definitions
 * 
 * @param {Array} searchengines         Search engine definitions
 * @return {Object}                     Self reference (liquid interface)
 */
tw_gat.addSearchEngines = function(searchengines) {
    if (this._accountId && this.isArray(searchengines) && searchengines.length) {
        for (var s = 0, sl = searchengines.length, se; s < sl; ++s) {
            se                          = searchengines[s];
            if (this.isArray(se, 2) || this.isArray(se, 3)) {
                var seName              = this.trim(se[0]);
                var seKeyword           = this.trim(se[1]);
                if (seName.length && seKeyword.length) {
                    var sePrepend       = (se.length > 2) ? !!se[2] : false;
                    if (this._debug && console) {
                        console.log('Google Analytics', '_addOrganic', seName, seKeyword, sePrepend);
                    }
                    if (this._debug < 2) {
                        _gaq.push(['_addOrganic', seName, seKeyword, sePrepend]);
                    }
                }
            }
        }
    }
    return this;
}

/**
 * IP address anonymization
 * 
 * @param {Boolean} anonymizeIP         Anonymize IP address
 * @return {Object}                     Self reference (liquid interface)
 */
tw_gat.anonymizeIP = function(anonymizeIP) {
    if (!!anonymizeIP && this._accountId) {
        if (this._debug && console) {
            console.log('Google Analytics', '_gat._anonymizeIp');
        }
        if (this._debug < 2) {
            _gaq.push(['_gat._anonymizeIp']);
        }
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
    if (this._accountId && (!!clientInfo != this._clientInfo)) {
        this._clientInfo        = !!clientInfo;
        if (this._debug && console) {
            console.log('Google Analytics', '_gat._setClientInfo', this._clientInfo);
        }
        if (this._debug < 2) {
            _gaq.push(['_gat._setClientInfo', this._clientInfo]);
        }
    }
    return this;
}

/**
 * Track flash version
 * 
 * @param {Boolean} flashVersion        Track flash version
 * @return {Object}                     Self reference (liquid interface)
 */
tw_gat.trackFlashVersion = function(flashVersion) {
    if (this._accountId && (!!flashVersion != this._flashVersion)) {
        this._flashVersion      = !!flashVersion;
        if (this._debug && console) {
            console.log('Google Analytics', '_gat._setDetectFlash', this._flashVersion);
        }
        if (this._debug < 2) {
            _gaq.push(['_gat._setDetectFlash', this._flashVersion]);
        }
    }
    return this;
}

/**
 * Track page title
 * 
 * @param {Boolean} pageTitle           Track page title
 * @return {Object}                     Self reference (liquid interface)
 */
tw_gat.trackPageTitle = function(pageTitle) {
    if (this._accountId && (!!pageTitle != this._pageTitle)) {
        this._pageTitle         = !!pageTitle;
        if (this._debug && console) {
            console.log('Google Analytics', '_gat._setDetectTitle', this._pageTitle);
        }
        if (this._debug < 2) {
            _gaq.push(['_gat._setDetectTitle', this._pageTitle]);
        }
    }
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
            if (this._debug && console) {
                console.log('Google Analytics', '_setAllowLinker', this._linker);
            }
            if (this._debug < 2) {
                _gaq.push(['_setAllowLinker', this._linker]);
            }
            
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
    if (this._accountId && url.length) {
        if (this._debug && console) {
            console.log('Google Analytics', '_link', url);
        }
        if (this._debug < 2) {
            _gaq.push(['_link', url]);
        }
    }
    return this;
}

/**
 * Crossdomain linking to an URL by POST
 * 
 * @param {Element} form                Form element
 * @return {Object}                     Self reference (liquid interface)
 */
tw_gat.linkByPost = function(form) {
    if (this._accountId && form) {
        if (this._debug && console) {
            console.log('Google Analytics', '_linkByPost', form);
        }
        if (this._debug < 2) {
            _gaq.push(['_linkByPost', form]);
        }
    }
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
    if (this._accountId) {
        pageUrl                 = (arguments.length ? this.trim(pageUrl) : this._lastPageUrl) || '';
        if (this._debug && console) {
            console[(this._futureCustomVariables && console.group) ? 'group' : 'log']('Google Analytics', '_trackPageview', pageUrl);
        }
        this.setCustomVariables();
        if (this._debug < 2) {
            _gaq.push(pageUrl.length ? ['_trackPageview', pageUrl] : ['_trackPageview']);
        }
        if (this._debug && console && console.group && this._futureCustomVariables) {
            console.groupEnd();
        }
        this._lastPageUrl       = pageUrl;
    }
    return this;
}

/**
 * Tracking an event
 * 
 * For a detailed explanation of the available arguments please
 * @see https://developers.google.com/analytics/devguides/collection/gajs/eventTrackerGuide
 * 
 * @param {String} category             Event category
 * @param {String} action               Event action
 * @param {String} label                Optional: Event label
 * @param {Number} value                Optional: Event value
 * @param {Boolean} nonInteraction      Optional: Don't consider as interaction for bounce rate calculation
 * @return {Object}                     Self reference (liquid interface)
 */
tw_gat.trackEvent = function(category, action, label, value, nonInteraction) {
    if (this._accountId) {
        category                        = (category ? this.trim(category) : '') || '';
        action                          = (action ? this.trim(action) : '') || '';
        if (category.length && action.length) {
            var evt                     = ['_trackEvent', category, action];
            if (arguments.length > 2) {
                evt.push((label ? this.trim(label) : '') || '');
                if (arguments.length > 3) {
                    value               = parseInt(value);
                    evt.push(isNaN(value) ? 0 : value);
                    if (arguments.length > 4) {
                        evt.push(!!nonInteraction);
                    }
                }
            }
            if (this._debug && console) {
                var evtlog              = evt.slice(0);
                evtlog.unshift('Google Analytics');
                var cfunc               = (this._futureCustomVariables && console.group) ? 'group' : 'log';
                
                // IE console problems ...
                // console[cfunc].apply(console, evtlog);
                switch (evtlog.length) {
                	case 3: console[cfunc](evtlog[0], evtlog[1], evtlog[2]); break;
                    case 4: console[cfunc](evtlog[0], evtlog[1], evtlog[2], evtlog[3]); break;
                    case 5: console[cfunc](evtlog[0], evtlog[1], evtlog[2], evtlog[3], evtlog[4]); break;
                    default: console[cfunc](evtlog[0], evtlog[1], evtlog[2], evtlog[3], evtlog[4], evtlog[5]); break;
                }
                
            }
            this.setCustomVariables();
            if (this._debug < 2) {
                _gaq.push(evt);
            }
            if (this._debug && console && console.group && this._futureCustomVariables) {
                console.groupEnd();
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
 * @param {String} pagePath             Optional page path (document location if omitted)
 * @return {Object}                     Self reference (liquid interface)
 */
tw_gat.trackSocial = function(network, action, target, pagePath) {
    if (this._accountId) {
        network                         = (network ? this.trim(network) : '') || '';
        action                          = (action ? this.trim(action) : '') || '';
        if (network.length && action.length) {
            var evt                     = ['_trackSocial', network, action];
            if (arguments.length > 2) {
                evt.push((target ? this.trim(target) : '') || '');
                if (arguments.length > 3) {
                    evt.push((pagePath ? this.trim(pagePath) : '') || '');
                }
            }
            if (this._debug && console) {
                var evtlog              = evt.slice(0);
                evtlog.unshift('Google Analytics');
                var cfunc               = (this._futureCustomVariables && console.group) ? 'group' : 'log';
                
                // IE console problems ...
                // console[cfunc].apply(console, evtlog);
                switch (evtlog.length) {
                    case 3: console[cfunc](evtlog[0], evtlog[1], evtlog[2], evtlog[3]); break;
                    case 4: console[cfunc](evtlog[0], evtlog[1], evtlog[2], evtlog[3], evtlog[4]); break;
                    default: console[cfunc](evtlog[0], evtlog[1], evtlog[2], evtlog[3], evtlog[4], evtlog[5]); break;
                }
                
            }
            this.setCustomVariables();
            if (this._debug < 2) {
                _gaq.push(evt);
            }
            if (this._debug && console && console.group && this._futureCustomVariables) {
                console.groupEnd();
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
        console.log('Google Analytics', 'optOut', out);
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