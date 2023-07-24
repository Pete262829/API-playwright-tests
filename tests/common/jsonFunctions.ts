// borrowed from https://stackoverflow.com/questions/9463233/how-to-access-nested-json-data

export function getProperty(json, path) {
    var tokens = path.split(".");
    var obj = json;
    for (var i = 0; i < tokens.length; i++) {
        obj = obj[tokens[i]];
    }
    return obj;
  }

  