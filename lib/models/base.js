module.exports = function(sequelize, DataTypes) {
    var Base = sequelize.define('Base', {
        location: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: true } },
        timezone: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: true } },
        color: { type: DataTypes.STRING(7), allowNull: false, validate: { notEmpty: true } },
        isMain: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
    }, {
        tableName: 'base'
    });

    return Base;
};