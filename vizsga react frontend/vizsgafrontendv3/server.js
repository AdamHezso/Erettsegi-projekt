console.log("Fut a szerver.")

const express = require('express')
const dbHandler = require('./dbHandler')
require('dotenv').config()
const jwt = require('jsonwebtoken')

const cors = require('cors')

const server = express()
server.use(express.json())
server.use(cors())

const TITOK = process.env.SECRETKEY
const PORT = process.env.PORT
const EXPIRES = process.env.EXPIRES

dbHandler.alkatresz.sync({alter:true})
dbHandler.felhasznalo.sync({alter:true})

function Auth() {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log('Auth. header: ' + authHeader);

    if (!authHeader) {
      res.status(401).json({ message: 'Hiányzó Authorization fejléc' }).end();
      return;
    }

    const headerSplit = authHeader.split(' ');
    if (headerSplit.length !== 2 || headerSplit[0] !== 'Bearer') {
      res.status(402).json({ message: 'Hibás token formátum' }).end();
      return;
    }

    try {
      const token = jwt.verify(headerSplit[1], TITOK);
      req.nev = token.nev;
      next();
    } catch (e) {
      res.status(403).json({ message: 'Hibás token: ' + e.message }).end();
      return;
    }
  };
}

server.get('/parts', Auth(), async (req, res) => {
    try {
        const all = await dbHandler.alkatresz.findAll(
            {
                attributes: ["nev","id"],
                distinct: true
            }
        )
        res.json(all)
    } catch (error) {
        res.json({'message':error})
    }
    res.end()
})
server.get('/userinfo', Auth(), async (req, res) => {
    res.json(await dbHandler.felhasznalo.findAll({
            attributes: ['felnev','jelszo']
        })).end()
})

server.post('/register', async (req, res) => {
    let oneUser
    try{
        oneUser = await dbHandler.felhasznalo.findOne(
            {
                where:{
                    felnev: req.body.registerName
                }
            })
        
    }catch(error){
        res.json({'message':error})
        console.log(error)
        res.end()
        return
    }

    if(oneUser){
        res.status(403)
        res.json({'message': 'Ilyen felhasználó már van.'})
        res.end()
        return
    }
    try {
        await dbHandler.felhasznalo.create({
            felnev: req.body.registerName,
            jelszo: req.body.registerPassword
        })
    } catch (error) {
        await res.json({'message':error})
        console.log(error)
        res.end()
        return
    }
    res.status(201)
    res.json({'message':'Sikeres regisztráció'})
    res.end()
})

server.post('/login', async (req, res) => {
    let oneUser
    try{
        oneUser = await dbHandler.felhasznalo.findOne(
            {
                where:{
                    felnev: req.body.loginName,
                    jelszo: req.body.loginPassword
                }
            })
        
    }catch(error){
        res.json({'message':error})
        console.log(error)
        res.end()
        return
    }

    if(oneUser){
        try{
            const token = await jwt.sign({'nev':oneUser.felnev,'id':oneUser.id},TITOK,{expiresIn:EXPIRES})
            res.json({'message':'Sikeres bejelentkezés', 'token':token})
            res.end()
            return
        }catch(error){
            res.json({'message':error})
            console.log(error)
            res.end()
            return

        }
    }
    res.status(409)
    res.json({'message':'Hibás felhasználónév vagy jelszó'})
    res.end()
})

server.listen(PORT, () => {console.log('A szerverunk elkezdett futni a ' + PORT + ' címen')})