require('dotenv').config();

const tmi = require('tmi.js');

const client = new tmi.Client({
    options: { debug: true },
	channels: [ 'eyedazzler', 'wrnbt', 'suzyqpid' ],
    identity: {
        username: process.env.TWITCH_BOT_USERNAME,
        password: process.env.TWITCH_OAUTH_TOKEN
    }
});

client.connect();

client.on('message', (channel, tags, message, self) => {

    if (!self) {
        var msg = message.split(' ');

        var command = msg[0];
        var argument = msg[1];
        var argC = msg[2]; // not in use rn

        if (command === '=commands') {
            client.say(channel, 'nothing here yet FeelsDankMan');
        }

        if ((command === '=echo') || (command === '=e')) {
            client.say(channel, argument);
        }

        if (command === '=hello') {
            client.say(channel, `hello ${tags.username} !`);
        }

        if (command === '=ping') {
            client.say(channel, 'FeelsDankMan pong');
        }

        if (command === '=tf') {
            client.say(channel, `https://tools.2807.eu/follows?user=${argument}`);
        }

        if ((command === 'c') || (command === '!c')) {
            client.say(channel, '!continue');
        }

        if ((command === 'r') || (command === '!r')) {
            client.say(channel, '!restart');
        }

        /*
        if ((command === 'wrens') && (tags.username !== 'wrrens')) {
            client.say(channel, '@wrrens');
        }
        */

	// owner/mod only command
        if ((command === '=spam') && ((badge.match(bcRegex)) || (badge.match(mdRegex)))) {
            var x = argC;

            for(var i=0; i<x; i++) {
                client.say(channel, argument);
            }
        }

        // WIP
        if (command === '=fish') {
            var x = Math.floor(Math.random() * 10);

            if (x == 0) { client.say(channel, 'you did not catch a fish  FeelsBadMan'); }
            else if (x == 1) { client.say(channel, 'no luck, no fish  FeelsBadMan'); }
            else if (x == 2) { client.say(channel, 'you failed to catch a fish  FeelsBadMan'); }
            else if (x == 3) { client.say(channel, 'the fish are not biting  FeelsBadMan'); }
            else if (x == 4) { client.say(channel, 'you caught a leaf  FeelsOkayMan FBBlock 🍂'); }
            else if (x == 5) { client.say(channel, 'you caught a squid! FBCatch 🦑'); }
            else if (x == 6) { client.say(channel, 'you caught a fish! FBCatch 🐟'); }
            else if (x == 7) { client.say(channel, 'you caught a turtle! FBCatch 🐢'); }         
        }

        /*
        // mirror stuff WIP
        var link;

        const regex = /^https:\/\/wos.gg\/r\/([a-zA-Z0-9-]+)/;

        if (command.match(regex)) {
            link = command;
            client.say(channel, 'updated mirror ApuApproved');
        }

        // mirror update
        if ((command === '=mirror') && (link != null)) {
            client.say(channel, link);
        }
        */

        // bw detection
        function bwDetect() {
            if ((command === '=bw') || (command === '!bw')) {
                var word = argument;
                var word2 = word.toUpperCase();
                var word3 = word2.split('').join(' ');

                return word3;
            }
        }

        // bw repetition
        function bwRep() {
            var word = "" + bwDetect();
            client.say(channel, word);
        }
       
        // bw intervals
        var id;

        function runBw() {
            bwRep();
            id = setInterval(bwRep, 20000);
            setTimeout(() => { clearInterval(id); }, 60000)
        }

        function stopBw() {
            clearInterval(id);
        }

        if ((command === '=bw') || (command === '!bw')) {
            if (id) {
                clearInterval(id);
            }
            runBw();
        }

        if (command === '=stop') {
            stopBw();
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
    }
});
