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
    var options = {
        rd: 0,
        rs: 0,
        rt: 0,
        shamt: 0,
        funct: instruction.funct
    };
    
    parseOperands(instruction, operands, options);
    
    return encodeR(options);
}

function encodeR(options) {
    return options.funct +
        (options.shamt << 6) +
        (options.rd << 11) +
        (options.rt << 16) +
        (options.rs << 21);
}

function assembleI(instruction, operands) {
    var options = {
        opcode: instruction.opcode,
        rs: 0,
        rt: 0,
        immediate: 0
    };
    
    parseOperands(instruction, operands, options);
    
    return encodeI(options);
}

function encodeI(options) {
    return options.immediate +
        (options.rt << 16) +
        (options.rs << 21) +
        (options.opcode << 26);
}

function parseOperands(instruction, operands, options) {
    operands.forEach(function(operand, index) {
        var slot = instruction.operands[index];
        options[slot] = parseOperand(slot, operand);
    });
}

function parseOperand(slot, operand) {
    // TODO: stricter integer parsing
    return slot === "shamt" || slot === "immediate" ?
            parseInt(operand) :
            encodeRegisterOperand(operand);
}

function encodeRegisterOperand(operand) {
    return registers.find(operand).number;
}

var rType3Operands = ["rd", "rs", "rt"];
var rType2Operands = ["rs", "rt"];

var instructions = [
    r("add", 0x20, rType3Operands),
    r("addu", 0x21, rType3Operands),
    r("sub", 0x22, rType3Operands),
    r("subu", 0x23, rType3Operands),
    r("mult", 0x18, rType2Operands),
    r("multu", 0x19, rType2Operands),
    r("div", 0x1a, rType2Operands),
    r("divu", 0x1b, rType2Operands),
    
    r("mfhi", 0x10, ["rd"]),
    r("mflo", 0x12, ["rd"]),
    
    r("and", 0x24, rType3Operands),
    r("or", 0x25, rType3Operands),
    r("xor", 0x26, rType3Operands),
    r("nor", 0x27, rType3Operands),
    r("slt", 0x2a, rType3Operands),
    
    r("sll", 0, ["rd", "rt", "shamt"]),
    r("srl", 0x2, ["rd", "rt", "shamt"]),
    r("sra", 0x3, ["rd", "rt", "shamt"]),
    r("sllv", 0x4, ["rd", "rt", "rs"]),
    r("srlv", 0x6, ["rd", "rt", "rs"]),
    r("srav", 0x7, ["rd", "rt", "rs"]),
    
    r("jr", 0x8, ["rs"]),
    
    i("addi", 0x8, ["rt", "rs", "immediate"]),
    i("addiu", 0x9, ["rt", "rs", "immediate"]),
    
    i("lui", 0xf, ["rt", "immediate"]),
    
    i("andi", 0xc, ["rt", "rs", "immediate"]),
    i("ori", 0xd, ["rt", "rs", "immediate"]),
    i("slti", 0xa, ["rt", "rs", "immediate"])
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

function i(name, opcode, operands) {
    return {
        type: "i",
        name: name,
        opcode: opcode,
        operands: operands
    };
}
