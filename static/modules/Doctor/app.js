"use strict";
require.config({
    baseUrl: '/static/',
    paths: { "module-config": "modules/common/config" }
});

require(["module-config"], function () {
    
    require(["module-Doctor-bootstrap"], function () {

        
    });

})






