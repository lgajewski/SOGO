var Jasmine2HtmlReporter = require('protractor-jasmine2-html-reporter');

exports.config = {
    suites: {
        auth: './protractor/*.js'
    },

    framework: 'jasmine2',

    baseUrl: "http://localhost:8081",

    capabilities: {
        'browserName': 'phantomjs',
        'phantomjs.binary.path': require('phantomjs-prebuilt').path
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
