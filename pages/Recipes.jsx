import { useMemo, useState } from "react";
import "./recipes.css";

const SEED = [
  {
    id: "r1",
    title: "Yummy Smoothie Bowl",
    categories: ["breakfast"],
    minutes: 10,
    pricePerServing: 2.1,
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1200&auto=format&fit=crop",
    tags: ["vegetarian", "quick"],
  },
  {
    id: "r2",
    title: "Salmon w/ Quinoa",
    categories: ["dinner"],
    minutes: 20,
    pricePerServing: 3.9,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop",
    tags: ["high protein"],
  },
  {
    id: "r3",
    title: "Homemade Apple Pie",
    categories: ["dessert"],
    minutes: 60,
    pricePerServing: 1.8,
    rating: 4.2,
    image:
      "https://images.unsplash.com/photo-1505253224300-0d5d80fa2f63?q=80&w=1200&auto=format&fit=crop",
    tags: ["bake"],
  },
  {
    id: "r4",
    title: "Superfood Green Juice",
    categories: ["drinks"],
    minutes: 5,
    pricePerServing: 1.1,
    rating: 4.0,
    image:
      "https://images.unsplash.com/photo-1505575972945-2804b5c00ce0?q=80&w=1200&auto=format&fit=crop",
    tags: ["vegan", "quick"],
  },
  {
    id: "r5",
    title: "Blueberry Avocado Pasta",
    categories: ["lunch"],
    minutes: 18,
    pricePerServing: 2.8,
    rating: 4.1,
    image:
      "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=1200&auto=format&fit=crop",
    tags: ["budget"],
  },
  {
    id: "r6",
    title: "Oregano Pizza",
    categories: ["lunch", "dinner"],
    minutes: 25,
    pricePerServing: 2.4,
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1548365328-9f547fb0953f?q=80&w=1200&auto=format&fit=crop",
    tags: ["crowd-pleaser"],
  },
  {
    id: "r7",
    title: "Raspberry Waffles",
    categories: ["breakfast"],
    minutes: 15,
    pricePerServing: 1.9,
    rating: 4.3,
    image:
      "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?q=80&w=1200&auto=format&fit=crop",
    tags: ["sweet", "brunch"],
  },
  {
    id: "r8",
    title: "Chickpea Minestrone",
    categories: ["dinner"],
    minutes: 30,
    pricePerServing: 2.2,
    rating: 4.4,
    image:
      "https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=1200&auto=format&fit=crop",
    tags: ["budget", "fiber"],
  },
];

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
  const [recipes, setRecipes] = useState(SEED);
  const [active, setActive] = useState("all"); // "all" | "favorites" | category
  const [query, setQuery] = useState("");
  const [view, setView] = useState("gallery"); // "gallery" | "list"
  const [sortKey, setSortKey] = useState("relevance"); // "relevance" | "time" | "cost" | "rating"
  const [budgetFilter, setBudgetFilter] = useState(null); // number | null

  const filtered = useMemo(() => {
    let r = [...recipes];

    // category
    if (active === "favorites") {
      r = r.filter((x) => x.isFavorite);
    } else if (active !== "all") {
      r = r.filter((x) => x.categories.includes(active));
    }

    // search
    if (query.trim()) {
      const q = query.toLowerCase();
      r = r.filter(
        (x) =>
          x.title.toLowerCase().includes(q) ||
          (x.tags || []).some((t) => t.toLowerCase().includes(q))
      );
    }

    // budget
    if (budgetFilter != null) {
      r = r.filter((x) => x.pricePerServing <= budgetFilter);
    }

    // sort
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

  const toggleFavorite = (id) => {
    setRecipes((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isFavorite: !r.isFavorite } : r))
    );
  };

  const toggleGrocery = (id) => {
    setRecipes((prev) =>
      prev.map((r) => (r.id === id ? { ...r, addedToGrocery: !r.addedToGrocery } : r))
    );
    // TODO: connect to your grocery list store/api
  };

  return (
    <div className="recipes-wrap">
      <header className="recipes-header">
        <div>
          <h1 className="recipes-title">Recipes</h1>
          <p className="recipes-sub">Browse, filter, and add meals to your plan.</p>
        </div>

        <div className="recipes-actions">
          <div className="input icon-left">
            <span className="icon">🔎</span>
            <input
              aria-label="Search recipes"
              placeholder="Search recipes, tags, ingredients…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <select
            aria-label="Sort recipes"
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
            aria-label="Budget filter"
            className="select"
            value={budgetFilter ?? ""}
            onChange={(e) => setBudgetFilter(e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">Budget: Any</option>
            <option value="2">≤ $2.00</option>
            <option value="3">≤ $3.00</option>
            <option value="4">≤ $4.00</option>
          </select>

          <div className="view-toggle" role="tablist" aria-label="View mode">
            <button
              role="tab"
              aria-selected={view === "gallery"}
              className={view === "gallery" ? "active" : ""}
              onClick={() => setView("gallery")}
              title="Gallery view"
            >
              ⬛ ⬛
            </button>
            <button
              role="tab"
              aria-selected={view === "list"}
              className={view === "list" ? "active" : ""}
              onClick={() => setView("list")}
              title="List view"
            >
              ☰
            </button>
          </div>
        </div>
      </header>

      <nav className="recipes-tabs" aria-label="Recipe categories">
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

      {view === "gallery" ? (
        <section className="recipes-grid" aria-live="polite">
          {filtered.map((r) => (
            <article key={r.id} className="recipe-card">
              <button
                className={`fav ${r.isFavorite ? "on" : ""}`}
                onClick={() => toggleFavorite(r.id)}
                aria-label={r.isFavorite ? "Remove from favorites" : "Add to favorites"}
                title="Toggle favorite"
              >
                ★
              </button>

              <div className="thumb">
                {r.image ? <img src={r.image} alt="" aria-hidden="true" /> : <div className="placeholder" />}
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
                  <label className="grocery">
                    <input
                      type="checkbox"
                      checked={!!r.addedToGrocery}
                      onChange={() => toggleGrocery(r.id)}
                    />
                    <span>Add To Grocery List</span>
                  </label>
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <section className="recipes-list" aria-live="polite">
          {filtered.map((r) => (
            <div key={r.id} className="list-row">
              <div className="list-left">
                <div className="list-thumb">
                  {r.image ? <img src={r.image} alt="" /> : <div className="placeholder" />}
                </div>
                <div className="list-text">
                  <div className="list-title">
                    <button
                      className={`fav small ${r.isFavorite ? "on" : ""}`}
                      onClick={() => toggleFavorite(r.id)}
                      aria-label={r.isFavorite ? "Remove from favorites" : "Add to favorites"}
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
                <label className="grocery">
                  <input
                    type="checkbox"
                    checked={!!r.addedToGrocery}
                    onChange={() => toggleGrocery(r.id)}
                  />
                  <span>Add To Grocery List</span>
                </label>
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
    <div className="rating" aria-label={`Rating ${value} out of 5`}>
      {"★".repeat(full)}
      {half ? "⯪" : ""}
      {"☆".repeat(empty)}
      <span className="rating-num">{value.toFixed(1)}</span>
    </div>
  );
}
