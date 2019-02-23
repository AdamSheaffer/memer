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

    const gamesPlayed = user.gamesPlayed ? user.gamesPlayed + 1 : 1;

    return userSnaphot.ref.update({ gamesPlayed });
});

export const onUserStatusChanged = functions.database
  .ref('status/{uid}')
  .onUpdate(async (change, context) => {
    if (!change || !change.after) {
      console.log('No updates made');
      return Promise.resolve();
    }
    const eventStatus = change.after.val();
    const userFirestoreRef = admin.firestore().doc(`users/${context.params.uid}`);

    // It is likely that the Realtime Database change that triggered
    // this event has already been overwritten by a fast change in
    // online/offline status, so re-read the current data
    // and compare the timestamps.
    const statusSnapshot = await change.after.ref.once('value');
    const status = statusSnapshot.val();
    if (status.lastChanged > eventStatus.lastChanged) {
      return null;
    }

    const updates = [];

    // If the user was in a game and goes offline, remove them from the game
    const needsRemoval = status.state === 'Offline' && !!status.game && !!status.player;
    if (needsRemoval) {
      const playerFirestoreRef = admin.firestore().doc(`games/${status.game}/players/${status.player}`);
      const playerRemoval = playerFirestoreRef.update({ isActive: false });
      updates.push(playerRemoval);
    }

    // Update lastChanged
    eventStatus.lastChanged = new Date(eventStatus.lastChanged);
    const userUpdate = userFirestoreRef.update(eventStatus);
    updates.push(userUpdate);

    return Promise.all(updates);
});
