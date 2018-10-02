# JBot-Microsoft Teams application
This is a Microsoft teams application which was built during the Microsoft Teams Hackfest. This is a mock application to show the capabilities of Microsoft Teams. It is an application to view the job openings inside your company and other added functionalities towards the same. 

### Steps for Installation :

This applications requires Node v6.11 or higher

Install Git, Npm and Node. Check the installation with the following commands - 

```sh
$ git --version
$ node -v
$ npm -v
$ gulp -v
```
Now clone this repo with the following command - 

```sh
$ git clone https://github.com/SujayGd/JBot---Microsoft-teams-application.git
```

> Once the repo is cloned, go through src/app.js and src/messaging-extension.js files and modify them for your job urls from which you want to fetch the jobs details

Run the following commands for installing the dependencies and running the application :

```sh
$ npm install
$ npm start
```
At this point, you can open a browser window and navigate to the following URLs to verify that all the app URLs are loading:

```sh
$ http://localhost:3333
$ http://localhost:3333/hello
$ http://localhost:3333/first
$ http://localhost:3333/second
```
### Hosting the application :

Use ngrok to tunnel your locally hosted Nodejs app to the internet. Install ngrok and then  you can open a new terminal window and run the following command to create a tunnel. 

```sh
$ ngrok http 3333
```
You can verify by opening your browser and going to https://51dea7be.ngrok.io/hello to load your app's hello page.

### Deploying the app to Microsoft Teams :

Modify the src/manifest.json file as follows:

To get a unique value for your app follow the instructions in [Create a bot for Microsoft Teams](https://docs.microsoft.com/en-us/microsoftteams/platform/concepts/bots/bots-create). You will use the App Framework website to register your app. Now edit the manifest file and set the value of the "id" property to the AppID returned by BotFramework.

```sh
"$schema": "https://statics.teams.microsoft.com/sdk/v1.0/manifest/MicrosoftTeams.schema.json",
    "manifestVersion": "1.0",
    "version": "1.0.0",
    "id": "<your app id here>",
    "packageName": "com.contoso.helloworld",
    "developer": {
        "name": "Microsoft Teams Hackfest",
        "websiteUrl": "https://www.microsoft.com",
        "privacyUrl": "https://www.microsoft.com/privacy",
        "termsOfUseUrl": "https://www.microsoft.com/termsofuse"
    },
```
Also change the botID value here - 

```sh
"bots": [{
        "botId": "Your botId here",
        "commandLists": [
            {
```

```sh
"composeExtensions": [{
        "botId": "Your botId here",
        "scopes": [
            "personal",
            "team"
        ],
```
Change the URLs in the manifest - 

```sh
"staticTabs": [{
        "entityId": "com.contoso.helloworld.CompanyJobs",
        "name": "Company India Jobs",
        "contentUrl": "API for your company's jobs",
        "scopes": [
            "personal",
            "team"
        ]
.
.
.
"configurableTabs": [{
        "configurationUrl": "Your ngrok URL",
        "canUpdateConfiguration": true,
        "scopes": [
            "team"
        ]
    }],
```

### Uploading the App :

Once you are done with your changes to the code and the manifest, rebuild the app and run the following command - 

```sh
$ gulp
```

This will create a zip file which you can upload in the **Upload a custom app** link in the Teams application.

To further configure the application on the Teams app and add more functionalities to it, goto the [Documentation from Microsoft](https://docs.microsoft.com/en-us/microsoftteams/platform/get-started/get-started-nodejs).
