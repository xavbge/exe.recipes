
// fonction qui permet l'extraction de l'API 
async function extract() {
    const reponse = await fetch("https://www.omdbapi.com/?s=batman&apikey=b58518b4");
    const batman = await reponse.json();

    const extractFilm = await fetch(`https://www.omdbapi.com/?i=${batman.imdbID}&apikey=b58518b4`);
    const reponseFilm = await extractFilm.json();
// extraction des éléments de l'API qu'ils soient en chaines de caractères où en tableau.
    document.getElementById("production").innerText = reponseFilm.Actors;
    document.getElementById("rated").innerText = reponseFilm.Rated;
    document.getElementById("titre").innerText = reponseFilm.Title;
    document.getElementById("durée").innerText = reponseFilm.Runtime;
    document.getElementById("synopsie").innerText = reponseFilm.Plot;
    document.getElementById("réalisateur").innerText = reponseFilm.Director;
    document.getElementById("Box-Office").innerText = reponseFilm.BoxOffice;
    document.getElementById("score").innerText = reponseFilm.Metascore;
}

// fonction qui permet d'afficher les films avec les paramètres à l'intérieur de la "card (bootstrap)".
async function afficherFilm(lesfilms) {
    const films = document.getElementById("films");

    films.innerHTML = ''; 
    for (const element of lesfilms.Search) {  //card avec les élèments importés de l'API.
        const inCard =// cards ******
            `<div class="card" style="width: 18rem;">
                        <img src="${element.Poster}"
                            class="card-img-top" alt="...">
                        <div class="card-body">
                            <h5 class="card-title">${element.Title}</h5>
                            <p class="card-text">${element.Year}</p>
                            
                            <!-- Button trigger modal -->
                            <button id="${element.imdbID}" type="button" class="btn btn-primary">
                            En savoir plus
                            </button>
                        </div>
                    </div>`;
        films.innerHTML += inCard; // affichage dans la partie html.
    };

    let btns = films.querySelectorAll(".btn"); //permet de selectionner TOUS les boutons des "cards" un par un pour chaque ID grâce a ${element.imdbID}.

    
    btns.forEach((btn) => { //inclus dan la modal les élèments de l'API en recupérant l'ID de chaques films par ${btn.getAttribute("id")}.

        btn.addEventListener("click", async () => { //Event sur le bouton "En savoir plus" pour afficher les infos DANS la modal.
            const extractFilm = await fetch(`https://www.omdbapi.com/?i=${btn.getAttribute("id")}&apikey=b58518b4`); // *
            const reponseFilm = await extractFilm.json();
            console.log(reponseFilm);

            const modalBody = document.getElementById('modal-body');
            modalBody.innerHTML = '';

            const modalTitle = document.getElementById('staticBackdropLabel');
            // introduction des élèments JS de l'API dans la partie modal-HTML.
            modalTitle.innerHTML = `<h1>${reponseFilm.Title}</h1>`
            modalBody.innerHTML = `<p>Acteurs : ${reponseFilm.Actors}</p>
            <p>Réalisateur : ${reponseFilm.Director}</p>
            <p>Synospie : ${reponseFilm.Plot}</p>
           <p>Box-Office : ${reponseFilm.BoxOffice} </p>
           <p>Note : ${reponseFilm.imdbRating}/10</p>
                                    `;

            const modal = new bootstrap.Modal(document.getElementById('staticBackdrop'));
            modal.show();
        });
    });

}
// barre de recherche *********

// extraction d'un élèment html pour "document.getElementById" en lui donnant une constante (const).
const bar = document.getElementById("bar");
const result = document.getElementById("result");

bar.addEventListener('input', async function () { //Event sur le bouton de la barre de recherche comme pour la modal.
    const triSearch = this.value.toLowerCase();

    if (triSearch.length === 0) { // barre de recherche remis a zero après chaques recherche.
        result.innerHTML = '';
        return;
    }
    try {

        if (triSearch.length >= 3) { // <= cette fonctionnalité propose des suggestions de titre dans la barre de recherche à partir de 3 caractères.
            const reponse = await fetch(`https://www.omdbapi.com/?s=${triSearch}&apikey=b58518b4`);
            const films = await reponse.json();
            // le fait d'inclure ${triSearch} dans l'url à la place de l'ID d'un film particulier permets de faire
            // correspondre la recherche de l'utilisateur dans l'API.
            if (films.Error == undefined) {
                afficherFilm(films);
            }

        }

    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
        result.innerHTML = '<li>Erreur de chargement</li>';
    }
});