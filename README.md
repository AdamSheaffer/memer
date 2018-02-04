# MEMER 

A multiplayer card game a la _Cards Against Humanity_ or _Know Your Meme_. Memer pulls from the [GIPHY API](https://developers.giphy.com/) so every game will have new and random community cards.

[Play here](https://i-memer.firebaseapp.com)

![Screenshot][screencast]

[screencast]: https://dr5mo5s7lqrtc.cloudfront.net/items/2n2K3C402i3h250J3I14/Screen%20Recording%202018-02-04%20at%2012.13%20PM.gif "MEMER screenshot"

### Rules

* Players get dealt 7 **CAPTION CARDS**
* One Player is chosen to be the **JUDGE**. The judge selects from a random set of 4 popular categories (i.e. Food, Chuck Norris, Alcohol, Sassy)
* After the judge picks a category, GIPHY selects 4 random gifs. The judge selects 1 gif to be the **COMMUNITY CARD**
* All other players select a caption card to play on top of the community card.
* A meme gets generated for each player using the community card and their selected caption card
* The judge selects their favorite meme and the player that submitted the caption scores a point
* The round resets and the next player becomes the judge
* First player to 10 points wins