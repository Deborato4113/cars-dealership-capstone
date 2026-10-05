import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
  useParams,
  useSearchParams
} from "react-router-dom";
import "./styles.css";

const API =
  import.meta.env.VITE_API_URL ||
  "https://cars-dealership-capstone-rlq9.onrender.com/api";

async function api(path, options = {}) {
  const res = await fetch(API + path, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || JSON.stringify(data));
  }

  return data;
}

function Nav({ user, setUser }) {
  const nav = useNavigate();

  async function logout() {
    await api("/logout/", { method: "POST" });
    setUser(null);
    nav("/");
  }

  return (
    <nav>
      <Link to="/" className="brand">
        Cars Dealership
      </Link>

      <div className="navlinks">
        <Link to="/">Dealers</Link>
        <Link to="/about">About Us</Link>
        <Link to="/contact">Contact Us</Link>

        {user ? (
          <>
            <span className="user">Welcome, {user.username}</span>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

function Layout() {
  const [user, setUser] = useState(null);

  return (
    <>
      <Nav user={user} setUser={setUser} />

      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route
          path="/dealer/:id"
          element={<DealerDetails user={user} />}
        />
        <Route
          path="/dealer/:id/review"
          element={<ReviewPage user={user} />}
        />
      </Routes>
    </>
  );
}

function Home({ user }) {
  const [dealers, setDealers] = useState([]);
  const [state, setState] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const s = searchParams.get("state");

    api(
      s
        ? `/dealers/state/${encodeURIComponent(s)}/`
        : "/dealers/"
    ).then(setDealers);
  }, [searchParams]);

  return (
    <main className="container">
      <section className="hero">
        <h1>Find Your Dealership</h1>
        <p>
          Explore trusted car dealerships across the United States.
        </p>
      </section>

      <div className="filter">
        <input
          value={state}
          onChange={(e) => setState(e.target.value)}
          placeholder="Filter by state (e.g. Kansas)"
        />

        <button
          onClick={() =>
            setSearchParams(state ? { state } : {})
          }
        >
          Search
        </button>

        <button
          onClick={() => {
            setState("");
            setSearchParams({});
          }}
        >
          All Dealers
        </button>
      </div>

      <div className="grid">
        {dealers.map((d) => (
          <article className="card" key={d.id}>
            <img src={d.image_url} alt={d.name} />

            <div className="cardbody">
              <h2>{d.name}</h2>

              <p>
                {d.city}, {d.state} {d.zip_code}
              </p>

              <p>{d.phone}</p>

              <p>{d.reviews_count} review(s)</p>

              <Link
                className="primary"
                to={`/dealer/${d.id}`}
              >
                View Dealer
              </Link>

              {user && (
                <Link
                  className="secondary"
                  to={`/dealer/${d.id}/review`}
                >
                  Review Dealer
                </Link>
              )}
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}

function Login({ setUser }) {
  const [username, setUsername] = useState("demo");
  const [password, setPassword] = useState("Demo@123");
  const [msg, setMsg] = useState("");

  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();

    try {
      const d = await api("/login/", {
        method: "POST",
        body: JSON.stringify({
          username,
          password
        })
      });

      setUser(d.user);
      nav("/");
    } catch (e) {
      setMsg(e.message);
    }
  }

  return (
    <Form title="Login">
      <form onSubmit={submit}>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />

        <button>Login</button>

        {msg && <p className="error">{msg}</p>}
      </form>
    </Form>
  );
}

function Register() {
  const [f, setF] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: ""
  });

  const [msg, setMsg] = useState("");
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();

    try {
      await api("/register/", {
        method: "POST",
        body: JSON.stringify(f)
      });

      nav("/login");
    } catch (e) {
      setMsg(e.message);
    }
  }

  return (
    <Form title="Sign-up">
      <form onSubmit={submit}>
        {[
          "username",
          "first_name",
          "last_name",
          "email",
          "password"
        ].map((x) => (
          <input
            key={x}
            type={x === "password" ? "password" : "text"}
            placeholder={x.replace("_", " ")}
            value={f[x]}
            onChange={(e) =>
              setF({
                ...f,
                [x]: e.target.value
              })
            }
            required
          />
        ))}

        <button>Register</button>

        {msg && <p className="error">{msg}</p>}
      </form>
    </Form>
  );
}

function Form({ title, children }) {
  return (
    <main className="formwrap">
      <div className="formbox">
        <h1>{title}</h1>
        {children}
      </div>
    </main>
  );
}

function DealerDetails({ user }) {
  const { id } = useParams();

  const [d, setD] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    Promise.all([
      api(`/dealers/${id}/`),
      api(`/dealers/${id}/reviews/`)
    ]).then(([a, b]) => {
      setD(a);
      setReviews(b);
    });
  }, [id]);

  if (!d) {
    return (
      <main className="container">
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main className="container">
      <div className="detail">
        <img src={d.image_url} alt={d.name} />

        <div>
          <h1>{d.name}</h1>

          <p>
            {d.address}, {d.city}, {d.state} {d.zip_code}
          </p>

          <p>{d.phone}</p>

          {user && (
            <Link
              className="primary"
              to={`/dealer/${id}/review`}
            >
              Review Dealer
            </Link>
          )}
        </div>
      </div>

      <section>
        <h2>Reviews</h2>

        {reviews.map((r) => (
          <div className="review" key={r.id}>
            <b>{r.username}</b> — {r.rating}/5

            <p>{r.text}</p>
          </div>
        ))}

        {!reviews.length && <p>No reviews yet.</p>}
      </section>
    </main>
  );
}

function ReviewPage({ user }) {
  const { id } = useParams();
  const nav = useNavigate();

  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const [msg, setMsg] = useState("");

  if (!user) {
    return (
      <Form title="Login Required">
        <p>Please login before posting a review.</p>
        <Link to="/login">Login</Link>
      </Form>
    );
  }

  async function submit(e) {
    e.preventDefault();

    try {
      await api(`/dealers/${id}/reviews/add/`, {
        method: "POST",
        body: JSON.stringify({
          text,
          rating
        })
      });

      nav(`/dealer/${id}`);
    } catch (e) {
      setMsg(e.message);
    }
  }

  return (
    <Form title="Post Review">
      <form onSubmit={submit}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write your review..."
          required
        />

        <select
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        >
          {[5, 4, 3, 2, 1].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>

        <button>Submit Review</button>

        {msg && <p className="error">{msg}</p>}
      </form>
    </Form>
  );
}


/* =========================
   ABOUT US
   ========================= */

function About() {
  return (
    <main className="static container">

      <h1>About Us</h1>

      <section className="about-intro">
        <div className="about-intro-text">

          <p>
            Cars Dealership is a customer-focused platform that
            helps people discover trusted car dealerships across
            the United States.
          </p>

          <p>
            Our platform provides dealership information, locations,
            contact details, customer reviews, and vehicle information
            to make it easier for customers to find dealerships that
            meet their needs.
          </p>

          <p>
            We aim to make the dealership discovery process simple,
            transparent, and convenient by bringing important
            dealership information together in one easy-to-use platform.
          </p>

        </div>

        <img
          src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=900&q=80"
          alt="Automotive professional"
        />

      </section>


      <section className="mission">

        <h2>Our Mission</h2>

        <p>
          Our mission is to connect customers with reliable
          dealerships and provide clear, useful information that
          helps them make confident decisions when searching for
          vehicles and automotive services.
        </p>

        <p>
          We focus on accessibility, reliable dealership information,
          customer feedback, and a straightforward online experience.
        </p>

      </section>


      <section className="team-section">

        <h2>Our Team</h2>

        <p>
          Our team combines technical expertise, product design,
          and dealership operations experience to create a better
          customer experience.
        </p>

        <div className="team">

          <article>

            <img
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80"
              alt="Alex Morgan"
            />

            <h2>Alex Morgan</h2>

            <h3>Lead Full-Stack Developer</h3>

            <p>
              Alex develops and maintains the platform, focusing
              on reliable web applications, APIs, database
              integration, and a smooth customer experience.
            </p>

            <p>
              <strong>Email:</strong> alex@example.com
            </p>

          </article>


          <article>

            <img
              src="https://images.unsplash.com/photo-1573496799515-eebbb63814f2?auto=format&fit=crop&w=600&q=80"
              alt="Sarah Johnson"
            />

            <h2>Sarah Johnson</h2>

            <h3>Product &amp; UX Lead</h3>

            <p>
              Sarah designs accessible and intuitive customer
              journeys, helping ensure that dealership discovery
              and review experiences are simple and easy to use.
            </p>

            <p>
              <strong>Email:</strong> sarah@example.com
            </p>

          </article>


          <article>

            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80"
              alt="Michael Carter"
            />

            <h2>Michael Carter</h2>

            <h3>Dealership Operations Manager</h3>

            <p>
              Michael works with dealership information and
              operations to help maintain accurate listings and
              provide customers with useful dealership details.
            </p>

            <p>
              <strong>Email:</strong> michael@example.com
            </p>

          </article>

        </div>

      </section>


      <section className="why-us">

        <h2>Why Choose Cars Dealership?</h2>

        <ul>
          <li>
            Discover trusted dealerships across the United States.
          </li>

          <li>
            View dealership locations and contact information.
          </li>

          <li>
            Read customer reviews before making decisions.
          </li>

          <li>
            Explore vehicle make and model information.
          </li>

          <li>
            Use a simple and responsive online experience.
          </li>
        </ul>

      </section>

    </main>
  );
}


/* =========================
   CONTACT US
   ========================= */

function Contact() {
  return (
    <main className="static container">

      <h1>Contact Us</h1>

      <p>
        We are here to help with dealership, review and account
        questions.
      </p>

      <div className="contact">

        <img
          src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=80"
          alt="Customer support team"
        />

        <div>

          <h3>Customer Support</h3>

          <p>
            Email: support@example.com
          </p>

          <p>
            Phone: +1 (800) 555-0144
          </p>

          <p>
            Address: 100 Market Street, Kansas City, KS 66101
          </p>

          <p>
            Hours: Monday–Friday, 9:00 AM–6:00 PM
          </p>

        </div>

      </div>

    </main>
  );
}


createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Layout />
  </BrowserRouter>
);