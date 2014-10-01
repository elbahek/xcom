module.exports = {
    up: function(migration, DataTypes, done) {
        migration.createTable('referenceData', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            referenceColumnId: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            order: {
                type: DataTypes.INTEGER(3),
                allowNull: false
            }
        });
        done();
    },
    down: function(migration, DataTypes, done) {
        migration.dropTable('referenceData');
        done();
    }
};
