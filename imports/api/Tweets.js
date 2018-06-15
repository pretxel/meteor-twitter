import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import Twitter from 'twitter';
import querystring from 'querystring';
import API from './api';

export const Tweets = new Mongo.Collection('tweets');

Meteor.startup(() => {

});

if (Meteor.isClient) {
    Router.configure({
        noRoutesTemplate: 'noRoutesTemplate'
    });
}



Router.route( '/api/getTweets', function() {
   
    console.log('getTweets');
    this.response.setHeader( 'Access-Control-Allow-Origin', '*' );

    if ( this.request.method === "OPTIONS" ) {
      this.response.setHeader( 'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept' );
      this.response.setHeader( 'Access-Control-Allow-Methods', 'POST, PUT, GET, DELETE, OPTIONS' );
      this.response.end( 'Set OPTIONS.' );
    } else {
      API.handleRequest( this, 'tweet', this.request.method );
    }

}, { where: 'server' } );


Router.route( '/api/getSummary/:username', function() {
    console.log('getSummary');
    API.handleRequest( this, 'summary', this.request.method );

}, { where: 'server' } );
