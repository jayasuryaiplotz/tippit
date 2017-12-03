var FileSystem = require("FuseJS/FileSystem");
var userDataPath = FileSystem.dataDirectory + "/preferences.json";

/**
* read
* @param key, key to read, null will read and return all properties
* @param byDefault, expected result if key doesn't exist
*/
function read(key,byDefault){
  //Check if file for properties exists
  if(FileSystem.existsSync(userDataPath))
	{
    //File exists, read his value
    var dataAsText = FileSystem.readTextFromFileSync(userDataPath);
    var data = JSON.parse(dataAsText);
    if(key!=null){
      data=data[key]?data[key]:byDefault
    }
		return data;
  }else{
    //File for properties doesn't exist
    return byDefault;
  }
}

/**
* write
* @param key, key to write to
* @param value, value to write
*/
function write(key,value){
  var preferences=read(null,{});
  preferences[key]=value;
  FileSystem.writeTextToFileSync(userDataPath, JSON.stringify(preferences));
}

module.exports = {
	write: write,
  read:read
};