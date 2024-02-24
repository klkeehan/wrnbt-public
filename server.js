require('dotenv').config();

const tmi = require('tmi.js');

const client = new tmi.Client({
    options: { debug: true },
	channels: [ 'eyedazzler', 'suzyqpid' ],
    identity: {
        username: process.env.TWITCH_BOT_USERNAME,
        password: process.env.TWITCH_OAUTH_TOKEN
    }
});

client.connect();

client.on('message', (channel, tags, message, self) => {

    if (!self) {
        // client.say(channel, `Message "${message}" was sent by ${tags.username}`);

        var msg = message.split(' ');

        var command = msg[0];
        var argument = msg[1];

        if (command === '=commands') {
            client.say(channel, 'nothing here yet FeelsDankMan');
        }

        if (command === '=echo') {
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

        if (command === 'c') {
            client.say(channel, '!continue');
        }

        if (command === 'r') {
            client.say(channel, '!restart');
        }

        /*
        // mirror update
        if (command === '=mirror') {

            var link;

            if (argument!=null) {
                link = 'is this even working';
                client.say(channel, 'updated mirror ApuApproved')
            } 
            
            else { 
                client.say(channel, link); 
            }
        }
        */

        // bw stuff
        function bwRep(word0) {
            word = "" + word0;
            client.say(channel, word);
        }

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

        if ((command === '=bw') || (command === '!bw')) {
            bwRep();

            var bwTimer = setInterval(bwRep, 20000);
            setTimeout(() => { clearInterval(bwTimer); }, 60000 )
        }
    }

	// "Alca: Hello, World!"
	// console.log(`${tags['display-name']}: ${message}`);
});