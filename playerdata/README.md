This is the directory where players have their krunker data stored.

### users.json
There is one main file, *`users.json`,* Which holds the registered Discord users and the krunker accounts they are paired with. It looks like this:
```
$ users.json
{
    "discordID": [],
    "playerIndex": [],
    "krunkerID": [],
    "krunkerName": []
}
```
For example the discord user at i = 0 in `users.discordID` is username#1234 and the krunker account he's paired with is in `users.krunkerID`/`users.krunkerName` and at index `users.playerIndex[0]`. I designed it like this so that there is a easy way I can check to see if a krunker player is registered to anyone (If they are, its index in `users.krunkerID` (e.g. 0) will be somewhere in `users.playerIndex`).

This architecture also lets me very easy allow multiple Discord users to be registered to the same Krunker player (this feature might be removed later!):
```
{
    "discordID": ["foo@123", "bar@456"],
    "playerIndex": [0, 0],
    "krunkerID": ["<KRUNKER_PLAYER_ID>"],
    "krunkerName": ["<KRUNKER_PLAYER_NAME>"]
}
```

### Krunker player data
This folder also contains all the fetched and stored Krunker player data.
These files follow this convention:
```
$ <KRUNKER_PLAYER_ID>.json
{
    stuff here. I don't actually know what this looks like yet!
}
```
Each krunker player the bot is watching over has their own file like above.

