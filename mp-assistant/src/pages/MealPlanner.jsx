import { useMemo, useState, useEffect } from "react";
import { mealPlanApi, recipesApi } from "../services/api";
import "./meal-planner.css";

const MEAL_TYPE_MAP = {
  breakfast: 0,
  lunch: 1,
  dinner: 2,
};

const getMondayOfWeek = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};

const formatDateOnly = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function MealPlanner() {
  const [weeklyBudget, setWeeklyBudget] = useState(70);
  const [weekStart, setWeekStart] = useState(() => getMondayOfWeek(new Date()));
  const [plan, setPlan] = useState([]);
  const [mealPlanId, setMealPlanId] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    loadData();
  }, [weekStart]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [allRecipes, mealPlanData] = await Promise.all([
        recipesApi.getAll(),
        mealPlanApi.getMealPlan(userId, formatDateOnly(weekStart)),
      ]);

      setRecipes(
        allRecipes.map((r) => ({
          id: r.id,
          title: r.name,
          price: r.price,
        }))
      );

      if (
        mealPlanData.id &&
        mealPlanData.id !== "00000000-0000-0000-0000-000000000000"
      ) {
        setMealPlanId(mealPlanData.id);
        setPlan(transformMealPlanToWeekView(mealPlanData));
      } else {
        setPlan(createEmptyWeek(weekStart));
      }
    } catch (err) {
      setError("Failed to load data: " + err.message);
      console.error(err);
      setPlan(createEmptyWeek(weekStart));
    } finally {
      setLoading(false);
    }
  };

  const createEmptyWeek = (startDate) => {
    const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
    return days.map((day, index) => {
      const date = new Date(startDate);
      date.setDate(date.getDate() + index);
      return {
        day,
        label: day[0].toUpperCase() + day.slice(1),
        date: formatDateOnly(date),
        meals: { breakfast: null, lunch: null, dinner: null },
      };
    });
  };

  const transformMealPlanToWeekView = (mealPlanData) => {
    const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
    return days.map((day, index) => {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + index);
      const dateStr = formatDateOnly(date);

      const dayData = mealPlanData.days.find((d) => d.date === dateStr);
      const meals = { breakfast: null, lunch: null, dinner: null };

      if (dayData) {
        dayData.items.forEach((item) => {
          const mealType = Object.keys(MEAL_TYPE_MAP).find(
            (key) => MEAL_TYPE_MAP[key] === item.mealType
          );
          if (mealType && item.recipe) {
            meals[mealType] = {
              id: item.recipe.id,
              itemId: item.id,
              title: item.recipe.name,
              price: item.recipe.price,
            };
          }
        });
      }

      return {
        day,
        label: day[0].toUpperCase() + day.slice(1),
        date: dateStr,
        dayId: dayData?.id,
        meals,
      };
    });
  };

  const flatMeals = useMemo(() => {
    const items = [];
    plan.forEach((d) => {
      Object.entries(d.meals).forEach(([, v]) => {
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
      saved: Math.max(0, 0.18 * cost),
    };
  }, [flatMeals, weeklyBudget]);

  const recipesFiltered = useMemo(() => recipes, [recipes]);

  async function replaceMeal(dayKey, slot, recipe) {
    try {
      const day = plan.find((d) => d.day === dayKey);
      const existingMeal = day.meals[slot];

      if (existingMeal?.itemId) {
        await mealPlanApi.updateItem(existingMeal.itemId, recipe.id);
      } else {
        await mealPlanApi.addItem(
          userId,
          day.date,
          MEAL_TYPE_MAP[slot],
          recipe.id
        );
      }

      await loadData();
    } catch (err) {
      setError("Failed to update meal: " + err.message);
      console.error(err);
    }
  }

  async function clearMeal(dayKey, slot) {
    try {
      const day = plan.find((d) => d.day === dayKey);
      const meal = day.meals[slot];

      if (meal?.itemId) {
        await mealPlanApi.deleteItem(meal.itemId);
        await loadData();
      }
    } catch (err) {
      setError("Failed to remove meal: " + err.message);
      console.error(err);
    }
  }

  async function clearWeek() {
    try {
      if (mealPlanId) {
        await mealPlanApi.deleteMealPlan(mealPlanId);
        await loadData();
      }
    } catch (err) {
      setError("Failed to clear week: " + err.message);
      console.error(err);
    }
  }

  async function autoPlan() {
    try {
      const data = await mealPlanApi.generateRandom(
        userId,
        formatDateOnly(weekStart),
        weeklyBudget
      );
      setMealPlanId(data.id);
      setPlan(transformMealPlanToWeekView(data));
    } catch (err) {
      setError("Failed to auto-plan: " + err.message);
      console.error(err);
    }
  }

  function changeWeek(delta) {
    const newWeekStart = new Date(weekStart);
    newWeekStart.setDate(newWeekStart.getDate() + delta * 7);
    setWeekStart(newWeekStart);
  }

  const getWeekLabel = () => {
    const today = getMondayOfWeek(new Date());
    const diff = Math.round((weekStart - today) / (7 * 24 * 60 * 60 * 1000));
    if (diff === 0) return "Current";
    if (diff > 0) return `+${diff}`;
    return `${diff}`;
  };

  if (loading) {
    return (
      <div className="planner-wrap">
        <header className="planner-head">
          <h1 className="planner-title">Meal Planner</h1>
        </header>
        <p style={{ padding: "2rem" }}>Loading meal plan...</p>
      </div>
    );
  }

  return (
    <div className="planner-wrap">
      {error && (
        <div className="auth-error" style={{ margin: "1rem" }}>
          {error}
        </div>
      )}

      <header className="planner-head">
        <div className="head-left">
          <h1 className="planner-title">Meal Planner</h1>
          <p className="planner-sub">
            Full-week view. Plan, edit, and stay on budget.
          </p>
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
            <button
              className="ghost"
              onClick={() => changeWeek(-1)}
              aria-label="Previous week"
            >
              ←
            </button>
            <span className="week-pill">Week {getWeekLabel()}</span>
            <button
              className="ghost"
              onClick={() => changeWeek(1)}
              aria-label="Next week"
            >
              →
            </button>
          </div>

          <button
            className={`edit-btn ${editMode ? "on" : ""}`}
            onClick={() => setEditMode((v) => !v)}
          >
            {editMode ? "Done" : "Edit Plan"}
          </button>
        </div>
      </header>

      <section className="toolbar">
        <div className="toolbar-left">
          <select
            className="select"
            value={weeklyBudget}
            onChange={(e) => setWeeklyBudget(Number(e.target.value))}
          >
            {[70, 80, 90, 100, 120].map((v) => (
              <option value={v} key={v}>
                Budget: ${v}
              </option>
            ))}
          </select>
        </div>
        <div className="toolbar-right">
          <button className="ghost" onClick={autoPlan}>
            Auto-Plan
          </button>
          <button className="ghost" onClick={clearWeek}>
            Clear Week
          </button>
        </div>
      </section>

      <section className="week-grid" aria-label="Weekly meal plan">
        <div className="grid-head">
          <div className="cell empty" />
          <div className="cell head">Breakfast</div>
          <div className="cell head">Lunch</div>
          <div className="cell head">Dinner</div>
        </div>

        {plan.map((day) => (
          <div key={day.day} className="grid-row">
            <div className="cell day-label">
              <div className="day-pill">{day.label}</div>
            </div>

            {["breakfast", "lunch", "dinner"].map((slot) => {
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
        <div className="tip">
          Tip: Use <strong>Edit Plan</strong> to add, replace, or clear meals.
          Auto-Plan fills the entire week with random recipes.
        </div>
      </section>
    </div>
  );
}

function MealTile({ title, price, editable, onRemove, onReplace, menu }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="meal-tile">
      <div className="meal-title">{title}</div>
      <div className="meal-price">${price.toFixed(2)}</div>

      {editable && (
        <div className="tile-actions">
          <button
            className="chip ghost"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
          >
            Replace
          </button>
          <button className="chip danger" onClick={onRemove}>
            Remove
          </button>
        </div>
      )}

      {editable && open && (
        <QuickPicker
          menu={menu}
          onPick={(r) => {
            onReplace(r);
            setOpen(false);
          }}
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
      <button className="chip add" onClick={() => setOpen(true)}>
        + Add
      </button>
      {open && (
        <QuickPicker
          menu={menu}
          onPick={(r) => {
            onAdd(r);
            setOpen(false);
          }}
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
        {menu.map((r) => (
          <button key={r.id} className="qp-item" onClick={() => onPick(r)}>
            <div className="qp-title">{r.title}</div>
            <div className="qp-price">${r.price.toFixed(2)}</div>
          </button>
        ))}
      </div>
      <button className="qp-close" onClick={onClose}>
        ✕
      </button>
    </div>
  );
}
