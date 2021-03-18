function* table(num){
    yield num*2;
    yield num*3;
    return num;
}

function* run(){
    let generators = [1,2,3].map(n=>table(n));
    for (let generator of generators) {
        var res = yield * generator;
        console.log("set", res);
    }
}
for (let step of run()) {
    console.log("step", step);
}
//console.log(prog.next());
//console.log(prog.next());

/*
yield Promise.all(input.map(inputPart=>evaluate(expr, inputPart, environment))
        .map(generator=>function*(){
            var res = yield * generator;
            if (expr.stages) console.log("HAS STAGES")
            return expr.stages
                ? yield * expr.stages.map(stage=>evaluateFilter(stage.expr, res, environment))
                : res;
        }));
    console.log(generators)
*/