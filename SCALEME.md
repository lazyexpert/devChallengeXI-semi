# Methodology
I've selected two main approaches to implement this project:
- Microservice architecture
- Dependency Injection pattern

Both of them I've selected thinking about the day after tomorrow.

Dependency Injection is the "king pattern" for continious refactoring.

Microservice architecture is also very good and testable approach to scale application.

# Example scaling
I'll try to imagine we need to scale right now. I would suggest the following steps:
- change logging approach from stream forwarding to some logmatic or logentries
- publish all common modules in npm, include them as dependencies
- remove lost dependencies(not needed anymore)
- place each service as a separate repository
- setup for each service CI
- monitor the CPU, Memory, Network load to determine when and where we need to add more instances
- refactor anything I didn't notice :)

# Scrapper
I've decided this one to parse the whole site, as far as he doesn't face limit.
In any case, if the logic of parsing has to be changed - it is easily done. 
Basically, implementing changes only in one module - Scrapper.

This module is designed with ability to scale.
In config file, we can set:
- urls: array of urls that will be parsed
- limit: how many entries we would like to find (if possible)
- delay: when crawling, make a delay in ms

Ex: If we add 2 urls and set limit to 100 - this will mean, that we would like to find 100 entries for each.
I found delay very useful when you attempt to get 1000 pages limit, for example. 

# Indexator
This service works mainly with the 'news' collection. Simply popping items.

I've added delay between requests. It is set in configs and might come very handy in future.
Example: we get ban by some ddos filter... But we're not hurry, just set delay.

I thought, it would be nice to implement the ability to launch multiple instances of indexator.
I've added simple flag property in news model - 'processing'.
So, when indexator takes something to index, it is marked as processing.
When he sends an update of the news (it is done on finally, so he will always do it) this property 
is set to false. This way another instance of indexator won't take the same news to process while it 
is already processing.