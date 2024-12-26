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
            $a := 10;
            $sum(example.value);
            $a := function() {(
                357;
            )};
            debugger;
            $a();
            1;
            2;
            3;
            4;
        )`);
        const result = await expression.evaluate(data, undefined, undefined, async(context) => {
            console.info(context);
            return 'next';
        });  // returns 24
        console.info(result);
    } catch (error) {
        debugger;
        console.error(error);
    }
})();
