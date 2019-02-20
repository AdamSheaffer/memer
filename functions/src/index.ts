import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const registerGamePlayed = functions.firestore
  .document('games/{gameId}/players/{playerId}')
  .onCreate(async (playerSnapshot, _event) => {
    const player = playerSnapshot.data();

    if (!player) {
      console.error('Function triggered but no player was added')
      return Promise.reject();
    }

    const userId = player.uid;

    const userSnaphot = await admin.firestore().doc(`users/${userId}`).get()
    const user = userSnaphot.data();

    if (!user) {
      console.error('Player added did not match any document in /users')
      return Promise.reject();
    }

    const gamesPlayed = user.gamesPlayed + 1;

    return userSnaphot.ref.update({ gamesPlayed });
});
