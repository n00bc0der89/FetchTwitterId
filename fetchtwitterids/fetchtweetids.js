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
	
		fs.readFile('ip/testfile', 'utf8', function (err,data) {
			  if (err) {
			    	return console.log(err);
			  }
			  places = data.split("\n");
			 // console.log(data);
			  	getResult(0);
		}); 
	//places = ["Asda Barking Superstore"];
	//getResult(0);


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
						
						if(obj.length > 0)
						{
							var twitterobj = {twitterid:[],twittername:[],twitterhandle:[],location:[],description:[]};
							var compl_string = "";
							var twitter_id ="";
							var twitter_name= "";
							var twitter_handle = "";
							var location="";
							var description = "";
							
						
						 twitterobj = populateObj(twitterobj,obj,places[n]);
						
						//Logic to print to file
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
							getResult(n + 1);
						}
						else
						{
							//Complete string does not returns any twitter account. So substring and search again.
							
							var lastIndex = places[n].lastIndexOf(" ");
							var plac = places[n].substring(0,lastIndex);
							if(plac != "")
							{
								places[n] = plac;
								getResult(n);
							}
							else{
								compl_string = "" + "," +  places[n]+ "," + "" + "," + "" + "," + "";
							fs.appendFile("op/twitterids.csv", compl_string, function(err) {
							    if(err) {
							        return console.log(err);
							    }
						
							});
							getResult(n + 1);	
							}
							
							
						}
						
						
						}
						catch(v){console.log("Exception: " + v);}
					
					});
				
			}
	
	}
	
	
	function populateObj(twitterobj,obj,place) //obj is array of objects matching business names
	{
		//Preference for location matching UK, London if no result found then take all
		//Second Preference with name / screen name match
		var pl = place.split(' '); 
		
		var objbyLoc = obj.filter(function(n)
						{
							if((n.location.includes("London") || n.location.includes("UK")) && ((n.name.toLowerCase().search(place.toLowerCase()) > -1 || n.screen_name.toLowerCase().search(place.replace(/\s/g,'').toLowerCase()) > -1)))
							{
								return n;
								
							}});
		
		if(objbyLoc.length > 0)
		{
			for(var m =0; m < objbyLoc.length; m++)
			{
				twitterobj.twitterid.push(objbyLoc[m].id);
				twitterobj.twittername.push(objbyLoc[m].name);
				twitterobj.twitterhandle.push(objbyLoc[m].screen_name);
				twitterobj.location.push(objbyLoc[m].location);
				twitterobj.description.push(objbyLoc[m].description.replace(/,/g,''));
			}
		}
		else
		{
		
				//Check Name /Screen Name 
				var objbyLoc = obj.filter(function(n)
						{
							if(((n.name.toLowerCase().search(place.toLowerCase()) > -1 || n.screen_name.toLowerCase().search(place.replace(/\s/g,'').toLowerCase()) > -1)))
							{
								return n;
								
							}});
			
				if(objbyLoc.length > 0)
				{
					for(var m =0; m < objbyLoc.length; m++)
					{
						twitterobj.twitterid.push(objbyLoc[m].id);
						twitterobj.twittername.push(objbyLoc[m].name);
						twitterobj.twitterhandle.push(objbyLoc[m].screen_name);
						twitterobj.location.push(objbyLoc[m].location);
						twitterobj.description.push(objbyLoc[m].description.replace(/,/g,''));
					}
				}
			
			
			
		}
	
	if(objbyLoc.length == 0)
	{
		var objbyLocSplit = [];
		for(var o= 0; o < pl.length; o++)
			{
			 objbyLocSplit = obj.filter(function(n){
								if((n.location.includes("London") || n.location.includes("UK")) && ((n.name.toLowerCase().search(pl[o].toLowerCase()) > -1 || n.screen_name.toLowerCase().search(pl[o].replace(/\s/g,'').toLowerCase()) > -1)))
								{
									return n;
									
								}});
								
			if(objbyLocSplit.length > 0)
			{
				for(var m =0; m < objbyLocSplit.length; m++)
					{
						twitterobj.twitterid.push(objbyLocSplit[m].id);
						twitterobj.twittername.push(objbyLocSplit[m].name);
						twitterobj.twitterhandle.push(objbyLocSplit[m].screen_name);
						twitterobj.location.push(objbyLocSplit[m].location);
						twitterobj.description.push(objbyLocSplit[m].description.replace(/,/g,''));
					}
					break;
			}
			}
	}
		
		return twitterobj;
	}
