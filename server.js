require('dotenv').config();

const tmi = require('tmi.js');

const client = new tmi.Client({
    options: { debug: true },
	channels: [ 'vwrens' ],
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

client.on('message', (channel, tags, message, self) => {

    if (!self) {
        var msg = message.split(' ');

        var command = msg[0];
        var argument = msg[1];
        var argC = msg[2];

        // badge detect for owner/mod only commands
        var badge = tags['badges-raw'];
        var bcRegex = /^broadcaster/;
        var mdRegex = /^moderator/;

        if (command === '=commands') {
            client.say(channel, 'https://wrrens.gitbook.io/wrnbt/');
        }

        if ((command === '=echo') || (command === '=e')) {
            client.say(channel, argument);
        }

        if (command === '=hello') {
            if (argument == null) {client.say(channel, `hello ${tags.username} !`)}
            else {client.say(channel, `hello ${argument} !`)};
        }

        if (command === '=ping') {
            client.say(channel, 'FeelsDankMan 🏓 pong');
        }

        if (command === '=tf') {
            client.say(channel, `https://tools.2807.eu/follows?user=${argument}`);
        }

        if ((command === 'c') || (command === '!c') || (command === 'C')) {
            client.say(channel, '!continue');
        }

        if ((command === 'r') || (command === '!r') || (command ==='R')) {
            client.say(channel, '!restart');
        }

        // owner/mod only command
        if ((command === '=spam') && ((badge.match(bcRegex)) || (badge.match(mdRegex)))) {
            var x = argC;

            for(var i=0; i<x; i++) {
                client.say(channel, argument);
            }
        }

        if (command === '=tuck') {
            client.say(channel, `${tags.username} tucked ${argument} into bed gn`);
        }

        if (command === '=emotes') {
            client.say(channel, `https://emotes.raccatta.cc/twitch/${argument}`);
        }

        // personal command,, arg must use '7day' '1month' '3month' '6month' '12month' or 'overall'
        if ((command === '=collage') && (tags.username === 'wrrens')) {
            client.say(channel, `https://www.tapmusic.net/collage.php?user=wrrens&type=${argument}&size=3x3&caption=true`)
        }

        // WIP
        if (command === '=bug') {
            var x = Math.floor(Math.random() * 15);

            if (x == 0) { client.say(channel, 'you did not catch a bug notAlright'); }
            else if (x == 1) { client.say(channel, 'you did not catch a bug notAlright'); }
            else if (x == 2) { client.say(channel, 'yyou did not catch a bug notAlright'); }
            else if (x == 3) { client.say(channel, 'you did not catch a bug notAlright'); }
            else if (x == 4) { client.say(channel, 'you caught a caterpillar! FBCatch 🐛'); }
            else if (x == 5) { client.say(channel, 'you caught a caterpillar! FBCatch 🐛'); }
            else if (x == 6) { client.say(channel, 'you caught a caterpillar! FBCatch 🐛'); }
            else if (x == 7) { client.say(channel, 'you caught a caterpillar! FBCatch 🐛'); }
            else if (x == 8) { client.say(channel, 'you caught a beetle! FBCatch 🪲'); }  
            else if (x == 9) { client.say(channel, 'you caught a beetle! FBCatch 🪲'); }
            else if (x == 10) { client.say(channel, 'you caught a beetle! FBCatch 🪲'); }
            else if (x == 11) { client.say(channel, 'you caught a ladybug! FBCatch 🐞'); }
            else if (x == 12) { client.say(channel, 'you caught a ladybug! FBCatch 🐞'); }
            else if (x == 13) { client.say(channel, 'you caught a spider! FBCatch 🕷️'); }
            else if (x == 14) { client.say(channel, 'you caught a spider! FBCatch 🕷️'); }
            else if (x == 15) { client.say(channel, 'you caught a butterfly! FBCatch 🦋')}       
        }

        if (command === '=bugodds') {
            client.say(channel, 'no bug - 4/15 | 🐛 - 4/15 | 🪲 - 3/15 | 🐞 - 2/15 | 🕷️ - 2/15 | 🦋 - 1/15')
        }

        // define command
        if ((command === '=define') || (command === '=def') || (command === '!define')) {
            var word = argument.toLowerCase();
            var url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

            fetch(url)
            .then(response => {
                return response.json();
            })
            .then(word => {
                var def = word[0].meanings[0].definitions[0].definition;
                client.say(channel, `${argument}: ${def}`);    
            })
            .catch(_ => {
                client.say(channel, `couldn't find a definition for ${argument} FeelsDankMan`);
            })
        }
    
        // mirror stuff WIP
        const regex = /^https:\/\/wos.gg\/r\/([a-zA-Z0-9-]+)/;

        if (command.match(regex)) {
            link = command;
            client.say(channel, 'updated mirror ApuApproved');
        }

        // mirror update
        if ((command === '!mirror') || (command === '!link') || (command === '!wos')) {
            client.say(channel, link);
        }
        
        // BW COMMAND
        if ((command === '!bw') || (command === '=bw')) {
            clearInterval(interval);
            argW = argument;

            client.say(channel, argW);

            interval = setInterval(() => {
                client.say(channel, argW);
            }, 20000);
            setTimeout(() => { clearInterval(interval); }, 120000)
        }

        if (message === 'stop') {
            clearInterval(interval);
        }
    }
});
