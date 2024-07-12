import dotenv from 'dotenv';
import { Client, GatewayIntentBits } from 'discord.js';
import { CustomGPTClient } from './customgpt.js';
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

dotenv.config();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

const conversations = new Map();
const customgpt = new CustomGPTClient(process.env.CUSTOMGPT_PROJECT_ID, process.env.CUSTOMGPT_TOKEN);

client.on('messageCreate', async (message) => {

    if (message.channelId === process.env.DISCORD_CHANNEL_ID && !message.author.bot) {

        let conversationData = conversations.get(message.author.id);

        if (!conversationData) {
            const newConversation = await customgpt.createConversation(message.author.username);
            if (newConversation?.data?.id) {
                conversations.set(message.author.id, newConversation.data);
                conversationData = newConversation.data;
            } else {
                return void message.reply('Sorry, I\'m having trouble starting a conversation with you. Please try again later.');
            }
        }

        message.channel.sendTyping();

        const interval = setInterval(() => {
            message.channel.sendTyping();
        }, 5000);

        const response = await customgpt.sendMessageToConversation(conversationData, message.content);

        clearInterval(interval);

        if (response?.data?.openai_response) {
            return void message.reply(response.data.openai_response);
        } else {
            return void message.reply('Sorry, I\'m having trouble responding to you. Please try again later.');
        }

    }

});

setInterval(() => {
  conversations.clear();
}, 1000 * 60 * 60 * 3);

client.login(process.env.DISCORD_TOKEN);
