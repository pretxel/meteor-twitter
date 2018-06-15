import { Meteor } from 'meteor/meteor';
import Twitter from 'twitter';
const T = new Twitter({
    consumer_key: Meteor.settings.private.CONSUMER_KEY,
    consumer_secret: Meteor.settings.private.CONSUMER_SECRET,
    access_token_key: Meteor.settings.private.ACCESS_TOKEN_KEY,
    access_token_secret: Meteor.settings.private.ACCESS_TOKEN_SECRET
});

export default API = {
    authentication: function (apiKey) { },
    connection: function (request) { },
    handleRequest: function (context, resource, method) {
        const connection = { owner: true, data: { } };
        API.methods[resource][method](context, connection);
    },
    methods: {
        tweet: {
            GET: async function (context, connection) {
                const hasQuery = API.utility.hasData(connection.data);
                let tweets = [];
                const query = context.request.query;
                console.log(context.request.query);

                const params = {
                    q: 'from:'+query.q,
                    since: query.since != undefined ? query.since : "",
                    until: query.until != undefined ? query.until : "",
                    count: query.count,
                    max_id: query.since_id != undefined ? query.since_id : ""
                };
                let result;
                try{
                    result = await T.get('search/tweets', params);
                }catch(e){
                    API.utility.response( context, 500, {error: 'Connection Error'} );
                }
                tweets = result.statuses;
                //console.log(result.statuses[0]);

                if (hasQuery) {
                    console.log(hasQuery);
                    API.utility.response( context, 200, result );
                }else{
                    API.utility.response( context, 200, result );
                }
            }
        },
        summary: {
            GET: async function (context, connection) {
                
                const username = context.params['username'];
                const params = {
                    q: 'from:'+username,
                    count: 100
                };
                let summaryData = {
                    userSummary: {},
                    tweets: [],
                    profileData: {}
                };
                let resultQuery;

                console.log(params);
                try{
                    resultQuery = await T.get('search/tweets', params);
                }catch(e){
                    API.utility.response( context, 500, {error: 'Connection Error'} );
                }

                let tweets = [];
                if (resultQuery.statuses.length > 0) {
                    resultQuery.statuses.map((tweet) => {
                        const tweetObj = {
                            tweet_text: tweet.text,
                            username: tweet.user.screen_name,
                            id: tweet.id,
                            date: tweet.created_at
                        };
                        tweets.push(tweetObj);
                    });
    
                    summaryData = {
                        userSummary: {
                            statusCount: resultQuery.statuses[0].user.statuses_count,
                            lists: resultQuery.statuses[0].user.listed_count,
                            followers: resultQuery.statuses[0].user.followers_count,
                            favorites: resultQuery.statuses[0].user.favourites_count,
                            reTweets_count: 0
                        },
                        tweets: tweets,
                        profileData: {
                            name: resultQuery.statuses[0].user.name,
                            location: resultQuery.statuses[0].user.location,
                            description: resultQuery.statuses[0].user.description,
                            profile_image: resultQuery.statuses[0].user.profile_image_url,
                            createdAt: resultQuery.statuses[0].user.created_at
                        }
                    };

                }
                
                API.utility.response( context, 200, summaryData );
            }
        }
    },
    resources: {},
    utility: {
        getRequestContents: function (request) {
            switch (request.method) {
                case "GET":
                    return request.query;
                case "POST":
                case "PUT":
                case "DELETE":
                    return request.body;
            }
        },
        hasData: function (data) {
            return Object.keys(data).length > 0 ? true : false;
        },
        response: function (context, statusCode, data) {
            context.response.setHeader('Content-Type', 'application/json');
            context.response.statusCode = statusCode;
            context.response.end(JSON.stringify(data));
        },
        validate: function (data, pattern) { }
    }
};