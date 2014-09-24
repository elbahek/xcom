module.exports = {
    up: function(migration, DataTypes, done) {
        migration.createTable('permission', {
            name: {
                type: DataTypes.STRING(50),
                primaryKey: true,
                allowNull: false
            },
            public: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            player: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            }
        });
        done();
    },
    down: function(migration, DataTypes, done) {
        migration.dropTable('permission');
        done();
    }
};
