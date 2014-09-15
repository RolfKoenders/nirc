# nirc

As a side project i want to create a [IRC](http://nl.wikipedia.org/wiki/Internet_Relay_Chat) client as webapp. 
Im going to use [Ember](emberjs.com) for the frontend. To start with a bit of styling [Bootstrap](http://getbootstrap.com/). 
The server part will be written in NodeJS. The communication between the front -and backend will be through sockets. 

## Features
Im planning to create the following features.
* Server management 
* Server console window
* Join Channels
* User list
* Private message to users

## Running
For now all the UI (index page, CSS, Javascript) is prototype code. Just to have something working and play with the library. 

To run it
```
git clone git@github.com:RolfKoenders/nirc.git
npm install
npm start
```

For now an extra step is necessary. The library [nirc-lib](https://github.com/RolfKoenders/nirc-lib) is not in the NPM registry at the moment. You need to clone also the library and 'npm link' it together.
```
git clone git@github.com:RolfKoenders/nirc-lib.git
npm install
npm link

cd ~/path/to/nirc
npm link nirc-lib
npm start
```

## [Todo list](https://github.com/RolfKoenders/nirc/blob/master/TODO.md)
This list shows what im working on at the moment. 
