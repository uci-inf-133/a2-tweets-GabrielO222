function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	//TODO: Filter to just the written tweets
	written_tweet_array = tweet_array.filter(tweet => tweet.written);

	document.getElementById("searchCount").innerText = 0;
	document.getElementById("searchText").innerText = '';
}

function addEventHandlerForSearch() {
	//TODO: Search the written tweets as text is entered into the search box, and add them to the table
	document.getElementById("textFilter").addEventListener("input", () => {
		let searchText = document.getElementById("textFilter").value.toLowerCase();
		let filtered_tweets = written_tweet_array.filter(tweet => tweet.text.toLowerCase().includes(searchText));
		document.getElementById("searchCount").innerText = filtered_tweets.length;
		document.getElementById("searchText").innerText = searchText;
		if (searchText !== '') {
			document.getElementById("tweetTable").innerHTML = filtered_tweets.map((tweet, i) => {
				return tweet.getHTMLTableRow(i + 1);
			}).join("");
		} else {
			document.getElementById("tweetTable").innerHTML = "";
			document.getElementById("searchCount").innerText = 0;
		}
	})
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});