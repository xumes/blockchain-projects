var expect = require('chai').expect

var Token = artifacts.require('./EthereumFinchainCourse.sol')

contract('Ethereum Finchain Course', (accounts) => {

    var token, owner;

    beforeEach(async () => {
        token = await Token.deployed()
        owner = accounts[0]
    });

    describe('ERC-20 compatibility test suite.', () => {
        it('Token satisfies ERC-20 interface - no async.', () => {
            token.totalSupply().then((totalSupply) => {
                expect(Number(totalSupply)).to.be.equal(1000000000000)
            })
        })

        it('Token satisfies ERC-20 interface.', async () => {
            const emptyAddress = accounts[1]

            expect(await token.totalSupply()).to.be.ok
            expect(await token.balanceOf(owner)).to.be.ok
            expect(await token.balanceOf(emptyAddress)).to.be.ok
            expect(await token.allowance(owner, emptyAddress)).to.be.ok
            expect(await token.Transfer(owner, emptyAddress, 0)).to.be.ok
            expect(await token.Approval(owner, emptyAddress, 0)).to.be.ok
        });

        it('Token satisfies ERC-20 characteristics.', async () => {
            const name = await token.name()
            assert.equal('Ethereum Finchain Course', name)

            const symbol = await token.symbol()
            assert.equal('ETHFC', symbol)

            const decimals = await token.decimals()
            assert.equal('8', decimals)

            const totalSupply = await token.totalSupply()
            expect(Number(totalSupply)).to.be.equal(1000000000000)
        });

        it('ERC-20 compatible transfer() is available.', async () => {
            const initialBalanceOwner = Number(await token.balanceOf(owner))
            const to = accounts[1]
            const initialBalanceTo = Number(await token.balanceOf(to))
            const amount = 5000.00


            const transfer = await token.transfer(to, amount)


            expect(transfer, 'Token can transfer').to.be.a('object')
            expect(/0x[\d\W\w].*/.test(transfer.tx), 'Has transfer transaction')

            token
                .Transfer({
                    to: to,
                    value: amount
                }, {
                    fromBlock: 0,
                    toBlock: 'latest'
                })
                .get(
                    (error, response) => {
                        response = response[0]
                        expect(response.event, 'Has Transfer event').to.equal('Transfer')
                        expect(response.args.from).to.be.equal(owner)
                        expect(response.args.to).to.be.equal(to)
                        expect(Number(response.args.value)).to.be.equal(amount)
                    }
                )

            expect(Number(await token.balanceOf(owner))).to.equal(initialBalanceOwner - amount)
            expect(Number(await token.balanceOf(to))).to.equal(initialBalanceTo + amount)
        });

        it('ERC-20 compatible transfer() is available - transfer fails if user exceeds his/her balance.', async () => {
            const initialBalanceOwner = Number(await token.balanceOf(owner))
            const amount = initialBalanceOwner + 1
            const to = accounts[2]

            try {
                await token.transferFrom(to, amount)
            } catch (error) {
                expect(error.message).to.equal('Invalid number of arguments to Solidity function')
            }
        });
    })
})