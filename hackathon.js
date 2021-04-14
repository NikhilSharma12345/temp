let fs = require("fs");
let puppeteer = require('puppeteer');
// node hackathon.js "TOP 10 HINDI SONGS"
let playlistname = process.argv[2];

function wait(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(ms)
        }, ms)
    })
}


async function main() {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        slowMo: 20,
        args: ['--start-fullscreen', '--disable-notifications', '--incognito']
    });

    let id = "yivebop366@art2427.com";
    let pass = "team@9999";
    let tabs = await browser.pages();
    let tab = tabs[0];
    tab.goto('https://open.spotify.com', {
        waitUntil: 'networkidle2'
    });

    // Login
    await tab.waitForSelector("._3f37264be67c8f40fa9f76449afdb4bd-scss._1f2f8feb807c94d2a0a7737b433e19a8-scss", {
        visible: true
    });
    await tab.click("._3f37264be67c8f40fa9f76449afdb4bd-scss._1f2f8feb807c94d2a0a7737b433e19a8-scss");


    await tab.waitForSelector('#login-username', {
        visible: true
    });
    await tab.type('#login-username', id);
    await tab.type('#login-password', pass);
    await tab.click("#login-button");

    await tab.waitForSelector('.icon.search-icon', {
        visible: true
    });

    let search = "/search";
    tab.goto('https://open.spotify.com' + search, {
        waitUntil: 'networkidle2'
    });

    await tab.waitForSelector('._748c0c69da51ad6d4fc04c047806cd4d-scss.f3fc214b257ae2f1d43d4c594a94497f-scss', {
        visible: true
    });
    await tab.type('._748c0c69da51ad6d4fc04c047806cd4d-scss.f3fc214b257ae2f1d43d4c594a94497f-scss', playlistname);

    await tab.waitForSelector('._85fec37a645444db871abd5d31db7315-scss', {
        visible: true
    });
    await tab.click("._85fec37a645444db871abd5d31db7315-scss");

    await tab.waitForSelector('.da0bc4060bb1bdb4abb8e402916af32e-scss.standalone-ellipsis-one-line._8a9c5cc886805907de5073b8ebc3acd8-scss span span');
    let elements = await tab.$$('.da0bc4060bb1bdb4abb8e402916af32e-scss.standalone-ellipsis-one-line._8a9c5cc886805907de5073b8ebc3acd8-scss span span');
    let songs_names_promise = [];
    for (let i = 0; i < elements.length; i++) {
        let text = await elements[i].getProperty('innerText');
        let ft = (await text).jsonValue();
        songs_names_promise.push(ft);
        
    }
    let song_names = await Promise.all(songs_names_promise);

     // new playlist
     tab.goto('https://open.spotify.com/collection/playlists', {
        waitUntil: 'networkidle2'
    });

    await tab.waitForSelector("._3f37264be67c8f40fa9f76449afdb4bd-scss._1f2f8feb807c94d2a0a7737b433e19a8-scss._0b979b912e80659fe92da99af4ebd251-scss");
    await tab.click("._3f37264be67c8f40fa9f76449afdb4bd-scss._1f2f8feb807c94d2a0a7737b433e19a8-scss._0b979b912e80659fe92da99af4ebd251-scss");

    for (let song of song_names) {
        await tab.waitForSelector("._655bc45ccbf3d91c685865ff470892eb-scss.f3fc214b257ae2f1d43d4c594a94497f-scss");
        await tab.click("._655bc45ccbf3d91c685865ff470892eb-scss.f3fc214b257ae2f1d43d4c594a94497f-scss");
        await tab.type("._655bc45ccbf3d91c685865ff470892eb-scss.f3fc214b257ae2f1d43d4c594a94497f-scss", song);

        await wait(5000);
    }
    await browser.close();

}
main();
    
