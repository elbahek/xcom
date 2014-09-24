module.exports = function(sequelize, DataTypes) {
    var Variable = sequelize.define('Variable', {
        name: { type: DataTypes.STRING(20), primaryKey: true, allowNull: false, validate: { notEmpty: true } },
        value: { type: DataTypes.TEXT }
    }, {
        tableName: 'variable'
    });

    return Variable;
};