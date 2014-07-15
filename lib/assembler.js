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
    function encodeRegisterOperand(operand) {
        return registers.find(operand).number;
    }
    
    var options = {
        rd: 0,
        rs: 0,
        rt: 0,
        shamt: 0,
        funct: instruction.funct
    };
    
    operands.forEach(function(operand, index) {
        var slot = instruction.operands[index];
        options[slot] = slot === "shamt" ?
            parseInt(operand) :
            encodeRegisterOperand(operand);
    });
    
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
