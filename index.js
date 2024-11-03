const express = require('express');
const app = express();
const { readFile } = require('fs');

const fdb = require('./firebase-database');
const { collection, doc, setDoc, getDocs, updateDoc, deleteDoc, getDoc } = require('firebase/firestore');

app.use(express.urlencoded({ extended: true })); 
app.use(express.json()); 
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.post('/add-player', (request, response) => {

    const { playerName, games, boughtIn, cashedOut } = request.body;

    const playerDocRef = doc(collection(fdb, 'player'));

    const realData = {
        playerID: playerDocRef.id,
        name: playerName,
        games: games,
        boughtIn: boughtIn,
        cashedOut: cashedOut,
        wonOrLost: cashedOut - boughtIn
    };

    setDoc(playerDocRef, realData)
        .then(() => {
            console.log('player added successfully to firebase db');
            response.redirect('/add-stats');
        })
        .catch((error) => {
            console.error('Error adding player to firebase db:', error);
            response.status(500).send('Error adding player');
        });
});



app.get('/get-player', async(request, response) => {
    try{
        const playersSnapshot = await getDocs(collection(fdb, 'player'));
        const players = playersSnapshot.docs.map(doc => doc.data());
        res.render('addStats', { firebasePlayers: players });

    } catch (error){
        console.error('error fetching the players from firebase', error)
        res.status(500).send('Error feching user form firebase')
    }
});

async function updatePlayer(documentId, newData){
    try {
        const docRef = doc(fdb, 'player', documentId); 
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const playerData = docSnap.data();
            await updateDoc(docRef, {
                games: parseFloat(playerData.games) + 1,
                boughtIn: playerData.boughtIn + newData.boughtIn,
                cashedOut: playerData.cashedOut + newData.cashedOut,
                wonOrLost: playerData.wonOrLost + newData.cashedOut - newData.boughtIn
            });
            console.log("Document updated successfully!");
        } else {
            console.log("No such document!");
        }
    } catch (error) {
        console.error("Error updating document: ", error);
    }
}


app.post('/add-stats-new', (request, response) => {
    const { 'select-player': playerId, 'edit-boughtIn': newBoughtIn, 'edit-cashedOut': newCashedOut } = request.body;
    console.log('Received data:', { playerId, newBoughtIn, newCashedOut });

    updatePlayer(playerId, {
        boughtIn: parseFloat(newBoughtIn),
        cashedOut: parseFloat(newCashedOut)
    });
    response.redirect('/add-stats');


});


app.post('/delete-player-new', async(request, response) => {
    const {'select-player' : playerId} = request.body;

    if (!playerId) {
        console.error('Player ID is missing');
        return response.status(400).send('Player ID is required');
    }

    try {
        const docRef = doc(fdb, 'player', playerId); 
        await deleteDoc(docRef); 
        console.log('Player deleted successfully');
        response.redirect('/add-stats');
        } catch (error) {
        console.error('error deleting specific player', error)
        response.status(500).send('Error deleting player');

    }
});

app.get('/', (request, response) => {

        // Load the HTML template
        readFile('./templates/home.html', 'utf8', (err, html) => {
            if (err) {
                response.status(500).send('Sorry, out of order');
                return;
            }

            response.send(html);
        });
    
});

app.get('/learning', (request, response) => {
    readFile('./templates/learning.html', 'utf8', (err, html) => {
        if (err) {
            response.status(500).send('Sorry, out of order');
            return;
        }
        response.send(html)
    });
});

app.get('/cheatsheet', (request, response) => {
    readFile('./templates/cheatsheet.html', 'utf8', (err, html) => {
        if (err) {
            response.status(500).send('Sorry, out of order');
            return;
        }
        response.send(html)
    });
});

app.get('/add-stats', async (req, res) => {
    try {
        const playersSnapshot = await getDocs(collection(fdb, 'player'));
        const firebasePlayers = playersSnapshot.docs.map(doc => doc.data());


        res.render('addStats', {firebasePlayers, firebasePlayers});
    } catch (error) {
        console.error('Error fetching players from Firebase:', error);
        res.status(500).send('Error fetching players from Firebase');
    }
});

    // Start the server
app.listen(process.env.PORT || 8000, () => console.log('App available on http://localhost:8000'));
