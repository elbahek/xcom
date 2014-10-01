module.exports = function(sequelize, DataTypes) {
    var ReferenceDataValue = sequelize.define('ReferenceDataValue', {
        value: { type: DataTypes.TEXT }
    }, {
        tableName: 'referenceDataValue',
        classMethods: {
            associate: function(models) {
                ReferenceDataValue.belongsTo(models.ReferenceData);
            }
        }
    });

    return ReferenceDataValue;
};