function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	var totalTweets = tweet_array.length;
	var totalCompletedEvents = tweet_array.filter(tweet => tweet.source === "completed_event").length;
	var totalLiveEvents = tweet_array.filter(tweet => tweet.source === "live_event").length;
	var totalAchievements = tweet_array.filter(tweet => tweet.source === "achievement").length;
	var totalMiscellaneous = tweet_array.filter(tweet => tweet.source === "miscellaneous").length;
	var totalCustomTweets = tweet_array.filter(tweet => tweet.written).length;

	document.getElementById("numberTweets").innerText = totalTweets;

	document.getElementById("firstDate").innerText = tweet_array[tweet_array.length - 1].time.toLocaleDateString(undefined, {year: 'numeric', month: 'long', day: 'numeric'});
	document.getElementById("lastDate").innerText = tweet_array[0].time.toLocaleDateString(undefined, {year: 'numeric', month: 'long', day: 'numeric'});

	document.getElementsByClassName("completedEvents")[0].innerText = totalCompletedEvents;
	document.getElementsByClassName("completedEventsPct")[0].innerText = (100 * totalCompletedEvents / totalTweets).toFixed(2) + "%";
	
	document.getElementsByClassName("liveEvents")[0].innerText = totalLiveEvents;
	document.getElementsByClassName("liveEventsPct")[0].innerText = (100 * totalLiveEvents / totalTweets).toFixed(2) + "%";
	
	document.getElementsByClassName("achievements")[0].innerText = totalAchievements;
	document.getElementsByClassName("achievementsPct")[0].innerText = (100 * totalAchievements / totalTweets).toFixed(2) + "%";
	
	document.getElementsByClassName("miscellaneous")[0].innerText = totalMiscellaneous;
	document.getElementsByClassName("miscellaneousPct")[0].innerText = (100 * totalMiscellaneous / totalTweets).toFixed(2) + "%";

	document.getElementsByClassName("completedEvents")[1].innerText = totalCompletedEvents;
	document.getElementsByClassName("written")[0].innerText = totalCustomTweets;
	document.getElementsByClassName("writtenPct")[0].innerText = (100 * totalCustomTweets / totalTweets).toFixed(2) + "%";
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});