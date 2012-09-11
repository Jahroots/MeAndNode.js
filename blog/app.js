
/**
 * Module dependencies.
 */
 
var express = require('express');
//var routes = require('./routes');
//var user = require('./routes/user');
var http = require('http');
var path = require('path');
var flash = require('connect-flash');
var gzippo = require('gzippo');
//var connect = require('connect');

var app = express();
//var server = http.createServer(app);
//var io = require('socket.io').listen(server);

//var ArticleProvider = require('./articleprovider-memory').ArticleProvider;
var ArticleProvider = require('./articleprovider-mongodb').ArticleProvider;

app.configure(function(){
  app.use(express.cookieParser());
  app.use(express.session({
    secret: 'blog'
    //,cookie: {maxAge: 60000}
    //,store:  new express.session.MemoryStore({ reapInterval: 60000 * 10 })
  }));

  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  //app.use(express.static(path.join(__dirname, 'public')));
  app.use(gzippo.staticGzip(path.join(__dirname, 'public')));
  app.use(gzippo.compress());
  //app.use(connect.compress());
  app.use(flash());
  /*
  this.use(express.cookieParser());
  this.use(express.session({
    "secret": "some private string",
    "store":  new express.session.MemoryStore({ reapInterval: 60000 * 10 })
  }));
  */
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

//var articleProvider= new ArticleProvider();
var articleProvider = new ArticleProvider('localhost', 27017);

//app.get('/', routes.index);
//app.get('/users', user.list);

app.get('/', function(req, res){
  //req.flash('info', 'index');
  req.session.username = 'Jahroots';
  articleProvider.findAll(function(error, docs){
    res.render('index', { title: 'Blog', articles:docs, "sessID":req.sessionID });
	});
});

app.get('/blog/new', function(req, res) {
    res.render('blog_new.jade', {title: 'New Post'});
});

app.post('/blog/new', function(req, res){
    articleProvider.save({
        title: req.param('title'),
        body: req.param('body')
    }, function( error, docs) {
        res.redirect('/')
    });
});

app.get('/blog/:id', function(req, res) {
    articleProvider.findById(req.params.id, function(error, article) {
        res.render('blog_show.jade',{title: article.title,article:article});
    });
});

app.get('/blog/edit/:id', function(req,res){
    articleProvider.findById(req.params.id, function(error, article){
        res.render('blog_edit.jade',{title:'Edit blog: ' + article.title, article:article});    
    });    
});

app.post('/blog/addComment', function(req, res) {
    articleProvider.addCommentToArticle(req.param('_id'), {
        person: req.param('person'),
        comment: req.param('comment'),
        created_at: new Date()
       } , function( error, docs) {
          res.redirect('/blog/' + req.param('_id'))
       });
});

app.post('/blog/update', function(req, res){
  console.log('Update article._id ' + req.param('_id') + ' new title:' + req.param('newTitle') + ' new body: ' + req.param('newBody'));
  articleProvider.updateArticle(req.param('_id'), req.param('newTitle'), req.param('newBody'), function(error, article){
    res.redirect('/');
  });
});

var server = http.createServer(app).listen(app.get('port'), function(){
  //console.log("Express server listening on port " + app.get('port'));
  console.log("Express server listening on port %d in %s mode", app.get('port'), app.settings.env);
});
//var server = http.createServer(app);
var io = require('socket.io').listen(server);
io.configure('development', function(){
  io.enable('browser client gzip minification');
  //io.enable('browser client minification');
  io.set('log level', 2);
  io.set('transports', [                     // enable all transports (optional if you want flashsocket)
    'websocket'
    ,'flashsocket'
    ,'htmlfile'
    ,'xhr-polling'
    ,'jsonp-polling'
  ]);
});

io.sockets.on('connection', function (socket) {
  console.log('A socket connected!');

  socket.on('dbReq', function(data){
    console.log('Req: ' + data.req);
    if (data.req === 'findAll'){
      articleProvider.findAll(function(error, docs){
        socket.emit('findAllResp', {articles:docs});
      });
    }
  });
});
