exports.find = find;

function find(name) {
    return byName[name];
}

var all = createRegisters();
var byName = {};
all.forEach(function(register) {
    byName["$" + register.name] = register;
});

function createRegisters() {
    var r = Array.prototype.concat.apply([], [
        [
            {name: "zero"},
            {name: "at"}
        ],
        registerSet({prefix: "v", count: 2}),
        registerSet({prefix: "a", count: 4}),
        registerSet({prefix: "t", count: 8}),
        registerSet({prefix: "s", count: 8}),
        registerSet({prefix: "t", count: 2, start: 8}),
        registerSet({prefix: "k", count: 2}),
        [
            {name: "gp"},
            {name: "sp"},
            {name: "fp"},
            {name: "ra"}
        ]
    ]);
    r.forEach(function(register, index) {
        register.number = index;
    });
    return r;
}


function registerSet(options) {
    var start = options.start || 0;
    
    var result = [];
    for (var i = 0; i < options.count; i++) {
        result.push({name: options.prefix + (i + start)});
    }
    return result;
}

