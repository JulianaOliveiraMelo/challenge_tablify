// c'est tellement plus beau quand tout est bien rangé 😍

// nos données, complètement interchangeables (essayez avec athletes.json si vous n'y croyez pas)
const nains = require('./data/nains.json');

// le processeur de middlewares, en charge de les enchaîner, quels qu'ils soient
const app = require('./modules/mw-processor');

// notre collection de middlewares, l'endroit où nous allons décider de la marche à suivre
const tablify = require('./modules/tablify');

// bonus : cette fonction indente correctement le code du tableau HTML ♥
const autoIndent = require('./modules/auto-indent');

// ici, une fois que tout fonctionnera, il ne restera qu'à donner l'ordre d'enchaînement des middlewares
// app.chain(tablify.premierMW);
// app.chain(tablify.secondMW);
// ...

app.chain(tablify.openTag);
app.chain(tablify.generateHead);
app.chain(tablify.generateBody);
app.chain(tablify.generateFoot);
app.chain(tablify.closeTag);


// et à lancer le traitement avec la méthode process, en précisant :
// - les données à traiter : ici, le tableau nains
// - ce qu'on fera du résultat général, un callback prenant un paramètre : ici, on va console.logger
app.process(nains, (table) => console.log(autoIndent(table)));