# 🚗 Tribitrabi Alkatrészek Webáruház és Admin Felület

## 📌 Projekt Leírás
Ez a projekt egy **autóalkatrész webáruház és adminisztrációs rendszer**, amely lehetővé teszi az autótulajdonosok számára, hogy könnyedén böngészhessenek és vásároljanak alkatrészeket online. Az adminisztrációs felület segítségével az üzemeltetők kezelhetik a termékeket és módosíthatják a készleteket.  

A főbb funkciók:
- **Főoldal:** Carousel és heti ajánlatok megjelenítése  
- **Áruház:** Keresősáv és adatbázisból betöltött alkatrészek  
- **Kosár:** A kiválasztott alkatrészek kezelése  
- **Fizetés:** Fizetési és szállítási adatok megadása  
- **Regisztráció & Bejelentkezés:** Felhasználói fiókok kezelése és jogosultságok biztosítása  

## 🛠️ Használt Technológiák
- **Frontend:** React, Bootstrap  
- **Backend:** Node.js, Express  
- **Adatbázis:** MySQL  
- **Verziókezelés:** Git, GitHub  
- **Tervezés:** Figma  
- **Projektmenedzsment:** Trello  

## 🚀 Telepítés és Futatás
### **1. Klónozás**
```bash
git clone https://github.com/felhasznalonev/autoalkatresz-webaruhaz.git
cd autoalkatresz-webaruhaz

cd backend
node server.js

cd frontend
npm install (npm i röviden)
npm run dev
o
```

##🔗 API Végpontok
###1. Alkatrészek
**GET /parts** – Az összes alkatrész lekérése

**POST /parts** – Új alkatrész hozzáadása

**PUT /parts/:id** – Meglévő alkatrész módosítása

**DELETE /parts/:id** – Alkatrész törlése

###2. Felhasználók
**POST /register** – Új felhasználó regisztrációja

**POST /login** – Bejelentkezés

**GET /profile** – Profiladatok lekérése

**DELETE /profile** – Felhasználó törlése

###3. Rendelések
**POST /checkout** – Új rendelés létrehozása

**GET /myorder** – Legutóbbi rendelés lekérése


