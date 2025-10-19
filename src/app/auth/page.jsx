"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const AuthService = {
    signIn: async (email, password) => {
        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { "Content-Type": "application.json" },
                body: JSON.stringify({ email: email, password: password })
            })
            const resData = await res.json()
            if (!res.ok) {
                return { success: false, message: resData.message || "Login failed" };
            }
            return resData;
        }
        catch (error) {
            console.error("Login Failed: ", error)
            return { success: false, message: "Network or server error" };
        }
    },
    signUp: async (data) => {
        try {
            const res = await fetch('/api/signup', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            const resData = await res.json();

            if (!res.ok) {
                return { success: false, message: resData.message || "Signup failed" };
            }

            return resData;

        } catch (error) {
            console.error("Signup error in AuthService:", error);
            return { success: false, message: "Network or server error" };
        }
    }

};

function LoginForm({ onSwitchToSignup }) {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
        if (error) setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!formData.email || !formData.password) {
            setError("Please fill in all fields");
            return;
        }

        setIsLoading(true);

        try {
            const result = await AuthService.signIn(
                formData.email.trim().toLowerCase(),
                formData.password
            );

            if (result.success) {
                router.push("/dashboard");
            } else {
                setError(result.message || "Failed to sign in");
            }
        } catch (error) {
            console.error("Login error:", error);
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            style={{
                maxWidth: "480px",
                margin: "auto",
                padding: "24px",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow:
                    "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
            }}
        >
            <header
                style={{ paddingBottom: "16px", borderBottom: "1px solid #e5e7eb" }}
            >
                <h2 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "4px" }}>
                    Welcome Back
                </h2>
                <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                    Sign in to your TheNigeriaProperties account
                </p>
            </header>
            <div style={{ padding: "16px 0" }}>
                <form
                    onSubmit={handleSubmit}
                    style={{ display: "flex", flexDirection: "column", gap: "16px" }}
                >
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <label
                            htmlFor="email"
                            style={{ fontSize: "0.875rem", fontWeight: "500" }}
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            required
                            disabled={isLoading}
                            style={{
                                padding: "8px",
                                border: "1px solid #d1d5db",
                                borderRadius: "4px",
                                outline: "none",
                            }}
                        />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <label
                            htmlFor="password"
                            style={{ fontSize: "0.875rem", fontWeight: "500" }}
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => handleInputChange("password", e.target.value)}
                            required
                            disabled={isLoading}
                            style={{
                                padding: "8px",
                                border: "1px solid #d1d5db",
                                borderRadius: "4px",
                                outline: "none",
                            }}
                        />
                    </div>
                    {error && (
                        <div
                            style={{
                                fontSize: "0.875rem",
                                color: "#dc2626",
                                backgroundColor: "#fef2f2",
                                padding: "12px",
                                borderRadius: "6px",
                                border: "1px solid #fca5a5",
                            }}
                        >
                            {error}
                        </div>
                    )}
                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                            width: "100%",
                            padding: "12px",
                            backgroundColor: isLoading ? "#9ca3af" : "#2563eb",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            cursor: isLoading ? "not-allowed" : "pointer",
                            fontWeight: "500",
                        }}
                    >
                        {isLoading ? "Signing In..." : "Sign In"}
                    </button>
                </form>
                <div
                    style={{
                        marginTop: "16px",
                        textAlign: "center",
                        fontSize: "0.875rem",
                        color: "#64748b",
                    }}
                >
                    <button
                        onClick={onSwitchToSignup}
                        style={{
                            marginTop: "8px",
                            backgroundColor: "transparent",
                            border: "none",
                            color: "#2563eb",
                            textDecoration: "underline",
                            cursor: "pointer",
                        }}
                    >
                        Don't have an account? Sign Up
                    </button>
                </div>
            </div>
        </div>
    );
}

function SignupForm({ onSwitchToLogin }) {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
        if (error) setError("");
    };

    const validateForm = () => {
        if (!formData.firstName.trim()) {
            setError("First name is required");
            return false;
        }
        if (!formData.lastName.trim()) {
            setError("Last name is required");
            return false;
        }
        if (!formData.email.trim()) {
            setError("Email is required");
            return false;
        }
        if (!formData.email.includes("@")) {
            setError("Please enter a valid email address");
            return false;
        }
        if (!formData.password) {
            setError("Password is required");
            return false;
        }
        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters long");
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const result = await AuthService.signUp({
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                email: formData.email.trim().toLowerCase(),
                phone: formData.phone.trim(),
                password: formData.password,
            });

            if (result.success) {
                router.push("/dashboard");
            } else {
                setError(result.message || "Failed to create account");
            }
        } catch (error) {
            console.error("Signup error:", error);
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            style={{
                maxWidth: "480px",
                margin: "auto",
                padding: "24px",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow:
                    "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
            }}
        >
            <header
                style={{ paddingBottom: "16px", borderBottom: "1px solid #e5e7eb" }}
            >
                <h2 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "4px" }}>
                    Create Account
                </h2>
                <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                    Join TheNigeriaProperties to start listing your properties
                </p>
            </header>
            <div style={{ padding: "16px 0" }}>
                <form
                    onSubmit={handleSubmit}
                    style={{ display: "flex", flexDirection: "column", gap: "16px" }}
                >
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "16px",
                        }}
                    >
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            <label
                                htmlFor="firstName"
                                style={{ fontSize: "0.875rem", fontWeight: "500" }}
                            >
                                First Name
                            </label>
                            <input
                                id="firstName"
                                type="text"
                                value={formData.firstName}
                                onChange={(e) => handleInputChange("firstName", e.target.value)}
                                required
                                disabled={isLoading}
                                style={{
                                    padding: "8px",
                                    border: "1px solid #d1d5db",
                                    borderRadius: "4px",
                                    outline: "none",
                                }}
                            />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            <label
                                htmlFor="lastName"
                                style={{ fontSize: "0.875rem", fontWeight: "500" }}
                            >
                                Last Name
                            </label>
                            <input
                                id="lastName"
                                type="text"
                                value={formData.lastName}
                                onChange={(e) => handleInputChange("lastName", e.target.value)}
                                required
                                disabled={isLoading}
                                style={{
                                    padding: "8px",
                                    border: "1px solid #d1d5db",
                                    borderRadius: "4px",
                                    outline: "none",
                                }}
                            />
                        </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <label
                            htmlFor="email"
                            style={{ fontSize: "0.875rem", fontWeight: "500" }}
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            required
                            disabled={isLoading}
                            style={{
                                padding: "8px",
                                border: "1px solid #d1d5db",
                                borderRadius: "4px",
                                outline: "none",
                            }}
                        />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <label
                            htmlFor="password"
                            style={{ fontSize: "0.875rem", fontWeight: "500" }}
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => handleInputChange("password", e.target.value)}
                            required
                            disabled={isLoading}
                            style={{
                                padding: "8px",
                                border: "1px solid #d1d5db",
                                borderRadius: "4px",
                                outline: "none",
                            }}
                        />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <label
                            htmlFor="confirmPassword"
                            style={{ fontSize: "0.875rem", fontWeight: "500" }}
                        >
                            Confirm Password
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                            required
                            disabled={isLoading}
                            style={{
                                padding: "8px",
                                border: "1px solid #d1d5db",
                                borderRadius: "4px",
                                outline: "none",
                            }}
                        />
                    </div>
                    {error && (
                        <div
                            style={{
                                fontSize: "0.875rem",
                                color: "#dc2626",
                                backgroundColor: "#fef2f2",
                                padding: "12px",
                                borderRadius: "6px",
                                border: "1px solid #fca5a5",
                            }}
                        >
                            {error}
                        </div>
                    )}
                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                            width: "100%",
                            padding: "12px",
                            backgroundColor: isLoading ? "#9ca3af" : "#2563eb",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            cursor: isLoading ? "not-allowed" : "pointer",
                            fontWeight: "500",
                        }}
                    >
                        {isLoading ? "Creating Account..." : "Create Account"}
                    </button>
                </form>
                <div
                    style={{
                        marginTop: "16px",
                        textAlign: "center",
                        fontSize: "0.875rem",
                        color: "#64748b",
                    }}
                >
                    <button
                        onClick={onSwitchToLogin}
                        style={{
                            marginTop: "8px",
                            backgroundColor: "transparent",
                            border: "none",
                            color: "#2563eb",
                            textDecoration: "underline",
                            cursor: "pointer",
                        }}
                    >
                        Already have an account? Sign In
                    </button>
                </div>
            </div>
        </div>
    );
}

// Main component to switch between forms
export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "#f9fafb" }}>
            {isLogin ? (
                <LoginForm onSwitchToSignup={() => setIsLogin(false)} />
            ) : (
                <SignupForm onSwitchToLogin={() => setIsLogin(true)} />
            )}
        </div>
    );
}