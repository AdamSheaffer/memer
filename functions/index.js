// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

exports.beginVoting = functions.firestore
  .document('games/{gameID}')
  .onWrite((change, context) => {
    const data = change.after.data();
    const previousData = change.before.data();
    const isReadyForVoting =
      !everyoneSubmittedCaption(previousData) && everyoneSubmittedCaption(data);

    if (isReadyForVoting && !data.isVotingRound) {
      return change.after.ref.set({
        isVotingRound: true
      }, { merge: true });
    }
  });

const everyoneSubmittedCaption = (game) => {
  const players = game.players;
  const playersNotSelected = players.filter(p => !p.captionPlayed);

  return playersNotSelected.length === 1 &&
    playersNotSelected[0].uid === game.turn;
}