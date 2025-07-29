import React, { useState, useMemo } from "react";
import "./App.css";

// Dummy data simulating recipes. In a real app, replace with API data!
const DUMMY_RECIPES = [
  {
    id: 1,
    title: "Lemon Pesto Pasta",
    description: "A zesty, fresh pasta with homemade pesto.",
    ingredients: [
      "Spaghetti",
      "Basil",
      "Lemon",
      "Garlic",
      "Pine nuts",
      "Parmesan",
    ],
    instructions: [
      "Boil the spaghetti.",
      "Blend basil, lemon, garlic, pine nuts, and parmesan for pesto.",
      "Combine and serve.",
    ],
    cuisine: "Italian",
    tags: ["vegetarian", "quick"],
    prepTime: 20,
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 2,
    title: "Spicy Ramen",
    description: "Hearty ramen with a spicy broth and fresh toppings.",
    ingredients: [
      "Ramen noodles",
      "Chicken broth",
      "Chili paste",
      "Egg",
      "Green onion",
      "Sesame oil",
    ],
    instructions: [
      "Boil broth and add chili paste.",
      "Cook noodles.",
      "Add toppings and serve hot.",
    ],
    cuisine: "Japanese",
    tags: ["spicy"],
    prepTime: 25,
    image:
      "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 3,
    title: "Mango Salsa Salad",
    description:
      "A light, refreshing salad with sweet mango and a hint of chili.",
    ingredients: ["Mango", "Red onion", "Coriander", "Lime", "Chili"],
    instructions: [
      "Dice all ingredients.",
      "Mix in a bowl with lime juice and serve.",
    ],
    cuisine: "Mexican",
    tags: ["vegan", "quick"],
    prepTime: 10,
    image:
      "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: 4,
    title: "Classic BLT",
    description: "A crispy bacon, lettuce and tomato sandwich.",
    ingredients: [
      "Bread",
      "Bacon",
      "Lettuce",
      "Tomato",
      "Mayonnaise",
      "Salt",
      "Pepper",
    ],
    instructions: [
      "Toast the bread.",
      "Layer bacon, lettuce, and tomato.",
      "Spread mayo and season.",
    ],
    cuisine: "American",
    tags: ["quick"],
    prepTime: 10,
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=500&q=80",
  },
];

// PUBLIC_INTERFACE
function App() {
  // Search and filters
  const [search, setSearch] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("All");
  const [selectedTag, setSelectedTag] = useState("All");
  const [detailRecipe, setDetailRecipe] = useState(null);

  const recipes = useMemo(() => {
    return DUMMY_RECIPES;
  }, []);

  // Filter options (computed from data)
  const cuisines = [
    "All",
    ...[...new Set(DUMMY_RECIPES.map((r) => r.cuisine))].sort(),
  ];
  const tags = [
    "All",
    ...Array.from(
      new Set(DUMMY_RECIPES.flatMap((r) => r.tags).filter(Boolean))
    ).sort(),
  ];

  // Derived filtered/serached recipe list
  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      // Search by title/ingredient/description
      const matchesSearch =
        recipe.title.toLowerCase().includes(search.toLowerCase()) ||
        recipe.description.toLowerCase().includes(search.toLowerCase()) ||
        recipe.ingredients.some((ingr) =>
          ingr.toLowerCase().includes(search.toLowerCase())
        );

      // Cuisine and tag filter
      const cuisineOk =
        selectedCuisine === "All" || recipe.cuisine === selectedCuisine;
      const tagOk =
        selectedTag === "All" || (recipe.tags && recipe.tags.includes(selectedTag));
      return matchesSearch && cuisineOk && tagOk;
    });
  }, [search, recipes, selectedCuisine, selectedTag]);

  // PUBLIC_INTERFACE
  const handleRecipeClick = (recipe) => {
    setDetailRecipe(recipe);
  };
  // PUBLIC_INTERFACE
  const closeModal = () => setDetailRecipe(null);

  return (
    <div className="recipe-app-theme">
      <Header search={search} setSearch={setSearch} />
      <div className="main-layout">
        {/* Sidebar */}
        <Sidebar
          cuisines={cuisines}
          selectedCuisine={selectedCuisine}
          setSelectedCuisine={setSelectedCuisine}
          tags={tags}
          selectedTag={selectedTag}
          setSelectedTag={setSelectedTag}
        />
        {/* Main area */}
        <main className="recipe-main">
          {/* Card grid */}
          <div className="recipe-grid">
            {filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onClick={() => handleRecipeClick(recipe)}
              />
            ))}
            {filteredRecipes.length === 0 && (
              <span className="empty-state">No recipes found.</span>
            )}
          </div>
        </main>
      </div>
      {/* Detailed Recipe Modal */}
      {detailRecipe && (
        <RecipeModal recipe={detailRecipe} onClose={closeModal} />
      )}
    </div>
  );
}

// PUBLIC_INTERFACE
function Header({ search, setSearch }) {
  return (
    <header className="recipe-header">
      <div className="header-title">
        <span className="logo-dot" />
        <h1>Recipe Explorer</h1>
      </div>
      <input
        type="text"
        className="search-bar"
        placeholder="Search recipes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        aria-label="Search recipes"
      />
    </header>
  );
}

// PUBLIC_INTERFACE
function Sidebar({
  cuisines,
  selectedCuisine,
  setSelectedCuisine,
  tags,
  selectedTag,
  setSelectedTag,
}) {
  return (
    <aside className="recipe-sidebar">
      <div>
        <span className="sidebar-section">Cuisine</span>
        <ul>
          {cuisines.map((cuisine) => (
            <li
              key={cuisine}
              className={
                selectedCuisine === cuisine ? "active filter-btn" : "filter-btn"
              }
              onClick={() => setSelectedCuisine(cuisine)}
              tabIndex={0}
            >
              {cuisine}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <span className="sidebar-section">Tags</span>
        <ul>
          {tags.map((tag) => (
            <li
              key={tag}
              className={selectedTag === tag ? "active filter-btn" : "filter-btn"}
              onClick={() => setSelectedTag(tag)}
              tabIndex={0}
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

// PUBLIC_INTERFACE
function RecipeCard({ recipe, onClick }) {
  return (
    <div className="recipe-card" tabIndex={0} onClick={onClick}>
      <div
        className="recipe-card-image"
        style={{
          backgroundImage: `url(${recipe.image})`,
        }}
        aria-label={recipe.title}
      />
      <div className="recipe-card-body">
        <h2>{recipe.title}</h2>
        <div className="recipe-pill">{recipe.cuisine}</div>
        <div className="tags-row">
          {recipe.tags.map((t) => (
            <span className="tag" key={t}>
              {t}
            </span>
          ))}
        </div>
        <p className="desc">{recipe.description}</p>
        <span className="prep-time">{recipe.prepTime} min</span>
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function RecipeModal({ recipe, onClose }) {
  // Close on background click
  const onBackgroundClick = (e) => {
    if (e.target.classList.contains("modal-backdrop")) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={onBackgroundClick}>
      <div className="modal-content" role="dialog" aria-modal="true">
        <button className="modal-close" onClick={onClose} aria-label="Close detail modal">
          ×
        </button>
        <div
          className="modal-img"
          style={{
            backgroundImage: `url(${recipe.image})`,
          }}
        />
        <h2>{recipe.title}</h2>
        <div className="pill-row">
          <span className="recipe-pill">{recipe.cuisine}</span>
          {recipe.tags.map((t) => (
            <span className="tag" key={t}>
              {t}
            </span>
          ))}
          <span className="prep-time">{recipe.prepTime} min</span>
        </div>
        <p className="desc">{recipe.description}</p>
        <div className="ing-sec">
          <h3>Ingredients</h3>
          <ul>
            {recipe.ingredients.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="inst-sec">
          <h3>Instructions</h3>
          <ol>
            {recipe.instructions.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

export default App;
