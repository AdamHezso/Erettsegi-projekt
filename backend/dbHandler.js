const{Sequelize,DataTypes} = require('sequelize');
require('dotenv').config();

const USERNAME = process.env.USER;
const PASSWORD = process.env.PASS;
const TABLE = process.env.TABLE;
const HOST = process.env.HOST;

let dbHandler
try {
    dbHandler = new Sequelize(
        TABLE,
        USERNAME,
        PASSWORD,
        {
            dialect: "mysql",
            host: HOST
        }
    )
} catch (error) {
    console.log(error)
}

exports.part = dbHandler.define(
    "part",{
        "id":{
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        "name":{
            type: DataTypes.STRING,
            allowNull: false
        },
        "price":{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        "stock":{
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }
)

exports.user = dbHandler.define(
    "user",{
        "id":{
            type:DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        "username":{
            type:DataTypes.STRING,
            allowNull:true
        },
        "password":{
            type:DataTypes.STRING,
            allowNull:true
        },
        "email":{
            type:DataTypes.STRING,
            allowNull:true
        }
    }
)

exports.order = dbHandler.define(
    "order",{
        "id":{
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        "userId":{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        "paymentData":{
            type: DataTypes.STRING,
            allowNull: false
        },
        "shippingData":{
            type: DataTypes.STRING,
            allowNull: false
        },
        "date":{
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW
        }
    }
)