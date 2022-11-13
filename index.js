var {Telegraf} = require('telegraf')
var bip39 = require('bip39');
var axios = require('axios');
var Web3 = require('web3');
const ethers = require('ethers');
const bot = new Telegraf('5611236558:AAHpt5g3yvgwwxHVhE4iKjQfJNFyFZsgO5s');

let etherValue = 0;
const startBrute = async() => {
    
        let generateMnemonic = bip39.generateMnemonic();
        return generateMnemonic;
        };
    

const getAdr = (mnemonic) =>{
    try{
        const wallet = ethers.Wallet.fromMnemonic(mnemonic);
        return wallet.address
    }catch{
        console.log("Невалидная сидка")
    }
}



const getBalance = async (address) => {
    
try{
    
await axios.get(`https://api.etherscan.io/api
?module=account
&action=balancemulti
&address=${address}
&tag=latest
&apikey=JPXWEADH99FMMAXX2RUQTP46YAA718GNZZ`)
.then(res => {
   let wei = res.data.result[0].balance;
   etherValue = Web3.utils.fromWei(wei, 'ether') * 1;

    
    }).catch(err => { 
        console.log(err); 
      });
    }catch(e){
        console.warn('ya upal')
    }

    return etherValue;
    
}



bot.start((ctx) => {

      ctx.replyWithHTML('<b>Здорова:)</b> \n /brute - для начала');
     })
   
 bot.command('brute', async (ctx) => {
    ctx.replyWithHTML(`<b>Сколько брутить?</b>`)
 })   

 bot.on('message', async (ctx)=> {
    let counter = 0;
    ctx.replyWithHTML(`<b> Начал ${ctx.message.text} операций... </b>`)
    for(i = 0; i <= ctx.message.text; i++ ) {
        (function(ind) {
            setTimeout( async function(){
                if(counter == 100){
                    ctx.replyWithHTML(`<b> Прошло ${counter} операций</b>`)
                    counter = 0;
                }
                if(i == ind + 1){
                    ctx.replyWithHTML(`<b> Закончил ${ctx.message.text} операций</b>`)
                }
                let mnenomic = await startBrute();
                let wallet = await getAdr(mnenomic);
                
                let balance = await getBalance(wallet)
                if(balance > 0.00006 && mnenomic){
                    ctx.replyWithHTML(`<b> ETH: ${balance} \n ${mnenomic}</b>`)
                }
                    
                counter++;

            }, 10000 * ind);
        })(i);
    }

 }) 

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
