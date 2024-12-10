const recipeForm = document.getElementById('recipe-form');
const recipesList = document.getElementById('recipes');
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');
const modal = document.getElementById('recipe-modal');
const closeModal = document.getElementsByClassName('close')[0];
const successMessage = document.getElementById('success-message');

let recipes = [];

// Load recipes from localStorage
function loadRecipes() {
    const storedRecipes = localStorage.getItem('recipes');
    if (storedRecipes) {
        recipes = JSON.parse(storedRecipes);
        displayRecipes();
    }
}

// Save recipes to localStorage
function saveRecipes() {
    localStorage.setItem('recipes', JSON.stringify(recipes));
}

// Add recipe
recipeForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const recipeName = document.getElementById('recipe-name').value.trim();
    const recipeIngredients = document.getElementById('recipe-ingredients').value.split(',').map(ingredient => ingredient.trim());
    const recipeInstructions = document.getElementById('recipe-instructions').value.trim();
    const recipeImage = document.getElementById('recipe-image').files[0];

    // Validation
    if (!recipeName || !recipeIngredients.length || !recipeInstructions || !recipeImage) {
        alert("Please fill in all fields, including uploading an image.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const recipe = {
            name: recipeName,
            ingredients: recipeIngredients,
            instructions: recipeInstructions,
            image: e.target.result
        };
        recipes.push(recipe);
        saveRecipes(); // Save to localStorage
        displayRecipes();
        recipeForm.reset();
        showSuccessMessage("Recipe added successfully!");
    };
    reader.readAsDataURL(recipeImage);
});

// Display recipes
function displayRecipes() {
    recipesList.innerHTML = '';
    recipes.forEach((recipe, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <h3>${recipe.name}</h3>
            <img src="${recipe.image}" alt="${recipe.name}" class="recipe-image" style="max-width: 100px; max-height: 100px;">
            <button class="delete-button" onclick="deleteRecipe(${index})">Delete</button>
        `;
        li.addEventListener('click', () => showRecipeDetails(recipe));
        recipesList.appendChild(li);
    });
}

// Show recipe details in modal
function showRecipeDetails(recipe) {
    document.getElementById('modal-recipe-name').textContent = recipe.name;
    document.getElementById('modal-recipe-image').src = recipe.image;
    document.getElementById('modal-recipe-ingredients').textContent = recipe.ingredients.join(', ');
    document.getElementById('modal-recipe-instructions').textContent = recipe.instructions;
    modal.style.display = "block";
}

// Delete recipe
function deleteRecipe(index) {
    if (confirm("Are you sure you want to delete this recipe?")) {
        recipes.splice(index, 1); // Remove the recipe from the array
        saveRecipes(); // Update localStorage
        displayRecipes(); // Refresh the displayed recipes
        showSuccessMessage("Recipe deleted successfully!");
    }
}

// Close modal
closeModal.onclick = function() {
    modal.style.display = "none";
}

// Close modal when clicking outside of it
window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
}

// Search recipes
searchInput.addEventListener('input', function() {
    const searchTerm = searchInput.value.toLowerCase();
    recipesList.innerHTML = ''; // Clear the current list
    if (searchTerm === '') {
        displayRecipes(); // Show all recipes if search input is empty
        return;
    }
    const filteredRecipes = recipes.filter(recipe => {
        return recipe.name.toLowerCase().includes(searchTerm) || 
               recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(searchTerm));
    });
    
    filteredRecipes.forEach(recipe => {
        const li = document.createElement('li');
        li.innerHTML = `
            <h3>${recipe.name}</h3>
            <img src="${recipe.image}" alt="${recipe.name}" class="recipe-image" style="max-width: 100px; max-height: 100px;">
            <button class="delete-button" onclick="deleteRecipe(${recipes.indexOf(recipe)})">Delete</button>
        `;
        li.addEventListener('click', () => showRecipeDetails(recipe));
        recipesList.appendChild(li);
    });
});

// Show success message
function showSuccessMessage(message) {
    successMessage.textContent = message;
    successMessage.style.display = 'block';
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 3000); // Hide after 3 seconds
}

// Load recipes on page load
loadRecipes();
