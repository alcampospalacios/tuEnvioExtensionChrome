var basics = require('./basics');
var request = require('request');
var cheerio = require('cheerio');
var cron = require('node-cron');
var Task;

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
    Task = cron.schedule(basics.time, async () => {        
        await getAlert(basics.URLBase, basics.URLCARLOS3);     
        await getAlert(basics.URLBase, basics.URL4CAMINOS);      
        await getAlert(basics.URLBase, basics.URLTVPEDREGAL);        
        await getAlert(basics.URLBase, basics.URLTIPICABOLLEROS);
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
    chrome.storage.local.set({ active: false });
    chrome.browserAction.setIcon({ path: 'icon1' + '.png' });
});


chrome.browserAction.onClicked.addListener(currentStatus);



