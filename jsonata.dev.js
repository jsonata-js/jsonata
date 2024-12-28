/* eslint-disable no-console */
/* eslint-disable strict */
const jsonata = require('./src/jsonata');

const data = {
    example: [
        {value: 4},
        {value: 7},
        {value: 13}
    ]
};

(async() => {
    try {
        const expression = jsonata(`(
            $a := 1;
            $sum(example.value);
            $a := function() {(
                2;
                3;
                4;
            )};
            debugger;
            $a();
            $eval('(5;6;7)');
            8;
            9;
            10;
        )`);
        const result = await expression.evaluate(data, undefined, undefined, async(context) => {
            console.info(context);
            return 'next';
        });
        console.info(result);
    } catch (error) {
        debugger;
        console.error(error);
    }
})();
