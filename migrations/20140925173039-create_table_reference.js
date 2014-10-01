module.exports = {
    up: function(migration, DataTypes, done) {
        migration.createTable('reference', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: DataTypes.STRING(50),
                allowNull: false
            }
        });
        done();
    },
    down: function(migration, DataTypes, done) {
        migration.dropTable('reference');
        done();
    }
};
