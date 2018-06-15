import React from 'react';
import Tweet from './Tweet';


export default function TweetsList(props) {
    const tweets = props.tweets;
    const listItems = tweets.map((tweet) =>
        // Wrong! The key should have been specified here:
        <Tweet value={tweet} key={tweet.id_str} />
    );
    return (
        <div className="listTweets">
            {listItems}
        </div>
    );
  }