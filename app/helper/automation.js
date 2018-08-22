const puppeteer = require('puppeteer');
const fs = require('fs');

const infomations = require('../config/infomations');
const selectors = require('../config/selectors');
const others = require('../config/others');

const array = require('../helper/array');
const folder = require('../helper/folder');
const file = require('../helper/file');
const string = require('../helper/string');
const { imgDiff } = require('img-diff-js');
const async = require('async');

async function automateLogin(page, pathFolder, selector, info, nameImg) {
    await page.waitFor(others.timewait);
    await page.click(selector);
    await page.keyboard.type(info);
}

async function automateEventClick(page, pathFolder, selector, nameImg, timewait) {
    await page.waitFor(timewait);
    await page.click(selector);
    await page.waitFor(timewait * 2);
    await page.screenshot({
        path: `${pathFolder}/current_${nameImg}.png`,
        fullPage: true
    });
}

async function automatePage(page, pathFolder, pathName, nameImg) {
    await page.goto(`${others.hostname}/${pathName}`);
    await page.waitFor(others.timewait);
    await page.screenshot({
        path: `${pathFolder}/current_${nameImg}.png`,
        fullPage: true
    });
}
function runAutomation(pathFolder, pathSaveFolder, isSaveBase, isCompare) {
    const promises = [];
    promises.push(
        puppeteer.launch({
            headless: false,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-gpu',
            ],
        }).then(async browser => {
            await browser.newPage()
                .then(async page => {
                    await page.setViewport({
                        width: 1440,
                        height: 900
                    });
                    await automatePage(page, pathFolder, 'login', 'login');
                    await automateLogin(page, pathFolder, selectors.email, infomations.email, 'email');
                    await automateLogin(page, pathFolder, selectors.password, infomations.password, 'password');
                    await automateEventClick(page, pathFolder, selectors.button_login, 'dashboard', others.timewait * 2);
                    await automatePage(page, pathFolder, 'cas/connections/', 'my_application');
                    await automatePage(page, pathFolder, 'cas/applicationcatalog/', 'application_catalog');
                    await automatePage(page, pathFolder, 'groupmanagement/', 'user_group');
                    await automatePage(page, pathFolder, 'usermanagement/', 'user_directory');
                    await automatePage(page, pathFolder, 'usersbyserviceng/', 'users_by_service');
                    await automatePage(page, pathFolder, 'cas/config/idpng/', 'identity_repository');
                    await automatePage(page, pathFolder, 'cas/config/clouddesktopng/', 'dock');
                    await automatePage(page, pathFolder, 'cas/config/authnpolicy/', 'authentication_policy');
                    await automatePage(page, pathFolder, 'cas/config/pingid/', 'pingID');
                    await automateEventClick(page, pathFolder, selectors.settings_client_integration, 'settings_client_integration', others.timewait);
                    await automateEventClick(page, pathFolder, selectors.settings_branding, 'settings_branding', others.timewait);
                    await automateEventClick(page, pathFolder, selectors.setting_device_pairing, 'setting_device', others.timewait);
                    await automateEventClick(page, pathFolder, selectors.setting_policy, 'setting_policy', others.timewait);
                    await automatePage(page, pathFolder, 'directoryPasswordPolicy/', 'directory_password_policy');
                    await automatePage(page, pathFolder, 'directoryRegistration', 'directory_registration');
                    await automatePage(page, pathFolder, 'cid/credentials', 'directory_api_credentials');
                    await automatePage(page, pathFolder, 'cas/config/certificates/', 'certificates');
                });
            browser.close();
        }))
    Promise.all(promises).then(() => {
        if (isSaveBase)
            saveFileToBase(pathFolder, pathSaveFolder);
        if (isCompare)
            compareFile(pathFolder, pathSaveFolder);
    })

}


function saveFileToBase(pathFolder, pathSaveFolder) {
    fs.readdirSync(`${pathFolder}`).forEach(file => {
        var nameFile = string.splitFileName(file);
        if (!fs.existsSync(`${pathSaveFolder}/${nameFile}`)) {
            folder.createFolder(`${pathSaveFolder}/${nameFile}`);
        }
        fs.createReadStream(`${pathFolder}/${file}`)
            .pipe(fs.createWriteStream(`${pathSaveFolder}/${nameFile}/base_${nameFile}_0.png`));
        console.log(`Created: ${nameFile}_0.png`);
    })
}


function compareFile(pathFolder, pathSaveFolder) {
    async.parallel([
        function (callback) {
            fs.readdir(`${pathSaveFolder}`, callback);
        },
        function (callback) {
            fs.readdir(`${pathFolder}`, callback);
        }
    ], function (err, results) {
        let length = results[1].length;

        if (length == 0) {
            console.log('Error: Length is not suitable: 0');
        }
        else {
            console.log('Start create diff');
            for (let i = 0; i < length; i++) {
                var index_promises = folder.getIndexBaseImages(pathSaveFolder, pathFolder, results[0][i], results[1][i]);
                Promise.all(index_promises)
                    .then(res => {
                        
                        var nameFileDiff = string.splitFileName(results[1][i]);
                        var value = array.getIndexLatest(res, -1);
                        console.log(`base_${results[0][i]}.png: ${res} `);
                      
                        if (value !== -1) {
                            var data = `base_${results[0][i]}.png: ${res}\r\n`;
                            fs.appendFileSync('Report.txt', data);  
                            imgDiff({
                                actualFilename: `${pathSaveFolder}/${results[0][i]}/base_${results[0][i]}_${value}.png`,
                                expectedFilename: `${pathFolder}/${results[1][i]}`,
                                diffFilename: `${others.folderDiff}/diff_${nameFileDiff}_${value}.png`,
                                generateOnlyDiffFile: true,
                            }).then(result => {

                            })
                        }
                        else {
                            fs.createReadStream(`${others.folderCurrent}/${results[1][i]}`)
                                .pipe(fs.createWriteStream(`${others.folderDiff}/similar_${nameFileDiff}.png`));
                        }
                        
                       /*
                        console.log(res);
                        var nameFileDiff = string.splitFileName(results[1][i]);
                        var value = array.getIndexLatest(res, -1);

                        if (value !== -1) {
                            data_report = `base_${results[0][i]}.png: ${res}\n`;
                            fs.appendFileSync('Report.txt', data_report);  
                            var checkArray = array.checkAllElementsAreGreaterThanValue(res, 1000);
                            // if all elements are greater than 1000 => reset file report and create diff image
                            if (checkArray) {
                                //reset report file.
                                fs.writeFileSync(`${others.folderReport}/${nameFileDiff}.txt`, '');

                                //compare different image
                                imgDiff({
                                    actualFilename: `${pathSaveFolder}/${results[0][i]}/base_${results[0][i]}_${value}.png`,
                                    expectedFilename: `${pathFolder}/${results[1][i]}`,
                                    diffFilename: `${others.folderDiff}/diff_${nameFileDiff}_${value}.png`,
                                    generateOnlyDiffFile: true,
                                }).then(result => {
    
                                })
                            }
                            else {
                                //create different file
                                file.createFile(`${others.folderReport}/${nameFileDiff}.txt`, '');

                                //write pixels deviation to report
                                fs.appendFileSync(`${others.folderReport}/${nameFileDiff}.txt`, `${res}\n`);

                                //get array when reading file report
                                data = file.readFileAndSplit(`${others.folderReport}/${nameFileDiff}.txt`);

                                //check pixels deviation
                                checkDefectPixel = array.checkAllElementsAreGreaterThanValue(data, 300);
                                console.log(checkDefectPixel);

                                if (checkDefectPixel) {
                                    //compare different image
                                    imgDiff({
                                        actualFilename: `${pathSaveFolder}/${results[0][i]}/base_${results[0][i]}_${value}.png`,
                                        expectedFilename: `${pathFolder}/${results[1][i]}`,
                                        diffFilename: `${others.folderDiff}/diff_${nameFileDiff}_${value}.png`,
                                        generateOnlyDiffFile: true,
                                    }).then(result => {
        
                                    })
                                }
                                else {
                                    //create similar image
                                    fs.createReadStream(`${others.folderCurrent}/${results[1][i]}`)
                                        .pipe(fs.createWriteStream(`${others.folderDiff}/similar_${nameFileDiff}.png`));
                                }
                            }
                        } 
                        else {
                            //create similar image
                            fs.createReadStream(`${others.folderCurrent}/${results[1][i]}`)
                                .pipe(fs.createWriteStream(`${others.folderDiff}/similar_${nameFileDiff}.png`));
                        }
                        */

                    })
            }
            fs.appendFileSync('Report.txt', '________________________________\r\n');
        }
    })
}

module.exports = {
    run: async (pathFolder, pathSaveFolder) => {
        runAutomation(pathFolder, pathSaveFolder, true, false);
    },
    reload: async (pathFolder, pathSaveFolder) => {
        runAutomation(pathFolder, pathSaveFolder, false, true);
    },
    compareFile
}
