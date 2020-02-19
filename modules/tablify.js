module.exports = {
    // ici, nous allons coder ensemble les middlewares qui généreront progressivement un tableau HTML à partir d'un array JS
    // chaque sous-ensemble de balises aura son(ses) propre(s) middleware(s) : table, thead, tbody, tfoot

    // [quelques fonctions codées ensemble ici]
    // gestion de la balise <table>, appelée en premier
    openTag: (i, o, next) => {
        o.push('<table>');
        next();
    },

    closeTag: (i, o, next) => {
        o.push('</table>');
        next();
    },

    generateBody: (i, o, next) => {
        o.push('<tbody>');
        // ici, je transforme les données de i en autant de tr, td etc.
        for (const row of i) {
            o.push('<tr>');
            // ici, je parcours les données de la ligne pour générer des td
            for (const key in row) {
                o.push(`<td>${row[key]}</td>`);
            }
            o.push('</tr>');
        }
        o.push('</tbody>');
        next();
    },

    generateHead: (i, o, next) => {
        // ici, il y a probablement des balises "inconditionnelles" (=dont on a tout le temps besoin)
        o.push('<thead>','<tr>');

        // on prend arbitrairement le premier élément du tableau
        // parce qu'il y en aura toujours un (ça serait stupide de demander l'affichage HTML d'un array vide, non ?)
        for (const key in i[0]) {
            // pour chaque clé de cet élément, on crée une cellule contenant le nom de la clé
            o.push(`<th>${key}</th>`);
        }

        // là aussi, balises inconditionnelles
        o.push('</tr>', '</thead>');

        next();
    },

    generateFoot: (i, o, next) => {
        // on va déjà écrire ce qui sera toujours présent dans le tfoot
        o.push('<tfoot>', '<tr>', '<th>Totaux</th>');

        // puis prendre la première ligne comme témoin
        let sampleRow = i[0];

        // cet indicateur va nous permettre de ne pas tenir compte de la première colonne, celle des noms
        // car pour cette colonne, on a déjà écrit la th{Totaux} ;-)
        let firstKey = true;
        for (const key in sampleRow) {
            if (firstKey) {
                firstKey = false;
                continue;
            }

            // à vous de jouer !
            // un tiret (-) si la colonne n'est pas numérique
            // la somme de la colonne sinon
            if (isNaN(sampleRow[key])) {
                o.push('<td>-</td>');
            } else {
                let sum = 0;
                for (const row of i) {
                    sum += row[key];
                }
                o.push(`<td>${sum}</td>`);
            }
        }
        // et on oublie pas de refermer ce qu'on a ouvert
        o.push('</tr>', '</tfoot>');
        // ainsi que de passer le bâton
        next();
    }
    
}