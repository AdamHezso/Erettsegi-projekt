// Szükséges modulok betöltése
const express = require('express')
const dbHandler = require('./dbHandler')
require('dotenv').config()
const jwt = require('jsonwebtoken')
const cors = require('cors')

const server = express()
server.use(express.json())
server.use(cors())

// Környezeti változók beolvasása
const SECRET = process.env.SECRET
const PORT = process.env.PORT

// Adatbázis szinkronizálása
dbHandler.part.sync({alter:true})
dbHandler.user.sync({alter:true})
dbHandler.order.sync({alter:true})

// Hitelesítést végző middleware (JWT)
function auth(){
    return(req,res,next) => {
        const authHeader = req.headers.authorization;
        if(typeof(authHeader) == 'undefined'){
            res.status(401).json({'message':'Token does not exist'});
            return;
        }
        if(!authHeader.startsWith('Bearer')){
            res.status(401).json({'message':'Invalid token'});
            return;
        }
        const encodedToken = authHeader.split(' ')[1];
        try{
            const decodedToken = jwt.verify(encodedToken,SECRET);
            req.username = decodedToken.username;
            req.userId = decodedToken.id;
            next();
        }catch(error){
            res.status(401).json({'message': error.message || error});
        }
    }
}

// Összes alkatrész lekérdezése (GET /parts)
server.get('/parts', async (req, res) => {
    try {
        const all = await dbHandler.part.findAll({
            attributes: ["name","price","stock","id"],
            distinct: true
        })
        res.json(all)
    } catch (error) {
        res.json({'message':error})
    }
    res.end()
})

// Új alkatrész hozzáadása (POST /parts)
server.post('/parts', async (req, res) => {
    const name = req.body.name;
    const price = req.body.price;
    const stock = req.body.stock;
    if (!name || typeof price === 'undefined' || typeof stock === 'undefined') {
        res.status(400).json({ message: 'Missing data' });
        return;
    }
    try {
        const newPart = await dbHandler.part.create({ name, price, stock });
        res.status(201).json({
            id: newPart.id,
            name: newPart.name,
            price: newPart.price,
            stock: newPart.stock
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    res.end()
});

// Alkatrész módosítása (PUT /parts/:id)
server.put('/parts/:id', async (req, res) => {
    const id = req.params.id;
    const name = req.body.name;
    const price = req.body.price;
    const stock = req.body.stock;
    try {
        const part = await dbHandler.part.findByPk(id);
        if (!part) {
            return res.status(404).send('Item not found');
        }
        part.name = name;
        part.price = price;
        part.stock = stock;
        await part.save();
        res.status(200).send('Item updated successfully');
    } catch (err) {
        console.error('Error updating item:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Alkatrész törlése ID alapján (DELETE /parts/:id)
server.delete('/parts/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const part = await dbHandler.part.findByPk(id);
        if (!part) {
            return res.status(404).send('Item not found');
        }
        await part.destroy();
        res.status(200).send('Item deleted successfully');
    } catch (err) {
        console.error('Error deleting item:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Felhasználó regisztrálása (POST /register)
server.post('/register', async (req, res) => {
    let oneUser
    try{
        oneUser = await dbHandler.user.findOne({
            where:{
                username: req.body.registerName
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
        res.json({'message': 'User already exists.'})
        res.end()
        return
    }
    try {
        await dbHandler.user.create({
            username: req.body.registerName,
            password: req.body.registerPassword,
            email: req.body.email
        })
    } catch (error) {
        await res.json({'message':error})
        console.log(error)
        res.end()
        return
    }
    res.status(201)
    res.json({'message':'Registration successful'})
    res.end()
})

// Felhasználó bejelentkezése (POST /login)
server.post('/login', async (req, res) => {
    let oneUser
    try{
        oneUser = await dbHandler.user.findOne({
            where:{
                username: req.body.loginName,
                password: req.body.loginPassword
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
            const token = await jwt.sign({'username':oneUser.username,'id':oneUser.id},SECRET,{expiresIn:'1h'})
            res.json({'message':'Login successful', 'token': token})
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
    res.json({'message':'Invalid username or password'})
    res.end()
})

// Profil lekérdezése (GET /profile)
server.get('/profile', auth(), async (req, res) => {
    try {
        const user = await dbHandler.user.findOne({
            where: { id: req.userId },
            attributes: ['username', 'password', 'email']
        });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    res.end()
});

// Jelszó módosítása (PUT /profile/password)
server.put('/profile/password', auth(), async (req, res) => {
    const { newPassword } = req.body;
    if (!newPassword) {
        res.status(400).json({ message: 'Missing new password' });
        return;
    }
    try {
        await dbHandler.user.update(
            { password: newPassword },
            { where: { id: req.userId } }
        );
        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    res.end()
});

// Profil törlése (DELETE /profile)
server.delete('/profile', auth(), async (req, res) => {
    try {
        const deleted = await dbHandler.user.destroy({ where: { id: req.userId } });
        if (deleted) {
            res.json({ message: 'User deleted' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    res.end()
});

// Rendelés leadása (POST /checkout)
server.post('/checkout', auth(), async (req, res) => {
    const { paymentData, shippingData } = req.body;
    if (!paymentData || !shippingData) {
        res.status(400).json({ message: 'Missing data' });
        return;
    }
    try {
        const newOrder = await dbHandler.order.create({
            userId: req.userId,
            paymentData,
            shippingData
        });
        res.status(201).json({ id: newOrder.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    res.end()
});

// Saját rendelés lekérdezése (GET /myorder)
server.get('/myorder', auth(), async (req, res) => {
    try {
        const order = await dbHandler.order.findOne({
            where: { userId: req.userId },
            order: [['date', 'DESC']]
        });
        if (!order) {
            res.status(404).json({ message: 'No active orders!' });
            return;
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    res.end()
});

// Szerver indítása
const envMsg = PORT ? PORT : 'unknown port';
server.listen(PORT, () => {
    console.log('Our server has started running on ' + envMsg + ' address')
})