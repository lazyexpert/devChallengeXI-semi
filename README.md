# How to start application
Using vagrant:
```
vagrant up
```

# Tests
When starting with vagrant, before the app starts it runs the tests,
so you can monitor them successfully passing.
What is covered with tests:
- all common modules
- public api (routes + modules)
- scrapper (routes)

# Launch on your machine
In case you would like to launch app without vagrant environment. 
You'll have to: 

## Install project dependencies (system):
- mongo
- node (latest)
- execute: `npm i -g apidoc`
- execute: `npm i -g http-server`

## Setup environment variables (linux version):
Values here are not mandatory these ones. You can use the ones that fit you best.
- printf "setting environment variables"
- export API_HOST=localhost
- export API_PORT=3000
- export DATABASE_HOST=localhost
- export DATABASE_PORT=3001
- export SCRAPPER_HOST=localhost
- export SCRAPPER_PORT=3002
- export CONNECTION_STRING=mongodb://localhost:27017/devChallenge
- export INTERSERVICE_AUTHORIZATION=sdklfjhsf789Wyr2fSoV78sdf89gsEp98thazlcksdfsfs5s

MAC: https://stackoverflow.com/questions/7501678/set-environment-variables-on-mac-os-x-lion
Windows: https://superuser.com/questions/79612/setting-and-getting-windows-environment-variables-from-the-command-prompt

## Install project dependencies (npm):
`npm i`

## Run tests:
`npm test` 

## Run app:
`npm start`


# Services description
In this section I would like to describe briefly each service and its responsibilities.

## API 
I think its clear here. Serves requests from users, uses inner structure.

## Database
This one is basically a layer between database and other microservices.
Directly queries database. Has a common module (dataabse-client) that makes requests for this service.
There is a constant in config 'usualUpdatePlan' - this value is currently set to 5 minutes, in real
case this, probably, should be something around 1 day.

## Scrapper
Is reponsible for web scrapping. 
Does the first scrapping stage - collects urls and adds them to the queue.
In case if the specified url already exists in the pages collection - it won't be added to the queue.

## Indexator
Muted service.

Duties:
- check if we have someting in queue - index it 
- check if we have something ready to be reindexed (according to the index update plan)
- saves indexed documents to the database
- calculates and sets the new updatePlan for the certain news

### Index update 
Indexator module fetches documents according to the 'updatePlan' property.
This property is also calculated by the indexator, module 'update-calculator'.

Algorithm for that is the following:
- we have hardcoded properties in config: 'usualUpdatePlan' and 'failedPenalty' 
- each news model stores the values: 'totalIndex', 'totalChanged' and 'totalFailed'
- the logic I used here is simple: the more document changes - the more often we should check it.
  Also, the more document checks failed - the less we should visit it.

## API-doc 
Small server with auto-generated documentation for the API, both public and private part.
By default will be accesible on port: 3010.

# APP FLOW 
I would like to describe the basic app flow here.

## Launch app
Sure, first thing we do is start app:
```
vagrant up
```

## Launch scrapper 
The scrapper is launched from the publicAPI service.
If default port, it will be:
```
http://localhost:3000/scrapper/launch
```

Second thing - is to launch scrapper.
He will add the pages he will find to the 'queueitems' collection.

## Indexator
Then indexator automatically will take queue items and process them to the 'news' collection.
Also indexator will go to each page and index it.
Also he will set the next update plan for this news.

# Diff 
Diff is build using npm module 'diff' - https://www.npmjs.com/package/diff.
Itself it uses algorithm -  "An O(ND) Difference Algorithm and its Variations" (Myers, 1986).
http://citeseerx.ist.psu.edu/viewdoc/summary?doi=10.1.1.4.6927

I use comparisson by sentences. I've tested chars and words - they work pretty long.
So I've decided to use sentence as a comparisson unit.

Also to read difference in json object is pretty hard. So I've added property 'type' in comparisson api.
If you specify type to 'html' - the output will be formatted(colors), escaped(won't render) initial html,
so it's a little easier to read the difference.

How I've tested it: I picked any document in 'pages' collection, copied it, just changing the value of 
version and html. Then I use API to compare these two versions.

## Use API 
In console: "No more fitting news to index currently" - this means that the scrapper and indexator did
their job. For the first launch - this means they filled db with data.
Next launch this is not mandatory waiting for anything...
Basically, the first launch - it will also work. But you won't receive expected data.

# What to improve
If I had some more time - I would definately refactor current naming in databse service:
- confusing routes naming
- confusing model naming
- confusing methods naming in database client
That happened because of several application refactorings and app design changes.

So basically, I currently have such collections:
- queueitems - these are basically 'queue-to-index'
- news - these are basically 'index'
- pages - these are more like 'versions'

Just don't want to break anything in the last moment, so I'll leave as is. 
But I wrote this, to underline I understand this problem.
