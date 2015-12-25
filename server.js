var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json())

app.get('/', function (req, res) {
    res.send('Todo API Root')
});

//GET /todo
//app.get('/todos', function(req, res){
//   res.json(todos) 
//});

//GET /todo?completed=true
app.get('/todos', function(req, res){
    var query = req.query;
    var where = {};
    
    if(query.hasOwnProperty('completed') && query.completed === 'true'){
         where.completed = true;
     } else if(query.hasOwnProperty('completed') && query.completed === 'false'){
         where.completed = false;
     }
    
    if(query.hasOwnProperty('q') && query.q.length > 0 ){
        where.description = {
            $like: '%' + query.q + '%'
        };
    }
    
    db.todo.findAll({where: where}).then(function (todos){
        res.json(todos);}, function (e){
        res.status(500).send();
    }
    )
    
//    var fliteredTodos = todos;
//    
//    if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'true'){
//        fliteredTodos = _.where(fliteredTodos, {completed: true});
//    }else if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'false'){
//        fliteredTodos = _.where(fliteredTodos, {completed: false});
//    }
//    
//    if(queryParams.hasOwnProperty('q') && queryParams.q.length > 0 ){
//        fliteredTodos = _.filter(fliteredTodos, function (todo){
//            return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
//        })
//    }
//    
//    res.json(fliteredTodos) 
})

//GET /todo/:id
app.get('/todos/:id', function(req, res){
    var todoId = parseInt(req.params.id, 10);
    
    db.todo.findById(todoId).then(function (todo) {
        if(!!todo){
        res.json(todo.toJSON());    
        }
        else {
        res.status(404).send();
        }
    }, function (e){
        res.status(500).send();
        
    })


//    var matchedTodo = _.findWhere(todos, {id: todoId});
//
//    
//    if(matchedTodo){
//        res.json(matchedTodo);
//    }else {
//        res.status(404).send();
//    }
    
});

//POST /todos
app.post('/todos', function (req, res) {
   var body = _.pick(req.body, 'description', 'completed');
    
    db.todo.create(body).then(function(todo){
        res.json(todo.toJSON());        
    },function(e){
        res.status(400).json(e);
    });
    
//   if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0){
//       return res.status(400).send();
//   }
//   body.description = body.description.trim();
//   body.id = todoNextId++;
//
//   todos.push(body)
//    
//   console.log('description: ' + body.description);
//   res.json(body);
    
    
});

//DELETE /todos/:id

app.delete('/todos/:id', function(req, res){
    var todoID = parseInt(req.params.id, 10);
    
    db.todo.destroy({
        where: {
            id: todoID
        }
    }).then(function(rowsDeleted){
        if (rowsDeleted === 0){
            res.status(404).json({
                error: 'No Todo with Id'
            });        
        }
        else {
            res.status(204).send();
        }
    },function(){
        res.status(500).send();
    }
           )
    
    
//    var matchedTodo = _.findWhere(todos, {id: todoID});
//    
//    if(!matchedTodo){
//        res.status(404).json({"error": "no todo found with that id"})}
//    else {
//            todos = _.without(todos, matchedTodo)
//            res.json(matchedTodo)
//        }
    
    
    });

//PUT /todos/:id
app.put('/todos/:id', function(req, res){
    var todoID = parseInt(req.params.id, 10);
    
//    var matchedTodo = _.findWhere(todos, {id: todoID});
    
    var body = _.pick(req.body, 'description', 'completed');
    var attributes = {};
    
//    if(!matchedTodo){
//        return res.status(404). send();
//    }
    
    if(body.hasOwnProperty('completed')){
        attributes.completed = body.completed;
    }
    
    
    
//    else if(body.hasOwnProperty('completed')){
//        return res.status(400).send();
//    }
    
    
    
    if(body.hasOwnProperty('description')) {
        attributes.description = body.description;
    }
    
    db.todo.findById(todoID).then(function (todo) {
        if (todo) {
            todo.update(attributes).then(function (todo) {
            res.json(todo.toJSON());
            },function (e) {
            res.satus(400).json(e);        
            }
           );
        } else {
            res.status(404).send();
        }
    }, function () {
        res.status(500).send();
    })
    
    
    
//    else if (body.hasOwnProperty('description')){
//        return res.status(400).send();
//    }
    
//    _.extend(matchedTodo, validAttributes);
//    
//    res.json(matchedTodo);
    
});

db.sequelize.sync().then(function() {
    app.listen(PORT, function() {
    console.log('Express listen on port ' + PORT + '!')
});
})

