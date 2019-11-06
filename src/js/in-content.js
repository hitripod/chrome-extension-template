/* in-content.js
*
* This file has an example on how to communicate with other parts of the extension through a long lived connection (port) and also through short lived connections (chrome.runtime.sendMessage).
*
* Note that in this scenario the port is open from the popup, but other extensions may open it from the background page or not even have either background.js or popup.js.
* */

// Extension port to communicate with the popup, also helps detecting when it closes
let port = null;

// Regular expression for ETH transaction
let ethTx = '/^0xcd[a-fA-F0-9]{62}$/';
let ethAddr = '/^0x[a-fA-F0-9]{40}$/';

// Send messages to the open port (Popup)
const sendPortMessage = data => port.postMessage(data);

// Handle incoming popup messages
const popupMessageHandler = message => console.log('in-content.js - message from popup:', message);

// Start scripts after setting up the connection to popup
chrome.extension.onConnect.addListener(popupPort => {
    // Listen for popup messages
    popupPort.onMessage.addListener(popupMessageHandler);
    // Set listener for disconnection (aka. popup closed)
    popupPort.onDisconnect.addListener(() => {
        console.log('in-content.js - disconnected from popup');
    });
    // Make popup port accessible to other methods
    port = popupPort;
    // Perform any logic or set listeners
    sendPortMessage('message from in-content.js');
});

// Response handler for short lived messages
const handleBackgroundResponse = response => {

    document.querySelectorAll('address').forEach(el => {
        // console.log(el.innerText);
        let res = lookupTx(el);
        
        // el.innerHTML =
        // lookupTx('xxx');
    });
}

const lookupTx = (el) => {
    //http://localhost:3000/transactions
    fetch(`https://172.20.2.231:8591/info`, {
        mode: 'cors',
        credentials: 'include'
    })
        .then(r => r.json()).then(res => {
            console.log(res);
            let _res = [
                {
                    Tx: "0x13ee7391472533a8f1cd16d1db160889ee0493fc",
                    FirstName:     "Yaowei",
                    LastName:      "Ou",
                    Ssn:           "001-8334-8733",
                    DriverLicense: "FA-3870223",
                    State:         "CA",
                },
                {
                    Tx: "0xdda6898e71868f7f38396c71107b01396ad4c36a",
                    Name:     "Coinbase Inc",
                    RegNumber: "22345",
                    State:         "CA",
                    Address: "548 Market St.",
                    Category: "Exchange",
                    Jurisdiction: "San Francisco, USA",
                    Domain: "coinbase.com"
                }
            ];
            

            // res = {
            //     "Individuals": {
            //         "Tx": "0x13ee7391472533a8f1cd16d1db160889ee0493fc",
            //         "FirstName": "Sidney",
            //         "LastName": "Lin",
            //         "Ssn": "001-8334-8733",
            //         "DriverLicense": "FA-3870223",
            //         "State": "CA"
            //     },
            //     "Businesses": {
            //         "Tx": "0xdda6898e71868f7f38396c71107b01396ad4c36a",
            //         "Name": "Coinbase Inc.",
            //         "RegNumber": "22345",
            //         "State": "CA",
            //         "Address": "548 Market St.",
            //         "Category": "Exchange",
            //         "Jurisdiction": "San Francisco, USA",
            //         "Domain": "coinbase.com"
            //     }
            // }


            for (i in res) {


                if(res[i].Tx === el.innerText) {
                    console.log('matched');

                    el.innerText = res[i].Name || res[i].FirstName + ' ' + res[i].LastName




                    var tip = document.createElement('div');
                    let meta;

                    if(res[i].Name) {
                        meta = `Tx: ${res[i].Tx}.<br>${res[i].Name}, Reg: ${res[i].RegNumber}, State: ${res[i].State}, Address: ${res[i].Address}, ${res[i].Category}, ${res[i].Jurisdiction}, ${res[i].Domain}`
                    }

                    if(res[i].FirstName) {
                        meta = `Tx: ${res[i].Tx}.<br>${res[i].FirstName} ${res[i].FirstName}, SSN: ${res[i].Ssn}, DL: ${res[i].DriverLicense}, State: ${res[i].State}`
                    }

                    tip.innerHTML = meta

                    el.appendChild(tip);



                }
            }

            _res.forEach(tx => {
                return;
                if(tx.Tx === el.innerText) {
                    console.log('matched');
                    el.innerText = tx.Name || tx.FirstName + ' ' + tx.LastName

                    var tip = document.createElement('div');
                    let meta;

                    if(tx.Name) {
                        meta = `${tx.Name}, Reg: ${tx.RegNumber}, State: ${tx.State}, Address: ${tx.Address}, ${tx.Category}, ${tx.Jurisdiction}, ${tx.Domain}`
                    }

                    if(tx.FirstName) {
                        meta = `${tx.FirstName} ${tx.FirstName}, SSN: ${tx.Ssn}, DL: ${tx.DriverLicense}, State: ${tx.State}`
                    }

                    tip.innerHTML = el.innerText + ' ' + meta

                    el.appendChild(tip);
                }
            })






            if(false)
                el.innerHTML = 'xxx';

        })
        .catch(e => console.error(e));
}

// Send a message to background.js
chrome.runtime.sendMessage('Message from in-content.js!', handleBackgroundResponse);

// TODO: Replace the hash with the KYC information from TRISA here.
// var images = document.getElementsByTagName('img');
// for (var i = 0, l = images.length; i < l; i++) {
//     images[i].src = 'http://placekitten.com/' + images[i].width + '/' + images[i].height;
// }
