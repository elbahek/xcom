module.exports = {
    up: function(migration, DataTypes, done) {
        // drop old tables
        migration.removeIndex('referenceData', 'UNIQUE_referenceData_ON_referenceColumnId_AND_order');
        migration.dropTable('referenceData');
        migration.dropTable('referenceDataValue');

        // create new structure
        migration.createTable('referenceRow', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            referenceId: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            order: {
                type: DataTypes.INTEGER(3),
                allowNull: false
            },
        });
        migration.addIndex(
            'referenceRow',
            [ 'referenceId', 'order' ],
            { indexName: 'UNIQUE_referenceRow_ON_referenceId_AND_order', indicesType: 'UNIQUE' }
        );

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
            referenceRowId: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            value: {
                type: DataTypes.TEXT
            }
        });
        migration.addIndex(
            'referenceData',
            [ 'referenceColumnId', 'referenceRowId' ],
            { indexName: 'INDEX_referenceData_ON_referenceColumnId_AND_referenceRowId' }
        );
        done();
    },
    down: function(migration, DataTypes, done) {
        // drop new tables
        migration.removeIndex('referenceRow', 'UNIQUE_referenceRow_ON_referenceId_AND_order');
        migration.dropTable('referenceRow');
        migration.removeIndex('referenceData', 'INDEX_referenceData_ON_referenceColumnId_AND_referenceRowId');
        migration.dropTable('referenceData');

        // recreate old structure
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
    }
};