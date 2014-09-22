module.exports = function(sequelize, DataTypes) {
    var Base = sequelize.define('Variable', {
        name: { type: DataTypes.STRING(20), primaryKey: true, allowNull: false, validate: { notNull: true, notEmpty: true } },
        value: { type: DataTypes.TEXT }
    }, {
        tableName: 'variable'
    });

    return Base;
};