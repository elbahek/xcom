module.exports = {
    up: function(migration, DataTypes, done) {
        migration.addColumn('referenceColumn', 'validations', {
            type: DataTypes.TEXT,
            comment: 'json-formatted validation options for reference column'
        });
        done();
    },
    down: function(migration, DataTypes, done) {
        migration.removeColumn('referenceColumn', 'validations');
        done();
    }
};