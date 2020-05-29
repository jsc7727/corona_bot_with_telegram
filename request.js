const fetch = require('node-fetch');
const cheerio = require("cheerio");
const TelegramBot = require('node-telegram-bot-api');
const {token} = require('./token');
const url = 'http://ncov.mohw.go.kr/bdBoardList_Real.do';
async function refreshing() {
    const data = await fetch(url);
    const body = await data.text();
    const $ = cheerio.load(body);
    let string = "";
    const coronaDescript = $('.bvc_txt p.s_descript').first().text() + "\n";
    string += coronaDescript;
    $('div.data_table.mgt16').first().find('th').map((index, value) => {
        const tdTag = $('div.data_table.mgt16').first().find('td')[index];
        const tdData = $(tdTag).text();
        const thData = $(value).text();
        string += `${thData} ${tdData}\n`
    });
    return string;
}


// replace the value below with the Telegram token you receive from @BotFather
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});
// Matches "/echo [whatever]"
bot.onText(/\/corona/, async (msg, match) => {
    const chatId = msg.chat.id;
    const string = await refreshing();
    bot.sendMessage(chatId, string);
});
// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const string = "/corona";
    console.log(msg);
    bot.sendMessage(chatId, string);
});
// bot.onText(/\/corona (.+)/, async (msg, match) => {
//     const chatId = msg.chat.id;
//     const string = await refreshing();
//     bot.sendMessage(chatId, string);
// });
