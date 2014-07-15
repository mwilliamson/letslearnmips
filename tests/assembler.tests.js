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

// I-type
exports["addi"] = assembleLineTest("addi $t1, $t2, 0x42", "00100001010010010000000001000010");
exports["addiu"] = assembleLineTest("addiu $t1, $t2, 0x42", "00100101010010010000000001000010");


function assembleLineTest(line, expectedResult) {
    return function(test) {
        var result = assembler.assembleLine(line);
        test.equal(parseInt(expectedResult, 2), result);
        test.done();
    };  
};
