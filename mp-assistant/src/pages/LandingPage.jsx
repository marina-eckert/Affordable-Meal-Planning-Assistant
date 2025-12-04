import { Link } from "react-router-dom";
import "./landing.css";

export default function LandingPage() {
  return (
    <div className="lp">
      
      <header className="lp-nav">
        <div className="lp-brand">
          <div className="lp-logo" aria-hidden="true">🍽</div>
          <span className="lp-name">MealPlan</span>
        </div>
        <nav className="lp-actions">
          <a href="#features" className="lp-link">Features</a>
          <a href="#how" className="lp-link">How it works</a>
          <a href="#faq" className="lp-link">FAQ</a>
          <Link to="/login" className="lp-cta">Get started</Link>
        </nav>
      </header>

      
      <section className="lp-hero">
        
        <img
          className="lp-hero-bg"
          src="https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=1600&auto=format&fit=crop"
          alt=""
          aria-hidden="true"
        />
        <div className="lp-hero-scrim" />
        <div className="lp-hero-inner">
          <h1 className="lp-hero-title">
            Your <em>Personal</em> Meal Planning Assistant
          </h1>

          <div className="lp-flow">
            <div className="flow-chip">Set budget</div>
            <div className="flow-arrow" aria-hidden="true">→</div>
            <div className="flow-chip">Plan Week</div>
            <div className="flow-arrow" aria-hidden="true">→</div>
            <div className="flow-chip">Shop Smarter</div>
          </div>

          <div className="lp-hero-ctas">
            <Link to="/planner" className="btn primary">Get started</Link>
            <a href="#features" className="btn ghost">See features</a>
          </div>

          <p className="lp-sub">
            Save money, cut food waste, and eat better—without the planning stress.
          </p>
        </div>
      </section>

      <section> 


      </section>

      
      <section className="lp-stats">
        <div className="stat">
          <strong>$23.40</strong>
          <span>avg saved / week</span>
        </div>
        <div className="stat">
          <strong>12%</strong>
          <span>waste reduced</span>
        </div>
        <div className="stat">
          <strong>3 min</strong>
          <span>to plan a week</span>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="lp-features">
        <h2>Designed for students & busy professionals</h2>
        <div className="feat-grid">
          <Feature
            title="Budget-based planning"
            body="Set a weekly budget and watch your plan stay under it—live."
            icon="💸"
          />
          <Feature
            title="Leftovers → recipes"
            body="Type ingredients or snap a fridge photo to get meal ideas."
            icon="🥗"
          />
          <Feature
            title="Cheapest grocery combos"
            body="Get cost-smart ingredient suggestions and a ready list."
            icon="🛒"
          />
          <Feature
            title="Nutrition tips"
            body="Light nutrition insights and healthier swaps built-in."
            icon="📊"
          />
          <Feature
            title="Simple, fast UI"
            body="Clean cards, quick filters, and one-tap add to plan."
            icon="⚡"
          />
          <Feature
            title="Save & repeat"
            body="Copy last week, tweak a day, done in under a minute."
            icon="🔁"
          />
        </div>
      </section>

      
      <section id="how" className="lp-how">
        <h2>How it works</h2>
        <ol className="how-steps">
          <li><strong>Set your budget.</strong> Pick ₦/€/$ per week.</li>
          <li><strong>Plan your week.</strong> Auto-fill or drag in recipes.</li>
          <li><strong>Shop smarter.</strong> Export the cheapest grocery list.</li>
        </ol>
       
      </section>

      
      <section className="lp-cta-band">
        <h3>Ready to save on groceries this week?</h3>
        <Link to="/login" className="btn primary lg">Start planning free</Link>
      </section>

      
      <section id="faq" className="lp-faq">
        <details>
          <summary>Is MealPlan free?</summary>
          <p>Yes—core planning is free. A Student Pro plan later adds diet presets and price alerts.</p>
        </details>
        <details>
          <summary>Do I need to know how to cook?</summary>
          <p>No. Recipes include simple steps and time estimates. You can filter by difficulty.</p>
        </details>
        <details>
          <summary>What about privacy?</summary>
          <p>You control your data. Photos are processed only to extract ingredients you approve.</p>
        </details>
      </section>

      <footer className="lp-foot">
        <div>© {new Date().getFullYear()} MealPlan</div>
        <div className="foot-links">
          <a href="#features">Features</a>
          <a href="#faq">FAQ</a>
          <a href="#" onClick={(e)=>e.preventDefault()}>Privacy</a>
        </div>
      </footer>
    </div>
  );
}

function Feature({ icon, title, body }) {
  return (
    <article className="feat">
      <div className="feat-icon" aria-hidden="true">{icon}</div>
      <h3 className="feat-title">{title}</h3>
      <p className="feat-body">{body}</p>
    </article>
  );
}
