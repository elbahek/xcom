module.exports = function(sequelize, DataTypes) {
    var Reference = sequelize.define('Reference', {
        name: { type: DataTypes.STRING(50), allowNull: false, validate: { notEmpty: true } }
    }, {
        tableName: 'reference',
        classMethods: {
            associate: function(models) {
                Reference.hasMany(models.ReferenceColumn, { as: 'columns', foreignKey: 'referenceId' });
            }
        }
    });

    return Reference;
};