var Observable = require("FuseJS/Observable");
var Bundle = require("FuseJS/Bundle");
//var DeviceLocale = require("DeviceLocale");
loc = Observable();

var Locales = {
	"default": "en-US.json",
	"en_US": "en-US.json",
	"th_TH": "th-TH.json",
	"fr_FR": "fr-FR.json"
};

function setLocale(locale) {
	// if (locale in Locales) f = Locales[locale];
	// else f = Locales["default"];
	// loc.value = JSON.parse(Bundle.readSync(f));
	loc.value = JSON.parse(Bundle.readSync("Locales/en-US.json"));
}

//setLocale(DeviceLocale.locale);
setLocale("default");

module.exports = { loc, setLocale };