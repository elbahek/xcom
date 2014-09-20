module.exports = {
    up: function(migration, DataTypes, done) {
        migration.createTable('base', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            location: {
                type: DataTypes.STRING,
                allowNull: false
            },
            timezone: {
                type: DataTypes.STRING,
                allowNull: false
            },
            color: {
                type: DataTypes.STRING(7),
                allowNull: false
            },
            isMain: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            }
        });
        done();
    },
    down: function(migration, DataTypes, done) {
        migration.dropTable('base');
        done();
    }
};
