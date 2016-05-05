(function () {
  'use strict';

  var pvt = {
    regexes: {
      keyName: /^\[{3}\.([^\[\]]+?)\]{3}$/
      , varsHtml: /\[{3}(.+?)\]{3}/ig
      , findInterpolatedVars: /(%\{[a-z0-9_]+\})/ig
      , findSelfClosingHTML: /<([A-Z][A-Z0-9]*)(\b[^>]*)\/>/ig
      , findHTMLContainers: /<([A-Z][A-Z0-9]*)(\b[^>]*)>(.*?)<\/\1>/ig
    }
    , objectReference: function(obj ,is , value) {
      if (typeof is === 'string') {
        return this.objectReference(obj,is.split('.'), value);
      }
      else if (is.length === 1 && value !== undefined) {
        return obj[is[0]] = value;
      }
      else if (is.length === 0) {
        return obj;
      }
      else {
        if(typeof obj[is[0]] === 'undefined') {
          obj[is[0]] = {};
        }
        return this.objectReference(obj[is[0]],is.slice(1), value);
      }
    }
    , flatten: function(data) {
      var result = {};
      function flatten(json, flattened, str_key) {
        for (var key in json) {
          if (json.hasOwnProperty(key)) {
            if (json[key] instanceof Object && json[key] !== '') {
              flatten(json[key], flattened, str_key + '.' + key);
            } else {
              flattened[str_key + '.' + key] = json[key];
            }
          }
        }
      }
      flatten(data, result, '');
      return result;
    }
  }
  , Gengo = {
    parse: function (raw) {
      var lines = raw.split('\n')
      , currentKey = null
      , tempObj = []
      , rtnObj = {}
      , i, match;

      for(i = 0; i < lines.length; i++) {
        if (lines[i] !== '') {
          if (match = lines[i].match(pvt.regexes.keyName)) {
            // This line is a new key
            // write out the string and capture the new
            if (tempObj.length > 0) {
              pvt.objectReference(rtnObj, currentKey, tempObj.join('\n'));
              tempObj = [];
            }
            currentKey = match[1];
          } else {
            // ok, lets find the interpolation variables and html
            lines[i] = lines[i].replace(pvt.regexes.varsHtml, '$1');

            tempObj.push(lines[i]);
          }
        }
        if (i+1 === lines.length) {
          pvt.objectReference(rtnObj, currentKey, tempObj.join('\n'));
        }
      }

      return rtnObj;
    }
    , stringify: function (parsed) {
      var yaml_flat, gengo, key, value;
      if (typeof parsed !== 'object') {
        throw new TypeError('Stringify requires a native object');
      }

      yaml_flat = pvt.flatten(parsed);
      gengo = [];

      for (key in yaml_flat) {
        if (yaml_flat.hasOwnProperty(key)) {
          value = yaml_flat[key];

          if (value === null) {
            value = '';
          }

          value = value.replace(pvt.regexes.findInterpolatedVars, '[[[$1]]]');
          value = value.replace(pvt.regexes.findSelfClosingHTML, '[[[<$1$2/>]]]');
          value = value.replace(pvt.regexes.findHTMLContainers, '[[[<$1$2>]]]$3[[[</$1>]]]');

          gengo.push('[[[' + key + ']]]', value);
        }
      }

      return gengo.join('\n');
    }
  };


  window.Gengo = Gengo;
})();
