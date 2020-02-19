const app = module.exports = {
    // ici, les middlewares vont s'accumuler dans l'ordre...
    mwStack: [],

    // grâce à cette fonction simple
    chain: function (mw) {
        // au final, tout ce qu'elle fait, c'est ajouter le middleware dans la pile, en dernier
        app.mwStack.push(mw);
    },
    
    // cette fonction lance le traitement
    // - on lui passe les données à traiter (c'est mieux)
    // - et on lui indique également, par un callback, ce qu'il faudra faire avec le résultat
    // cf. appel à cette fonction dans le fichier app.js
    process: function (data, action) {
        // le positionnement dans la mwStack : on commence au début, c'est mieux
        app.mwIndex = 0;

        // on sauvegarde les données à traiter en tant qu'entrée
        app.input = data;

        // et on déclare une sortie vide (pour l'instant)
        app.output = [];

        // NB : input et output étant des tableaux (donc d'un type non-scalaire 🤓, comme les objets), ils seront passés par référence aux middlewares
        // c'est d'ailleurs pour ça que ça fonctionne : les middlewares ne renvoient rien
        // les données traitées ne sont donc pas transférées d'un mw à l'autre (=retour d'une fonction en argument de la suivante)
        // mais *passées par référence* à tous les middlewares ;-)

        // chaque middleware aura l'occasion de modifier l'entrée, la sortie ou les deux...
        // ... avant d'appeler la fonction "passage de bâton"

        // on va considérer l'action finale comme un middleware
        // mais comme l'action finale sera effectuée sur le résultat (la sortie donc), il faut modifier légèrement la fonction
        // _ est une convention JS qui indique qu'on peut ignorer ce paramètre
        // tous les middles reçoivent l'input en 1er param et l'output en 2e param, il faut donc déclarer un premier paramtère (dont on se fiche)...
        // ... et un deuxième, qu'on passera en argument de l'action finale
        app.chain((_, result) => {
            action(result);
        });

        // et c'est parti, on lance le premier middleware, c'est lui qui se chargera de faire avancer le traitement
        app.mwStack[app.mwIndex](app.input, app.output, app.nextMw);
    },
    // cette fonction est appelée depuis chaque middleware pour faire progresser le traitement
    nextMw: function () {
        // on récupère le prochain middleware à appeler (undefined s'il n'y en a plus)
        // au fait, vous connaissez la différence entre ++i et i++ ?
        // ce sont 2 opérateurs : qui dit "opérateur" dit "opération" et implique "résultat" (=retour)
        // ex: + est l'opérateur d'addition : il retourne le résultat de l'addition des 2 opérandes qui l'entourent
        // ok, donc...
        // i++ incrémente i et retourne la valeur avant l'incrémentation
        // ex: i = 4; console.log(i++) => affichera 4
        // ++i incrémente i et retourne la valeur après l'incrémentation
        // ex: i = 4; console.log(++i) => affichera 5
        let mwToCall = app.mwStack[++app.mwIndex];

        // s'il existe, c'est reparti pour un tour 🎠
        if (!!mwToCall) {
            // le prochain middleware bénéficiera des mêmes jouets que le précédent, dans le même ordre
            // - l'entrée (les données passées à app.process)
            // - la sortie (le tableau HTML qu'on constitue petit à petit)
            // - la fonction de passage de bâton (oui oui, celle que vous êtes en train de décortiquer en lisant ce commentaire)
            mwToCall(app.input, app.output, app.nextMw);
        }

        // quand il n'y a plus de prochain middleware, c'est fini, tout simplement
    }
}