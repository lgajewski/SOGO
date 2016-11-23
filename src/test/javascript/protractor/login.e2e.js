'use strict';

describe('login', function () {

    var username = element(by.id('username'));
    var password = element(by.id('password'));
    var login = element(by.id('btn-login'));
    var logout = element(by.id('logout'));

    beforeEach(function () {
        browser.get(browser.baseUrl);
    });

    // it('should fail to login with bad password', function () {
    //     username.sendKeys('admin');
    //     password.sendKeys('foo');
    //
    //     login.click();
    //
    //     expect(element(by.css('.alert-danger')).getText()).toMatch(/Failed to sign in!/);
    // });

    it('should login successfully with admin account', function () {
        username.sendKeys('admin');
        password.sendKeys('admin');

        login.click().then(function(){
                browser.waitForAngular();
                expect(browser.driver.getCurrentUrl()).toMatch('/home');
                // expect(element(by.css('.alert-success')).getText()).toMatch(/You are logged in/);
        });

    });
});
