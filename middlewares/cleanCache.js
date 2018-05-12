// import functia custom care imi da acces la instantierea curenta a query-ului.
const { clearHash } = require('../services/cache');

// Voi face aceasta functie async deoarece voi astepta sa fie executata urmatoarea
// , functie din pipeline si apoi o sa ma intorc ca sa execut codul din acest
// , Middleware.
module.exports = async (req, res, next) => {
  //! Ii spun sa execute urmatorul middleware din pipeline si apoi sa se intoarca
  //! , sa execute retul de cod din acest middleware. In cazul acesta, va executa
  //! , route handler-ul si apoi se va intoarce aici ca sa faca cache clearing
  //! , pentru userul care a facut post request.
  await next();
  clearHash(req.user.id);
};