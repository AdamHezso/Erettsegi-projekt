console.log("Fut a szerver.")

const express = require('express')
const dbHandler = require('./dbHandler')
require('dotenv').config()
const jwt = require('jsonwebtoken')

const cors = require('cors')

const server = express()
server.use(express.json())
server.use(cors())

const TITOK = process.env.SECRET
const PORT = process.env.PORT

dbHandler.alkatresz.sync({alter:true})
dbHandler.felhasznalo.sync({alter:true})

function auth(){
    return(req,res,next) => {
        const aUTHh = req.headers.authorization
        if(typeof(aUTHh) == 'undefined'){
            res.status(401)
            res.json({'message':'Nem létező token'})
            res.end()
            return
        }
        if(!aUTHh.startsWith('Bearer')){
            res.status(401)
            res.json({'message':'Hibás token'})
            res.end()
            return
        }
        const encodedToken = aUTHh.split(' ')[1]
        try{
            const decodedToken = jwt.verify(encodedToken,TITOK)
            req.userName = decodedToken.felnev
            req.userId = decodedToken.id
        }catch(error){
            res.json({'message':error})
            res.end()
        }
    }
}

server.get('/parts', auth(), async (req, res) => {
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
            const token = await jwt.sign({'nev':oneUser.felnev,'id':oneUser.id},TITOK,{expiresIn:'1h'})
            res.json({'message':'Sikeres bejelentkezés'})
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