import React, { useState } from "react";

export default function Register() {
  const [form, setForm] = useState({
    username: "", first_name: "", last_name: "", email: "", password: ""
  });

  const update = (e) => setForm({...form, [e.target.name]: e.target.value});

  return (
    <div className="register-page">
      <h1>Sign-up</h1>
      <form>
        <input name="username" placeholder="Username" value={form.username} onChange={update} />
        <input name="first_name" placeholder="First Name" value={form.first_name} onChange={update} />
        <input name="last_name" placeholder="Last Name" value={form.last_name} onChange={update} />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={update} />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={update} />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
