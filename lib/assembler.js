var registers = require("./registers");
var instructions = require("./instructions");

// TODO: verify validity of operands

exports.assembleLine = function(line) {
    var parsedLine = parseLine(line);
    var instruction = instructions.findByName(parsedLine.instructionName);
    var operands = parsedLine.operands;
    
    if (instruction.type === "r") {
        return assembleR(instruction, operands);
    } else {
        return assembleI(instruction, operands);
    }
};

function parseLine(line) {
    var result = /([a-z]+)\s*(.*)/i.exec(line);
    return {
        instructionName: result[1],
        operands: result[2].split(/,\s*/).map(parseOperand)
    };
}

function parseOperand(operand) {
    var immediateRegex = /^((?:0x)[0-9]+)$/;
    var registerRegex = /^(\$[a-z0-9]+)$/;
    var memoryOperandRegex = /^((?:0x)?[0-9]+)\((\$[a-z0-9]+)\)$/;
    
    if (immediateRegex.test(operand)) {
        return parseInt(operand);
    } else if (registerRegex.test(operand)) {
        return operand;
    } else {
        var result = memoryOperandRegex.exec(operand);
        return {immediate: parseInt(result[1]), register: result[2]};
    }
}

function assembleR(instruction, operands) {
    var options = {
        rd: 0,
        rs: 0,
        rt: 0,
        shamt: 0,
        funct: instruction.funct
    };
    
    encodeOperands(instruction, operands, options);
    
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
    
    encodeOperands(instruction, operands, options);
    
    return encodeI(options);
}

function encodeI(options) {
    return options.immediate +
        (options.rt << 16) +
        (options.rs << 21) +
        (options.opcode << 26);
}

function encodeOperands(instruction, operands, options) {
    operands.forEach(function(operand, index) {
        var slot = instruction.operands[index];
        var encodedOperand = encodeOperand(slot, operand);
        if (slot.isMemory) {
            options[slot.immediate] = encodedOperand.immediate;
            options[slot.register] = encodedOperand.register;
        } else {
            options[slot] = encodedOperand;
        }
    });
}

function encodeOperand(slot, operand) {
    if (slot === "shamt" || slot === "immediate") {
        // TODO: check integer size
        return operand;
    } else if (slot.isMemory) {
        return encodeMemoryOperand(operand);
    } else {
        return encodeRegisterOperand(operand);
    }
}

function encodeMemoryOperand(operand) {
    return {
        immediate: operand.immediate,
        register: encodeRegisterOperand(operand.register)
    };
}

function encodeRegisterOperand(operand) {
    return registers.find(operand).number;
}
