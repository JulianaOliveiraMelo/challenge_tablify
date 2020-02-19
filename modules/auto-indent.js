// Hop hop hop ! Tu t'es perdu(e), jeune padawan ?
// Ce code est cadeau, il n'y a rien à modifier, ferme ce fichier tout de suite
// Si tu es curieux(se), rouvre-le ce weekend pour le décortiquer ;-)

module.exports = (() => {
    let indentCount = 0;

    return (tags) => {
        return tags.map((tag) => {

            // if it is a close tag alone
            if (tag.trim().charAt(1) == "/") indentCount--; // the tag itself should be less indented

            // in any other case, create the output
            let out =  "\n" + "\t".repeat(indentCount) + tag;

            // but if it is an open tag alone
            if (tag.trim().indexOf("/") == -1) indentCount++; // next tag should be more indented

            return out;
        }).join("");
    }
})();