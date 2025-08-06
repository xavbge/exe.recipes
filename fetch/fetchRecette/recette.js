async function extract() {

    const reponse = await fetch(`https://dummyjson.com/recipes`);
    const pages = await reponse.json();

    const recette = pages.recipes[0];

    document.getElementById("ID").innerText = recette.id;
    document.getElementById("nom").innerText = recette.name;
    document.getElementById("ingredients").innerText = recette.ingredients.join(', ');
    document.getElementById("instructions").innerText = recette.instructions;
    document.getElementById("tags").innerText = recette.tags.join(', ');

};

async function afficherRecette(recettes) {
    const cards = document.getElementById("cards");
    cards.innerHTML = '';

    

    for (const element of recettes.recipes) {
        const inCard = `<div class="card" style="width: 18rem;">
                    <img src="${element.image}" class="card-img-top" alt="${element.name}">
                    <div class="card-body">
                        <h5 class="card-title">${element.name}</h5>
                        <h6 class="card-title">${element.tags.join(', ')}</h6>
                        <p class="card-text">${element.difficulty} - ${element.mealType} - ${element.prepTimeMinutes} MIN de préparation et ${element.cookTimeMinutes} MIN de cuisson</p>
                        <p class="card-text">pour : ${element.servings}</p>
                        <button id="${element.id}" type="button" class="btn btn-primary">Afficher la recette</button>
                    </div>
                 </div>`;
        cards.innerHTML += inCard;
    }


    const btns = cards.querySelectorAll(".btn");
    btns.forEach((btn) => {
        btn.addEventListener("click", async () => {
            const response = await fetch(`https://dummyjson.com/recipes/${btn.id}`);
            const recette = await response.json();

            const modalTitle = document.getElementById('staticBackdropLabel');
            const modalBody = document.getElementById('modal-body');

            modalTitle.innerHTML = recette.name;
            modalBody.innerHTML = `<p>Ingrédients : ${recette.ingredients.join(', ')}</p>
                                   <p>Instructions : ${recette.instructions}</p>`;

            const modal = new bootstrap.Modal(document.getElementById('staticBackdrop'));
            modal.show();
        });
    });
};


const bar = document.getElementById("bar");
const result = document.getElementById("result");

bar.addEventListener('input', async function () {
    const SearchBar = this.value.toLowerCase();
    result.innerHTML = '';

    if (SearchBar.length >= 3) {
        try {
            const response = await fetch(`https://dummyjson.com/recipes`);
            const pages = await response.json();

            const filtered = pages.recipes.filter(recipe => recipe.name.toLowerCase().includes(SearchBar));

            //******************************************************************** */
            const type = pages.recipes.filter(recipe =>
                Array.isArray(recipe.tags) &&
                recipe.tags.some(tag => tag.toLowerCase().includes(SearchBar)));
                                                         //partie rechercher avec IA avec sa compréhension
            const wanted = [...filtered, ...type].filter(
                (recipe, index, self) =>
                    index === self.findIndex(r => r.id === recipe.id));
            //******************************************************************** */    


            afficherRecette({ recipes: wanted });


        } catch (error) {
            console.error('Erreur lors de la récupération des données :', error);
            result.innerHTML = '<li>Erreur de chargement</li>';
        }
    }
});

