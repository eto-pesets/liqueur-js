import { Liqueur, Alcohol, Syrup, Water, Measure, Composition, Component, Conversion, round, AlcoholTable } from './src/index.js'

let tests = [];
tests.push({
    id: 'simple', 
    run: () => new Liqueur(null, new Syrup(50, Measure.BRIX))
});
tests.push({
    id: 'simple_fail_insufficient_wo_sugar', 
    run: () => (new Liqueur(null, new Syrup(50, Measure.BRIX))).make(),
    check: (result) => (result.type == 'exception' && result.data.code == 'INSUFFICIENT_SUGAR')
});
tests.push({
    id: 'simple_fail_insufficient_w_sugar',
    run: () => (new Liqueur(null, new Syrup(50, Measure.BRIX))).make({ syrup: new Syrup(10, Measure.BRIX) }),
    check: (result) => (result.type == 'exception' && result.data.code == 'INSUFFICIENT_SUGAR')
});
tests.push({
    id: 'vodka', 
    run: () => new Liqueur(new Alcohol(40, Measure.ABV))
});
tests.push({
    id: 'vodka_fail_insufficient_wo_alcohol', 
    run: () => (new Liqueur(new Alcohol(40, Measure.ABV))).make(),
    check: (result) => (result.type == 'exception' && result.data.code == 'INSUFFICIENT_ALCOHOL')
});
tests.push({
    id: 'vodka_fail_insufficient_w_alcohol', 
    run: () => (new Liqueur(new Alcohol(40, Measure.ABV)).make({ alcohol: new Alcohol(5.6, Measure.ABV) })),
    check: (result) => (result.type == 'exception' && result.data.code == 'INSUFFICIENT_ALCOHOL')
});
tests.push({
    id: 'falernum_fail_insufficient_alcohol', 
    run: () => (new Liqueur(new Alcohol(11, Measure.ABV), new Syrup(50, Measure.BRIX)).make({
        alcohol: new Alcohol(5.6, Measure.ABV),
        syrup: new Syrup(100, Measure.BRIX),
        priority: 'syrup'
    })),
    check: (result) => (result.type == 'exception' && result.data.code == 'INSUFFICIENT_ALCOHOL')
});
tests.push({
    id: 'falernum_fail_insufficient_sugar', 
    run: () => (new Liqueur(new Alcohol(11, Measure.ABV), new Syrup(50, Measure.BRIX)).make({
        alcohol: new Alcohol(96, Measure.ABV),
        syrup: new Syrup(50, Measure.BRIX)
    })),
    check: (result) => (result.type == 'exception' && result.data.code == 'INSUFFICIENT_SUGAR')
});
tests.push({
    id: 'triplesec_fail_insufficient_alcohol', 
    run: () => (new Liqueur(new Alcohol(38, Measure.ABV), new Syrup(0.25, Measure.WV)).make({
        alcohol: new Alcohol(40, Measure.ABV),
        syrup: new Syrup(100, Measure.BRIX)
    })),
    check: (result) => (result.type == 'exception' && result.data.code == 'INSUFFICIENT_SUGAR')
});
tests.push({
    id: 'triplesec_fail_insufficient_sugar', 
    run: () => (new Liqueur(new Alcohol(38, Measure.ABV), new Syrup(0.25, Measure.WV)).make({
        alcohol: new Alcohol(96, Measure.ABV),
        syrup: new Syrup(10, Measure.BRIX)
    })),
    check: (result) => (result.type == 'exception' && result.data.code == 'INSUFFICIENT_SUGAR')
});

const show = (test_id, success, data) => {
    let color = success
        ? '\x1b[32m'
        : '\x1b[31m';
    console.log(color+(success ? '>> [PASS]' : '>> [FAIL]')+' '+test_id+'\x1b[0m');
    if (!success) {
        console.log(JSON.stringify(data, null, 4));
    }
}
console.log('> tests\n');
let everything_is_ok = true;
tests.forEach((test, i) => {
    let result;
    try {
        result = { type: 'success', data: test.run() };
    } catch (e) {
        result = { type: 'exception', data: e }
    }
    let passed = (typeof test.check == 'function') ? test.check(result) : (result.type == 'success');
    if (!passed) {
        everything_is_ok = false;
    }
    show(test.id, passed, result);
});

console.log('\n');
process.exit(everything_is_ok ? 0 : 1);