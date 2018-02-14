var keys = require("./keys.js");

var command = process.argv[2];


switch (command){
	case "my-tweets":
		tweets();
		break;
	case "spotify-this-song":
		spotify();
		break;
	case "movie-this":
		movie();
		break;
	case "do-what-it-says":
		doIt();
		break;	
	default:
		break;			
}