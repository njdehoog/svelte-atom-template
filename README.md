### Running locally

Please run on node 16: `nvm install 16` `nvm use 16`

Make sure you are using the correct version of node with NVM: run `nvm use` in the root of the repo. 
If you don't have nvm installed, add it: `brew install nvm`.

Install node modules: `npm i`

To run locally: `npm run dev`.

### Deploying

To deploy to the Interactives S3 bucket you need AWS credentials for the Interactives account in your command line. You can get these from the Guardian's permissions manager system [Janus](https://janus.gutools.co.uk/). You need to be assigned these permissions and be on a Guardian network or VPN to see them on Janus. 

Fill out config.json:

```
{
    "title": "Title of your interactive",
    "docData": "Any associated external data",
    "path": "year/month/unique-title"
}
```

Deploy to S3:

```
npm run deploy
```
Running this task will output the url to be embedded in Composer.


To verify that deploy was picked up sucessfully:

```
npm run deploylog
```
