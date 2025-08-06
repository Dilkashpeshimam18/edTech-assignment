"use client";
import { FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { graphqlFetch } from '../../utils/graphql';
import './Login.css'

export default function LoginPage() {
  const { login, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace("/"); 
    }
  }, [user, router]);

  const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  const form = e.target as any;
  const email = form.email.value.trim();

  if (!email) return;

  const query = `
    query Login($email: String!) {
      login(email: $email) {
        id
        name
        email
        role
      }
    }
  `;

  try {
    const data:any = await graphqlFetch(query, { email });
    const user = data.login;

    if (!user) {
      alert("User not found or invalid.");
      return;
    }

    login(user);
    router.push("/");
  } catch (err:any) {
    alert("Login failed: " + err.message);
  }
};

  return (
   <div className="login-container">
      <h2 className="login-title"> Login</h2>
      <div className="login-credentials">
        <p><strong>Use the following credentials to test:</strong></p>
        <ul>
          <li>👨‍🎓 <strong>Student</strong>: <br />Name: <code>Student1</code>, Email: <code>student@gmail.com</code></li>
          <li>👨‍🏫 <strong>Professor</strong>: <br />Name: <code>Professor1</code>, Email: <code>professor@gmail.com</code></li>
        </ul>
      </div>
      <form onSubmit={handleSubmit} className="login-form">
        <label>
          Name
          <input name="name" placeholder="Your name" required />
        </label>
        <label>
          Email
          <input name="email" placeholder="you@example.com" type="email" required />
        </label>
        <button type="submit" className="login-button">
          Login
        </button>
      </form>
    </div>
  );
}
