var assembler = require("../lib/assembler");

exports["add"] = assembleLineTest("add $t1, $t2, $t3", "1010010110100100000100000");
exports["addu"] = assembleLineTest("addu $t1, $t2, $t3", "1010010110100100000100001");

function assembleLineTest(line, expectedResult) {
    return function(test) {
        var result = assembler.assembleLine(line);
        test.equal(parseInt(expectedResult, 2), result);
        test.done();
    };  
};
