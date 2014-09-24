module.exports = function(sequelize, DataTypes) {
    var Permission = sequelize.define('Permission', {
        name: { type: DataTypes.STRING(50), primaryKey: true, allowNull: false, validate: { notEmpty: true } },
        public: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
        player: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
    }, {
        tableName: 'permission'
    });

    return Permission;
};