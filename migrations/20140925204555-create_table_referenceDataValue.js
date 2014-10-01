module.exports = {
    up: function(migration, DataTypes, done) {
        migration.createTable('referenceDataValue', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            referenceDataId: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            value: {
                type: DataTypes.TEXT
            }
        });
        done();
    },
    down: function(migration, DataTypes, done) {
        migration.dropTable('referenceDataValue');
        done();
    }
};