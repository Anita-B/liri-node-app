// fs is a core Node package for reading and writing files
var fs = require("fs");
// Load the NPM Package inquirer to access .prompt
var inquirer = require("inquirer");
// the code to grab the data from keys.js. Then store the keys in a variable.
var keys = require('./keys.js');

var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require("request"); //for making http calls, we'll use with omdb


/********** functions ******************/
function my_tweets(){

	var client = new Twitter(keys.twitterKeys);
	    	
	    	var params = {
	    					screen_name: 'Twinkle1000000',
	    					count: '20'
	    				};

			client.get('statuses/user_timeline', params, function(error, tweets, response) {

				if(error) throw error;

			  	else 
			  	{
			  		for(var i = 0; i < tweets.length; i++)
			  		{
			  			//console.log(tweets);
				    	console.log("*******************************************************"); 
				    	console.log(tweets[i].text);
				    	console.log(tweets[i].created_at);
			  		}
			    	console.log("*******************************************************"); 
			  	}

			});

}

function spotify_this_song(search){ 

	var spotify = new Spotify(keys.spotifyKey);
	var song_title;

	if (search)
	{
		var title_string = search;
		song_title = title_string.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	}
	else 
	{
		song_title = 'The Sign';
	}

	spotify.search({ type: 'track', query: song_title }, function(err, data) {
	//spotify.search({ type: 'track', query: 'The Sign', song{type: 'artist', query: 'Ace of Base'} }, function(err, data) {
		//spotify.search({ song_query }, function(err, data) {	
			if (err) {
			return console.log('Error occurred: ' + err);
			}

		//console.log(JSON.stringify(data, null, 4));

		for (var i = 0; i < data.tracks.items.length; i++){

			if(data.tracks.items[i].name === 'The Sign')
			{
				if(data.tracks.items[i].album.artists[0].name === "Ace of Base")
				{
					console.log("*******************************************************");
					console.log("Artist: ", data.tracks.items[i].album.artists[0].name);
					console.log("Song Name: ", data.tracks.items[i].name);
					console.log("A preview link of the song from Spotify: ", data.tracks.items[i].preview_url);
					console.log("The album that the song is from: ", data.tracks.items[i].album.name);
				}
			}
			
			if(data.tracks.items[i].name !== 'The Sign' && data.tracks.items[i].name === song_title)
			{ 
				console.log("*******************************************************");
				console.log("Artist: ", data.tracks.items[i].album.artists[0].name);
				console.log("Song Name: ", data.tracks.items[i].name);
				console.log("A preview link of the song from Spotify: ", data.tracks.items[i].preview_url);
				console.log("The album that the song is from: ", data.tracks.items[i].album.name);

			}	

		}
		console.log("*******************************************************"); 
		
	});
}

function movie_this(search){
	if (search)
	{
		var queryURL = 'http://www.omdbapi.com/?t=' + search + '&apiKey=40e9cece';
		//console.log("here", inquirerResponse.search);
	}
	else 
	{
		var queryURL = 'http://www.omdbapi.com/?t=mr+nobody&apiKey=40e9cece';
		
	}	

	request (queryURL, function(error, response, data) {

		// If the request is successful, 200 code is normal
		if(!error && response.statusCode === 200){

			//console.log(data);
			//console.log(response);


			// When receiving data from a web server, the data is always a string.
			// Parse the data with JSON.parse(), and the data becomes a JavaScript object.
			console.log("*******************************************************"); 
			console.log("Title: ", JSON.parse(data).Title);
			console.log("Year: ", JSON.parse(data).Year);
			console.log("imdb Rating: ", JSON.parse(data).imdbRating);
			console.log("Rotten Tomatoes Rating: ", JSON.parse(data).Ratings[1].Value);
			console.log("Country where movie was produced: ", JSON.parse(data).Country);
			console.log("Language: ", JSON.parse(data).Language);
			console.log("Plot: ", JSON.parse(data).Plot);
			console.log("Actors: ", JSON.parse(data).Actors);
			console.log("*******************************************************"); 

			var save_to_log = [];
			save_to_log.push("*******************************************************");
			save_to_log.push("Title: ", JSON.parse(data).Title);
			save_to_log.push("Year: ", JSON.parse(data).Year);
			save_to_log.push("imdb Rating: ", JSON.parse(data).imdbRating);
			save_to_log.push("Rotten Tomatoes Rating: ", JSON.parse(data).Ratings[1].Value);
			save_to_log.push("Country where movie was produced: ", JSON.parse(data).Country);
			save_to_log.push("Language: ", JSON.parse(data).Language);
			save_to_log.push("Plot: ", JSON.parse(data).Plot);
			save_to_log.push("Actors: ", JSON.parse(data).Actors);
			save_to_log.push("*******************************************************");
			var log = save_to_log.toString();

			fs.appendFile("log.txt", log, function(err) {

				// If an error was experienced we say it.
				if (err) {
					console.log(err);
				}

				// If no error is experienced, we'll log the phrase "Content Added" to our node console.
				else {
					console.log("okay");
				}

			});
		}	

	});

	
}


inquirer.prompt([
{
	type: "list",
	message: "Choose the command you'd like to run!",
	choices: ["my-tweets", "spotify-this-song", "movie-this", "do-what-it-says"],
	name: "command"
},
{
	type: "input",
	message: "If looking for a song or movie title, enter it here. Otherwise, hit enter!",
	name: "search"
}
])
.then(function(inquirerResponse) {

	switch(inquirerResponse.command) {
	    case "my-tweets": 
	    	// show your last 20 tweets and when they were created in your terminal/bash window
	    	my_tweets();
	    	break;

	    case "spotify-this-song":

	    	spotify_this_song(inquirerResponse.search);
	    	break;

	    case "movie-this":

	    	movie_this(inquirerResponse.search);
	    	break;

	    case "do-what-it-says":

	    	fs.readFile("random.txt", "utf8", function(error, data) {

    			if (error)
    			{
    				return console.log(error);
    			}
    			else
    			{
    				var split_file = data.split(",");
    				var command = split_file[0];
    				var search_quotes = split_file[1];
    				//remove quotes from the string
    				var search = search_quotes.replace(/['"]+/g, '');


    				//console.log("command: ", command);

    				switch(command) {
					    case "my-tweets": 
					    	my_tweets();
					    	break;

					    case "spotify-this-song":
					    	spotify_this_song(search);
					    	break;

					    case "movie-this":
					    	movie_this(search);
					    	break;
					    default:
					}	

    			}

	    	});

	    	break;	

	    default:
	      	// error message
	}


});




