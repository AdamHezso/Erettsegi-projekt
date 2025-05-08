console.log("Fut a szerver.")

const express = require('express')
const dbHandler = require('./dbHandler')
require('dotenv').config()
const jwt = require('jsonwebtoken')

const cors = require('cors')

const server = express()
server.use(express.json())


server.use(cors());


const TITOK = process.env.SECRET
const PORT = process.env.PORT

dbHandler.alkatresz.sync({alter:true})
dbHandler.felhasznalo.sync({alter:true})
dbHandler.rendeles.sync({alter:true})

function auth(){
    return(req,res,next) => {
        const aUTHh = req.headers.authorization;
        console.log('Authorization fejléc:', aUTHh);
        if(typeof(aUTHh) == 'undefined'){
            res.status(401).json({'message':'Nem létező token'});
            return;
        }
        if(!aUTHh.startsWith('Bearer')){
            res.status(401).json({'message':'Hibás token'});
            return;
        }
        const encodedToken = aUTHh.split(' ')[1];
        try{
            const decodedToken = jwt.verify(encodedToken,TITOK);
            req.userName = decodedToken.felnev;
            req.userId = decodedToken.id;
            next();
        }catch(error){
            res.status(401).json({'message': error.message || error});
        }
    }
}

server.get('/parts', async (req, res) => {
    try {
        const all = await dbHandler.alkatresz.findAll(
            {
                attributes: ["nev","ar","raktarkeszlet","id"],
                distinct: true
            }
        )
        res.json(all)
    } catch (error) {
        res.json({'message':error})
    }
    res.end()
})

server.post('/parts', async (req, res) => {
    const { nev, ar, raktarkeszlet } = req.body;
    if (!nev || typeof ar === 'undefined' || typeof raktarkeszlet === 'undefined') {
        res.status(400).json({ message: 'Hiányzó adat(ok)' });
        return;
    }
    try {
        const newPart = await dbHandler.alkatresz.create({ nev, ar, raktarkeszlet });
        res.status(201).json({
            id: newPart.id,
            nev: newPart.nev,
            ar: newPart.ar,
            raktarkeszlet: newPart.raktarkeszlet
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

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
            jelszo: req.body.registerPassword,
            email: req.body.email
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
            const token = await jwt.sign({'felnev':oneUser.felnev,'id':oneUser.id},TITOK,{expiresIn:'1h'})
            res.json({'message':'Sikeres bejelentkezés', 'token': token})
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

server.get('/profile', auth(), async (req, res) => {
    try {
        const user = await dbHandler.felhasznalo.findOne({
            where: { id: req.userId },
            attributes: ['felnev', 'jelszo', 'email']
        });
        if (!user) {
            res.status(404).json({ message: 'Felhasználó nem található' });
            return;
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    res.end()
});

server.put('/profile/password', auth(), async (req, res) => {
    const { newPassword } = req.body;
    if (!newPassword) {
        res.status(400).json({ message: 'Hiányzó új jelszó' });
        return;
    }
    try {
        await dbHandler.felhasznalo.update(
            { jelszo: newPassword },
            { where: { id: req.userId } }
        );
        res.json({ message: 'Jelszó sikeresen módosítva' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    res.end()
});

server.delete('/profile', auth(), async (req, res) => {
    try {
        const deleted = await dbHandler.felhasznalo.destroy({ where: { id: req.userId } });
        if (deleted) {
            res.json({ message: 'Felhasználó törölve' });
        } else {
            res.status(404).json({ message: 'Felhasználó nem található' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

server.delete('/parts/:id', async (req, res) => {
    const id = req.params.id; // Get the ID from the request parameters

    try {
        // Find the item by ID using the alkatresz model
        const part = await alkatresz.findByPk(id);

        if (!part) {
            // If the item is not found, return a 404 response
            return res.status(404).send('Item not found');
        }

        // Delete the item
        await part.destroy();

        // Return a success response
        res.status(200).send('Item deleted successfully');
    } catch (err) {
        // Log the error and return a 500 response
        console.error('Error deleting item:', err);
        res.status(500).send('Internal Server Error');
    }
});

server.post('/checkout', auth(), async (req, res) => {
    const { fizetesiAdatok, szallitasiAdatok } = req.body;
    if (!fizetesiAdatok || !szallitasiAdatok) {
        res.status(400).json({ message: 'Hiányzó adatok!' });
        return;
    }
    try {
        const newOrder = await dbHandler.rendeles.create({
            userId: req.userId,
            fizetesiAdatok,
            szallitasiAdatok
        });
        res.status(201).json({ id: newOrder.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

server.get('/myorder', auth(), async (req, res) => {
    try {
        const order = await dbHandler.rendeles.findOne({
            where: { userId: req.userId },
            order: [['datum', 'DESC']]
        });
        if (!order) {
            res.status(404).json({ message: 'Nincs aktív rendelésed!' });
            return;
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

server.listen(PORT, () => {console.log('A szerverunk elkezdett futni a ' + PORT + ' címen')})