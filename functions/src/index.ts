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
  .onWrite(async (change, context) => {
    if (!change || !change.after || !change.before) {
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
      console.log('Already overwritten', status, eventStatus);
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
    const userUpdate = userFirestoreRef.update({ presence: eventStatus });
    updates.push(userUpdate);

    return Promise.all(updates);
});

export const updateOnlineCounter = functions.database
  .ref('status/{uid}')
  .onWrite(async (change, _context) => {
    if (!change || !change.after || !change.before) {
      console.log('No updates made');
      return Promise.resolve();
    }

    const previous = change.before.val();
    const updated = change.after.val();

    if (previous.state === updated.state) {
      console.log('No change to status. Returning...');
      return Promise.resolve();
    }

    const cameOnline = updated.state === 'Online';
    const countRef = admin.database().ref('playersOnline');
    const lastCountSnap = await countRef.once('value');
    const lastCount = lastCountSnap.val();
    let updatedCount = cameOnline ? lastCount + 1 : lastCount - 1;
    updatedCount = updatedCount >= 0 ? updatedCount : 0;
    return countRef.set(updatedCount);
  });

export const onPointWon = functions.firestore
  .document('games/{gameId}')
  .onUpdate(async (change, _context) => {
    if (!change || !change.after || !change.before) {
      console.log('No updates made');
      return null;
    }

    const lastGame = change.before.data();
    const game = change.after.data();

    if (!game) {
      console.log('No game found');
      return null;
    }

    const hasPointWon = !!lastGame && !lastGame.roundWinner && !!game.roundWinner;
    const hasGameWon = !!lastGame && !lastGame.winner && !!game.winner;

    if (!hasGameWon && !hasPointWon) {
      console.log('No updates to points. Exiting...');
      return null;
    }

    const userId = game.roundWinner.uid;
    const userRef = admin.firestore().doc(`users/${userId}`);
    const userSnaphot = await userRef.get();
    const user = userSnaphot.data();

    if (!user) {
      console.log('No user found. Cannot update points');
      return null;
    }

    const updates: any = {
      totalPoints: (user.totalPoints || 0) + 1
    }

    if (hasGameWon) {
      updates.gamesWon = (user.gamesWon || 0) + 1
    }

    return userRef.update(updates);
  });
