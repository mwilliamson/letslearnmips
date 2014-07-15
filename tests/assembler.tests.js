var assembler = require("../lib/assembler");

exports["add"] = function(test) {
    var result = assembler.assembleLine("add $t1, $t2, $t3");
    test.equal(parseInt("1010010110100100000100000", 2), result);
    test.done();
};
