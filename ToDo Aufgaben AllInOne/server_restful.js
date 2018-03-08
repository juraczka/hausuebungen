var fs = require( 'fs' );
var express = require( 'express' );
var bp = require( 'body-parser' );
var app = express();


var server = app.listen(3000, function() {
  console.log( 'Server gestartet. Port 3000' );
});

// CORS Header
app.use( function( request, response, next ) {
  response.setHeader( 'Access-Control-Allow-Origin', '*' );
  response.setHeader( 'Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE' );
  next();
});
app.use( express.static( 'files' ) );
app.use( bp.urlencoded({ extended:true })); // POST Daten parsen

app.get( '/', function(req,res) {
  res.sendFile( __dirname+'/files/todo.html' );
});

// RESTFUL
var getData = function( dataname, callback ) {
  var dataObj;
  fs.readFile( dataname+'.json', function(err,data) {
    try {
      dataObj = JSON.parse( data );
      callback( dataObj[ dataname ] );
    } catch(e) {
      callback( [] );
    }
  });
} // getData
var writeData = function( dataname, dataArray, callback ) {
  var dataObj = {};
  dataObj[ dataname ] = dataArray;
  fs.writeFile( dataname+'.json', JSON.stringify(dataObj), callback );
} // writeData

app.get( '/restful/todo', function( request, response ) {
  console.log( 'GET all' );
    getData( 'todo', function( alleToDos ) {
      response.send( {todo:alleToDos } );
    });
});

app.get( '/restful/todo/:id', function( request, response ) {
    var id = request.params.id;
    console.log( 'GET id', id  );
    getData( 'todo', function( alleToDos ) {
      response.send( {todo:[ alleToDos[id] ] } );
    });
});

app.post( '/restful/todo', function( request, response ) {
  console.log( 'POST', request.body );
  getData( 'todo', function( alleToDos ) {
    alleToDos.push( request.body );
    writeData( 'todo', alleToDos, function() {
      response.send( {result:true} );
    });
  });
});

app.put( '/restful/todo/:id', function( request, response ) {
  var id = request.params.id;
  console.log( 'PUT', id, request.body );
  getData( 'todo', function( alleToDos ) {
    alleToDos[id] = request.body;
    writeData( 'todo', alleToDos, function() {
      response.send( {result:true} );
    });
  });
});

app.delete( '/restful/todo/:id', function( request, response ) {
  var id = request.params.id;
  console.log( 'DELETE', id );
  getData( 'todo', function( alleToDos ) {
    delete alleToDos[id];
    writeData( 'todo', alleToDos, function() {
      response.send( {result:true} );
    });
  });
});
