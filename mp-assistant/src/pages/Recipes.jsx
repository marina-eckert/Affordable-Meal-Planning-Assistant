import { useMemo, useState, useEffect } from "react";
import "./recipes.css";
import { recipesApi, groceryApi, favoritesApi } from "../services/api";

import smoothieBowl from "../assets/images/smoothie-bowl.jpeg";
import salmonQuinoa from "../assets/images/salmon-quinoa.jpg";
import chickenRiceBowl from "../assets/images/chicken-rice.webp";
import shrimpNoodleBowl from "../assets/images/shrimp-noodles.jpg";
import vegStirFry from "../assets/images/veg-stir-fry.jpg";
import lentilSoup from "../assets/images/lentil-soup.jpg";
import beefPasta from "../assets/images/beef-pasta.jpg";
import greekSalad from "../assets/images/greek-salad.jpg";
import chickenSalad from "../assets/images/ceasar-salad.jpg";
import avocadoToast from "../assets/images/avocado-toast.jpg";
import omelette from "../assets/images/omelette.jpg";
import tofuBowl from "../assets/images/tofu-bowl.jpg";

const IMAGE_MAP = {
  "Salmon with Vegetables": salmonQuinoa,
  "Chicken Rice Bowl": chickenRiceBowl,
  "Vegetable Stir Fry": vegStirFry,
  "Lentil Soup": lentilSoup,
  "Shrimp Noodle Bowl": shrimpNoodleBowl,
  "Beef Pasta Bolognese": beefPasta,
  "Greek Salad": greekSalad,
  "Chicken Caesar Salad": chickenSalad,
  "Avocado Toast": avocadoToast,
  Omelette: omelette,
  "Tofu Vegetable Bowl": tofuBowl,
  "Fruit Smoothie": smoothieBowl,
};

const CATEGORIES = [
  { key: "all", label: "all recipes" },
  { key: "favorites", label: "favorites" },
  { key: "breakfast", label: "breakfast" },
  { key: "lunch", label: "lunch" },
  { key: "dinner", label: "dinner" },
  { key: "dessert", label: "desserts" },
  { key: "snacks", label: "snacks" },
  { key: "drinks", label: "drinks" },
];

export default function RecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState("all");
  const [query, setQuery] = useState("");
  const [view, setView] = useState("gallery");
  const [sortKey, setSortKey] = useState("relevance");
  const [budgetFilter, setBudgetFilter] = useState(null);
  const [openRecipe, setOpenRecipe] = useState(null);
  const [addingToGrocery, setAddingToGrocery] = useState(null);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [backendRecipes, favoriteIds] = await Promise.all([
        recipesApi.getAll(),
        favoritesApi.getUserFavorites(userId),
      ]);

      const transformedRecipes = backendRecipes.map((recipe) => ({
        id: recipe.id,
        title: recipe.name,
        categories: [recipe.category.toLowerCase()],
        minutes: recipe.durationInMinutes,
        pricePerServing: recipe.price,
        rating: recipe.rating,
        image: IMAGE_MAP[recipe.name] || smoothieBowl,
        tags: [],
        ingredients: recipe.ingredients.map((ing) => ing.name),
        recipe: `Delicious ${recipe.name} recipe.`,
        isFavorite: favoriteIds.includes(recipe.id),
        addedToGrocery: false,
        backendIngredients: recipe.ingredients,
      }));

      setRecipes(transformedRecipes);
    } catch (err) {
      console.error("Failed to load recipes:", err);
      alert("Failed to load recipes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    let r = [...recipes];
    if (active === "favorites") r = r.filter((x) => x.isFavorite);
    else if (active !== "all")
      r = r.filter((x) => x.categories.includes(active));

    if (query.trim()) {
      const q = query.toLowerCase();
      r = r.filter(
        (x) =>
          x.title.toLowerCase().includes(q) ||
          (x.tags || []).some((t) => t.toLowerCase().includes(q))
      );
    }

    if (budgetFilter != null)
      r = r.filter((x) => x.pricePerServing <= budgetFilter);

    switch (sortKey) {
      case "time":
        r.sort((a, b) => a.minutes - b.minutes);
        break;
      case "cost":
        r.sort((a, b) => a.pricePerServing - b.pricePerServing);
        break;
      case "rating":
        r.sort((a, b) => b.rating - a.rating);
        break;
      default:
        r.sort((a, b) => b.rating - a.rating || a.minutes - b.minutes);
    }
    return r;
  }, [recipes, active, query, sortKey, budgetFilter]);

  const toggleFavorite = async (id) => {
    try {
      const recipe = recipes.find((r) => r.id === id);
      if (recipe.isFavorite) {
        await favoritesApi.removeFavorite(userId, id);
      } else {
        await favoritesApi.addFavorite(userId, id);
      }

      setRecipes((prev) =>
        prev.map((r) => (r.id === id ? { ...r, isFavorite: !r.isFavorite } : r))
      );
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
      alert("Failed to update favorite. Please try again.");
    }
  };

  const addIngredientsToGrocery = async (recipeId) => {
    const recipe = recipes.find((r) => r.id === recipeId);
    if (!recipe || !recipe.backendIngredients) return;

    setAddingToGrocery(recipeId);
    try {
      for (const ingredient of recipe.backendIngredients) {
        await groceryApi.addItem(userId, ingredient.id, 1);
      }

      setRecipes((prev) =>
        prev.map((r) =>
          r.id === recipeId ? { ...r, addedToGrocery: true } : r
        )
      );

      alert(
        `All ingredients from "${recipe.title}" added to your grocery list!`
      );
    } catch (err) {
      console.error("Failed to add ingredients:", err);
      alert("Failed to add some ingredients. Please try again.");
    } finally {
      setAddingToGrocery(null);
    }
  };

  if (loading) {
    return (
      <div className="recipes-wrap">
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <p>Loading recipes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="recipes-wrap">
      {/* Modal */}
      {openRecipe && (
        <div className="modal-overlay" onClick={() => setOpenRecipe(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setOpenRecipe(null)}>
              ✕
            </button>
            <img className="modal-img" src={openRecipe.image} alt="" />
            <h2>{openRecipe.title}</h2>
            <p className="modal-meta">
              {openRecipe.minutes} min · $
              {openRecipe.pricePerServing.toFixed(2)}/serving
            </p>
            <div className="chips">
              {openRecipe.categories.map((c) => (
                <span className={`chip cat-${c}`} key={c}>
                  {c}
                </span>
              ))}
              {(openRecipe.tags || []).map((t) => (
                <span className="chip subtle" key={t}>
                  {t}
                </span>
              ))}
            </div>
            <h3>Ingredients</h3>
            <ul className="modal-list">
              {openRecipe.ingredients.map((i, idx) => (
                <li key={idx}>{i}</li>
              ))}
            </ul>
            <h3>Instructions</h3>
            <p>{openRecipe.recipe}</p>
            <button
              className="add-btn"
              style={{ marginTop: "1rem", width: "100%" }}
              onClick={(e) => {
                e.stopPropagation();
                addIngredientsToGrocery(openRecipe.id);
              }}
              disabled={
                addingToGrocery === openRecipe.id || openRecipe.addedToGrocery
              }
            >
              {addingToGrocery === openRecipe.id
                ? "Adding..."
                : openRecipe.addedToGrocery
                  ? "✓ Added to Grocery List"
                  : "Add All Ingredients to Grocery List"}
            </button>
          </div>
        </div>
      )}

      <header className="recipes-header">
        <div>
          <h1 className="recipes-title">Recipes</h1>
          <p className="recipes-sub">
            Browse, filter, and add meals to your plan.
          </p>
        </div>
        <div className="recipes-actions">
          <div className="input icon-left">
            <span className="icon">🔎</span>
            <input
              placeholder="Search recipes…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <select
            className="select"
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
          >
            <option value="relevance">Sort: Relevance</option>
            <option value="time">Sort: Time (mins)</option>
            <option value="cost">Sort: Cost ($)</option>
            <option value="rating">Sort: Rating</option>
          </select>
          <select
            className="select"
            value={budgetFilter ?? ""}
            onChange={(e) =>
              setBudgetFilter(e.target.value ? Number(e.target.value) : null)
            }
          >
            <option value="">Budget: Any</option>
            <option value="2">≤ $2.00</option>
            <option value="3">≤ $3.00</option>
            <option value="4">≤ $4.00</option>
          </select>
          <div className="view-toggle">
            <button
              className={view === "gallery" ? "active" : ""}
              onClick={() => setView("gallery")}
            >
              ⬛ ⬛
            </button>
            <button
              className={view === "list" ? "active" : ""}
              onClick={() => setView("list")}
            >
              ☰
            </button>
          </div>
        </div>
      </header>

      <nav className="recipes-tabs">
        {CATEGORIES.map(({ key, label }) => (
          <button
            key={key}
            className={`tab ${active === key ? "active" : ""}`}
            onClick={() => setActive(key)}
          >
            {label}
          </button>
        ))}
      </nav>

      {/* Gallery View */}
      {view === "gallery" ? (
        <section className="recipes-grid">
          {filtered.map((r) => (
            <article
              key={r.id}
              className="recipe-card"
              onClick={() => setOpenRecipe(r)}
            >
              <button
                className={`fav ${r.isFavorite ? "on" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(r.id);
                }}
              >
                ★
              </button>
              <div className="thumb">
                <img src={r.image} alt="" />
              </div>
              <div className="body">
                <h3 className="title">{r.title}</h3>
                <div className="chips">
                  {r.categories.map((c) => (
                    <span className={`chip cat-${c}`} key={c}>
                      {c}
                    </span>
                  ))}
                  <span className="chip subtle">{r.minutes} Minutes</span>
                </div>
                <div className="meta">
                  <span className="price">${r.pricePerServing.toFixed(2)}</span>
                  <span className="per">per serving</span>
                </div>
                <div className="row">
                  <Rating value={r.rating} />
                  <button
                    className="add-btn"
                    style={{ fontSize: "0.85rem", padding: "0.4rem 0.8rem" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      addIngredientsToGrocery(r.id);
                    }}
                    disabled={addingToGrocery === r.id || r.addedToGrocery}
                  >
                    {addingToGrocery === r.id
                      ? "Adding..."
                      : r.addedToGrocery
                        ? "✓ Added"
                        : "Add to Grocery"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : (
        /* List View */
        <section className="recipes-list">
          {filtered.map((r) => (
            <div
              key={r.id}
              className="list-row"
              onClick={() => setOpenRecipe(r)}
            >
              <div className="list-left">
                <div className="list-thumb">
                  <img src={r.image} alt="" />
                </div>
                <div className="list-text">
                  <div className="list-title">
                    <button
                      className={`fav small ${r.isFavorite ? "on" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(r.id);
                      }}
                    >
                      ★
                    </button>
                    <h3>{r.title}</h3>
                  </div>
                  <div className="chips">
                    {r.categories.map((c) => (
                      <span className={`chip cat-${c}`} key={c}>
                        {c}
                      </span>
                    ))}
                    {(r.tags || []).map((t) => (
                      <span className="chip subtle" key={t}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="list-right">
                <Rating value={r.rating} />
                <div className="list-meta">
                  <span>{r.minutes} min</span>
                  <span>·</span>
                  <span>${r.pricePerServing.toFixed(2)}/serving</span>
                </div>
                <button
                  className="add-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    addIngredientsToGrocery(r.id);
                  }}
                  disabled={addingToGrocery === r.id || r.addedToGrocery}
                >
                  {addingToGrocery === r.id
                    ? "Adding..."
                    : r.addedToGrocery
                      ? "✓ Added to Grocery"
                      : "Add to Grocery List"}
                </button>
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

function Rating({ value }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <div className="rating">
      {"★".repeat(full)}
      {half ? "⯪" : ""}
      {"☆".repeat(empty)}
      <span className="rating-num">{value.toFixed(1)}</span>
    </div>
  );
}
