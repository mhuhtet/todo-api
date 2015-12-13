var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
    'dialect':'sqlite',
    'storage':__dirname + '/basic-sqlite-database.sqlite'
});

var todo = sequelize.define('todo', {
        description: {
                        type: Sequelize.STRING,
                        allowNull: false,
                        validate: {
                            len: [1, 250]
                        }
                     },
        completed: {
                        type:Sequelize.BOOLEAN,
                        allowNull: false,
                        defaultValue: false
                            
                    }
                    
                            })

sequelize.sync({
// force:true
}).then(function(){
    console.log('Everything is synced');
    
    todo.findById(3).then(function(todo){
        if(todo){
            console.log(todo.toJSON());
        }
        else {
            console.log('todo no found !')
        }
})
})

    
    
//    todo.create({
//        description:'Meet With Mom',
//    }).then(function(Todo){
//        return todo.create({
//            description:'Clean office'
//        })
//    }).then(
//        function(){
////            return todo.findById(1)
//            return todo.findAll({
//                where : {
//                description: {
//                    $like: '%clean%'
//                }
//            }
//            })
//        }
//    ).then(function(todos) {
//        if(todos){
//            todos.forEach(function(todo){
//                console.log(todo.toJSON());
//            })
//            
//        }else {
//            console.log('no todo')
//        }
//    }
//        
//    ).catch(function(e){
//        console.log(e);
//    })
//});