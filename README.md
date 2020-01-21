# Introducing weQuest
## A mobile app that matches user and owners of products through a reverse auction mechanism.
## Built for the Lighthouse Labs final project.
## Authors: [Kevin Laburte](https://github.com/kevlabs), [Leo Lee](https://github.com/leoltl), [Jackson To](https://github.com/checksonhk)

## Link: [Heroku host](https://wequest.xyz)

### Features
- Single Page Application using React and Ionic
- Users can request items for short-term rental
- Users who own the requested products are able to bid on the aforementioned requests through a reverse auction mechanism
- As no two bids are the same, the requester is presented with all bids and selects a winner
- All other users' requests are shown in the request feed. This is the landing page. It showcases the app's concepts.
- Users can see their history in the activity feed
- Live updates using socket.io (current auction price, notifications...)

### Getting Started

1. Fork this repository, then clone your fork of this repository.
2. Install the front-end dependencies using the `npm install` command in the frontEnd folder.
3. Build the front-end running `npm run build`.
4. Install the server dependencies using the `npm install` command in the server folder.
5. Build the server running `npm run build` (in the server folder).
6. Start the web server using the `npm start` command (in the server folder). The app will be served at http://localhost:8080/.
7. Go to http://localhost:8080/ in your browser.

### Dependencies
- express
- node 8.x.x or above
- axios
- bcrypt
- body-parser
- cookie-session
- dotenv
- morgan
- pg
- pg-native
- socket.io
- aws-sdk
- typescript
- ionic
- react
- react-router
- node-sass
- gulp
