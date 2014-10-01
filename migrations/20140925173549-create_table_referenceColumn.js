module.exports = {
    up: function(migration, DataTypes, done) {
        migration.createTable('referenceColumn', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            referenceId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            order: {
                type: DataTypes.INTEGER(2),
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING(50),
                allowNull: false
            },
            options: {
                type: DataTypes.TEXT,
                comment: 'json-formatted column options'
            }
        });
        done();
    },
    down: function(migration, DataTypes, done) {
        migration.dropTable('referenceColumn');
        done();
    }
};
