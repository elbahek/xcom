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
        migration.addIndex(
            'referenceData',
            [ 'referenceColumnId', 'order' ],
            { indexName: 'UNIQUE_referenceData_ON_referenceColumnId_AND_order', indicesType: 'UNIQUE' }
        );
        done();
    },
    down: function(migration, DataTypes, done) {
        migration.removeIndex('referenceData', 'UNIQUE_referenceData_ON_referenceColumnId_AND_order');
        migration.dropTable('referenceData');
        done();
    }
};
