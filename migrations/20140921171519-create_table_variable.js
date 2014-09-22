module.exports = {
    up: function(migration, DataTypes, done) {
        migration.createTable('variable', {
            name: {
                type: DataTypes.STRING(20),
                primaryKey: true,
                allowNull: false
            },
            value: {
                type: DataTypes.TEXT,
                allowNull: true
            }
        });
        done();
    },
    down: function(migration, DataTypes, done) {
        migration.dropTable('variable');
        done();
    }
};
