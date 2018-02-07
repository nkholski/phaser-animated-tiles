
function startGui(plugin) {
    var settings = {
        message: "hej",
        active: true,
        rate: 1,
        waterRate: 1,
        lavaRate: 1,
        resetRates: function () {
            plugin.resetRates();
            settings.rate = 1;
            settings.waterRate = 1;
            settings.lavaRate = 1;
            gui.__folders["Global"].__controllers[1].updateDisplay();
            gui.__folders["Global"].__controllers[2].updateDisplay();
            gui.__folders["Global"].__controllers[3].updateDisplay();
        },
        active0: true,
        active1: true,
        alpha0: 1,
        alpha1: 11
    };
    var gui = new dat.GUI();
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
    var folder = gui.addFolder('Bottom layer');
    f = folder.add(settings, 'active0').name('active');
    f.onChange(function (value) {
        if (value) {
            plugin.resume(0);
        }
        else {
            plugin.pause(0);
        }
    });
    //f = folder.add(settings, 'alpha0').name('alpha');
    folder.open();
    var folder = gui.addFolder('Top layer');
    f = folder.add(settings, 'active1').name('active');
    f.onChange(function (value) {
        if (value) {
            plugin.resume(1);
        }
        else {
            plugin.pause(1);
        }
    });
    folder.open();
}