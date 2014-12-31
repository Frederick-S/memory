var app = require('../app');
var request = require('supertest')(app);
var should = require('should');
var util = require('./util');
var Course = require('../models').Course;

var agent;
var req;
var courseId;
var courseName = 'TestCourse' + (+new Date());

before(function (done) {
    util.signup(request, function (signupAgent) {
        agent = signupAgent;
        done();
    });
});

describe('Course: create', function () {
    it('Should visit create course page', function (done) {
        req = request.get('/course/create');
        agent.attachCookies(req);
        req.expect(200, function (error, response) {
            response.text.should.containEql('Create Course');
            done(error);
        });
    });
    
    it('Should return error message: Course name is required.', function (done) {
        req = request.post('/course/create');
        agent.attachCookies(req);
        req.send({
                name: '',
            })
            .expect(200, function (error, response) {
                response.text.should.containEql('Course name is required.');
                done();
            });
    });
    
    it('Should create course successfully and redirect to course page', function (done) {
        req = request.post('/course/create');
        agent.attachCookies(req);
        req.send({
                name: courseName
            })
            .expect(200, function (error, response) {
                response.text.should.containEql('Redirecting to /course/');
                done();
            });
    });
    
    it('Should return error message: Course name is already taken.', function (done) {
        req = request.post('/course/create');
        agent.attachCookies(req);
        req.send({
                name: courseName,
            })
            .expect(200, function (error, response) {
                response.text.should.containEql('Course name is already taken.');
                done();
            });
    });
});

describe('Course: view', function () {
    it('Should return error message: Course 123 doesn\'t exist.', function (done) {
        req = request.get('/course/123');
        req.expect(200, function (error, response) {
            response.text.should.containEql('Course 123 doesn\'t exist.');
            done(error);
        });
    });
    
    it('Should visit course page', function (done) {
        Course.getByName(courseName, function (error, course) {
            if (error) {
                done(error);
            } else {
                req = request.get('/course/' + course.id);
                agent.attachCookies(req);
                req.expect(200, function (error, response) {
                    response.text.should.containEql(courseName);
                    done(error);
                });
            }
        });
    });
});