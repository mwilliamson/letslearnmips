var assembler = require("../lib/assembler");

// R-type
exports["add"] = assembleLineTest("add $t1, $t2, $t3", "1010010110100100000100000");
exports["addu"] = assembleLineTest("addu $t1, $t2, $t3", "1010010110100100000100001");
exports["sub"] = assembleLineTest("sub $t1, $t2, $t3", "00000001010010110100100000100010");
exports["subu"] = assembleLineTest("subu $t1, $t2, $t3", "00000001010010110100100000100011");
exports["subu"] = assembleLineTest("subu $t1, $t2, $t3", "00000001010010110100100000100011");

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
