import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import "./styles.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

async function api(path, options={}) {
  const res = await fetch(API + path, {credentials:"include", headers:{"Content-Type":"application/json", ...(options.headers||{})}, ...options});
  const data = await res.json().catch(()=>({}));
  if (!res.ok) throw new Error(data.error || JSON.stringify(data));
  return data;
}

function Nav({user,setUser}) {
  const nav=useNavigate();
  async function logout(){ await api("/logout/",{method:"POST"}); setUser(null); nav("/"); }
  return <nav>
    <Link to="/" className="brand">Cars Dealership</Link>
    <div className="navlinks">
      <Link to="/">Dealers</Link><Link to="/about">About Us</Link><Link to="/contact">Contact Us</Link>
      {user ? <><span className="user">Welcome, {user.username}</span><button onClick={logout}>Logout</button></> :
        <><Link to="/login">Login</Link><Link to="/register">Sign Up</Link></>}
    </div>
  </nav>
}

function Layout(){
 const [user,setUser]=useState(null);
 return <><Nav user={user} setUser={setUser}/><Routes>
   <Route path="/" element={<Home user={user}/>}/>
   <Route path="/login" element={<Login setUser={setUser}/>}/>
   <Route path="/register" element={<Register/>}/>
   <Route path="/about" element={<About/>}/><Route path="/contact" element={<Contact/>}/>
   <Route path="/dealer/:id" element={<DealerDetails user={user}/>}/>
   <Route path="/dealer/:id/review" element={<ReviewPage user={user}/>}/>
 </Routes></>
}

function Home({user}){
 const [dealers,setDealers]=useState([]); const [state,setState]=useState(""); const [searchParams,setSearchParams]=useSearchParams();
 useEffect(()=>{ const s=searchParams.get("state"); api(s?`/dealers/state/${encodeURIComponent(s)}/`:"/dealers/").then(setDealers);},[searchParams]);
 return <main className="container">
  <section className="hero"><h1>Find Your Dealership</h1><p>Explore trusted car dealerships across the United States.</p></section>
  <div className="filter"><input value={state} onChange={e=>setState(e.target.value)} placeholder="Filter by state (e.g. Kansas)"/><button onClick={()=>setSearchParams(state?{state}:{})}>Search</button><button onClick={()=>{setState("");setSearchParams({})}}>All Dealers</button></div>
  <div className="grid">{dealers.map(d=><article className="card" key={d.id}>
   <img src={d.image_url} /><div className="cardbody"><h2>{d.name}</h2><p>{d.city}, {d.state} {d.zip_code}</p><p>{d.phone}</p><p>{d.reviews_count} review(s)</p><Link className="primary" to={`/dealer/${d.id}`}>View Dealer</Link>{user&&<Link className="secondary" to={`/dealer/${d.id}/review`}>Review Dealer</Link>}</div>
  </article>)}</div>
 </main>
}

function Login({setUser}){const [username,setUsername]=useState("demo"),[password,setPassword]=useState("Demo@123"),[msg,setMsg]=useState("");const nav=useNavigate();
 async function submit(e){e.preventDefault();try{const d=await api("/login/",{method:"POST",body:JSON.stringify({username,password})});setUser(d.user);nav("/");}catch(e){setMsg(e.message)}}
 return <Form title="Login"><form onSubmit={submit}><input value={username} onChange={e=>setUsername(e.target.value)} placeholder="Username"/><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password"/><button>Login</button>{msg&&<p className="error">{msg}</p>}</form></Form>}

function Register(){const [f,setF]=useState({username:"",first_name:"",last_name:"",email:"",password:""}),[msg,setMsg]=useState("");const nav=useNavigate();
 async function submit(e){e.preventDefault();try{await api("/register/",{method:"POST",body:JSON.stringify(f)});nav("/login")}catch(e){setMsg(e.message)}}
 return <Form title="Sign-up"><form onSubmit={submit}>{["username","first_name","last_name","email","password"].map(x=><input key={x} type={x==="password"?"password":"text"} placeholder={x.replace("_"," ")} value={f[x]} onChange={e=>setF({...f,[x]:e.target.value})} required/>)}<button>Register</button>{msg&&<p className="error">{msg}</p>}</form></Form>}

function Form({title,children}){return <main className="formwrap"><div className="formbox"><h1>{title}</h1>{children}</div></main>}

function DealerDetails({user}){const {id}=useParams();const [d,setD]=useState(null),[reviews,setReviews]=useState([]);useEffect(()=>{Promise.all([api(`/dealers/${id}/`),api(`/dealers/${id}/reviews/`)]).then(([a,b])=>{setD(a);setReviews(b)})},[id]);if(!d)return <main className="container"><p>Loading...</p></main>;
 return <main className="container"><div className="detail"><img src={d.image_url}/><div><h1>{d.name}</h1><p>{d.address}, {d.city}, {d.state} {d.zip_code}</p><p>{d.phone}</p>{user&&<Link className="primary" to={`/dealer/${id}/review`}>Review Dealer</Link>}</div></div><section><h2>Reviews</h2>{reviews.map(r=><div className="review" key={r.id}><b>{r.username}</b> — {r.rating}/5<p>{r.text}</p></div>)}{!reviews.length&&<p>No reviews yet.</p>}</section></main>
}

function ReviewPage({user}){const {id}=useParams();const nav=useNavigate();const [text,setText]=useState(""),[rating,setRating]=useState(5),[msg,setMsg]=useState("");if(!user)return <Form title="Login Required"><p>Please login before posting a review.</p><Link to="/login">Login</Link></Form>;
 async function submit(e){e.preventDefault();try{await api(`/dealers/${id}/reviews/add/`,{method:"POST",body:JSON.stringify({text,rating})});nav(`/dealer/${id}`)}catch(e){setMsg(e.message)}}
 return <Form title="Post Review"><form onSubmit={submit}><textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Write your review..." required/><select value={rating} onChange={e=>setRating(e.target.value)}>{[5,4,3,2,1].map(x=><option key={x}>{x}</option>)}</select><button>Submit Review</button>{msg&&<p className="error">{msg}</p>}</form></Form>
}

function About(){return <main className="static container"><h1>About Us</h1><p>Cars Dealership connects customers with trusted dealership branches across the United States.</p><div className="team"><div><img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=500&q=80"/><h3>Alex Morgan</h3><p>Lead Full-Stack Developer</p><p>alex@example.com</p></div><div><img src="https://images.unsplash.com/photo-1573496799515-eebbb63814f2?auto=format&fit=crop&w=500&q=80"/><h3>Sarah Johnson</h3><p>Product & UX Lead</p><p>sarah@example.com</p></div></div></main>}
function Contact(){return <main className="static container"><h1>Contact Us</h1><p>We are here to help with dealership, review and account questions.</p><div className="contact"><img src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=80"/><div><h3>Customer Support</h3><p>Email: support@example.com</p><p>Phone: +1 (800) 555-0144</p><p>Address: 100 Market Street, Kansas City, KS 66101</p><p>Hours: Monday–Friday, 9:00 AM–6:00 PM</p></div></div></main>}

createRoot(document.getElementById("root")).render(<BrowserRouter><Layout/></BrowserRouter>);
