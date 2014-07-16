var assembler = require("../lib/assembler");

// R-type
exports["add"] = assembleLineTest("add $t1, $t2, $t3", "1010010110100100000100000");
exports["addu"] = assembleLineTest("addu $t1, $t2, $t3", "1010010110100100000100001");
exports["sub"] = assembleLineTest("sub $t1, $t2, $t3", "00000001010010110100100000100010");
exports["subu"] = assembleLineTest("subu $t1, $t2, $t3", "00000001010010110100100000100011");
exports["subu"] = assembleLineTest("subu $t1, $t2, $t3", "00000001010010110100100000100011");
exports["mult"] = assembleLineTest("mult $t1, $t2", "00000001001010100000000000011000");
exports["multu"] = assembleLineTest("multu $t1, $t2", "00000001001010100000000000011001");
exports["div"] = assembleLineTest("div $t1, $t2", "00000001001010100000000000011010");
exports["divu"] = assembleLineTest("divu $t1, $t2", "00000001001010100000000000011011");

exports["mfhi"] = assembleLineTest("mfhi $t1", "00000000000000000100100000010000");
exports["mflo"] = assembleLineTest("mflo $t1", "00000000000000000100100000010010");

exports["and"] = assembleLineTest("and $t1, $t2, $t3", "00000001010010110100100000100100");
exports["or"] = assembleLineTest("or $t1, $t2, $t3", "00000001010010110100100000100101");
exports["xor"] = assembleLineTest("xor $t1, $t2, $t3", "00000001010010110100100000100110");
exports["nor"] = assembleLineTest("nor $t1, $t2, $t3", "00000001010010110100100000100111");
exports["slt"] = assembleLineTest("slt $t1, $t2, $t3", "00000001010010110100100000101010");

exports["sll"] = assembleLineTest("sll $t1, $t2, 0x4", "00000000000010100100100100000000");
exports["srl"] = assembleLineTest("srl $t1, $t2, 0x4", "00000000000010100100100100000010");
exports["sra"] = assembleLineTest("sra $t1, $t2, 0x4", "00000000000010100100100100000011");
exports["sllv"] = assembleLineTest("sllv $t1, $t2, $t3", "00000001011010100100100000000100");
exports["srlv"] = assembleLineTest("srlv $t1, $t2, $t3", "00000001011010100100100000000110");
exports["srlv"] = assembleLineTest("srlv $t1, $t2, $t3", "00000001011010100100100000000110");
exports["srav"] = assembleLineTest("srav $t1, $t2, $t3", "00000001011010100100100000000111");

exports["jr"] = assembleLineTest("jr $t1", "00000001001000000000000000001000");

// I-type
exports["addi"] = assembleLineTest("addi $t1, $t2, 0x42", "00100001010010010000000001000010");
exports["addiu"] = assembleLineTest("addiu $t1, $t2, 0x42", "00100101010010010000000001000010");

exports["lw"] = assembleLineTest("lw $t1, 16($t2)", "10001101010010010000000000010000");
exports["lh"] = assembleLineTest("lh $t1, 16($t2)", "10000101010010010000000000010000");
exports["lui"] = assembleLineTest("lui $t1, 0x42", "00111100000010010000000001000010");

exports["andi"] = assembleLineTest("andi $t1, $t2, 0x42", "00110001010010010000000001000010");
exports["ori"] = assembleLineTest("ori $t1, $t2, 0x42", "00110101010010010000000001000010");
exports["slti"] = assembleLineTest("slti $t1, $t2, 0x42", "00101001010010010000000001000010");

exports["beq"] = assembleLineTest("beq $t1, $t2, 0x42", "00010001001010100000000001000010");
exports["bne"] = assembleLineTest("bne $t1, $t2, 0x42", "00010101001010100000000001000010");


function assembleLineTest(line, expectedResult) {
    return function(test) {
        var result = assembler.assembleLine(line);
        var expected = parseInt(expectedResult, 2);
        if (expected > Math.pow(2, 31)) {
            expected = expected - Math.pow(2, 32);
        }
        test.equal(expected, result);
        test.done();
    };  
};
