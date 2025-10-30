function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.
	let tweet_map = new Map();
	for (let i = 0; i < tweet_array.length; i++) {
		let tweet = tweet_array[i];
		if (!tweet_map.has(tweet.activityType)) {
			tweet_map.set(tweet.activityType, [tweet]);
		} else {
			tweet_map.get(tweet.activityType).push(tweet);
		}
	}
	
	let banned_activities = [];
	for (let [key, value] of tweet_map) {
		if (value.length <= 1 || key === "unknown") {
			banned_activities.push(key);
		}
	}

	tweet_map = new Map([...tweet_map].filter(([key, value]) => key !== "unknown" && value.length > 1));
	let top3 = [...tweet_map.entries()].sort((a, b) => b[1].length - a[1].length).slice(0, 3);

	let firstMost = top3[0][0];
	let firstArray = top3[0][1];
	let secondMost = top3[1][0];
	let secondArray = top3[1][1];
	let thirdMost = top3[2][0];
	let thirdArray = top3[2][1];

	let sum = 0;
	let maxArray = firstArray;
	let minArray = firstArray;
	let maxAverage = 0;
	let minAverage = Infinity;

	let weekendAverage = 0;
	let weekendTotal = 0;
	let weekdayAverage = 0;
	let weekdayTotal = 0;

	for (let i = 0; i < firstArray.length; i++) {
		sum += Number(firstArray[i].distance);
	}
	if (sum / firstArray.length > maxAverage) {
		maxAverage = sum / firstArray.length;
		maxArray = firstArray;
	}
	if (sum / firstArray.length < minAverage) {
		minAverage = sum / firstArray.length;
		minArray = firstArray;
	}
	sum = 0;
	for (let i = 0; i < secondArray.length; i++) {
		sum += Number(secondArray[i].distance);
	}
	if (sum / secondArray.length > maxAverage) {
		maxAverage = sum / secondArray.length;
		maxArray = secondArray;
	}
	if (sum / secondArray.length < minAverage) {
		minAverage = sum / secondArray.length;
		minArray = secondArray;
	}
	sum = 0;
	for (let i = 0; i < thirdArray.length; i++) {
		sum += Number(thirdArray[i].distance);
	}
	if (sum / thirdArray.length > maxAverage) {
		maxAverage = sum / thirdArray.length;
		maxArray = thirdArray;
	}
	if (sum / thirdArray.length < minAverage) {
		minAverage = sum / thirdArray.length;
		minArray = thirdArray;
	}

	for (let i = 0; i < tweet_array.length; i++) {
		let day = tweet_array[i].time.toString().substring(0, 3);
		let distance = Number(tweet_array[i].distance);
		if (isNaN(distance) || distance <= 0) {
			continue;
		}
		if (day === 'Sun' || day === 'Sat') {
			weekendAverage += distance;
			weekendTotal += 1;
		} else {
			weekdayAverage += distance;
			weekdayTotal += 1;
		}
	}

	weekendAverage = weekendTotal ? weekendAverage / weekendTotal : 0;
	weekdayAverage = weekdayTotal ? weekdayAverage / weekdayTotal : 0;
	
	

	document.getElementById("numberActivities").innerText = tweet_map.size;

	document.getElementById("firstMost").innerText = firstMost;
	document.getElementById("secondMost").innerText = secondMost;
	document.getElementById("thirdMost").innerText = thirdMost;

	document.getElementById("longestActivityType").innerText = maxArray[0].activityType;
	document.getElementById("shortestActivityType").innerText = minArray[0].activityType;

	document.getElementById("weekdayOrWeekendLonger").innerText = (weekendAverage > weekdayAverage) ? "weekends" : "weekdays";
	
	let filtered_tweet_array = [];
	for (let i = 0; i < tweet_array.length; i++) {
		let tweet = tweet_array[i];
		if (!banned_activities.includes(tweet.activityType)) {
			filtered_tweet_array.push(tweet);
		}
	}

	let activity_tweet_array = [];
	activity_tweet_array = filtered_tweet_array.map(tweet => {
		return {
			activityType: tweet.activityType,
			dayOfWeek: tweet.time.toString().substring(0, 3),
			distance: Number(tweet.distance)
		};
	});

	top3_data = [
		firstArray.map(tweet => {
		return {
			activityType: tweet.activityType,
			dayOfWeek: tweet.time.toString().substring(0, 3),
			distance: Number(tweet.distance)
		}
	}), 
		secondArray.map(tweet => {
		return {
			activityType: tweet.activityType,
			dayOfWeek: tweet.time.toString().substring(0, 3),
			distance: Number(tweet.distance)
		}
	}), 
		thirdArray.map(tweet => {
		return {
			activityType: tweet.activityType,
			dayOfWeek: tweet.time.toString().substring(0, 3),
			distance: Number(tweet.distance)
		}
	})
	].flat();

	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": activity_tweet_array
	  },
	  //TODO: Add mark and encoding
	  "mark": "bar",
	  "encoding": {
		"x": {"field": "activityType", "title": "Activity Type", "sort": "-y"},
		"y": {"aggregate": "count", "title": "Number of Tweets" },
		"color": { "field": "activityType", "type": "nominal", "legend": null},
	  }
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.
	
	distance_vis_spec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "A scatter plot showing the distance of activities over days of the week.",
		"data": {
			"values": top3_data
		},
		"mark": "point",
		"encoding": {
			"x": {"field": "dayOfWeek", "title": "Time (day)", "type": "ordinal", "sort": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]},
			"y": {"field": "distance", "title": "Distance", "type": "quantitative"},
			"color": {"field": "activityType", "title": "Activity Type", "type": "nominal"}
		}
	};

	mean_spec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "A plot showing the average distance of activities over days of the week.",
		"data": {
			"values": top3_data
		},
		"mark": "point",
		"encoding": {
			"x": {"field": "dayOfWeek", "title": "Time (day)", "type": "ordinal", "sort": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]},
			"y": {"field": "distance", "title": "Mean of Distance", "type": "quantitative", "aggregate": "mean"},
			"color": {"field": "activityType", "title": "Activity Type", "type": "nominal"}
		}
	};

	let showMean = false;
	vegaEmbed('#distanceVis', distance_vis_spec, {actions:false});

	document.getElementById("aggregate").addEventListener("click", () => {
		showMean = !showMean;
		showMean ? vegaEmbed('#distanceVis', mean_spec, {actions:false}) : vegaEmbed('#distanceVis', distance_vis_spec, {actions:false});
		showMean ? document.getElementById("aggregate").innerText = "Show All Activities" : document.getElementById("aggregate").innerText = "Show Means";
	});
	
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});