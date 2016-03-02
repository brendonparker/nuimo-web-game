
module.exports = function(io){
    try {
        var nuimo = require('nuimo-node');

        var handlers = {};
        handlers[nuimo.CHARACTERISTICS.ROTATION] = function(nuimo, data){
            var velocity = -(data[1] - data[0]);
            io.emit('rotate', velocity);
        };

        handlers[nuimo.CHARACTERISTICS.BUTTON_CLICK] = function(nuimo, data){
            io.emit(data[0] ? 'buttondown' : 'buttonup');
        };

        nuimo.init(handlers);
    }
    catch(e){
        console.log('Failed to initialize nuimo: ');
        console.log(e);
    }
};