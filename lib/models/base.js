module.exports = function(sequelize, DataTypes) {
    var Base = sequelize.define('Base', {
        location: { type: DataTypes.STRING, allowNull: false, validate: { notNull: true, notEmpty: true } },
        timezone: { type: DataTypes.STRING, allowNull: false, validate: { notNull: true, notEmpty: true } },
        color: { type: DataTypes.STRING(7), allowNull: false, validate: { notNull: true, notEmpty: true } },
        isMain: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, validate: { notNull: true } }
    }, {
        tableName: 'base'
    });

    return Base;
};