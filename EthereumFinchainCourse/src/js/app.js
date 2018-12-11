App = {
    web3Provider: null,
    contracts: {},

    init: () => {
        return App.initWeb3();
    },

    initWeb3: () => {
        if (typeof web3 !== 'undefined') {
            App.web3Provider = web3.currentProvider;
            web3 = new Web3(web3.currentProvider);
        } else {
            App.web3Provider = new web3.providers.HttpProvider('http://localhost:8545');
            web3 = new Web3(App.web3Provider);
        }

        return App.initContract();
    },

    initContract: () => {
        $.getJSON('EthereumFinchainCourse.json', (data) => {
            var EthereumFinchainCourseArtifact = data;
            App.contracts.EthereumFinchainCourse = TruffleContract(EthereumFinchainCourseArtifact);
            App.contracts.EthereumFinchainCourse.setProvider(App.web3Provider);

            return App.showWallet();
        });

        return App.bindEvents();
    },

    bindEvents: function () {
        $(document).on('click', '.btn-send', App.handleSend);
    },

    isEmpty: (string) => {
        return !string || 0 === string.length;
    },

    handleSend: function () {
        event.preventDefault();

        var outputMessage = $('.output-message');

        var contractInstance;

        App.contracts.EthereumFinchainCourse.deployed().then(function (instance) {
            contractInstance = instance;

            var messageCheck = "";

            var addressTo = $('.addressTo').val();
            if (App.isEmpty(addressTo)) {
                messageCheck += " Address is empty!"
            }

            var amount = $('.tokenAmount').val();
            if (App.isEmpty(amount)) {
                messageCheck += " Amount is empty!"
            }

            if (App.isEmpty(messageCheck)) {
                return contractInstance.transfer(addressTo, parseFloat(amount));
            } else {
                outputMessage.css('color', 'red').text(messageCheck);
            }
        }).then(function (result) {
            if (result) {
                outputMessage.css('color', 'green').text(`Transfered!`);
            }
        }).catch(function (err) {
            console.log(err);
            outputMessage.text(err.message);
        });
    },

    qrCodeDraw: (account) => {
        var qr = new JSQR();
        var code = new qr.Code();

        code.encodeMode = code.ENCODE_MODE.BYTE;
        code.version = code.DEFAULT;
        code.errorCorrection = code.ERROR_CORRECTION.H;

        var input = new qr.Input();
        input.dataType = input.DATA_TYPE.TEXT;
        input.data = account;

        var matrix = new qr.Matrix(input, code);
        matrix.scale = 4;
        matrix.margin = 2;

        var canvas = $('#wallet-address-qrcode')[0]
        canvas.setAttribute('width', matrix.pixelWidth);
        canvas.setAttribute('height', matrix.pixelWidth);

        canvas.getContext('2d').fillStyle = 'rgb(0,0,0)';
        matrix.draw(canvas, 0, 0);
    },

    showAddress: (account) => {
        $('.wallet-address').text(account);
        App.qrCodeDraw(account);
    },

    showEthBalance: (account) => {
        web3.eth.getBalance(account, (err, result) => {
            if (err) {
                throw err;
            }
            var ethBalance = web3.fromWei(result);
            $('.wallet-amount-eth').text(ethBalance);
        });
    },

    showTokenBalance: (account) => {
        var contractInstance;

        App.contracts.EthereumFinchainCourse.deployed().then(
            (instance) => {
                contractInstance = instance;

                return contractInstance.balanceOf(account);
            }
        ).then((balanceOf) => {
            contractInstance.decimals().then((decimals) => {
                $('.wallet-amount-token').text((balanceOf / Math.pow(10, decimals)).toFixed(decimals));
            })
        }).catch((err) => {
            console.log(err.message);
        });
    },

    showWallet: () => {
        var account = web3.eth.accounts[0];

        App.showAddress(account);
        App.showTokenBalance(account);
        App.showEthBalance(account);
    }
};

$(
    () => {
        $(window).load(() => {
            App.init();
        });
    }
);