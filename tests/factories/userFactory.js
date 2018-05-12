// CLARIFICARI
// In mod normal, Mongoose a fost deja incarcat in memorie pe partea de Server.
// , Faptul ca import 'mongoose' aici, o sa imi dea acces la cache-ul din
// , memorie, unde a fost deja instantiat. Deci voi avea acces la Models care
// , au fost definite pe API Server.
//! DAR, in acest caz nu o sa functioneze in acest fel. Deoarece Jest o sa
//! , creeze un nou Node enviorment, atunci cand il pornim din CLI.
//! Deci Node API Server si Jest, vor fi procese diferite in OS.
//! Apoi Jest o sa caute toate fisierele care au extensia '*.test.js' si le va
//! , lua doar acele files si le va executa. Deci acest lucru inseamn ca
//! , Mongoose nici macar nu a fost conectat la MongoDB. La fel nu o sa aiba
//! , acces nici la Models.

const mongoose = require('mongoose');
//! 'model' cu m mic
const User = mongoose.model('User');

module.exports = () => {
  // In mod normal, User ar trebui sa primeasca un obiect cu 'googleId' si
  // , 'displayName'. Daca vreau, pot sa le generez ca sa fie unice, dar in acest
  // , caz, nu sunt obligatorii. Nu am configurat serverul ca sa fie mandatorii.
  //! Deci o sa imi genereze un nou user, o sa imi dea _id-ul acelui user din
  //! , obiectul returnat de MongoDB. Apoi acel _id o sa fie folosit de
  //! , sessionFactory ca sa imi genereze cookies pentru autentificare.
  return new User({}).save();
};