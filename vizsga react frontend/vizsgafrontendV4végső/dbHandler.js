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

exports.alkatresz = dbHandler.define(
    "alkatresz",{
        "id":{
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        "nev":{
            type: DataTypes.STRING,
            allowNull: false
        },
        "ar":{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        "raktarkeszlet":{
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }
)

exports.felhasznalo = dbHandler.define(
    "felhasznalo",{
        "id":{
            type:DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        "felnev":{
            type:DataTypes.STRING,
            allowNull:true
        },
        "jelszo":{
            type:DataTypes.STRING,
            allowNull:true
        },
        "email":{
            type:DataTypes.STRING,
            allowNull:true
        }
    }
)

exports.rendeles = dbHandler.define(
    "rendeles",{
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
        "fizetesiAdatok":{
            type: DataTypes.STRING,
            allowNull: false
        },
        "szallitasiAdatok":{
            type: DataTypes.STRING,
            allowNull: false
        },
        "datum":{
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW
        }
    }
)