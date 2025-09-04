"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import "../../../styles/id.css"

// Replaced imported components with simple JSX to reduce dependencies
const Button = ({ onClick, className, children, type }) => (
  <button onClick={onClick} className={className} type={type}>{children}</button>
)

const Card = ({ children }) => <div className="card-container">{children}</div>

const CardContent = ({ children }) => <div className="card-content">{children}</div>

const CardHeader = ({ children }) => <div className="card-header-inner">{children}</div>

const CardTitle = ({ children }) => <h2 className="card-title-inner">{children}</h2>

const Badge = ({ className, children }) => <span className={className}>{children}</span>

const Input = ({ placeholder, value, onChange, type, required }) => (
  <input placeholder={placeholder} value={value} onChange={onChange} type={type} required={required} className="input" />
)

const Label = ({ children }) => <label className="label">{children}</label>

const Textarea = ({ placeholder, value, onChange, required }) => (
  <textarea placeholder={placeholder} value={value} onChange={onChange} required={required} className="textarea" />
)

// Icon components (simplified SVGs)
const ArrowLeft = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
const MapPin = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
const Bed = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 4v14" /><path d="M2 8h18a2 2 0 1 1 0 4H2" /><path d="M2 12h16a2 2 0 1 1 0 4H2" /><path d="M20 8v14" /><path d="M20 16H8" /></svg>
const Bath = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6c-3 0-5.3 3.5-5.3 8C3.7 18.5 6 22 9 22h6c3 0 5.3-3.5 5.3-8S18 6 15 6z" /><path d="M12 2v4" /><path d="M15 9V6" /><path d="M9 9V6" /><path d="M9.5 9h5" /><path d="M12 6h2" /><path d="M12 9h2" /></svg>
const Square = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /></svg>
const Calendar = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" /></svg>
const Eye = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
const MessageSquare = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
const Phone = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2.18A19.05 19.05 0 0 1 2.92 2.18 2 2 0 0 1 5 0h3a2 2 0 0 1 2 2.18A19.05 19.05 0 0 1 22.18 14z" /></svg>
const Mail = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-10 7L2 7" /></svg>
const User = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
const Home = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
const Heart = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
const Share2 = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.59 13.51 6.83 3.42" /><path d="m15.41 6.49-6.83 3.42" /></svg>
const Calculator = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2" /><path d="M8 6h8" /><path d="M8 10h8" /><path d="M12 14h.01" /><path d="M12 18h.01" /></svg>
const ChevronLeft = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
const ChevronRight = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>


// Dummy authService
const authService = {
  getCurrentUser: () => ({ id: "user-1", name: "John Doe" }),
  getAdById: (id) => {
    const properties = [
      {
        id: "1", title: "Luxury 5-Bedroom Villa", address: "Lekki, Lagos", price: 250000000, listingType: "sale", type: "house", beds: 5, baths: 6, sqft: 5000, description: "A stunning villa with a swimming pool and modern amenities, located in a secure gated community.", images: ["https://picsum.photos/600/400?random=1", "https://picsum.photos/600/400?random=2"], featured: true, createdAt: "2024-01-15T08:00:00Z", views: 1250, inquiries: 45
      },
      {
        id: "2", title: "Spacious 3-Bedroom Apartment", address: "Wuse 2, Abuja", price: 5000000, listingType: "rent", type: "condo", beds: 3, baths: 3, sqft: 2500, description: "Conveniently located in a secure and serene neighborhood. The apartment features a spacious living area and a well-equipped kitchen.", images: ["https://picsum.photos/600/400?random=3", "https://picsum.photos/600/400?random=4"], featured: false, createdAt: "2024-02-20T10:30:00Z", views: 800, inquiries: 20
      },
    ];
    return properties.find(p => p.id === id);
  },
  incrementViews: (id) => {
    console.log(`Incremented views for property ${id}`);
  },
  incrementInquiries: (id) => {
    console.log(`Incremented inquiries for property ${id}`);
  },
};

export default function PropertyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showContactForm, setShowContactForm] = useState(false)
  const [contactForm, setContactForm] = useState({ name: "", email: "", phone: "", message: "" })
  const [calculator, setCalculator] = useState({ loanAmount: "", interestRate: "15", loanTerm: "25" })

  useEffect(() => {
    const propertyId = params.id
    const foundProperty = authService.getAdById(propertyId)

    if (!foundProperty) {
      // In a real app, you might use a redirect here
      // router.push("/properties")
      setLoading(true)
      return
    }

    setProperty(foundProperty)
    authService.incrementViews(propertyId)
    setLoading(false)
  }, [params.id])

  const formatPrice = (price, listingType) => {
    const formatted = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(price);
    if (listingType === "rent" || listingType === "lease") return `${formatted}/year`;
    return formatted;
  }

  const getListingTypeBadgeClass = (type) => {
    switch (type) {
      case "sale": return "badge-sale";
      case "rent": return "badge-rent";
      case "lease": return "badge-lease";
      default: return "";
    }
  }

  const handleContactSubmit = (e) => {
    e.preventDefault()
    if (property) {
      authService.incrementInquiries(property.id)
      alert("Your inquiry has been sent! The property owner will contact you soon.")
      setContactForm({ name: "", email: "", phone: "", message: "" })
      setShowContactForm(false)
    }
  }

  const calculateMortgage = () => {
    const principal = Number.parseFloat(calculator.loanAmount)
    const rate = Number.parseFloat(calculator.interestRate) / 100 / 12
    const payments = Number.parseFloat(calculator.loanTerm) * 12
    if (principal && rate && payments) {
      const monthlyPayment = (principal * rate * Math.pow(1 + rate, payments)) / (Math.pow(1 + rate, payments) - 1);
      return monthlyPayment;
    }
    return 0;
  }

  const nextImage = () => {
    if (property?.images) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length)
    }
  }

  const prevImage = () => {
    if (property?.images) {
      setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length)
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading property details...</p>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="not-found-container">
        <Home className="not-found-icon" />
        <h2 className="not-found-title">Property Not Found</h2>
        <p className="not-found-text">The property you're looking for doesn't exist.</p>
        <Link href="/properties">
          <Button className="button button-primary">Back to Properties</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="property-detail-page">
      {/* Header */}
      <header className="header-detail">
        <div className="header-container-detail">
          <div className="header-left">
            <Link href="/properties">
              <Button className="button-outline button-back">
                <ArrowLeft />
                Back to Properties
              </Button>
            </Link>
            <div className="header-logo">
              <video src="/logoTest.mp4" autoPlay loop muted></video>
            </div>
          </div>
          <div className="header-right">
            <Button className="button-outline"><Heart /></Button>
            <Button className="button-outline"><Share2 /></Button>
          </div>
        </div>
      </header>

      <div className="main-content-detail">
        <div className="grid-layout">
          {/* Main Content */}
          <div className="main-column">
            {/* Image Gallery */}
            <Card>
              <div className="image-gallery">
                <img
                  src={property.images?.[currentImageIndex] || "/placeholder.png"}
                  alt={property.title}
                  className="main-image"
                />
                {property.images && property.images.length > 1 && (
                  <>
                    <button onClick={prevImage} className="image-nav-button left"><ChevronLeft /></button>
                    <button onClick={nextImage} className="image-nav-button right"><ChevronRight /></button>
                  </>
                )}
                <div className="image-badge-container top-left">
                  <Badge className={getListingTypeBadgeClass(property.listingType)}>For {property.listingType.charAt(0).toUpperCase() + property.listingType.slice(1)}</Badge>
                </div>
                {property.featured && (
                  <div className="image-badge-container top-right">
                    <Badge className="badge-featured">Featured</Badge>
                  </div>
                )}
              </div>
              {property.images && property.images.length > 1 && (
                <div className="thumbnail-container">
                  {property.images.map((image, index) => (
                    <img
                      key={index}
                      src={image || "/placeholder.svg"}
                      alt={`Property ${index + 1}`}
                      className={`thumbnail ${index === currentImageIndex ? "active" : ""}`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              )}
            </Card>

            {/* Property Details */}
            <Card>
              <CardHeader>
                <div className="details-header">
                  <CardTitle>{property.title}</CardTitle>
                  <span className="price">{formatPrice(property.price, property.listingType)}</span>
                </div>
                <div className="address-container">
                  <MapPin className="icon-sm" />
                  <span>{property.address}</span>
                </div>
                <div className="details-grid">
                  <div className="detail-item-stat"><Bed className="icon-lg" /><span>{property.beds} Bedrooms</span></div>
                  <div className="detail-item-stat"><Bath className="icon-lg" /><span>{property.baths} Bathrooms</span></div>
                  <div className="detail-item-stat"><Square className="icon-lg" /><span>{property.sqft} sqft</span></div>
                </div>
                <div className="stats-header-row">
                  <div className="stat-item"><Eye className="icon-sm" /><span className="text-sm">{property.views || 0} views</span></div>
                  <div className="stat-item"><MessageSquare className="icon-sm" /><span className="text-sm">{property.inquiries || 0} inquiries</span></div>
                  <div className="stat-item"><Calendar className="icon-sm" /><span className="text-sm">Listed {new Date(property.createdAt).toLocaleDateString()}</span></div>
                </div>
              </CardHeader>
              <CardContent>
                <h3 className="section-title">Description</h3>
                <p className="description-text">{property.description}</p>
              </CardContent>
            </Card>

            {/* Mortgage Calculator */}
            {property.listingType === "sale" && (
              <Card>
                <CardHeader>
                  <CardTitle><Calculator className="icon-sm mr-2" />Mortgage Calculator</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="calculator-grid">
                    <div><Label>Loan Amount (₦)</Label><Input type="number" value={calculator.loanAmount} onChange={(e) => setCalculator((prev) => ({ ...prev, loanAmount: e.target.value }))} placeholder={property.price.toString()} /></div>
                    <div><Label>Interest Rate (%)</Label><Input type="number" value={calculator.interestRate} onChange={(e) => setCalculator((prev) => ({ ...prev, interestRate: e.target.value }))} step="0.1" /></div>
                    <div><Label>Loan Term (Years)</Label><Input type="number" value={calculator.loanTerm} onChange={(e) => setCalculator((prev) => ({ ...prev, loanTerm: e.target.value }))} /></div>
                  </div>
                  <div className="calculator-result">
                    <p className="monthly-payment-label">Estimated Monthly Payment</p>
                    <p className="monthly-payment-amount">
                      {new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(calculateMortgage())}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="sidebar-column">
            {/* Contact Card */}
            <Card>
              <CardHeader><CardTitle>Contact Agent</CardTitle></CardHeader>
              <CardContent>
                <div className="agent-profile">
                  <div className="agent-icon-bg"><User /></div>
                  <div>
                    <h3 className="agent-name">Property Agent</h3>
                    <p className="agent-company">TheNigeriaProperties</p>
                  </div>
                </div>
                <div className="contact-buttons">
                  <Button className="button button-primary" onClick={() => setShowContactForm(!showContactForm)}><MessageSquare />Send Message</Button>
                  <Button className="button-outline"><Phone />+234 (0) 123-456-7890</Button>
                  <Button className="button-outline"><Mail />Email Agent</Button>
                </div>
                {showContactForm && (
                  <form onSubmit={handleContactSubmit} className="contact-form">
                    <div><Label>Name</Label><Input value={contactForm.name} onChange={(e) => setContactForm((prev) => ({ ...prev, name: e.target.value }))} required /></div>
                    <div><Label>Email</Label><Input type="email" value={contactForm.email} onChange={(e) => setContactForm((prev) => ({ ...prev, email: e.target.value }))} required /></div>
                    <div><Label>Phone</Label><Input value={contactForm.phone} onChange={(e) => setContactForm((prev) => ({ ...prev, phone: e.target.value }))} /></div>
                    <div><Label>Message</Label><Textarea value={contactForm.message} onChange={(e) => setContactForm((prev) => ({ ...prev, message: e.target.value }))} placeholder="I'm interested in this property..." required /></div>
                    <Button type="submit" className="button button-primary">Send Inquiry</Button>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* Property Features */}
            <Card>
              <CardHeader><CardTitle>Property Features</CardTitle></CardHeader>
              <CardContent>
                <div className="feature-list">
                  <div className="feature-item"><span>Property Type:</span><span>{property.type.charAt(0).toUpperCase() + property.type.slice(1)}</span></div>
                  <div className="feature-item"><span>Listing Type:</span><span>For {property.listingType.charAt(0).toUpperCase() + property.listingType.slice(1)}</span></div>
                  <div className="feature-item"><span>Status:</span><span className="text-green-600">Active</span></div>
                  {property.listingType !== "sale" && (<div className="feature-item"><span>Lease Term:</span><span>12 months</span></div>)}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader><CardTitle>Property Stats</CardTitle></CardHeader>
              <CardContent>
                <div className="stats-list">
                  <div className="stat-row">
                    <div className="stat-label"><Eye className="icon-sm" />Views</div>
                    <span className="stat-value">{property.views || 0}</span>
                  </div>
                  <div className="stat-row">
                    <div className="stat-label"><MessageSquare className="icon-sm" />Inquiries</div>
                    <span className="stat-value">{property.inquiries || 0}</span>
                  </div>
                  <div className="stat-row">
                    <div className="stat-label"><Calendar className="icon-sm" />Days Listed</div>
                    <span className="stat-value">{Math.ceil((new Date() - new Date(property.createdAt)) / (1000 * 60 * 60 * 24))}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}