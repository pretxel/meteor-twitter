# Twitter Meteor

Firstly install all dependencies
```bash
npm install
```

Add access token and secret token from Twitter App
```bash
mv settings-development.template.json settings-development.json
```

Run meteor
```bash
npm start
```


## Endpoints
### /api/getTweets
Get Tweets by username, you can search by since and until 

```bash
GET /api/getTweets?q=username&since=2018-06-01&until=2018-06-10&count=50
```

The count is required
The q is required


### /api/getSummary/:username
Get Tweet with the follow sctructure:
```bash
{
 userSummary : {
 statusCount : 421,
 lists : 12,
 followers : 123,
 favorites : 34,
 reTweets_count : 45
 },
 tweets : [{
 tweet_text : “hi”,
 username : “johndoe”,
 id : “id of the tweet”,
 date : “01/01/2018”
 }, //more tweets ],
 profileData : {
 name : John Doe,
 location : New York,
 description : profile description,
 profile_image : “profile_image_url”, createdAt : “01/01/2018” }
}
```
