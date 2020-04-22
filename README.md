![alt-text](/icebreaker_1.png)

# icebreaker
speed dating app



## How to use the node dev env
Navigate to the folder of your cloned repository in a command line tool. 

Type npm install and wait while the libraries specified in the file package.json are installed. Make sure that you add folder named node_modules to your .gitignore. 

write node app.js in the terminal.

go to localhost:3000 in the web-browser to show the contents. It's automatically set up to start on the site index.html located in the public folder



## NOTE TO THE TEACHERS / OUR USERS

We are using window.sessionStorage to store a userID/roomID so that when we land on different html pages we can just request the correct data from the backend. This happens aswell with eventIDs when creating new events. This makes it possible to create different events and users and use them in the same server.

You need to have swipe functionality activated in your browser. This application is tested on a macos Catalina - google-chrome latest version.

### If you experience crashes
Since we are using window.sessionStorage for storing roomIDs/eventIDs so that our socket.io in the server always can give the right information to the right user (since socket IDs are not the same when you change html site) if something goes wrong or crashes you need to:`CLOSE AND REOPPEN THE TAB`and then restart the server. It is extremely important that you do this so that the sessionStorage on your tab gets reset -> otherwise you would experience undefined behaviour. 

This is kinda weird but this was the only way that we could store the roomID/EventID across different html pages.

ALSO.. You may NOT use the back arrow and forward arrow in the app.. This could break how window.sessionStorage works. If that happens then again you need to:`CLOSE AND REOPPEN THE TAB`and then restart the server.

## How to remove bots?
Our app can work without any bots or with as many real users as youd like as long as the total attendees of the event is not greater than 20.

To remove bots change the 18 number to a lower one in App.js on for loop at line 152: You can use cmd + f and search for "!change" to get to the right place in App.js

Standard is 18 bots so that you need a real female, and a real male to create, and join the event. 

## other important info

You cannot QUIT an event before all REAL users have done their swiping left and right in the last stage of the event. 
As soon as all real users are done. You can press QUIT which will send the manager and all real users to the starting screen where the real users can check out their matches :).

  
It's up to the event manager to make sure that two REAL users are not matched twice and that female and male participents are matched together. (press help button in event manager view for explanation in the app aswell :) )

Bots will not have answers for custom questions. Bots will not have rating messages after a dating round is completed.

#### This should be everything you need to know to use the app! We've fixed all points that was given to us in the "komplettering"
