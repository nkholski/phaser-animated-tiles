
function startGui(plugin) {
    var settings = {
        active: true,
        rate: 1,
        waterRate: 1,
        lavaRate: 1,
        resetRates: function () {
            plugin.resetRates();
            settings.rate = 1;
            settings.waterRate = 1;
            settings.lavaRate = 1;
            settings.leftMap.rate = 1;
            settings.leftMap.waterRate = 1;
            settings.leftMap.lavaRate = 1;
            settings.rightMap.rate = 1;
            settings.rightMap.waterRate = 1;
            fixGuiValues();
        },
        leftMap: {
            active: true,
            active0: true,
            active1: true,
            rate: 1,
            waterRate: 1,
            lavaRate: 1,
            resetRates: function () {
                plugin.resetRates(0);
                settings.leftMap.rate = 1;
                settings.leftMap.waterRate = 1;
                settings.leftMap.lavaRate = 1;
                fixGuiValues();
            },
        },
        rightMap: {
            active: true,
            waterRate: 1,
        }
    };

    var fixGuiValues = function(){
        gui.__folders["Global"].__controllers[1].updateDisplay();
        gui.__folders["Global"].__controllers[2].updateDisplay();
        gui.__folders["Global"].__controllers[3].updateDisplay();
        gui.__folders["Left map"].__controllers[3].updateDisplay();
        gui.__folders["Left map"].__controllers[4].updateDisplay();
        gui.__folders["Left map"].__controllers[5].updateDisplay();
        gui.__folders["Right map"].__controllers[1].updateDisplay();

    }


    var gui = new dat.GUI();
    
    /// GLOBAL
    var folder = gui.addFolder('Global');
    f = folder.add(settings, 'active');
    f.onChange(function (value) {
        if (value) {
            plugin.resume();
        }
        else {
            plugin.pause();
        }
    });
    f = folder.add(settings, 'rate', 0, 5);
    f.onChange(function (value) {
        plugin.setRate(value);
    });
    f = folder.add(settings, 'waterRate', 0, 5);
    f.onChange(function (value) {
        plugin.setRate(value, 1384);
    });
    f = folder.add(settings, 'lavaRate', 0, 5);
    f.onChange(function (value) {
        plugin.setRate(value, 1412);
    });
    folder.add(settings, 'resetRates');

    folder.open();

    /// LEFT MAP
    var leftMap = gui.addFolder('Left map');
    f = leftMap.add(settings.leftMap, 'active');
    f.onChange(function (value) {
        if (value) {
            plugin.resume(null,0);
        }
        else {
            plugin.pause(null,0);
        }
    });
    f = leftMap.add(settings.leftMap, 'active0').name('Bottom layer');
    f.onChange(function (value) {
        if (value) {
            plugin.resume(0,0);
        }
        else {
            plugin.pause(0,0);
        }
    });
    f = leftMap.add(settings.leftMap, 'active1').name('Top layer');
    f.onChange(function (value) {
        if (value) {
            plugin.resume(1,0);
        }
        else {
            plugin.pause(1,0);
        }
    });
    f = leftMap.add(settings.leftMap, 'rate', 0, 5);
    f.onChange(function (value) {
        plugin.setRate(value, null, 0);
    });
    f = leftMap.add(settings.leftMap, 'waterRate', 0, 5);
    f.onChange(function (value) {
        plugin.setRate(value, 1384, 0);
    });
    f = leftMap.add(settings.leftMap, 'lavaRate', 0, 5);
    f.onChange(function (value) {
        plugin.setRate(value, 1412, 0);
    });
    leftMap.add(settings.leftMap, 'resetRates');
    /*leftMap.add(settings.leftMap, 'resetRates');
    f = leftMap.add(settings.leftMap, 'active0').name('Bottom layer');
    f.onChange(function (value) {
        if (value) {
            plugin.resume(0);
        }
        else {
            plugin.pause(0);
        }
    });
    f = leftMap.add(settings.leftMap, 'active1').name('Top layer');
    f.onChange(function (value) {
        if (value) {
            plugin.resume(1);
        }
        else {
            plugin.pause(1);
        }
    });*/
    leftMap.open();

    var rightMap = gui.addFolder('Right map');
    f = rightMap.add(settings.rightMap, 'active');
    f.onChange(function (value) {
        if (value) {
            plugin.resume(null,1);
        }
        else {
            plugin.pause(null,1);
        }
    });
    
    f = rightMap.add(settings.rightMap, 'waterRate', 0, 5);
    f.onChange(function (value) {
        plugin.setRate(value, 1384, 1);
    });
    rightMap.open();


}