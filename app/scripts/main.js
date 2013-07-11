require.config({
    paths: {
        jquery: '../bower_components/jquery/jquery',
        bootstrap: 'vendor/bootstrap'
    },
    shim: {
        bootstrap: {
            deps: ['jquery'],
            exports: 'jquery'
        }
    }
});

require(['jquery', 'prisonerGame'], function ($, PrisonerGame) {
    'use strict';
    console.log('Running jQuery %s', $().jquery);
    PrisonerGame.run();
});
