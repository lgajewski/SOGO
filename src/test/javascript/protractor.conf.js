var Jasmine2HtmlReporter = require('protractor-jasmine2-html-reporter');

var prefix = 'src/test/javascript/'.replace(/[^/]+/g,'..');

exports.config = {
    seleniumServerJar: prefix + 'node_modules/protractor/node_modules/webdriver-manager/selenium/selenium-server-standalone-2.53.1.jar',
    chromeDriver: prefix + 'node_modules/protractor/selenium/chromedriver',

    suites: {
        auth: './protractor/*.js'
    },

    framework: 'jasmine2',

    capabilities: {
        'browserName': 'firefox'
    },

    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 30000
    },

    onPrepare: function () {
        browser.driver.manage().window().setSize(1280, 1024);
        jasmine.getEnv().addReporter(new Jasmine2HtmlReporter({
            savePath: 'build/reports/e2e/'
        }));
    }
};
