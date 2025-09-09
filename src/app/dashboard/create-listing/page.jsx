"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Home, ArrowLeft, Upload, X, MapPin, DollarSign, Bed, Bath, Square, Star, CheckCircle } from "lucide-react"
import Link from "next/link"
import "../../../styles/createListing.css"

// Dummy components for local development
const DummyButton = ({ children, variant, size, ...props }) => (
  <button className={`dummy-button ${variant} ${size}`} {...props}>
    {children}
  </button>
)
const DummyCard = ({ children }) => <div className="dummy-card">{children}</div>
const DummyCardHeader = ({ children }) => <div className="dummy-card-header">{children}</div>
const DummyCardTitle = ({ children, ...props }) => <h2 className="dummy-card-title" {...props}>{children}</h2>
const DummyCardContent = ({ children, ...props }) => <div className="dummy-card-content" {...props}>{children}</div>
const DummyCardDescription = ({ children }) => <p className="dummy-card-description">{children}</p>
const DummyInput = (props) => <input className="dummy-input" {...props} />
const DummyLabel = (props) => <label className="dummy-label" {...props} />
const DummyTextarea = (props) => <textarea className="dummy-textarea" {...props} />
const DummySelect = ({ children, value, onValueChange }) => (
  <select value={value} onChange={(e) => onValueChange(e.target.value)} className="dummy-select">
    {children}
  </select>
)
const DummySelectTrigger = ({ children }) => <div className="dummy-select-trigger">{children}</div>
const DummySelectContent = ({ children }) => <>{children}</>
const DummySelectItem = ({ children, value }) => <option value={value}>{children}</option>
const DummySelectValue = ({ children }) => <span className="dummy-select-value">{children}</span>
const DummyCheckbox = (props) => <input type="checkbox" className="dummy-checkbox" {...props} />

// Dummy authService for local development
const dummyAuthService = {
  getCurrentUser: () => {
    // Return a dummy user object for testing purposes
    return {
      id: "user123",
      wallet: { balance: 100.00 },
      // Other user data
    }
  },
  saveAd: (ad) => {
    console.log("Saving ad:", ad)
  },
  deductFunds: (userId, amount, description) => {
    console.log(`Deducting $${amount} from ${userId} for ${description}`)
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
    // Use the dummy auth service
    const currentUser = dummyAuthService.getCurrentUser()
    if (!currentUser) {
      router.push("/auth") // This path may not exist in a dummy setup
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

    // Clear error when user starts typing
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
        images: [...prev.images, ...newImages].slice(0, 10), // Max 10 images
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
    if (!formData.baths || Number.parseFloat(formData.baths) < 0)
      newErrors.baths = "Valid number of bathrooms is required"
    if (!formData.sqft || Number.parseInt(formData.sqft) <= 0) newErrors.sqft = "Valid square footage is required"
    if (formData.images.length === 0) newErrors.images = "At least one image is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const calculateCost = () => {
    const baseCost = 10 // Base cost per listing
    const durationMultiplier = Number.parseInt(formData.duration) / 30
    const featuredCost = formData.featured ? 25 : 0

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
      // Replaced alert() with a console log for a more graceful failure.
      console.log(`Insufficient funds. You need $${cost.toFixed(2)} but only have $${user.wallet.balance.toFixed(2)}`)
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

      // Use the dummy auth service
      dummyAuthService.saveAd(newListing)
      dummyAuthService.deductFunds(user.id, cost, `Listing fee for "${formData.title}"`)

      router.push("/dashboard")
    } catch (error) {
      console.error("Error creating listing:", error)
      // Replaced alert() with a console log
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
                    className={errors.title ? "input-error" : ""}
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
                        <DummySelectItem value="condo">Condo</DummySelectItem>
                        <DummySelectItem value="townhouse">Townhouse</DummySelectItem>
                        <DummySelectItem value="land">Land</DummySelectItem>
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
                    <DollarSign className="input-icon" />
                    <DummyInput
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleInputChange("price", e.target.value)}
                      placeholder={formData.listingType === "sale" ? "425000" : "2500"}
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
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Property ${index + 1}`}
                          className="image-preview"
                        />
                        <DummyButton
                          variant="destructive"
                          size="sm"
                          className="remove-image-button"
                          onClick={() => removeImage(index)}
                        >
                          <X className="remove-icon" />
                        </DummyButton>
                      </div>
                    ))}
                  </div>

                  {formData.images.length < 10 && (
                    <div>
                      <DummyLabel htmlFor="images" className="upload-label">
                        <div
                          className={`upload-area ${errors.images ? "upload-error-border" : ""}`}
                        >
                          <Upload className="upload-icon" />
                          <p className="upload-text">Click to upload images</p>
                        </div>
                      </DummyLabel>
                      <DummyInput
                        id="images"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden-input"
                      />
                    </div>
                  )}
                  {errors.images && <p className="error-message">{errors.images}</p>}
                </div>
              </DummyCardContent>
            </DummyCard>
          </div>

          {/* Sidebar */}
          <div className="sidebar">
            {/* Pricing Summary */}
            <DummyCard>
              <DummyCardHeader>
                <DummyCardTitle className="card-title-icon-wrapper">
                  <DollarSign className="card-title-icon-green" />
                  Pricing Summary
                </DummyCardTitle>
              </DummyCardHeader>
              <DummyCardContent className="card-content-spacing">
                <div className="pricing-section-spacing">
                  <DummyLabel htmlFor="duration">Listing Duration</DummyLabel>
                  <DummySelect value={formData.duration} onValueChange={(value) => handleInputChange("duration", value)}>
                    <DummySelectTrigger>
                      <DummySelectValue />
                    </DummySelectTrigger>
                    <DummySelectContent>
                      <DummySelectItem value="7">7 days - $2.33</DummySelectItem>
                      <DummySelectItem value="14">14 days - $4.67</DummySelectItem>
                      <DummySelectItem value="30">30 days - $10.00</DummySelectItem>
                      <DummySelectItem value="60">60 days - $20.00</DummySelectItem>
                      <DummySelectItem value="90">90 days - $30.00</DummySelectItem>
                    </DummySelectContent>
                  </DummySelect>
                </div>

                <div className="checkbox-item">
                  <DummyCheckbox
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => handleInputChange("featured", checked)}
                  />
                  <DummyLabel htmlFor="featured" className="checkbox-label-icon-wrapper">
                    <Star className="checkbox-icon-yellow" />
                    Featured Listing (+$25)
                  </DummyLabel>
                </div>

                {formData.listingType && (
                  <div className="pricing-info-box">
                    <p className="pricing-info-title">
                      {formData.listingType === "sale"
                        ? "For Sale"
                        : formData.listingType === "rent"
                          ? "For Rent"
                          : "For Lease"}{" "}
                      Listing
                    </p>
                    {formData.listingType === "rent" && (
                      <p className="pricing-info-text">20% discount applied for rental listings</p>
                    )}
                    {formData.listingType === "lease" && (
                      <p className="pricing-info-text">10% discount applied for lease listings</p>
                    )}
                  </div>
                )}

                <div className="pricing-summary-details">
                  <div className="pricing-line-item">
                    <span>Base Cost:</span>
                    <span>${((10 * Number.parseInt(formData.duration)) / 30).toFixed(2)}</span>
                  </div>
                  {formData.listingType === "rent" && (
                    <div className="pricing-line-item">
                      <span>Rental Discount (20%):</span>
                      <span className="text-green-600">
                        -${(((10 * Number.parseInt(formData.duration)) / 30) * 0.2).toFixed(2)}
                      </span>
                    </div>
                  )}
                  {formData.listingType === "lease" && (
                    <div className="pricing-line-item">
                      <span>Lease Discount (10%):</span>
                      <span className="text-green-600">
                        -${(((10 * Number.parseInt(formData.duration)) / 30) * 0.1).toFixed(2)}
                      </span>
                    </div>
                  )}
                  {formData.featured && (
                    <div className="pricing-line-item">
                      <span>Featured:</span>
                      <span>$25.00</span>
                    </div>
                  )}
                  <div className="pricing-total">
                    <span>Total:</span>
                    <span className="text-green-600">${cost.toFixed(2)}</span>
                  </div>
                </div>

                <div className="wallet-summary">
                  <p className="wallet-label">Your wallet balance:</p>
                  <p className={`wallet-balance-display ${user.wallet.balance >= cost ? "text-green-600" : "text-red-600"}`}>
                    ${user.wallet.balance.toFixed(2)}
                  </p>
                  {user.wallet.balance < cost && (
                    <p className="insufficient-funds-message">
                      Insufficient funds. Please add ${(cost - user.wallet.balance).toFixed(2)} to your wallet.
                    </p>
                  )}
                </div>
              </DummyCardContent>
            </DummyCard>

            {/* Submit Button */}
            <DummyCard>
              <DummyCardContent className="submit-card-content">
                <DummyButton
                  onClick={handleSubmit}
                  disabled={isSubmitting || !canAfford}
                  className="submit-button"
                >
                  {isSubmitting ? (
                    "Creating Listing..."
                  ) : canAfford ? (
                    <>
                      <CheckCircle className="icon-left" />
                      Create Listing
                    </>
                  ) : (
                    "Insufficient Funds"
                  )}
                </DummyButton>
                {!canAfford && (
                  <p className="add-funds-message">
                    Add funds to your wallet to create this listing
                  </p>
                )}
              </DummyCardContent>
            </DummyCard>
          </div>
        </div>
      </div>
    </div>
  )
}
