module.exports = {
    up: function(migration, DataTypes, done) {
        migration.addIndex(
            'referenceColumn',
            [ 'referenceId', 'order' ],
            { indexName: 'UNIQUE_referenceColumn_ON_referenceId_AND_order', indicesType: 'UNIQUE' }
        );
        migration.addIndex(
            'referenceData',
            [ 'referenceColumnId', 'order' ],
            { indexName: 'UNIQUE_referenceData_ON_referenceColumnId_AND_order', indicesType: 'UNIQUE' }
        );
        done();
    },
    down: function(migration, DataTypes, done) {
        migration.removeIndex('referenceColumn', 'UNIQUE_referenceColumn_ON_referenceId_AND_order');
        migration.removeIndex('referenceData', 'UNIQUE_referenceData_ON_referenceColumnId_AND_order');
        done();
    }
};
