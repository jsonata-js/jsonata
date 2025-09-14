 // use the sync library but make it async anyway, so that tests relying on moch-as-promised work
const syncJsonata = require('./jsonata');
module.exports = (...args) => {
    const sync = syncJsonata(...args);
    return {
        ...sync,
        evaluate: async (...args) => {
            return sync.evaluate(...args);
        }
    }
}
