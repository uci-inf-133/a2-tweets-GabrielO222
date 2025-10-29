class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        //TODO: identify whether the source is a live event, an achievement, a completed event, or miscellaneous.
        if (this.text.toLowerCase().includes("live")) {
            return "live_event";
        } else if (this.text.toLowerCase().includes("achieved")) {
            return "achievement";
        } else if (this.text.toLowerCase().includes("completed") || this.text.toLowerCase().includes("posted")) {
            return "completed_event";
        }
        return "miscellaneous";
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        //TODO: identify whether the tweet is written
        return !this.text.includes('@');
    }

    get writtenText():string {
        if(!this.written) {
            return "";
        }
        //TODO: parse the written text from the tweet
        return this.text.substring(0, this.text.indexOf("http")).trim();
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        //TODO: parse the activity type from the text of the tweet
        let startIndex:number = this.text.indexOf(" mi ");
        if (startIndex == -1) {
            startIndex = this.text.indexOf(" km ");
        }
        if (startIndex == -1) {
            return "unknown";
        }
        let endIndex:number = this.text.indexOf(" - ");
        if (endIndex == -1) {
            endIndex = this.text.indexOf(" with ");
        }
        if (endIndex == -1) {
            return "unknown";
        }
        return this.text.substring(startIndex + 4, endIndex);
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        //TODO: prase the distance from the text of the tweet
        let index:number = this.text.indexOf(" a ");
        let distance:number = this.text.substring(index + 2, this.text.indexOf(".") + 3).trim() as unknown as number;
        if (this.text.includes(" km ")) {
            distance = distance / 1.60934;
        }
        return distance;
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        return "<tr></tr>";
    }
}