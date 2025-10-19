"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Home, ArrowLeft, Upload, X, MapPin, Bed, Bath, Square, Star, CheckCircle } from "lucide-react"
import Link from "next/link"
import "../../../styles/createListing.css"

// Dummy components for local development
const DummyButton = ({ children, variant, size, className, ...props }) => (
  <button className={`dummy-button ${variant || ""} ${size || ""} ${className || ""}`} {...props}>
    {children}
  </button>
)

const DummyCard = ({ children, className, ...props }) => (
  <div className={`dummy-card ${className || ""}`} {...props}>
    {children}
  </div>
)

const DummyCardHeader = ({ children, className, ...props }) => (
  <div className={`dummy-card-header ${className || ""}`} {...props}>
    {children}
  </div>
)

const DummyCardTitle = ({ children, className, ...props }) => (
  <h2 className={`dummy-card-title ${className || ""}`} {...props}>
    {children}
  </h2>
)

const DummyCardContent = ({ children, className, ...props }) => (
  <div className={`dummy-card-content ${className || ""}`} {...props}>
    {children}
  </div>
)

const DummyCardDescription = ({ children, className, ...props }) => (
  <p className={`dummy-card-description ${className || ""}`} {...props}>
    {children}
  </p>
)

const DummyInput = ({ className, ...props }) => (
  <input className={`dummy-input ${className || ""}`} {...props} />
)

const DummyLabel = ({ className, ...props }) => (
  <label className={`dummy-label ${className || ""}`} {...props} />
)

const DummyTextarea = ({ className, ...props }) => (
  <textarea className={`dummy-textarea ${className || ""}`} {...props} />
)

const DummySelect = ({ children, value, onValueChange, className, ...props }) => (
  <select
    value={value}
    onChange={(e) => onValueChange(e.target.value)}
    className={`dummy-select ${className || ""}`}
    {...props}
  >
    {children}
  </select>
)

const DummySelectTrigger = ({ children, className, ...props }) => (
  <div className={`dummy-select-trigger ${className || ""}`} {...props}>
    {children}
  </div>
)

const DummySelectContent = ({ children, className, ...props }) => (
  <div className={`dummy-select-content ${className || ""}`} {...props}>
    {children}
  </div>
)

const DummySelectItem = ({ children, value, className, ...props }) => (
  <option value={value} className={`dummy-select-item ${className || ""}`} {...props}>
    {children}
  </option>
)

const DummySelectValue = ({ children, className, ...props }) => (
  <span className={`dummy-select-value ${className || ""}`} {...props}>
    {children}
  </span>
)

const DummyCheckbox = ({ className, ...props }) => (
  <input type="checkbox" className={`dummy-checkbox ${className || ""}`} {...props} />
)

// Dummy authService for local development
const dummyAuthService = {
  getCurrentUser: () => {
    return {
      id: "user123",
      wallet: { balance: 50000.0 }, // ₦50,000 test balance
    }
  },
  saveAd: (ad) => {
    console.log("Saving ad:", ad)
  },
  deductFunds: (userId, amount, description) => {
    console.log(`Deducting ₦${amount} from ${userId} for ${description}`)
  },
}

export default function CreateListingPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    address: "",
    beds: "",
    baths: "",
    sqft: "",
    type: "house",
    listingType: "sale",
    featured: false,
    duration: "30",
    images: [],
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    const currentUser = dummyAuthService.getCurrentUser()
    if (!currentUser) {
      router.push("/auth")
      return
    }

    setUser(currentUser)
    setIsLoading(false)
  }, [router])

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }))
    }
  }

  const handleImageUpload = (e) => {
    const files = e.target.files
    if (files) {
      const newImages = Array.from(files).map(
        (file, index) =>
          `/placeholder.svg?height=300&width=400&text=Property+Image+${formData.images.length + index + 1}`,
      )
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newImages].slice(0, 10),
      }))
    }
  }

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.title.trim()) newErrors.title = "Title is required"
    if (!formData.description.trim()) newErrors.description = "Description is required"
    if (!formData.price || Number.parseFloat(formData.price) <= 0) newErrors.price = "Valid price is required"
    if (!formData.address.trim()) newErrors.address = "Address is required"
    if (!formData.beds || Number.parseInt(formData.beds) < 0) newErrors.beds = "Valid number of bedrooms is required"
    if (!formData.baths || Number.parseFloat(formData.baths) < 0) newErrors.baths = "Valid number of bathrooms is required"
    if (!formData.sqft || Number.parseInt(formData.sqft) <= 0) newErrors.sqft = "Valid square footage is required"
    if (formData.images.length === 0) newErrors.images = "At least one image is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const calculateCost = () => {
    const baseCost = 5000 // ₦5,000 base per 30 days
    const durationMultiplier = Number.parseInt(formData.duration) / 30
    const featuredCost = formData.featured ? 2500 : 0 // ₦2,500 for featured

    let listingTypeMultiplier = 1
    if (formData.listingType === "rent") {
      listingTypeMultiplier = 0.8
    } else if (formData.listingType === "lease") {
      listingTypeMultiplier = 0.9
    }

    return baseCost * durationMultiplier * listingTypeMultiplier + featuredCost
  }

  const handleSubmit = async () => {
    if (!user || !validateForm()) return
    const cost = calculateCost()

    if (user.wallet.balance < cost) {
      console.log(`Insufficient funds. You need ₦${cost.toFixed(2)} but only have ₦${user.wallet.balance.toFixed(2)}`)
      return
    }

    setIsSubmitting(true)

    try {
      const newListing = {
        id: Date.now().toString(),
        userId: user.id,
        title: formData.title,
        description: formData.description,
        price: Number.parseFloat(formData.price),
        address: formData.address,
        beds: Number.parseInt(formData.beds),
        baths: Number.parseFloat(formData.baths),
        sqft: Number.parseInt(formData.sqft),
        type: formData.type,
        listingType: formData.listingType,
        status: "active",
        images: formData.images,
        featured: formData.featured,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + Number.parseInt(formData.duration) * 24 * 60 * 60 * 1000).toISOString(),
        views: 0,
        inquiries: 0,
        cost,
      }

      dummyAuthService.saveAd(newListing)
      dummyAuthService.deductFunds(user.id, cost, `Listing fee for "${formData.title}"`)
      router.push("/dashboard")
    } catch (error) {
      console.error("Error creating listing:", error)
      console.error("Error creating listing. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="loading-container">
        <Home className="loading-icon" />
        <p>Loading...</p>
      </div>
    )
  }

  if (!user) return null

  const cost = calculateCost()
  const canAfford = user.wallet.balance >= cost

  const getPriceLabel = () => {
    switch (formData.listingType) {
      case "rent":
        return "Monthly Rent"
      case "lease":
        return "Monthly Lease"
      default:
        return "Sale Price"
    }
  }

  const getListingTypeDescription = () => {
    switch (formData.listingType) {
      case "rent":
        return "Monthly rental property (20% discount on listing fees)"
      case "lease":
        return "Long-term lease property (10% discount on listing fees)"
      default:
        return "Property for sale"
    }
  }

  return (
    <div className="create-listing-page-container">
      {/* Header */}
      <header className="create-listing-header">
        <div className="create-listing-header-left">
          <div className="hll">
            <Link href="/dashboard">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" /></svg>
            </Link>
          </div>
          <Link href="/" className="create-listing-brand">
            <video src="/logoTest.mp4" autoPlay loop muted></video>
          </Link>
        </div>
      </header>

      <div className="main-content-area">
        <div className="form-layout">
          {/* Main Form */}
          <div className="form-sections">
            {/* Basic Information */}
            <DummyCard>
              <DummyCardHeader>
                <DummyCardTitle className="card-title-icon-wrapper">
                  <Home className="card-title-icon" />
                  Basic Information
                </DummyCardTitle>
              </DummyCardHeader>
              <DummyCardContent className="card-content-spacing">
                <div>
                  <DummyLabel htmlFor="title">Property Title</DummyLabel>
                  <DummyInput
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Beautiful 3BR home in downtown..."
                    className={errors.title ? "input-error dummy-imput" : "dummy-input"}
                  />
                  {errors.title && <p className="error-message">{errors.title}</p>}
                </div>

                <div>
                  <DummyLabel htmlFor="description">Description</DummyLabel>
                  <DummyTextarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Describe your property..."
                    rows={4}
                    className={errors.description ? "input-error" : ""}
                  />
                  {errors.description && <p className="error-message">{errors.description}</p>}
                </div>

                <div className="grid-2-col-md">
                  <div>
                    <DummyLabel htmlFor="type">Property Type</DummyLabel>
                    <DummySelect value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                      <DummySelectTrigger>
                        <DummySelectValue />
                      </DummySelectTrigger>
                      <DummySelectContent>
                        <DummySelectItem value="house">House</DummySelectItem>
                        <DummySelectItem value="land">Land</DummySelectItem>
                        <DummySelectItem value="eventp">Event Place/Halls</DummySelectItem>
                        <DummySelectItem value="eventp">Gardens</DummySelectItem>
                        <DummySelectItem value="condo">Condo</DummySelectItem>
                        <DummySelectItem value="townhouse">Townhouse</DummySelectItem>
                      </DummySelectContent>
                    </DummySelect>
                  </div>

                  <div>
                    <DummyLabel htmlFor="listingType">Listing Type</DummyLabel>
                    <DummySelect
                      value={formData.listingType}
                      onValueChange={(value) => handleInputChange("listingType", value)}
                    >
                      <DummySelectTrigger>
                        <DummySelectValue />
                      </DummySelectTrigger>
                      <DummySelectContent>
                        <DummySelectItem value="sale">For Sale</DummySelectItem>
                        <DummySelectItem value="rent">For Rent</DummySelectItem>
                        <DummySelectItem value="lease">For Lease</DummySelectItem>
                      </DummySelectContent>
                    </DummySelect>
                    <p className="description-text">{getListingTypeDescription()}</p>
                  </div>
                </div>
              </DummyCardContent>
            </DummyCard>

            {/* Location & Price */}
            <DummyCard>
              <DummyCardHeader>
                <DummyCardTitle className="card-title-icon-wrapper">
                  <MapPin className="card-title-icon" />
                  Location & Pricing
                </DummyCardTitle>
              </DummyCardHeader>
              <DummyCardContent className="card-content-spacing">
                <div>
                  <DummyLabel htmlFor="address">Address</DummyLabel>
                  <DummyInput
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="123 Main St, City, State 12345"
                    className={errors.address ? "input-error" : ""}
                  />
                  {errors.address && <p className="error-message">{errors.address}</p>}
                </div>

                <div>
                  <DummyLabel htmlFor="price">{getPriceLabel()}</DummyLabel>
                  <div className="input-with-icon">
                    <span className="input-icon">₦</span>
                    <DummyInput
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleInputChange("price", e.target.value)}
                      placeholder={formData.listingType === "sale" ? "42500000" : "250000"}
                      className={`input-padded-left ${errors.price ? "input-error" : ""}`}
                    />
                  </div>
                  {errors.price && <p className="error-message">{errors.price}</p>}
                </div>
              </DummyCardContent>
            </DummyCard>

            {/* Property Details */}
            <DummyCard>
              <DummyCardHeader>
                <DummyCardTitle className="card-title-icon-wrapper">
                  <Square className="card-title-icon" />
                  Property Details
                </DummyCardTitle>
              </DummyCardHeader>
              <DummyCardContent>
                <div className="grid-3-col">
                  <div>
                    <DummyLabel htmlFor="beds">Bedrooms</DummyLabel>
                    <div className="input-with-icon">
                      <Bed className="input-icon" />
                      <DummyInput
                        id="beds"
                        type="number"
                        value={formData.beds}
                        onChange={(e) => handleInputChange("beds", e.target.value)}
                        className={`input-padded-left ${errors.beds ? "input-error" : ""}`}
                      />
                    </div>
                    {errors.beds && <p className="error-message-small">{errors.beds}</p>}
                  </div>

                  <div>
                    <DummyLabel htmlFor="baths">Bathrooms</DummyLabel>
                    <div className="input-with-icon">
                      <Bath className="input-icon" />
                      <DummyInput
                        id="baths"
                        type="number"
                        step="0.5"
                        value={formData.baths}
                        onChange={(e) => handleInputChange("baths", e.target.value)}
                        className={`input-padded-left ${errors.baths ? "input-error" : ""}`}
                      />
                    </div>
                    {errors.baths && <p className="error-message-small">{errors.baths}</p>}
                  </div>

                  <div>
                    <DummyLabel htmlFor="sqft">Square Feet</DummyLabel>
                    <div className="input-with-icon">
                      <Square className="input-icon" />
                      <DummyInput
                        id="sqft"
                        type="number"
                        value={formData.sqft}
                        onChange={(e) => handleInputChange("sqft", e.target.value)}
                        className={`input-padded-left ${errors.sqft ? "input-error" : ""}`}
                      />
                    </div>
                    {errors.sqft && <p className="error-message-small">{errors.sqft}</p>}
                  </div>
                </div>
              </DummyCardContent>
            </DummyCard>

            {/* Images */}
            <DummyCard>
              <DummyCardHeader>
                <DummyCardTitle className="card-title-icon-wrapper">
                  <Upload className="card-title-icon" />
                  Property Images
                </DummyCardTitle>
                <DummyCardDescription>Upload up to 10 high-quality images of your property</DummyCardDescription>
              </DummyCardHeader>
              <DummyCardContent>
                <div className="image-upload-section">
                  <div className="image-grid">
                    {formData.images.map((image, index) => (
                      <div key={index} className="image-preview-container">
                        <img src={image || "/placeholder.svg"} alt={`Property ${index + 1}`} className="image-preview" />
                        <button onClick={() => removeImage(index)} className="remove-image-btn">
                          <X className="remove-image-icon" />
                        </button>
                      </div>
                    ))}
                    {formData.images.length < 10 && (
                      <label className="upload-image-box">
                        <Upload className="upload-icon" />
                        <span>Add Images</span>
                        <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                      </label>
                    )}
                  </div>
                  {errors.images && <p className="error-message">{errors.images}</p>}
                </div>
              </DummyCardContent>
            </DummyCard>
          </div>

          {/* Sidebar */}
          <div className="sidebar">
            {/* Listing Options */}
            <DummyCard>
              <DummyCardHeader>
                <DummyCardTitle className="card-title-icon-wrapper">
                  <Star className="card-title-icon" />
                  Listing Options
                </DummyCardTitle>
              </DummyCardHeader>
              <DummyCardContent>
                <div className="checkbox-row">
                  <DummyCheckbox
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => handleInputChange("featured", e.target.checked)}
                  />
                  <DummyLabel htmlFor="featured">Feature this listing (+₦2,500)</DummyLabel>
                </div>

                <div>
                  <DummyLabel htmlFor="duration">Duration</DummyLabel>
                  <DummySelect
                    value={formData.duration}
                    onValueChange={(value) => handleInputChange("duration", value)}
                  >
                    <DummySelectTrigger>
                      <DummySelectValue />
                    </DummySelectTrigger>
                    <DummySelectContent>
                      <DummySelectItem value="30">30 days (₦5,000)</DummySelectItem>
                      <DummySelectItem value="60">60 days (₦10,000)</DummySelectItem>
                      <DummySelectItem value="90">90 days (₦15,000)</DummySelectItem>
                    </DummySelectContent>
                  </DummySelect>
                </div>
              </DummyCardContent>
            </DummyCard>

            {/* Cost Summary */}
            <DummyCard>
              <DummyCardHeader>
                <DummyCardTitle className="card-title-icon-wrapper">
                  <CheckCircle className="card-title-icon" />
                  Cost Summary
                </DummyCardTitle>
              </DummyCardHeader>
              <DummyCardContent>
                <p>Listing Fee: ₦{cost.toFixed(2)}</p>
                <p>Your Balance: ₦{user.wallet.balance.toFixed(2)}</p>
                {!canAfford && <p className="error-message">Insufficient funds in your wallet</p>}
                <DummyButton
                  onClick={handleSubmit}
                  disabled={isSubmitting || !canAfford}
                  className="submit-button"
                >
                  {isSubmitting ? "Processing..." : `Pay ₦${cost.toFixed(2)} & Publish`}
                </DummyButton>
              </DummyCardContent>
            </DummyCard>
          </div>
        </div>
      </div>
    </div>
  )
}
