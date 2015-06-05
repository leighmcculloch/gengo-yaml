JSON.flatten = function(data) {
  var result = {};
  function flatten(json, flattened, str_key) {
    for (var key in json) {
      if (json.hasOwnProperty(key)) {
        if (json[key] instanceof Object && json[key] != "") {
          flatten(json[key], flattened, str_key + "." + key);
        } else {
          flattened[str_key + "." + key] = json[key];
        }
      }
    }
  };
  flatten(data, result, "");
  return result;
}
