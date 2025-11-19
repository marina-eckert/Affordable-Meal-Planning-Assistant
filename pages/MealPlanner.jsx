import { useMemo, useState } from "react";
import "./meal-planner.css";

/** demo data */
const RECIPE_INDEX = [
  { id: "oatmeal", title: "Oatmeal", price: 2.5 },
  { id: "toast", title: "Toast", price: 1.8 },
  { id: "cereal", title: "Cereal", price: 2.2 },
  { id: "salmon", title: "Salmon Bowl", price: 3.9 },
  { id: "pasta", title: "Budget Veggie Pasta", price: 3.2 },
  { id: "soup", title: "Hearty Soup", price: 2.5 },
  { id: "rice", title: "Simple Rice Bowl", price: 2.8 },
];


const TEMPLATE = () => ([
  { key: "mon" }, { key: "tue" }, { key: "wed" }, { key: "thu" }, { key: "fri" }, { key: "sat" }, { key: "sun" },
].map(k => ({
  day: k.key,
  label: k.key[0].toUpperCase() + k.key.slice(1),
  meals: { breakfast: null, lunch: null, dinner: null }
})));

const STARTER_WEEK = () => {
  const t = TEMPLATE();
  t[0].meals.breakfast = { id: "oatmeal", title: "Oatmeal", price: 2.5 };
  t[1].meals.breakfast = { id: "toast", title: "Toast", price: 1.8 };
  t[2].meals.breakfast = { id: "cereal", title: "Cereal", price: 2.2 };
  return t;
};

export default function MealPlanner() {
  const [weeklyBudget, setWeeklyBudget] = useState(70);
  const [weekIndex, setWeekIndex] = useState(0); // 0 = current week (for nav demo)
  const [plan, setPlan] = useState(STARTER_WEEK());
  const [editMode, setEditMode] = useState(false);
  const [quickAddFilter, setQuickAddFilter] = useState("");

  const flatMeals = useMemo(() => {
    const items = [];
    plan.forEach(d => {
      Object.entries(d.meals).forEach(([slot, v]) => {
        if (v) items.push(v);
      });
    });
    return items;
  }, [plan]);

  const totals = useMemo(() => {
    const cost = flatMeals.reduce((s, m) => s + (m.price || 0), 0);
    return {
      meals: flatMeals.length,
      cost,
      remaining: Math.max(weeklyBudget - cost, 0),
      saved: Math.max(0, 0.18 * cost) 
    };
  }, [flatMeals, weeklyBudget]);

  const recipesFiltered = useMemo(() => {
    const q = quickAddFilter.toLowerCase().trim();
    if (!q) return RECIPE_INDEX;
    return RECIPE_INDEX.filter(r => r.title.toLowerCase().includes(q));
  }, [quickAddFilter]);

  function replaceMeal(dayKey, slot, recipe) {
    setPlan(prev =>
      prev.map(d =>
        d.day === dayKey
          ? { ...d, meals: { ...d.meals, [slot]: recipe } }
          : d
      )
    );
  }

  function clearMeal(dayKey, slot) {
    setPlan(prev =>
      prev.map(d =>
        d.day === dayKey
          ? { ...d, meals: { ...d.meals, [slot]: null } }
          : d
      )
    );
  }

  function clearWeek() {
    setPlan(TEMPLATE());
  }

  function copyLastWeek() {
  
    setPlan(STARTER_WEEK());
  }

  function autoPlan() {
  
    setPlan(prev => {
      let idx = 0;
      const next = prev.map(d => {
        const meals = { ...d.meals };
        for (const slot of ["breakfast", "lunch", "dinner"]) {
          if (!meals[slot]) {
            const r = RECIPE_INDEX[idx % RECIPE_INDEX.length];
            meals[slot] = r;
            idx++;
          }
        }
        return { ...d, meals };
      });
      return next;
    });
  }

  function addAllToGrocery() {
    const ids = flatMeals.map(m => m.id);
    console.log("Add to Grocery List:", ids);
    alert(`Added ${ids.length} planned items to Grocery List (demo).`);
  }

  function changeWeek(delta) {
   
    setWeekIndex(i => i + delta);
  }

  return (
    <div className="planner-wrap">
      <header className="planner-head">
        <div className="head-left">
          <h1 className="planner-title">Meal Planner</h1>
          <p className="planner-sub">Full-week view. Plan, edit, and stay on budget.</p>
        </div>

        <div className="head-actions">
          <div className="budget-chip">
            <span>${totals.remaining.toFixed(2)}</span>
            <small>Remaining</small>
          </div>
          <div className="stat-chip">
            <span>{totals.meals}</span>
            <small>Meals</small>
          </div>
          <div className="stat-chip">
            <span>${totals.cost.toFixed(2)}</span>
            <small>Planned</small>
          </div>

          <div className="divider" />
          <div className="week-nav">
            <button className="ghost" onClick={() => changeWeek(-1)} aria-label="Previous week">←</button>
            <span className="week-pill">Week {weekIndex === 0 ? "Current" : (weekIndex > 0 ? `+${weekIndex}` : `${weekIndex}`)}</span>
            <button className="ghost" onClick={() => changeWeek(1)} aria-label="Next week">→</button>
          </div>

          <button className={`edit-btn ${editMode ? "on" : ""}`} onClick={() => setEditMode(v => !v)}>
            {editMode ? "Done" : "Edit Plan"}
          </button>
        </div>
      </header>

      <section className="toolbar">
        <div className="toolbar-left">
          <label className="input icon-left">
            <span className="icon">🔎</span>
            <input
              placeholder="Quick add: search recipes…"
              value={quickAddFilter}
              onChange={e => setQuickAddFilter(e.target.value)}
            />
          </label>
          <select
            className="select"
            value={weeklyBudget}
            onChange={e => setWeeklyBudget(Number(e.target.value))}
          >
            {[50, 60, 70, 80, 90, 100].map(v => (
              <option value={v} key={v}>Budget: ${v}</option>
            ))}
          </select>
        </div>
        <div className="toolbar-right">
          <button className="ghost" onClick={autoPlan}>Auto-Plan</button>
          <button className="ghost" onClick={copyLastWeek}>Copy Last Week</button>
          <button className="ghost" onClick={clearWeek}>Clear Week</button>
          <button className="primary" onClick={addAllToGrocery}>View / Add Grocery List</button>
        </div>
      </section>

      <section className="week-grid" aria-label="Weekly meal plan">
        <div className="grid-head">
          <div className="cell empty" />
          <div className="cell head">Breakfast</div>
          <div className="cell head">Lunch</div>
          <div className="cell head">Dinner</div>
        </div>

        {plan.map(day => (
          <div key={day.day} className="grid-row">
            <div className="cell day-label">
              <div className="day-pill">{day.label}</div>
            </div>

            {(["breakfast", "lunch", "dinner"]).map(slot => {
              const value = day.meals[slot];
              return (
                <div key={slot} className="cell meal">
                  {value ? (
                    <MealTile
                      title={value.title}
                      price={value.price}
                      editable={editMode}
                      onRemove={() => clearMeal(day.day, slot)}
                      onReplace={(r) => replaceMeal(day.day, slot, r)}
                      menu={recipesFiltered}
                    />
                  ) : (
                    <EmptyTile
                      editable={editMode}
                      onAdd={(r) => replaceMeal(day.day, slot, r)}
                      menu={recipesFiltered}
                    />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </section>

      <section className="foot-help">
        <div className="tip">Tip:  Use <strong>Edit Plan</strong> to add, replace, or clear meals. Auto-Plan fills empty slots from your recipes within budget.</div>
      </section>
    </div>
  );
}

/** small ui bits */
function MealTile({ title, price, editable, onRemove, onReplace, menu }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="meal-tile">
      <div className="meal-title">{title}</div>
      <div className="meal-price">${price.toFixed(2)}</div>

      {editable && (
        <div className="tile-actions">
          <button className="chip ghost" onClick={() => setOpen(o => !o)} aria-expanded={open}>
            Replace
          </button>
          <button className="chip danger" onClick={onRemove}>Remove</button>
        </div>
      )}

      {editable && open && (
        <QuickPicker
          menu={menu}
          onPick={(r) => { onReplace(r); setOpen(false); }}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}

function EmptyTile({ editable, onAdd, menu }) {
  const [open, setOpen] = useState(false);
  if (!editable) return <div className="empty-tile muted">+ Add</div>;
  return (
    <div className="empty-tile addable">
      <button className="chip add" onClick={() => setOpen(true)}>+ Add</button>
      {open && (
        <QuickPicker
          menu={menu}
          onPick={(r) => { onAdd(r); setOpen(false); }}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}

function QuickPicker({ menu, onPick, onClose }) {
  return (
    <div className="quickpicker" role="dialog" aria-label="Choose recipe">
      <div className="qp-scroller">
        {menu.map(r => (
          <button key={r.id} className="qp-item" onClick={() => onPick(r)}>
            <div className="qp-title">{r.title}</div>
            <div className="qp-price">${r.price.toFixed(2)}</div>
          </button>
        ))}
      </div>
      <button className="qp-close" onClick={onClose}>✕</button>
    </div>
  );
}
