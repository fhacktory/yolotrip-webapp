var AppRouter = Backbone.Router.extend({
    routes: {
        "": "index",
        "test/:id": "test"
    }
});

// Initiate the router
var app_router = new AppRouter;

// index.html
app_router.on('route:index', function(actions) {
    console.log('index');
});

// index.html#/test/1
app_router.on('route:test', function(id) {
    console.log(id);
});

// Start Backbone history a necessary step for bookmarkable URL's
Backbone.history.start();