module.exports = function(sequelize, DataTypes) {
    return sequelize.define('best', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        text: {
            type: DataTypes.TEXT(11),
            allowNull: false
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        rating: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        last_update: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        tableName: 'best',
        timestamps: false
    });
};
