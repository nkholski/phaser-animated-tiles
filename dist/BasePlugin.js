(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("BasePlugin", [], factory);
	else if(typeof exports === 'object')
		exports["BasePlugin"] = factory();
	else
		root["BasePlugin"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2018 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser3-plugin-template/blob/master/LICENSE|MIT License}
*/

var BasePlugin = function (scene)
{
    //  The Scene that owns this plugin
    this.scene = scene;

    this.systems = scene.sys;

    if (!scene.sys.settings.isBooted)
    {
        scene.sys.events.once('boot', this.boot, this);
    }
};

//  Static function called by the PluginFile Loader.
BasePlugin.register = function (PluginManager)
{
    //  Register this plugin with the PluginManager, so it can be added to Scenes.

    //  The first argument is the name this plugin will be known as in the PluginManager. It should not conflict with already registered plugins.
    //  The second argument is a reference to the plugin object, which will be instantiated by the PluginManager when the Scene boots.
    //  The third argument is the local mapping. This will make the plugin available under `this.sys.base` and also `this.base` from a Scene if
    //  it has an entry in the InjectionMap.
    PluginManager.register('BasePlugin', BasePlugin, 'base');
};

BasePlugin.prototype = {

    //  Called when the Plugin is booted by the PluginManager.
    //  If you need to reference other systems in the Scene (like the Loader or DisplayList) then set-up those references now, not in the constructor.
    boot: function ()
    {
        var eventEmitter = this.systems.events;

        //  Listening to the following events is entirely optional, although we would recommend cleanly shutting down and destroying at least.
        //  If you don't need any of these events then remove the listeners and the relevant methods too.

        eventEmitter.on('start', this.start, this);

        eventEmitter.on('preupdate', this.preUpdate, this);
        eventEmitter.on('update', this.update, this);
        eventEmitter.on('postupdate', this.postUpdate, this);

        eventEmitter.on('pause', this.pause, this);
        eventEmitter.on('resume', this.resume, this);

        eventEmitter.on('sleep', this.sleep, this);
        eventEmitter.on('wake', this.wake, this);

        eventEmitter.on('shutdown', this.shutdown, this);
        eventEmitter.on('destroy', this.destroy, this);
    },

    //  A test method.
    test: function (name)
    {
        console.log('BasePlugin says hello ' + name + '!');
    },

    //  Called when a Scene is started by the SceneManager. The Scene is now active, visible and running.
    start: function ()
    {
    },

    //  Called every Scene step - phase 1
    preUpdate: function (time, delta)
    {
    },

    //  Called every Scene step - phase 2
    update: function (time, delta)
    {
    },

    //  Called every Scene step - phase 3
    postUpdate: function (time, delta)
    {
    },

    //  Called when a Scene is paused. A paused scene doesn't have its Step run, but still renders.
    pause: function ()
    {
    },

    //  Called when a Scene is resumed from a paused state.
    resume: function ()
    {
    },

    //  Called when a Scene is put to sleep. A sleeping scene doesn't update or render, but isn't destroyed or shutdown. preUpdate events still fire.
    sleep: function ()
    {
    },

    //  Called when a Scene is woken from a sleeping state.
    wake: function ()
    {
    },

    //  Called when a Scene shuts down, it may then come back again later (which will invoke the 'start' event) but should be considered dormant.
    shutdown: function ()
    {
    },

    //  Called when a Scene is destroyed by the Scene Manager. There is no coming back from a destroyed Scene, so clear up all resources here.
    destroy: function ()
    {
        this.shutdown();

        this.scene = undefined;
    }

};

BasePlugin.prototype.constructor = BasePlugin;

//  Make sure you export the plugin for webpack to expose

module.exports = BasePlugin;


/***/ })
/******/ ]);
});