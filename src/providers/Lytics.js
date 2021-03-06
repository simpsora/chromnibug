/**
 * Lytics
 * https://learn.lytics.com/documentation/product/features/lytics-javascript-tag/using-version-2/installation-configuration
 * https://learn.lytics.com/documentation/product/features/lytics-javascript-tag/using-version-3/installation-configuration
 * https://learn.lytics.com/documentation/product/features/lytics-javascript-tag/using-version-2/collecting-data
 * https://learn.lytics.com/documentation/product/features/lytics-javascript-tag/using-version-3/collecting-data

 *
 * @class
 * @extends BaseProvider
 */

class LyticsProvider extends BaseProvider {
    constructor() {
        super();
        this._key       = "LYTICS";
        this._pattern   = /c\.lytics.io\/c\//;
        this._name      = "Lytics";
        this._type      = "marketing";
    }

    /**
     * Retrieve the column mappings for default columns (account, event type)
     *
     * @return {{}}
     */
    get columnMapping()
    {
        return {
            "account":      "cid",
            "requestType":  "requestTypeParsed"
        };
    }

    /**
     * Retrieve the group names & order
     *
     * @returns {*[]}
     */
    get groups()
    {
        return [
            {
                "key": "general",
                "name": "General"
            },
            {
                "key": "configuration",
                "name": "Configuration"
            },
        ];
    }

    /**
     * Get all of the available URL parameter keys
     *
     * @returns {{}}
     */
    get keys()
    {
        return {
            "loadid" : {
                "name": "loadid",
                "group": "configuration"
            },
            "blockload" : {
                "name": "blockload",
                "group": "configuration"
            },
            "stream" : {
                "name": "stream",
                "group": "configuration"
            },
            "sessecs" : {
                "name": "sessecs",
                "group": "configuration"
            },
            "qsargs" : {
                "name": "qsargs",
                "group": "configuration"
            },
            "_e" : {
                "name": "Event",
                "group": "general"
            },
            "_ref" : {
                "name": "Referral Domain",
                "group": "general"
            },
            "_tz" : {
                "name": "User Time Zone",
                "group": "general"
            },
            "_ul" : {
                "name": "User Language",
                "group": "general"
            },
            "_sz" : {
                "name": "Display Size",
                "group": "general"
            },
            "_ts" : {
                "name": "Timestamp",
                "group": "general"
            },
            "_nmob" : {
                "name": "Not Mobile Device",
                "group": "general"
            },
            "_device" : {
                "name": "Current Device",
                "group": "general"
            },
            "url" : {
                "name": "URL",
                "group": "general"
            },
            "_uid" : {
                "name": "Lytics UID",
                "group": "general"
            },
            "_uido" : {
                "name": "Lytics UID",
                "group": "general"
            },
            "_v" : {
                "name": "Javascript Tag Version",
                "group": "general"
            },
        };
    }

    /**
     * Parse a given URL parameter into human-readable form
     *
     * @param {string}  name
     * @param {string}  value
     *
     * @returns {void|{}}
     
    LEFT IN AS EXAMPLE 
    handleQueryParam(name, value)
    {
        let result = {};

        if(name.indexOf("attrs.") === 0) {
            result = {
                "key":   name,
                "field": name.replace("attrs.", ""),
                "value": value,
                "group": "customattributes"
            };
        }
        else {
            result = super.handleQueryParam(name, value);
        }
        return result;
    }*/

    /**
     * Parse custom properties for a given URL
     *
     * @param    {string}   url
     * @param    {object}   params
     *
     * @returns {void|Array}
     */
    handleCustom(url, params)
    {
        let results = [];

        // Client Code
        const clientCodeRe = /\/c\/(.+)$/;
        let clientCodematches =  url.pathname.match(clientCodeRe);
        if(clientCodematches !== null) {
            results.push({
                "key":   "cid",
                "field": "Account ID",
                "value": clientCodematches[1],
                "group": "general"
            });
        }
        
        
        // Event Type (_e) or (event) value parsed to requesttype
        let eventType = params.get("_e") || params.get("event") || "Other";
        const eventDict = {
            "pv" : "Page View",
            "conversion": "Conversion"
        };
        let eventTypeValue = eventDict[eventType] ? eventDict[eventType] : eventType;
        results.push({
            "key":   "requestTypeParsed",
            "field": "Request Type",
            "value": eventTypeValue,
            "group": "general"
        });


        return results;
    } // handle custom
} // class