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
						
						var twitterobj = {twitterid:[],twittername:[],twitterhandle:[],location:[],description:[]};
						var compl_string = "";
						var twitter_id ="";
						var twitter_name= "";
						var twitter_handle = "";
						var location="";
						var description = "";
							
						
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
								//	var str = obj[i].id + "," + obj[i].name + "," + obj[i].screen_name + "," + obj[i].location + "," + obj[i].description.replace(/,/g,'') + "\n";
									twitterobj.twitterid.push(obj[i].id);
									twitterobj.twittername.push(obj[i].name);
									twitterobj.twitterhandle.push(obj[i].screen_name);
									twitterobj.location.push(obj[i].location);
									twitterobj.description.push(obj[i].description.replace(/,/g,''));
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
								
								//	var str = obj[i].id + "," + obj[i].name + "," + obj[i].screen_name + "," + obj[i].location + "," + obj[i].description.replace(/,/g,'')  + "\n";
									twitterobj.twitterid.push(obj[i].id);
									twitterobj.twittername.push(obj[i].name);
									twitterobj.twitterhandle.push(obj[i].screen_name);
									twitterobj.location.push(obj[i].location);
									twitterobj.description.push(obj[i].description.replace(/,/g,''));
								
								}
								
							}
						
						
						}
						
							if(twitterobj.twitterid.length == 0) // No result found for search
							{
								twitter_name = places[n];
							}
							else
							{
								for(var t=0; t < twitterobj.twitterid.length; t++){
									
									twitter_id += twitterobj.twitterid[t] + "|";
									twitter_name += twitterobj.twittername[t] + "|";
									twitter_handle += twitterobj.twitterhandle[t] + "|";
									location += twitterobj.location[t] + "|";
									description += twitterobj.description[t] + "|";
								}
								
							twitter_id = twitter_id.substring(0, twitter_id.length - 1);
							twitter_name = twitter_name.substring(0, twitter_name.length - 1);
							twitter_handle = twitter_handle.substring(0, twitter_handle.length - 1); 
							location  = location.substring(0, location.length - 1);
							description = description.substring(0, description.length - 1);
							
							}
							
							compl_string =  twitter_id + "," + twitter_name + "," + twitter_handle + "," + location + "\n" ;
							
							console.log(compl_string);
							
							
								//	console.log(obj[i].id + "," + obj[i].name + "," + obj[i].screen_name + "," + obj[i].location + "," + obj[i].description.replace(/,/g,'') );
						//Write into file for single finding or multiple findings
						fs.appendFile("op/twitterids.csv", compl_string, function(err) {
							    if(err) {
							        return console.log(err);
							    }
						
							}); 
							
						
						
						
						
						}
						catch(v){console.log("Exception: " + v);}
					getResult(n + 1);
					});
				
			}
	
	}
	
