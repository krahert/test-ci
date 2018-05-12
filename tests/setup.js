// Aici o sa fac global setup pentru Jest
// Acest file o sa fie executat doar o singura data, atunci cand pornesc Jest.

//! Aici voi modifica default timeout pentru Jest tests, adica timpul in care
//! , au voie sa ruleze pana cand vor fi 'failed'. Acest timer este pentru timpul
//! , adunat pentru toate testele dintr-un test suite. Este in milisecunde.
jest.setTimeout(30000);


// este ca si cum as da paste la cod in acest fisier
require('../models/User');

const mongoose = require('mongoose');
const keys = require('../config/keys');


//! By default, Mongoose nu o sa vrea sa isi foloseasca propriul Promise
//! , implementation si o sa vrea sa sa ii spun ce implementation sa foloseasca.
//! Deci ii spunem lui Mongoose sa foloseasca global.Promise din Node.js.
mongoose.Promise = global.Promise;

// voi folosi 'useMongoURI' ca sa evit deprecation warnings
mongoose.connect(keys.mongoURI, { useMongoClient: true });

//! Ca sa-i spunem lui JEST sa execute acest 'setup.js' atunci cand proneste, va
//! , trebui sa ii spunem sa faca acest lucru in 'package.json'.
//! Va trebui sa scriu deasupra la scripts:
/*
"jest": {
    "setupTestFrameworkScriptFile": "./tests/setup.js"
  }
*/