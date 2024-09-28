require('dotenv').config();

const tmi = require('tmi.js');

const client = new tmi.Client({
    options: { debug: true },
	channels: [ 'wrnbt','suzyqpid', 'wrenqp' ],
    identity: {
        username: process.env.TWITCH_BOT_USERNAME,
        password: process.env.TWITCH_OAUTH_TOKEN
    }
});

client.connect();

// global variables
var interval;
var argW = '';
var link;
var flowerInv = [];
const cooldowns = {};
var toggle;

client.on('message', async (channel, tags, message, self) => {

    // functions
    function flowerCommand(channel, user) {
        const flowers = ['tulip', 'hibiscus', 'sunflower', 'hyacinth', 'rose'];
        const emojis = ['🌷', '🌺', '🌻', '🪻', '🌹'];

        var num = generateNum();

        var randomFlower = flowers[num];
        var emoji = emojis[num];

        if (!flowerInv[user]) {
            flowerInv[user] = [];
        }
        flowerInv[user].push(emoji);

        client.say(channel, `${tags.username}, you picked a ${randomFlower}! FBCatch ${emoji}`);
    }

    function flowerDisplay(channel, user) {
        const userFlowers = flowerInv[user] || [];

        if (userFlowers.length > 0) {
            const flowerList = userFlowers.join(' ');
            client.say(channel, `${tags.username}'s flowers: ${flowerList}`);
        }
        else {
            client.say(channel, `${tags.username} has no flowers notAlright`);
        }
    }

    function generateNum() {
        const randInd = Math.floor(Math.random() * 5);
        return randInd;
    }

    if (!self) {
        var msg = message.split(' ');

        var command = msg[0];
        var argA = msg[1];
        var argB = msg[2];

        // badge detect for owner/mod only commands
        var badge = tags['badges-raw'];
        var bcRegex = /^broadcaster/;
        var mdRegex = /^moderator/;

        if (command === '!flower') {
            user = `${tags.username}`;

            if (argA === 'inv') {
                flowerDisplay(channel, user);
            }

            else {
                if (!cooldowns[tags.username] || Date.now() - cooldowns[tags.username] >= 1000000) {
                    flowerCommand(channel, user);
                    cooldowns[tags.username] = Date.now();
                }
                else {
                    client.say(channel, `${tags.username}, this command is on cooldown alr`);
                }
            }
        }

        if ((message === ':p') || (message === ':P')) {
            client.say(channel, 'TehePelo');
        }

        if (command === '=commands') {
            client.say(channel, 'https://wrrens.gitbook.io/wrnbt/');
        }

        if ((command === '=echo') || (command === '=e')) {
            client.say(channel, argA);
        }

        if (command === '=hello') {
            if (argA == null) {client.say(channel, `hello ${tags.username} !`)}
            else {client.say(channel, `hello ${argA} !`)};
        }

        if (command === '=ping') {
            client.say(channel, 'FeelsDankMan 🏓 pong');
        }

        if (command === '=tf') {
            client.say(channel, `https://tools.2807.eu/follows?user=${argA}`);
        }

        if ((command === 'c') || (command === '!c') || (command === 'C')) {
            client.say(channel, '!continue');
        }

        if ((command === 'r') || (command === '!r') || (command ==='R')) {
            client.say(channel, '!restart');
        }

        // broadcaster/mod only command
        if ((command === '=spam') && ((badge.match(bcRegex)) || (badge.match(mdRegex)))) {
            var x = argA;
            var y = message.replace("=spam", "");
            y = y.replace(argA, "");

            if (x < 11) {
                for(var i=0; i<x; i++) {
                    client.say(channel, y);
                }
            }

            else {
                client.say(channel, '/me cannot send more than 10 lines alr');
            }
        }

	// broadcaster/mod only command
        if ((command === '=pyramid') && ((badge.match(bcRegex)) || (badge.match(mdRegex)))) {
            var x = argA;
            var y = message.replace("=pyramid", "");
            y = y.replace(argA, "");
            var i;

            if (x < 11) {
                for (var i=0; i<=x; i++) {
                    client.say(channel, y.repeat(i));
                }

                for (var i=x-1; i>=1; i--) {
                    client.say(channel, y.repeat(i));
                }
            }

            else {
                client.say(channel, '/me cannot send pyramid with width greater than 10 alr');
            }
        }

        if (command === '=togglet') {
            if (toggle == 0) {
                toggle = 1;

                client.say(channel, 'toggled on FeelsOkayMan')
            }
            else {
                toggle = 0;

                client.say(channel, 'toggled off FeelsOkayMan')
            }
        }

        if (command === '=test') {
            if (toggle == 0) {
                client.say(channel, 'this command is toggled off FeelsDankMan');
            }
            else {
                client.say(channel, 'ppL');
            }
        }

        if (command === '=tuck') {
            client.say(channel, `${tags.username} tucked ${argA} into bed gn`);
        }

        if (command === '=emotes') {
            client.say(channel, `https://emotes.raccatta.cc/twitch/${argA}`);
        }

        // personal command,, arg must use '7day' '1month' '3month' '6month' '12month' or 'overall'
        if ((command === '=collage') && (tags.username === 'wrrens')) {
            client.say(channel, `https://www.tapmusic.net/collage.php?user=wrrens&type=${argA}&size=3x3&caption=true`)
        }

        // WIP
        if (command === '=bug') {
            var x = Math.floor(Math.random() * 15);

            if ((x >= 0) && (x < 4)) { client.say(channel, `${tags.username}, you did not catch a bug notAlright`); }
            else if ((x >= 4) && (x < 8)) { client.say(channel, `${tags.username}, you caught a caterpillar! FBCatch 🐛`); }
            else if ((x >= 8) && (x < 11)) { client.say(channel, `${tags.username}, you caught a beetle! FBCatch 🪲`); }  
            else if ((x == 11) || (x == 12)) { client.say(channel, `${tags.username}, you caught a ladybug! FBCatch 🐞`); }
            else if ((x == 13) || (x == 14)) { client.say(channel, `${tags.username}, you caught a spider! FBCatch 🕷️`); }
            else if (x == 15) { client.say(channel, `${tags.username}, you caught a butterfly! FBCatch 🦋`)}       
        }

        if (command === '=bugodds') {
            client.say(channel, 'no bug - 4/15 | 🐛 - 4/15 | 🪲 - 3/15 | 🐞 - 2/15 | 🕷️ - 2/15 | 🦋 - 1/15')
        }

        // define command
        if ((command === '=define') || (command === '=def') || (command === '!define') || (command === '!def')) {
            var word = argA.toLowerCase();
            var url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

            fetch(url)
            .then(response => {
                return response.json();
            })
            .then(word => {
                var def = word[0].meanings[0].definitions[0].definition;
                client.say(channel, `/me ${argA}: ${def}`);    
            })
            .catch(_ => {
                client.say(channel, `/me couldn't find a definition for ${argA} FeelsDankMan`);
            })
        }
	
	// BW COMMAND
        if ((command === '!bw') || (command === '=bw')) {
            clearInterval(interval);
            argW = argA.toUpperCase();
            argW = argW.split('').join(' ');

            client.say(channel, `/me ${argW}`);

            interval = setInterval(() => {
                client.say(channel, `/me ${argW}`);
            }, 20000);
        }

        if ((message === 'stop') || (message === ',')) {
            clearInterval(interval);
        }        
    }
});
