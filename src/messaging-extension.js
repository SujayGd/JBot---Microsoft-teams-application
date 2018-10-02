'use strict';

module.exports.setup = function() {
    var builder = require('botbuilder');
    var teamsBuilder = require('botbuilder-teams');
    var bot = require('./bot');
    const request = require('request');

    var resultArray = new Array();


    bot.connector.onQuery('getRandomText', function(event, query, callback) {

        console.log(JSON.stringify(query));

        request({'url':'<your company API url for jobs>',
        json: true },
      
        (err,out, body) => {
          if (err) { return console.log(err); }
        //   console.log(out.body.Data[2]);
          resultArray = out.body.Data;
          console.log("Length is:" + resultArray.length);
        
        
        var attachments = new Array();
        
        
        console.log("Query : " +query.parameters[0].value);

        var SearchQuery = query.parameters[0].value
        SearchQuery = SearchQuery.toLowerCase();
        if(SearchQuery == "true"){
            for (var i = 0; i < 10; i++) {
                var JobID = resultArray[i]['JobID']
                    var deepLink = 'https://teams.microsoft.com/l/entity/efb97b66-c91e-4e51-b284-61dda56bd60e/com.contoso.helloworld.JobDetails'
                    + '?webUrl=' + encodeURI('https://<your company API url for jobs>/ShowJob/Id/' + JobID + '&label=' + 'Job' + JobID )
                    + '&context=' + encodeURI('{"subEntityId": "' + JobID + '"}');
                    attachments.push(
                        new builder.ThumbnailCard()
                            .title(resultArray[i]['JobTitle'] + " | " + resultArray[i]['JobCodeDescription'])
                            .text(resultArray[i]['ShortTextField1'] + " | " + resultArray[i]['ShortTextField3'])
                            .buttons([
                                // builder.CardAction.imBack(session, "Apply for Job", "Apply"),                                
                                new builder.CardAction()
                                        .title('Apply')
                                        .type('openUrl')
                                        .value(deepLink),
                                               
                            ])
                            .toAttachment());
                }
        }else{
            resultArray.forEach(element => {                
                if(element.JobTitle.toLowerCase().indexOf(SearchQuery) > -1){
                    var JobID = element['JobID']
                    var deepLink = 'https://teams.microsoft.com/l/entity/efb97b66-c91e-4e51-b284-61dda56bd60e/com.contoso.helloworld.JobDetails'
                    + '?webUrl=' + encodeURI('https://<your company API url for jobs>/ShowJob/Id/' + JobID + '&label=' + 'Job' + JobID )
                    + '&context=' + encodeURI('{"subEntityId": "' + JobID + '"}');
                    attachments.push(
                        new builder.ThumbnailCard()
                            .title(element['JobTitle'] + " | " + element['JobCodeDescription'])
                            .text(element['ShortTextField1'] + " | " + element['ShortTextField3'])
                            .buttons([
                                // builder.CardAction.imBack(session, "Apply for Job", "Apply"),                                
                                new builder.CardAction()
                                        .title('Apply')
                                        .type('openUrl')
                                        .value(deepLink),
                                               
                            ])
                            .toAttachment());
                }
                
            });
        }

        // Build the response to be sent
        if(attachments.length <= 0){

            attachments.push(
                new builder.ThumbnailCard()
                    .title("No Jobs Found")
                    //.text(element['ShortTextField1'] + " | " + element['ShortTextField3'])                    
                    .toAttachment());

        }
  
        var response = teamsBuilder.ComposeExtensionResponse
            .result('list')
            .attachments(attachments)
            .toResponse();
        

        // Send the response to teams
        callback(null, response, 200);
        }); 
    });
};
