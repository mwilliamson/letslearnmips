var registers = require("./registers");

exports.assembleLine = function(line) {
    var result = /([a-z]+)\s*(.*)/i.exec(line);
    var instructionName = result[1];
    var operands = result[2].split(/,\s*/);
    
    if (functs.hasOwnProperty(instructionName)) {
        return assembleR(instructionName, operands);
    } else {
        return assembleI(instructionName, operands);
    }
};

function assembleR(instructionName, operands) {
    var rd = registers.find(operands[0]).number;
    var rs = registers.find(operands[1]).number;
    var rt = registers.find(operands[2]).number;
    var shamt = 0;
    var funct = functs[instructionName];
    
    return encodeR({
        rd: rd,
        rs: rs,
        rt: rt,
        shamt: shamt,
        funct: funct
    });
}

function encodeR(options) {
    return options.funct +
        (options.shamt << 6) +
        (options.rd << 11) +
        (options.rt << 16) +
        (options.rs << 21);
}

function assembleI(instructionName, operands) {
    var opcode = opcodes[instructionName];
    var rt = registers.find(operands[0]).number;
    var rs = registers.find(operands[1]).number;
    // TODO: stricter integer parsing
    var immediate = parseInt(operands[2]);
    
    return encodeI({
        opcode: opcode,
        rs: rs,
        rt: rt,
        immediate: immediate
    });
}

function encodeI(options) {
    return options.immediate +
        (options.rt << 16) +
        (options.rs << 21) +
        (options.opcode << 26);
}

var functs = {
    "add": 0x20,
    "addu": 0x21,
    "sub": 0x22,
    "subu": 0x23,
    "mult": 24,
    "multu": 25,
    "div": 26,
    "divu": 27,
    "mfhi": 16,
    "mflo": 18,
    "and": 36,
    "or": 37,
    "xor": 38,
    "nor": 39,
    "slt": 42,
    "srl": 2,
    "sra": 3,
    "sllv": 4,
    "srlv": 6,
    "srav": 7,
    "jr": 8
};

var opcodes = {
    "addi": 0x8
};
