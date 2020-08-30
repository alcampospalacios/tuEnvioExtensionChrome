var request = require('request');
var cheerio = require('cheerio');
const cron = require('node-cron');
var Task;

const URLBase = 'https://www.tuenvio.cu/';
const URLCARLOS3 = 'carlos3/Products?depPid=46095';
const URL4CAMINOS = '4caminos/Products?depPid=46095';
const URLCIEGO = 'ciego/Products?depPid=46095';
const URLTVPEDREGAL = 'tvpedregal/Products?depPid=55';
const URLTIPICABOLLEROS = 'tipicaboyeros/Products?depPid=46095';

function getAlert(urlbase, urlObjective) {
    request(urlbase + urlObjective, (error,
        response, html) => {
        if (!error && response.statusCode == 200) {
            let $ = cheerio.load(html);
            let mainPanel = $('#mainPanel').text();

            console.log(mainPanel);
            let adviser = mainPanel.split(" ");

            if (adviser.length > 130) {
                alert("Nuevo producto encontrado en: " + urlObjective.split("/")[0]);
            }
        }
        if (error) console.log(error);
    });
}

function initNotifications() {
    alert("Notificaciones Iniciadas");
    // Comprobamos si ya nos habían dado permiso    **********Por desarrollar********
    // if (Notification.permission === "granted") {

    //     // Si esta correcto lanzamos la notificación        
    //     var notification = new Notification("Tu Envio", {
    //         body: "Servicio de notificacion iniciado correctamente!!"
    //     });
    // }

    // // Si no, tendremos que pedir permiso al usuario
    // else if (Notification.permission !== 'denied') {
    //     alert("denied");
    //     Notification.requestPermission(function (permission) {
    //         // Si el usuario acepta, lanzamos la notificación
    //         if (permission === "granted") {
    //             alert("accepted");
    //             var notification = new Notification("Gracias majo!");
    //         }
    //     });
    // }

    Task = cron.schedule('*/10 * * * * *', async () => {
        console.log('running a task every 10 seconds URLCARLOS3');
        await getAlert(URLBase, URLCARLOS3);
        console.log('running a task every 10 seconds URL4CAMINOS');
        await getAlert(URLBase, URL4CAMINOS);
        console.log('running a task every 10 seconds URLCIEGO');
        await getAlert(URLBase, URLCIEGO);
        console.log('running a task every 10 seconds URLTVPEDREGAL');
        await getAlert(URLBase, URLTVPEDREGAL);
        console.log('running a task every 10 seconds URLTIPICABOLLEROS');
        await getAlert(URLBase, URLTIPICABOLLEROS);
    });
}

function stopNotifications() {
    alert("Notificaciones Detenidas");
    Task.stop();
}

function currentStatus() {
    chrome.storage.local.get(['active'], function (result) {
        if (!result.active) {
            chrome.storage.local.set({ active: true }, function () {
                chrome.browserAction.setIcon({ path: 'icon2' + '.png' });
                initNotifications();
            });
        } else {
            chrome.storage.local.set({ active: false }, function () {
                chrome.browserAction.setIcon({ path: 'icon1' + '.png' });
                stopNotifications();
            });
        }
    });
}

chrome.runtime.onInstalled.addListener(function () {
    chrome.browserAction.setIcon({ path: 'icon1' + '.png' });
    chrome.storage.local.set({ active: false });
});

chrome.runtime.onStartup.addListener(function () {
    console.log("Starting");
    chrome.storage.local.set({ active: false });
    chrome.browserAction.setIcon({ path: 'icon1' + '.png' });
})


chrome.browserAction.onClicked.addListener(currentStatus);



