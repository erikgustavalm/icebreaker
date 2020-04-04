![alt-text](/icebreaker_1.png)

# icebreaker
speed dating app



## How to use the node dev env
Navigate to the folder of your cloned repository in a command line tool. 

Type npm install and wait while the libraries specified in the file package.json are installed. Make sure that you add folder named node_modules to your .gitignore. 

write node app.js in the terminal.

go to localhost:3000 in the web-browser to show the contents. It's automatically set up to start on the site index.html located in the public folder



NOTE!!!!

Since we are using window.sessionStorage for storing roomIDs/eventIDs so that our socket.io in the server always can give the right information to the right user (since socket IDs are not the same when you change html site) if something goes wrong or crashes you need to:`CLOSE AND REOPPEN THE TAB`and then restart the server

ALSO.. You may not use the back arrow and forward arrow in the app.. This could break how window.sessionStorage works. If that happens then again you need to:`CLOSE AND REOPPEN THE TAB`and then restart the server.
