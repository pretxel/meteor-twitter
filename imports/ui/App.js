import React, { Component } from 'react';
import { Router } from 'meteor/iron:router';
import TweetsList from './TweetsList';
import axios from 'axios';
import querystring from 'querystring';


Router.configure({
 noRoutesTemplate: 'noRoutesTemplate',
});


export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = { text: '', tweets: [], nextPag: '' };
    this.handlerSearch = this.handlerSearch.bind(this);
    this.updateText = this.updateText.bind(this);
    this.handlerMore = this.handlerMore.bind(this);
  }


  //Handler Search button
  handlerSearch(event) {
    event.preventDefault();

    axios.get('/api/getTweets?q='+this.state.text+'&count=50').then( (response) => {
      console.log(response.data);
      const parm = querystring.parse(response.data.search_metadata.next_results.substr(1, response.data.search_metadata.next_results.length));
      this.setState({ tweets: response.data.statuses, nextPag: parm.max_id });
    }).catch((error) => {
      console.log(error);
    });


  }

  //Handler More button
  handlerMore(event) {
    event.preventDefault();

    axios.get('/api/getTweets?q='+this.state.text+'&count=100&since_id='+this.state.nextPag).then( (response) => {
      console.log(response.data);
      const parm = querystring.parse(response.data.search_metadata.next_results.substr(1, response.data.search_metadata.next_results.length));
      this.setState({ tweets: response.data.statuses, nextPag: parm.max_id  });
    })

  }

  //Update text
  updateText(event) {
    this.setState({ text: event.target.value });
  }

  render() {
    const tweets = this.state.tweets;
    return (
      <div>
        <div className="jumbotron">
          <h1 className="display-4">Twitter App</h1>

          <div className="input-group mb-3">
            <input type="text" className="form-control" value={this.state.text}
              placeholder="topic" aria-label="topic" aria-describedby="basic-addon2"
              onChange={this.updateText}
            />
            <div className="input-group-append">
              <button className="btn btn-outline-secondary" type="button" onClick={this.handlerSearch} >Search</button>
            </div>
          </div>

        </div>

        {tweets.length > 0 &&
          <div>
            <TweetsList tweets={tweets} />
            <button type="button" className="btn btn-outline-primary btn-block" onClick={this.handlerMore}>More</button>
          </div>
        }

      </div>
    );
  }
}