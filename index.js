// Import required classes and functions from the Discord.js library
const { Client, GatewayIntentBits } = require('discord.js');
// Import the bot token from the configuration file
const { token } = require('./config.json');

// Create a new Discord client instance with specific intents
const client = new Client({ 
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] 
});

// Define the ID of the target guild (replace "GUILD ID" with the actual ID)
const guildId = "GUILD ID";

/**
 * Utility function to pause execution for a specified amount of time
 * @param {number} ms - Time to sleep in milliseconds
 * @returns {Promise<void>}
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Event listener triggered when the bot is ready
client.once('ready', async () => {
    console.log(`Bot is ready! Time to clean up the guild. 🚀`);

    try {
        // Fetch the guild by its ID
        const guild = await client.guilds.fetch(guildId);
        console.log(`Connected to guild: ${guild.name}`);

        // --- Delete Roles ---
        const roles = await guild.roles.fetch();
        const botHighestRole = guild.members.me.roles.highest;

        for (const role of roles.values()) {
            // Skip managed roles, the @everyone role, or roles above the bot's highest role
            if (!role.managed && role.name !== '@everyone' && role.comparePositionTo(botHighestRole) < 0) {
                await sleep(1000); // 1-second delay between deletions
                try {
                    await role.delete();
                    console.log(`Role deleted: ${role.name}`);
                } catch (error) {
                    console.error(`Failed to delete role: ${role.name}`, error);
                }
            }
        }
        console.log("All eligible roles have been deleted!");

        // --- Delete Channels ---
        const channels = await guild.channels.fetch();

        for (const channel of channels.values()) {
            await sleep(2000); // 2-second delay between deletions
            try {
                await channel.delete();
                console.log(`Channel deleted: ${channel.name}`);
            } catch (error) {
                console.error(`Failed to delete channel: ${channel.name}`, error);
            }
        }
        console.log("All channels have been deleted!");

        // --- Ban Members ---
        const members = await guild.members.fetch();

        for (const member of members.values()) {
            if (!member.user.bot) { // Skip bots
                await sleep(2000); // 2-second delay between bans
                try {
                    await member.ban({ reason: 'Violation of Discord TOS' });
                    console.log(`Member banned: ${member.user.tag}`);
                } catch (error) {
                    console.error(`Failed to ban member: ${member.user.tag}`, error);
                }
            }
        }
        console.log("All non-bot members have been banned!");

        // Disconnect the bot after cleanup
        client.destroy();
    } catch (error) {
        console.error("An error occurred during the guild cleanup process:", error);
    }
});

// Log in to Discord with the bot's token
client.login(token);
