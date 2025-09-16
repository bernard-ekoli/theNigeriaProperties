"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import "../../styles/properties.css"

// Replaced imported components with simple JSX
const Button = ({ onClick, className, children }) => (
  <button onClick={onClick} className={className}>
    {children}
  </button>
)

const Card = ({ className, children }) => <div className={className}>{children}</div>

const CardContent = ({ className, children }) => <div className={className}>{children}</div>

const Input = ({ placeholder, value, onChange, type, className }) => (
  <input placeholder={placeholder} value={value} onChange={onChange} type={type} className={className} />
)

const Badge = ({ className, children }) => <span className={className}>{children}</span>

const Select = ({ value, onChange, className, children }) => (
  <select value={value} onChange={(e) => onChange(e.target.value)} className={className}>
    {children}
  </select>
)

const SelectItem = ({ value, children }) => <option value={value}>{children}</option>

// Icon components (simplified SVGs)
const Search = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
const MapPin = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
const Bed = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 4v14" /><path d="M2 8h18a2 2 0 1 1 0 4H2" /><path d="M2 12h16a2 2 0 1 1 0 4H2" /><path d="M20 8v14" /><path d="M20 16H8" /></svg>
const Bath = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9 6c-3 0-5.3 3.5-5.3 8C3.7 18.5 6 22 9 22h6c3 0 5.3-3.5 5.3-8S18 6 15 6z" /><path d="M12 2v4" /><path d="M15 9V6" /><path d="M9 9V6" /><path d="M9.5 9h5" /><path d="M12 6h2" /><path d="M12 9h2" /></svg>
const Square = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /></svg>
const Filter = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
const Home = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
const Heart = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>


// Dummy data to simulate API response
const DUMMY_PROPERTIES = [
  { id: "1", title: "Luxury 5-Bedroom Villa", address: "Lekki, Lagos", price: 250000000, listingType: "sale", type: "house", beds: 5, baths: 6, sqft: 5000, description: "A stunning villa with a swimming pool and modern amenities.", images: ["https://picsum.photos/400/250?random=1"], featured: true },
  { id: "2", title: "Spacious 3-Bedroom Apartment", address: "Wuse 2, Abuja", price: 5000000, listingType: "rent", type: "condo", beds: 3, baths: 3, sqft: 2500, description: "Conveniently located in a secure and serene neighborhood.", images: ["https://picsum.photos/400/250?random=2"] },
  { id: "3", title: "Commercial Land", address: "Victoria Island, Lagos", price: 1500000000, listingType: "sale", type: "land", beds: 0, baths: 0, sqft: 10000, description: "Prime commercial land suitable for development.", images: ["https://picsum.photos/400/250?random=3"], featured: true },
  { id: "4", title: "Modern 4-Bedroom Townhouse", address: "Ikoyi, Lagos", price: 10000000, listingType: "lease", type: "townhouse", beds: 4, baths: 4, sqft: 3500, description: "A contemporary townhouse with a private garden.", images: ["https://picsum.photos/400/250?random=4"] },
  { id: "5", title: "Cozy 2-Bedroom Condo", address: "Ikeja, Lagos", price: 3000000, listingType: "rent", type: "condo", beds: 2, baths: 2, sqft: 1800, description: "Perfect for a small family, close to schools and malls.", images: ["https://picsum.photos/400/250?random=5"] },
]

// Main Page Component
export default function PropertiesPage() {
  const [properties] = useState(DUMMY_PROPERTIES)
  const [filteredProperties, setFilteredProperties] = useState(DUMMY_PROPERTIES)
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    type: "all",
    listingType: "all",
    minPrice: "",
    maxPrice: "",
    beds: "all",
    baths: "all",
  })

  useEffect(() => {
    let filtered = [...properties]
    if (searchTerm) {
      filtered = filtered.filter(
        (property) =>
          property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
          property.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }
    if (filters.type !== "all") {
      filtered = filtered.filter((property) => property.type === filters.type)
    }
    if (filters.listingType !== "all") {
      filtered = filtered.filter((property) => property.listingType === filters.listingType)
    }
    if (filters.minPrice) {
      filtered = filtered.filter((property) => property.price >= Number.parseInt(filters.minPrice))
    }
    if (filters.maxPrice) {
      filtered = filtered.filter((property) => property.price <= Number.parseInt(filters.maxPrice))
    }
    if (filters.beds !== "all") {
      filtered = filtered.filter((property) => property.beds >= Number.parseInt(filters.beds))
    }
    if (filters.baths !== "all") {
      filtered = filtered.filter((property) => property.baths >= Number.parseFloat(filters.baths))
    }
    setFilteredProperties(filtered)
  }, [properties, searchTerm, filters])

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const formatPrice = (price, listingType) => {
    const formatted = new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
    if (listingType === "rent" || listingType === "lease") return `${formatted}/year`
    return formatted
  }

  const getListingTypeBadgeClass = (type) => {
    switch (type) {
      case "sale": return "badge badge-sale";
      case "rent": return "badge badge-rent";
      case "lease": return "badge badge-lease";
      default: return "badge";
    }
  }

  return (
    <div className="properties-page">
      {/* Header */}
      <header className="header">
        <div className="header-container">
          <div className="header-logo">
            <video src="./logoTest.mp4" autoPlay loop muted className="header-logo-video"></video>
          </div>
          <nav className="nav-links">
            <Link href="/auth" className="nav-link"><button className="button-primary">Sign Up</button></Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="main-content">
        {/* Search and Filters Section */}
        <div className="search-section">
          <h1 className="page-title">Find Your Perfect Nigerian Property</h1>
          <p className="page-subtitle">Discover {filteredProperties.length} properties across Nigeria</p>
          <div className="search-box">
            <div className="search-input-container">
              <Search className="search-icon" />
              <Input placeholder="Search by location, property type, or description..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="input-special pl-10 h-12" />
            </div>
            <div className="filter-price">
              <Input placeholder="Min Price (₦)" value={filters.minPrice} onChange={(e) => handleFilterChange("minPrice", e.target.value)} type="number" className="input-specialised" />
              <Input placeholder="Max Price (₦)" value={filters.maxPrice} onChange={(e) => handleFilterChange("maxPrice", e.target.value)} type="number" className="input-specialised" />
            </div>
            <div className="filter-grid">
              <Select value={filters.type} onChange={(value) => handleFilterChange("type", value)} className="select">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="condo">Condo</SelectItem>
                <SelectItem value="townhouse">Townhouse</SelectItem>
                <SelectItem value="land">Land</SelectItem>
              </Select>
              <Select value={filters.listingType} onChange={(value) => handleFilterChange("listingType", value)} className="select">
                <SelectItem value="all">All Listings</SelectItem>
                <SelectItem value="sale">For Sale</SelectItem>
                <SelectItem value="rent">For Rent</SelectItem>
                <SelectItem value="lease">For Lease</SelectItem>
              </Select>
              <Select value={filters.beds} onChange={(value) => handleFilterChange("beds", value)} className="select">
                <SelectItem value="all">Any Beds</SelectItem>
                <SelectItem value="1">1+ Beds</SelectItem>
                <SelectItem value="2">2+ Beds</SelectItem>
                <SelectItem value="3">3+ Beds</SelectItem>
                <SelectItem value="4">4+ Beds</SelectItem>
                <SelectItem value="5">5+ Beds</SelectItem>
              </Select>
              <Select value={filters.baths} onChange={(value) => handleFilterChange("baths", value)} className="select">
                <SelectItem value="all">Any Baths</SelectItem>
                <SelectItem value="1">1+ Baths</SelectItem>
                <SelectItem value="2">2+ Baths</SelectItem>
                <SelectItem value="3">3+ Baths</SelectItem>
                <SelectItem value="4">4+ Baths</SelectItem>
              </Select>
            </div>
          </div>
        </div>

        {/* Results and Grid */}
        <div className="results-header">
          <h2 className="results-title">{filteredProperties.length} Properties Found</h2>
          <div className="sort-by">
            <Filter className="w-4 h-4" />
            <span>Sort by: Price (Low to High)</span>
          </div>
        </div>
        {filteredProperties.length === 0 ? (
          <div className="no-results">
            <Home className="no-results-icon" />
            <h3>No properties found</h3>
            <p>Try adjusting your search filters</p>
            <Button onClick={() => { setSearchTerm(""); setFilters({ type: "all", listingType: "all", minPrice: "", maxPrice: "", beds: "all", baths: "all" }) }} className="button button-primary">Clear Filters</Button>
          </div>
        ) : (
          <div className="property-grid">
            {filteredProperties.map((property) => (
              <Card key={property.id} className="card">
                <div className="card-image-container">
                  <img src={property.images?.[0] || "/placeholder.svg?height=250&width=400&text=Property"} alt={property.title} className="card-image" />
                  <div className="card-badge left">
                    <Badge className={getListingTypeBadgeClass(property.listingType)}>For {property.listingType.charAt(0).toUpperCase() + property.listingType.slice(1)}</Badge>
                  </div>
                  {property.featured && (<div className="card-badge right"><Badge className="badge badge-featured">Featured</Badge></div>)}
                  <button className="favorite-button"><Heart className="w-4 h-4 text-gray-500" /></button>
                </div>
                <CardContent className="card-content">
                  <div className="card-header">
                    <h3 className="property-title">{property.title}</h3>
                    <span className="property-price">{formatPrice(property.price, property.listingType)}</span>
                  </div>
                  <div className="property-address">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{property.address}</span>
                  </div>
                  <div className="property-details">
                    <div className="detail-item"><Bed className="w-4 h-4 mr-1" /><span>{property.beds} beds</span></div>
                    <div className="detail-item"><Bath className="w-4 h-4 mr-1" /><span>{property.baths} baths</span></div>
                    <div className="detail-item"><Square className="w-4 h-4 mr-1" /><span>{property.sqft} sqft</span></div>
                  </div>
                  <div className="card-footer">
                    <div className="property-stats">
                      <span>{property.views || 0} views</span>
                      <span>{property.inquiries || 0} inquiries</span>
                    </div>
                    <Link href={`/properties/${property.id}`}><Button className="button button-primary">View Details</Button></Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      <div className="load-more-button">
        <button>Load More</button>
      </div>
    </div>
  )
}