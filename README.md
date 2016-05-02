#Ledgr - Public Repository

This is a small App I made for keeping track of who owes what and to whom, and keep every device in sync,
even if you don't have data connectivity. Ledgr has been very useful on
trips with a large group of people where you want to keep track of who
bought the beers and who paid for the cab ride to the airport and so on,
but don't want to pay hefty data roaming charges and keep everyone's devices
synced.

Ledgr lets you sync and consolidate everything when you get back to a free WiFi at
your hotel or chalet. The app will sync itself once it has data connectivity
and every client will automatically be brought up to date.

##Installation

You'll need cordova (version 5) and ionic to serve the frontend to the
web browser. The easiest way to get these is through `npm`

 ```
 npm install cordova@5 -g
 npm install ionic -g
 ```

If you do not have Node.js (and `npm`) installed, check out the
installation instructions for your platform from
[https://nodejs.org/en/](https://nodejs.org/en/)

After this you probably want to run the `CouchDB` backend, which can be easily run by using
the provided Vagrant box:

```
cd backend
vagrant up
```

This will download a 14.04 LTS Ubuntu and install the needed components on it and start the CouchDB daemon.

After this the CouchDB backend can be reached easily with any browser by going to the address:
[http://localhost:5984/_utils](http://localhost:5984/_utils)

Now you should be able to just go into the `frontend` folder and run `ionic serve`
and that should launch your browser and open up the `Ledgr` app. Some limitations of course
apply to the browser version, for instance, the camera can't be used to take pictures.

The `vagrant up` script will import some boilerplate data into the CouchDB
(from our last trip to the Alps actually) with all sensitive data removed from
the DB. This is just to give you an idea of how the app works.


##Compilation

If you want to compile the code for your Android
or iOS device, you will need the proper environment to compile for those devices. Check the ionic docs on how
to compile for each platfrom. In essence it is `ionic run android --device` when you have an android phone connected
and setup for debugging, and your environment has all the required libs.