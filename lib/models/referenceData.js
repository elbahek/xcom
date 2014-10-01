module.exports = function(sequelize, DataTypes) {
    var ReferenceData = sequelize.define('ReferenceData', {
        order: { type: DataTypes.INTEGER(3), allowNull: false, validate: { min: 1 } }
    }, {
        tableName: 'referenceData',
        classMethods: {
            associate: function(models) {
                ReferenceData.belongsTo(models.ReferenceColumn);
                ReferenceData.hasMany(models.ReferenceDataValue, { as: 'values', foreignKey: 'referenceDataId' });
            }
        }
    });

    return ReferenceData;
};