"use client"

import { useState, useEffect } from "react"
import "../../../styles/profile.css"

export default function ProfilePage() {
  const [user, setUser] = useState(null)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })
  const [errors, setErrors] = useState({})

  // Dummy user loader
  useEffect(() => {
    const dummyUser = {
      id: 1,
      firstName: "Titan",
      lastName: "Plays",
      email: "titan@example.com",
      phone: "+234 800 123 4567",
      location: "Lagos, Nigeria",
      bio: "Just a gamer and builder, living life.",
    }
    setUser(dummyUser)
    setFormData(dummyUser)
  }, [])

  const validateForm = () => {
    const newErrors = {}
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }
    if (formData.bio && formData.bio.length > 500) newErrors.bio = "Bio must be less than 500 characters"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }))
    if (message.text) setMessage({ type: "", text: "" })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    setTimeout(() => {
      setUser(formData)
      setMessage({ type: "success", text: "Profile updated successfully!" })
      setLoading(false)
      setTimeout(() => setMessage({ type: "", text: "" }), 3000)
    }, 1000)
  }

  if (!user) return <div className="loading">Loading...</div>

  return (
    <div className="page">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <video src="/logoTest.mp4" muted autoPlay loop></video>
        </div>
        <a href="/dashboard" className="back-btn">Back to Dashboard</a>
      </header>

      <div className="container">
        <h1>Edit Profile</h1>
        <p>Update your personal information and preferences.</p>

        <div className="card">
          <h2>Profile Overview</h2>
          <div className="profile-overview">
            <div className="avatar">{formData.firstName[0]}</div>
            <div>
              <h3>{formData.firstName} {formData.lastName}</h3>
              <p>{formData.email}</p>
              {formData.location && <small>{formData.location}</small>}
            </div>
          </div>
        </div>

        <div className="card">
          <h2>Personal Information</h2>

          {message.text && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="flex">
              <div className="field">
                <label>First Name *</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  className={errors.firstName ? "error" : ""}
                  placeholder="Enter your first name"
                />
                {errors.firstName && <span className="error-text">{errors.firstName}</span>}
              </div>
              <div className="field">
                <label>Last Name *</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  className={errors.lastName ? "error" : ""}
                  placeholder="Enter your last name"
                />
                {errors.lastName && <span className="error-text">{errors.lastName}</span>}
              </div>
            </div>

            <div className="field">
              <label>Email Address *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={errors.email ? "error" : ""}
                placeholder="Enter your email"
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="field">
              <label>Phone Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="+234 (0) 123-456-7890"
              />
            </div>

            <div className="field">
              <label>Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="Lagos, Nigeria"
              />
            </div>

            <div className="field">
              <label>Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                className={errors.bio ? "error" : ""}
                placeholder="Tell us about yourself..."
                rows={4}
                maxLength={500}
              />
              <div className="bio-footer">
                {errors.bio && <span className="error-text">{errors.bio}</span>}
                <small>{formData.bio.length}/500 characters</small>
              </div>
            </div>

            <div className="actions">
              <a href="/dashboard" className="btn outline">Cancel</a>
              <button type="submit" disabled={loading} className="btn primary">
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
