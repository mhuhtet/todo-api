module.exports = function (sequelize, DataTypes) {
return sequelize.define('todo', {
        description: {
                        type: DataTypes.STRING,
                        allowNull: false,
                        validate: {
                            isAlpha: true,
                            len: [1, 250],
                            notEmpty: true,
                            is: ["^[a-z]+$",'i']
                        }
                     },
        completed: {
                        type:DataTypes.BOOLEAN,
                        allowNull: false,
                        defaultValue: false
                            
                    }
   });
    
};