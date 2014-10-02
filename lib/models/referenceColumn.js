module.exports = function(sequelize, DataTypes) {
    var ReferenceColumn = sequelize.define('ReferenceColumn', {
        order: { type: DataTypes.INTEGER(2), allowNull: false, validate: { min: 1 } },
        name: { type: DataTypes.STRING(50), allowNull: false, validate: { notEmpty: true } },
        options: { type: DataTypes.TEXT},
        validations: { type: DataTypes.TEXT }
    }, {
        tableName: 'referenceColumn',
        classMethods: {
            associate: function(models) {
                ReferenceColumn.belongsTo(models.Reference);
                ReferenceColumn.hasMany(models.ReferenceData, { as: 'data', foreignKey: 'referenceColumnId' });
            }
        }
    });

    return ReferenceColumn;
};