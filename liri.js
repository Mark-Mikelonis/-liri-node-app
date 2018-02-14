var keys = require("./keys.js");
var request = require("request");
var Spotify = require("node-spotify-api");
var Twitter = require("twitter");
var fs = require("fs");

var client = new Twitter(keys.twitter);
var spotify = new Spotify(keys.spotify);
var queryString="";
var command = process.argv[2];
var argsArr = [];
for(var i=3;i<process.argv.length; i++){
	argsArr.push(process.argv[i])
}

switch (command){
	case "my-tweets":
		tweets();
		break;
	case "spotify-this-song":
		getSpotifyTrack(argsArr);
		break;
	case "movie-this":
		getMovie(argsArr);
		break;
	case "do-what-it-says":
		doIt();
		break;	
	default:
		break;			
}

function tweets(){
	var params = {screen_name: 'sggrc'};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
  if (!error) {
   for(var i=0;i<20;i++){
   		console.log("=================================");
    	console.log("\nCreated at: " + tweets[i].created_at +"\nTweet: " + tweets[i].text);
    	console.log("");
    }
  }
});
}

function getSpotifyTrack(arr){
	if(!queryString){
		if (process.argv.length === 3) {
		queryString = "The Sign";
		} else {
			for(var i=0;i<arr.length;i++){
				if (i === arr.length -1){
					queryString += arr[i]; 
				} else {
					queryString += arr[i] + "+"; 
				}
			}
		}
	} 
	

	
	console.log(queryString);
	spotify.search({type: "track", query: queryString})
		.then(function(response){
		console.log("==================================");
		console.log("Artist: " + response.tracks.items[0].artists[0].name);
		console.log("Track name: " + response.tracks.items[0].name);
		console.log("Spotify Link: " + response.tracks.items[0].artists[0].href);
		console.log("Album name: " + response.tracks.items[0].album.name);
		console.log("==================================");
	}).catch(function(err){
		console.log(err);
	});	

}

function getMovie(arr){
	if(!queryString){
		if (process.argv.length === 3) {
			queryString = "Mr. Nobody";
		} else {
			for(var i=0;i<arr.length;i++){
				if (i === (arr.length -1)){
					queryString += arr[i]; 
				} else {
					queryString += arr[i] + "+"; 
				}
			}
		}
	}	
	console.log("queryString: "+queryString);
	request("http://www.omdbapi.com/?t="+queryString+"&y=&plot=short&apikey=40e9cece", function(error, response, body) {

    // If the request is successful (i.e. if the response status code is 200)
    if (!error && response.statusCode === 200) {
    	console.log("queryString: "+queryString);
        // Parse the body of the site and recover just the imdbRating
        // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
        // console.log("The movie's rating is: " + body); //JSON.parse(body));//.imdbRating);
        console.log("==================================");
        console.log("Movie Title: " + JSON.parse(body).Title);
        console.log("Year: " + JSON.parse(body).Year);
        console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
        console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
        console.log("Language: " + JSON.parse(body).Language);
        console.log("Plot: " + JSON.parse(body).Plot);
        console.log("Actors: " + JSON.parse(body).Actors);
        console.log("==================================");
    }
});
}

function doIt(){
	fs.readFile("random.txt", "utf8", function(err, data){
		if(err){
			console.log(err);
		}
		// console.log(data);
		data = data.trim();
		var instructions = data.split(",");
		command = instructions[0];
		queryString = instructions[1];
		// console.log(command);
		switch (command){
	case "my-tweets":
		tweets();
		break;
	case "spotify-this-song":
		getSpotifyTrack();
		break;
	case "movie-this":
		getMovie();
		break;
	default:
		break;			
	}
	});
	
}

