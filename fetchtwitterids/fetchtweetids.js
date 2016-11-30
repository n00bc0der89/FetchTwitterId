const Twitter 	= require('twitter');
const config = require('./config');
const constants = config.constants;
var fs = require('fs');

const client = new Twitter({
	consumer_key: constants.twitter_consumer_key,
	consumer_secret: constants.twitter_consumer_secret,
	access_token_key: constants.twitter_access_token_key,
	access_token_secret: constants.twitter_access_token_secret		
});


	var places = [];
	
		fs.readFile('ip/businesslist', 'utf8', function (err,data) {
			  if (err) {
			    	return console.log(err);
			  }
			  places = data.split("\n");
			 // console.log(data);
			  	getResult(0);
		});
	

	function getResult(n)
	{
			if(n < places.length)
			{
				client.get('users/search', {q:places[n]} ,function(error, tweets, response) {
			
						if(error){
							console.log(error);
						}
						
						try{
						var obj = JSON.parse(response.body);
						
						for(var i=0; i < obj.length; i++)
						{
						if((obj[i].location.includes("UK") || obj[i].location.includes("London") ))
							{
							//	var o = JSON.parse(obj[i]);
							//	console.log(obj[i]);
							var arr = places[n].split(' ');
							if(arr.length == 1)
							{
								if(obj[i].name.search(places[n].replace(/\s/g,'')) > -1)
								{
									var str = obj[i].id + "," + obj[i].name + "," + obj[i].screen_name + "," + obj[i].location + "," + obj[i].description.replace(/,/g,'') + "\n";
									
									fs.appendFile("op/twitterids.csv", str, function(err) {
										    if(err) {
										        return console.log(err);
										    }
									
										}); 
									console.log(obj[i].id + "," + obj[i].name + "," + obj[i].screen_name + "," + obj[i].location + "," + obj[i].description.replace(/,/g,'') );
								}
							}
							else
							{
								var flag =false;
								
								for(var m =0; m < arr.length; m++)
								{
									try{
										if(obj[i].name.search(arr[m]) > -1)
										{
											flag =true;
											break;
										}
									}catch(ex){console.log("Exception: " + ex);}
								
								}
									
								}
								
								if(flag)
								{
								
									var str = obj[i].id + "," + obj[i].name + "," + obj[i].screen_name + "," + obj[i].location + "," + obj[i].description.replace(/,/g,'')  + "\n";
									
									fs.appendFile("op/twitterids.csv", str, function(err) {
										    if(err) {
										        return console.log(err);
										    }
									
										}); 
									console.log(obj[i].id + "," + obj[i].name + "," + obj[i].screen_name + "," + obj[i].location + "," + obj[i].description.replace(/,/g,'') );
								
								}
								
								
							}
							
						}
						}
						catch(v){console.log("Exception: " + v);}
					getResult(n + 1);
					});
				
			}
	
	}
	
