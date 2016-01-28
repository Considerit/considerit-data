# considerit-data

Help us by running a node that mirrors and archives publicly accessible data behind any considerit subdomain! The goal is to have distributed data replication for auditing and visualization. All of the code used is open and inspectable.

I'm running an example mirror at http://considering.it. 

## Installation

```
git clone https://github.com/invisible-college/considerit-data.git
cd considerit-data
echo '{}' > package.json
npm install statebus-server --save
npm install request --save
cp sample_mirror.js mirror.js
```

## Run the mirror server

```
node mirror.js bitcoin
```

Replace the 'bitcoin' argument with the considerit subdomain that you would like to mirror. 

## Visualizing data

Available visualizations are in considerit-data/clients/. For example, considerit-data/clients/sample.html is a quick and ugly table view of the replicated considerit data. 

The sample code assumes that you are running a local mirror accessible at port 9375. If that's true, you can just load the client html in a webbrowser. If, however, you want to use data from a mirror hosted elsewhere, or want to make your mirror publicly accessible, modify the following line: 

```
<script>statebus_server = 'http://localhost:9375'</script>
```

For example, in my example mirror running at http://considering.it, I've changed this line to 

```
<script>statebus_server = 'http://considering.it:9375'</script>
```

## Creating new clients

Beyond replicating data, you can create new visualizations over the data that could be useful. For example:

* The considerit-data/clients/sample.html data browser is barebones, ugly, and doesn't display changes in data fields over time. A better data browsing client would be welcome. Preferably one that showed when/how a record has been changed (e.g. an opinion's stance or a proposal's text)

* Network analysis tools for identifying possible fake accounts. For example, correlating voting records amongst accounts.

* Create unique views over the opinion data, or the participants, that leads to new insights. For example, what about ranking participants by the frequency with which they substantiate their opinions with reasons? Or a list of proposals re-ranked by an adjusted score that accounts for the fact that some users tend to vote binary (to either extreme) while others tend to express themselves in more measured way?

Just copy clients/sample.html and start developing a new visualization! Share your new views via pull request if you like. Or message me.

## Make your mirror public

Here's a sketch of how to host your node so that it is publically accessible:

1. Put considerit-data/clients/ somewhere in your website's root directory. Now anyone can access the clients at your domain. Optionally modify your webserver to make one of the html files the index. 

1. Make sure that your mirror.js is always running, such as running it in a screen session.

## Local database backups

Backups of the sqlite database are created every minute and stored at considerit-data/backups. Note that only one backup file is created per day, which means that your database is backed up every minute, but overwrites the previous one, until the day changes when a new backup file is created. 

If this policy doesn't suit how you want to manage the auditing, you can also modify mirror.js to track changes in the incoming data. 
