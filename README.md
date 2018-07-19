# MEMER 

A multiplayer card game a la _Cards Against Humanity_ or _Know Your Meme_. Memer pulls from the [GIPHY API](https://developers.giphy.com/) so every game will have new and random community cards.

#### Disclaimer!
By default _MEMER_ is NSFW, but if you want to get your meme on at the office, there is now a **Safe For Work** mode that can be toggled on and off. 

PLAY [HERE](https://i-memer.firebaseapp.com)

![Screenshot][screenshot]

[screenshot]: screenshots/screenshot1.png "MEMER screenshot"

### Rules

* Players get dealt 7 **CAPTION CARDS**
* One Player is chosen to be the **JUDGE**. The judge selects from a random set of 4 popular categories (i.e. Food, Chuck Norris, Alcohol, Sassy)
* After the judge picks a category, GIPHY selects 4 random gifs. The judge selects 1 gif to be the **COMMUNITY CARD**
* All other players select a caption card to play on top of the community card.
* A meme gets generated for each player using the community card and their selected caption card
* The judge selects their favorite meme and the player that submitted the caption scores a point
* The round resets and the next player becomes the judge
* First player to 10 points wins