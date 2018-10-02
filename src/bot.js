'use strict';

module.exports.setup = function(app) {
    var builder = require('botbuilder');
    var teams = require('botbuilder-teams');
    var config = require('config');
    const request = require('request');
    var _ = require("lodash");
    
    var inits = require('inits');

    var resultArray = new Array();

    inits.init(function(){
        request({'url':'<your company API url for jobs>',
        json: true },
      
        (err,out, body) => {
          if (err) { return console.log(err); }
        //   console.log(out.body.Data[2]);
          resultArray = out.body.Data;
        //   console.log("Length is:" + resultArray.length);
      }); 
    });
   
    var botConfig = config.get('bot');
    
    // Create a connector to handle the conversations
    var connector = new teams.TeamsChatConnector({
        // It is a bad idea to store secrets in config files. We try to read the settings from
        // the environment variables first, and fallback to the config file.
        // See node config module on how to create config files correctly per NODE environment
        appId: process.env.MICROSOFT_APP_ID || botConfig.microsoftAppId,
        appPassword: process.env.MICROSOFT_APP_PASSWORD || botConfig.microsoftAppPassword
    });
    
    var inMemoryBotStorage = new builder.MemoryBotStorage();
    
    // Define a simple bot with the above connector that echoes what it received
    var bot = new builder.UniversalBot(connector, function(session) {

            var search = teams.TeamsMessage.getTextWithoutMentions(session.message);
            var search = search.toLowerCase();
            var terms = search.split(" ");

            console.log(terms);

            if(search.indexOf('jobs in') > -1)
            {
                console.log("jobs in");
                console.log("");
                var loc= "";
                var skill = "";
                for (let index = 0; index < terms.length; index++) {
                    const element = terms[index];
                    if(element == 'in'){                
                        loc = terms[++index]
                    }
                    if(element == 'for'){
                        skill = terms[++index]
                    }            
                }
                console.log(loc + " : " + skill);
                var final_array = new Array();
                var cards = new Array();
    
                _.forEach(resultArray, function(value) {
    
                
                if( loc != '' && skill != ''){
                    if (value.JobTitle.toLowerCase().indexOf(skill.trim()) > -1  && value.City.toLowerCase().includes(loc.trim()))
                    {
                        final_array.push(value);
                    }            
                
                }else {
                    if (value.JobTitle.toLowerCase().indexOf(search) > -1)
                    {
                        final_array.push(value);
                    }
                }
                    }); 
             
    
                console.log(final_array.length);
    
                var count = 0;
                
                    final_array.forEach(element => {
                        console.log(element);
                        var JobID = element['JobID']
                        var deepLink = 'https://teams.microsoft.com/l/entity/efb97b66-c91e-4e51-b284-61dda56bd60e/com.contoso.helloworld.JobDetails'
                        + '?webUrl=' + encodeURI('https://<your company API url for similar jobs>/ShowJob/Id/' + JobID + '&label=' + 'Job' + JobID )
                        + '&context=' + encodeURI('{"subEntityId": "' + JobID + '"}');
                        
                        var newCard = new builder.HeroCard(session)
                        .title(element['JobTitle'] +" | "+ element['JobCodeDescription'])
                        .subtitle(element['ShortTextField1'] +" | "+ element['ShortTextField3'])
                        .buttons([
                            builder.CardAction.imBack(session, "Job Details for " + element['JobID'], "Details"),
                            builder.CardAction.imBack(session, "Similar Jobs for " + element['JobID'], "Similar Jobs"),
                            new builder.CardAction(session)
                                        .title('Apply')
                                        .type('openUrl')
                                        .value(deepLink)
                        ])

                        if(count < 10)
                        {
                                cards.push(newCard);
                                count += 1 
                        }
                    });  
                           
                 
                console.log(count);
                if(count > 0)
                {
                session.send(new builder.Message(session)
                // .attachmentLayout("list")
                .attachmentLayout("carousel")
                .attachments(cards));
                }else{
                session.send('No Jobs Found !!');
    
                }

            }
            else if(search.indexOf('job details for') > -1){

                console.log("Button Clicked");
                    //console.log(terms);
                    var JobID = terms[3]
                    var deepLink = 'https://teams.microsoft.com/l/entity/efb97b66-c91e-4e51-b284-61dda56bd60e/com.contoso.helloworld.JobDetails'
                    + '?webUrl=' + encodeURI('https://<your company API url for jobs>/ShowJob/Id/' + JobID + '&label=' + 'Job' + JobID )
                    + '&context=' + encodeURI('{"subEntityId": "' + JobID + '"}');
                    
                    var cards = new Array();
                    //console.log(resultArray.length);                    
                    resultArray.forEach(element => {
                        var elementID = element['JobID']
                        if(elementID.toString() == JobID.toString())
                        {
                            var newCard = new builder.HeroCard(session)
                            .title(element['JobTitle'] +" | "+ element['JobCodeDescription'])
                            .subtitle(element['ShortTextField1'] +" | "+ element['ShortTextField3'])
                            .text(element['JobDescription'])
                            .buttons([
                                // builder.CardAction.imBack(session, "Apply for Job", "Apply"),
                                
                                new builder.CardAction(session)
                                        .title('Apply')
                                        .type('openUrl')
                                        .value(deepLink),
                                               
                                builder.CardAction.imBack(session, "Similar Jobs for " + element['JobID'], "Similar Jobs")
                            ])
        
                            cards.push(newCard);
                            // break;
                        }
                    });
        
                    if(cards.length > 0){
                        session.send(new builder.Message(session)
                        // .attachmentLayout("list")
                        .attachmentLayout("carousel")
                        .attachments(cards));
                    }else{
                    session.send('Details Not Found !!');
        
                    }
            }
            else if(search.indexOf('similar jobs for ') > -1){
                 
                 var similarJObs = new Array()
                 var JobID = terms[3]
                 var SimilarJobCards = new Array();
                
                 var options = { method: 'POST',
                    url: '<your company API url for similar jobs>',
                    headers: 
                    { 'content-type': 'application/json' },
                    body: { JobID: JobID },
                    json: true };
                    
                    request(options, function (err, response, body) {
                        if (err) { return console.log(err); }                           
                        similarJObs = response.body;
                        var count = 0;
                
                        similarJObs.forEach(element => {
                        var newCard = new builder.HeroCard(session)
                        .title(element['OriginalJobTitle'] +" | "+ element['City'])
                        .subtitle(element['JobType'])
                        .buttons([
                            builder.CardAction.imBack(session, "Job Details for " + element['JobId'], "Details"),
                            builder.CardAction.imBack(session, "Similar Jobs for " + element['JobId'], "Similar Jobs"),
                        ])

                        if(count < 5)
                        {
                            SimilarJobCards.push(newCard);
                            count += 1 
                        }
                    });  
                           
                 
                console.log(count);
                if(count > 0)
                {
                session.send(new builder.Message(session)
                // .attachmentLayout("list")
                .attachmentLayout("carousel")
                .attachments(SimilarJobCards));
                }else{
                session.send('No Similar Job Found !!');
    
                }
                        
                    
                });
            
            }else{

                session.send('Incorrect search query! Accepted Query:  "Jobs in _LOCATION_ for _SKILL_"');
                
            }
                              

    }).set('storage', inMemoryBotStorage);

    


    // Setup an endpoint on the router for the bot to listen.
    // NOTE: This endpoint cannot be changed and must be api/messages
    app.post('/api/messages', connector.listen());

    // Export the connector for any downstream integration - e.g. registering a messaging extension
    module.exports.connector = connector;
};
