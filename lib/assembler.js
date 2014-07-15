var registers = require("./registers");

exports.assembleLine = function(line) {
    var result = /([a-z]+)\s*(.*)/i.exec(line);
    var operands = result[2].split(/,\s*/);
    
    var rd = registers.find(operands[0]).number;
    var rs = registers.find(operands[1]).number;
    var rt = registers.find(operands[2]).number;
    var shamt = 0;
    var funct = functs[result[1]];
    
    return encodeR({
        rd: rd,
        rs: rs,
        rt: rt,
        shamt: shamt,
        funct: funct
    });
};

function encodeR(options) {
    return options.funct +
        (options.shamt << 6) +
        (options.rd << 11) +
        (options.rt << 16) +
        (options.rs << 21);
}

var functs = {
    "add": 32,
    "addu": 33
};
