// Modul care imi permite sa convertesc Base64 in UTF-8 si invers.
const Buffer = require('safe-buffer').Buffer;

// Modul care imi permite generarea de keys cu care voi semna si verifica semnaturi
const Keygrip = require('keygrip');

// Import private key-ul folosit de cookie sessions. Valoarea de Dev sau de Prod.
const keys = require('../../config/keys');

// Generez un nou key, cu valoarea importata din 'keys'.
const keygrip = new Keygrip([keys.cookieKey]);

//! Deoarece acest factory function va genera 'session' si 'session.sig' strings
//! , dar nu pentru acelasi user, vom da parametru acestei factory function, un
//! , obiect returnat de Model-ul din Mongoose, care va contine id-ul userului
//! , returnat de MongoDB. Acest argument va fi generat de User factory function.
module.exports = (user) => {
	// Generez obiectul care este stocat in cookie.
	const sessionObject = {
		passport: {
      //! Aici este un bug, unde _id-ul returnat de Model, o sa fie un Object
      //! , care va contine un string cu id-ul userului. Daca i-as face stringify
      //! , o sa includa si {}. Deci voi folosi metoda toString(), care imi va
      //! , scoate si returna in mod automat string-ul din Obiect.
      user: user._id.toString()
		}
	};

	// O sa convertesc obiectul continut de Cookie, in JSON si apoi din UTF-8 in Base64.
	const session = Buffer.from(JSON.stringify(sessionObject)).toString('base64');

	// Generez semnatura pentru session, pe care o voi trimite impreuna cu session cookie
  const sig = keygrip.sign('session=' + session);
  
  return { session, sig };
};
