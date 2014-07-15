var registers = require("./registers");

// TODO: verify validity of operands

exports.assembleLine = function(line) {
    var result = /([a-z]+)\s*(.*)/i.exec(line);
    var instructionName = result[1];
    var instruction = instructionsByName[instructionName];
    var operands = result[2].split(/,\s*/);
    
    if (instruction.type === "r") {
        return assembleR(instruction, operands);
    } else {
        return assembleI(instruction, operands);
    }
};

function assembleR(instruction, operands) {
    function encodeRegisterOperand(index) {
        return registers.find(operands[index]).number;
    }
    
    if (instruction.operands === 3) {
        var rd = encodeRegisterOperand(0);
        var rs = encodeRegisterOperand(1);
        var rt = encodeRegisterOperand(2);
    } else if (instruction.operands == 2) {
        var rs = encodeRegisterOperand(0);
        var rt = encodeRegisterOperand(1);
        var rd = 0;
    } else {
        var rd = encodeRegisterOperand(0);
        var rs = 0;
        var rt = 0;
    }
    
    var shamt = 0;
    var funct = instruction.funct;
    
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

function assembleI(instruction, operands) {
    var opcode = instruction.opcode;
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

var instructions = [
    r("add", 0x20, 3),
    r("addu", 0x21, 3),
    r("sub", 0x22, 3),
    r("subu", 0x23, 3),
    r("mult", 0x18, 2),
    r("multu", 0x19, 2),
    r("div", 0x1a, 2),
    r("divu", 0x1b, 2),
    r("mfhi", 0x10, 1),
    r("mflo", 0x12, 1),
    //~ "and": 36,
    //~ "or": 37,
    //~ "xor": 38,
    //~ "nor": 39,
    //~ "slt": 42,
    //~ "srl": 2,
    //~ "sra": 3,
    //~ "sllv": 4,
    //~ "srlv": 6,
    //~ "srav": 7,
    //~ "jr": 8,
    i("addi", 0x8),
    i("addiu", 0x9)
];

var instructionsByName = {};
instructions.forEach(function(instruction) {
    instructionsByName[instruction.name] = instruction;
});

function r(name, funct, operands) {
    return {
        type: "r",
        name: name,
        funct: funct,
        operands: operands
    };
}

function i(name, opcode) {
    return {
        type: "i",
        name: name,
        opcode: opcode
    };
}
