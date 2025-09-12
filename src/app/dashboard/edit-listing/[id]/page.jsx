"use client"

import React, { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import "../../../../styles/editListing.css"

export default function EditListingPage() {
  const router = useRouter()
  const params = useParams()
  const listingId = params.id // comes from [id]

  const [listing, setListing] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    address: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    listingType: "sale",
  })
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    // ✅ Load listings from localStorage
    const userListings = JSON.parse(localStorage.getItem("userListings") || "[]")
    const foundListing = userListings.find((ad) => ad.id === listingId)

    if (!foundListing) {
      router.push("/dashboard") // if not found, go back
      return
    }

    setListing(foundListing)
    setFormData({
      title: foundListing.title || "",
      description: foundListing.description || "",
      price: foundListing.price?.toString() || "",
      address: foundListing.location || "",
      bedrooms: foundListing.bedrooms?.toString() || "",
      bathrooms: foundListing.bathrooms?.toString() || "",
      area: foundListing.area?.toString() || "",
      listingType: foundListing.listingType || "sale",
    })
  }, [listingId])

  function handleInputChange(field, value) {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError("")
  }

  function handleSave() {
    if (!listing) return
    setSaving(true)

    try {
      if (!formData.title.trim()) throw new Error("Title required")
      if (!formData.price || parseFloat(formData.price) <= 0)
        throw new Error("Valid price required")

      const userListings = JSON.parse(localStorage.getItem("userListings") || "[]")

      const updated = {
        ...listing,
        title: formData.title,
        description: formData.description,
        price: formData.price,
        location: formData.address,
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        area: parseInt(formData.area),
        listingType: formData.listingType,
      }

      const updatedListings = userListings.map((ad) =>
        ad.id === listing.id ? updated : ad
      )

      localStorage.setItem("userListings", JSON.stringify(updatedListings))
      router.push("/dashboard")
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  if (!listing) return <p>Loading...</p>

  return (
    <div className="container">
      <h1 className="heading">Edit Listing</h1>
      {error && <p className="error">{error}</p>}

      <div className="card">
        <label className="label">Title</label>
        <input
          value={formData.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
          className="input"
        />

        <label className="label">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          className="textarea"
        ></textarea>

        <label className="label">Price</label>
        <input
          type="number"
          value={formData.price}
          onChange={(e) => handleInputChange("price", e.target.value)}
          className="input"
        />

        <label className="label">Address</label>
        <input
          value={formData.address}
          onChange={(e) => handleInputChange("address", e.target.value)}
          className="input"
        />

        <label className="label">Bedrooms</label>
        <input
          type="number"
          value={formData.bedrooms}
          onChange={(e) => handleInputChange("bedrooms", e.target.value)}
          className="input"
        />

        <label className="label">Bathrooms</label>
        <input
          type="number"
          value={formData.bathrooms}
          onChange={(e) => handleInputChange("bathrooms", e.target.value)}
          className="input"
        />

        <label className="label">Area (sqft)</label>
        <input
          type="number"
          value={formData.area}
          onChange={(e) => handleInputChange("area", e.target.value)}
          className="input"
        />

        <button onClick={handleSave} disabled={saving} className="button">
          {saving ? "Saving..." : "Save"}
        </button>
      </div>

      <Link href="/dashboard" className="link">
        Back to Dashboard
      </Link>
    </div>
  )
}
