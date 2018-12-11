var MetaCoin = artifacts.require("./MetaCoin.sol");

module.exports = function (callback) {

    console.log('############# Ethereum-Course - truffle exec - MetaCoin.sendCoin #############\n')

    MetaCoin.deployed().then((instance) => {
        let args = process.argv.slice(2)

        if (['h', 'help', '--help'].includes(args[2])) {
            callback(`Send MetaCoin values using 'value' ,'to address' and 'from address' parameters.
                \nEx (from default account): truffle exec sendCoin.js 300 0x95e929e6d62b3ccec9f476bef71c397edbfe9f24 
                \nEx (from address parameter): truffle exec sendCoin.js 300 0x95e929e6d62b3ccec9f476bef71c397edbfe9f24 0xda14c10c2c77992a84a290c9ac1d4b2d2d4acd4f`)
        }

        if (!args[2] || !args[3]) {
            callback(`Please pass 'value' and 'to address' and 'from address' (optional) parameters.
                \nEx: truffle exec sendCoin.js 300 0x95e929e6d62b3ccec9f476bef71c397edbfe9f24
                \n\nMore informations user 'help parameter: truffle exec sendCoin.js help'`)
        }

        let value = Number(args[2])
        let to = args[3]
        let from = web3.eth.accounts[0]
        if (args[4]) {
            from = args[4]
        }

        instance.getBalance(from).then((balance) => {
            console.log(`The balance of ${from} (from) is ${balance.toString()}`)
        })

        instance.getBalance(to).then((balance) => {
            console.log(`The balance of ${to} (to) is ${balance.toString()}`)
        })

        instance.sendCoin(to, value, {
            from: from
        }).then((result) => {
            console.log(`\nSend ${value} from ${from} to ${to}...`)
            let message = `Transfer ${value} to ${to} is ${result ? 'OK' : 'FAIL'}`
            console.log('MetaCoin.sendCoin: ', message, `\n`)
        })

        instance.getBalance(from).then((balance) => {
            console.log(`The balance of ${from} (from) is ${balance.toString()}`)
        })

        instance.getBalance(to).then((balance) => {
            console.log(`The balance of ${to} (to) is ${balance.toString()}`)
        })
    })
}