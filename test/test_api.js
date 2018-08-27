process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');

const others = require('../app/config/others');
const folder = require('../app/helper/folder');
const file = require('../app/helper/file');

const expect = chai.expect;
const fs = require('fs-extra');

var loadingController = require('../app/controllers/loadingController');
const mocks = require('node-mocks-http');

chai.use(chaiHttp);

describe('Api', function() {
   
    before(done => {
        it ('should server different null', function() {
            server.listen(3000);
        })

        if (fs.pathExistsSync(`${others.folderImage}`)) {
            if (fs.pathExistsSync(`${others.folderImagesTest}`)) {
                fs.removeSync(`${others.folderImage}`);
                fs.copySync(`${others.folderImagesTest}`, `${others.folderImage}`);
            }
            else {
                fs.copySync(`${others.folderImage}`, `${others.folderImagesTest}`);
            }
        }
        else {
            fs.mkdirpSync(`${others.folderImage}`);
            fs.mkdirpSync(`${others.folderBase}`);
            fs.mkdirpSync(`${others.folderCurrent}`);
            fs.mkdirpSync(`${others.folderDiff}`);
        }
        done();
    })

    after(done => {
        server.listen(3000).close();
        //fs.removeSync(`${others.folderImage}`);
        //fs.copySync(`${others.folderImagesTest}`, `${others.folderImage}`);
        //await fs.removeSync(`${others.folderImagesTest}`);
        done();
    })

    describe('/Get Load Images When Base Folder Is Not Empty', function() {
        it ('should get all the images when has diff images', (done) => {
            file.createFile(`${others.folderDiff}/diff_dock_0.png`, 'This is diff test image');
            chai.request(server)
                .get('/')
                .end((err, res) => {
                    expect(res).have.status(200);
                    expect(res.body).be.an('object');
                    done();
                })
        }) 

        it ('should get all the images when no diff images', (done) => {
            folder.removeAllFile(`${others.folderDiff}`);                                                                          
            chai.request(server)
                .get('/')
                .end((err, res) => {
                    expect(res).have.status(200);
                    expect(res.body).be.an('object');
                    done();
                })
        })
    })

    
    describe('/GET Loading When Base Folder Is Not Empty', function() {
        it ('should loading when session is actived', done => {
            req = {
                session: {
                    load: true
                }
            }
            res = mocks.createResponse();
            loadingController.loading(req, res);
            done();
        })
    })
    
    
    

    describe('/GET Load Images When Base Folder Is Empty', function(){
        it ('should redirect loading when current folder empty', done => {
            folder.removeAllFile(`${others.folderCurrent}`);
            chai.request(server)
                .get('/')
                .end((err, res) => {
                    expect(res).have.status(302); //loading no render
                    done();
                })
        })

        it ('should render no images when base folder empty', done => {
            //DELETE BASE FOLDER
            folder.removeFileBase(`${others.folderBase}`);
            chai.request(server)
                .get('/')
                .end((err, res) => {
                    expect(res).have.status(200);
                    done();
                })
        })
    })
    
    describe('/GET Loading When Base Folder Is Empty', function() {
        it ('should get layout loading when base folder empty', done => {
            chai.request(server)
                .get('/loading')
                .end((err, res) => {
                    expect(res).have.status(200);
                    expect(res.body).be.an('object');
                    done();
                })
        })
    })

    
    describe('/GET Layout Error', function() {
        it ('should GET layout error', done => {
            chai.request(server)
                .get('/aasdasdasd')
                .end((err, res) => {
                    expect(res).have.status(404);
                    expect(res.body).be.an('object');
                    done();
                })
        })
    })
    
    
    describe('/POST Replace Image', function() {
        it ('should POST a image', done => {
            fs.writeFileSync(`${others.folderDiff}/diff_dock_0.png`, 'This is diff test image');
            fs.writeFileSync(`${others.folderCurrent}/current_dock.png`, 'This is current dock image');
            let listImages = [ 'diff_dock_0.png'];
    
            chai.request(server)
                .post('/replace')
                .send(listImages)
                .end((err, res) => {
                    expect(res).have.status(200);
                    expect(res.body).be.an('object');
                    expect(res.body).have.property('message').eql('Replace image success!');
                    done();
                })
        })
    })
    
    describe('/POST Add New Base Image', function() {
        it ('should POST a image', done => {
            fs.writeFileSync(`${others.folderDiff}/diff_dock_0.png`, 'This is diff test image');
            let listImages = ['diff_dock_0.png'];
    
            chai.request(server)
                .post('/add/base')
                .send(listImages)
                .end((err, res) => {
                    expect(res).have.status(200);
                    expect(res.body).be.an('object');
                    expect(res.body).have.property('message').eql('Add base images success!');
                    done();
                })
        })
    })

    
    describe('/POST Automate', function(){
        it ('should automation and take screenshot when current has child file', done => {
            chai.request(server)
                .post('/automate')
                .end((err, res) => {
                    expect(res).have.status(200);
                    done();
                })
        })

        it ('should automation and take screenshot when current has not child file', done => {
            folder.removeAllFile(`${others.folderCurrent}`);
            chai.request(server)
                .post('/automate')
                .end((err, res) => {
                    expect(res).have.status(200);
                    done();
                })
        })
    })
    
    
    describe('/POST Reset', function() {
        it ('should remove all folder', done => {
            chai.request(server)
                .post('/reset')
                .end((err, res) => {
                    expect(res).have.status(200);
                    done();
                })
        })
    })
    
})


