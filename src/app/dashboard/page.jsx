"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import '../../styles/dashboard.css'
import {
    Home,
    Plus,
    Edit,
    Eye,
    Trash2,
    User,
    LogOut,
    MapPin,
    Bed,
    Bath,
    Square,
    Calendar,
    DollarSign,
    TrendingUp,
} from "lucide-react"

export default function Dashboard() {
    const [showNav, setShowNav] = useState(false)
    const [user, setUser] = useState(null)
    const [listings, setListings] = useState([])
    const [stats, setStats] = useState({
        totalListings: 0,
        activeListings: 0,
        totalViews: 0,
        totalEarnings: 0,
    })

    useEffect(() => {
        // Mock user
        const currentUser = { id: 1, firstName: "Guest", email: "guest@example.com" }
        setUser(currentUser)

        // Seed demo listings in localStorage if none exist
        let userListings = JSON.parse(localStorage.getItem("userListings") || "[]")
        if (userListings.length === 0) {
            userListings = [
                {
                    id: "1",
                    userId: 1,
                    title: "2-Bedroom Apartment in Lagos",
                    location: "Ikeja, Lagos",
                    bedrooms: 2,
                    bathrooms: 2,
                    area: 1200,
                    price: "1500000",
                    listingType: "rent",
                    views: 34,
                    earnings: 0,
                    expiresAt: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
                },
                {
                    id: "2",
                    userId: 1,
                    title: "4-Bedroom Duplex in Abuja",
                    location: "Gwarinpa, Abuja",
                    bedrooms: 4,
                    bathrooms: 3,
                    area: 3000,
                    price: "80000000",
                    listingType: "sale",
                    views: 87,
                    earnings: 0,
                    expiresAt: new Date(new Date().setMonth(new Date().getMonth() + 2)).toISOString(),
                },
            ]
            localStorage.setItem("userListings", JSON.stringify(userListings))
        }

        const filteredListings = userListings.filter((listing) => listing.userId === currentUser.id)
        setListings(filteredListings)

        const activeListings = filteredListings.filter((listing) => new Date(listing.expiresAt) > new Date())

        setStats({
            totalListings: filteredListings.length,
            activeListings: activeListings.length,
            totalViews: filteredListings.reduce((sum, listing) => sum + (listing.views || 0), 0),
            totalEarnings: filteredListings.reduce((sum, listing) => sum + (listing.earnings || 0), 0),
        })
    }, [])

    const handleLogout = () => {
        alert("Logout functionality not wired yet.")
    }

    const handleDeleteListing = (listingId) => {
        if (confirm("Are you sure you want to delete this listing?")) {
            const userListings = JSON.parse(localStorage.getItem("userListings") || "[]")
            const updatedListings = userListings.filter((listing) => listing.id !== listingId)
            localStorage.setItem("userListings", JSON.stringify(updatedListings))

            setListings(listings.filter((listing) => listing.id !== listingId))

            const activeListings = updatedListings.filter(
                (listing) => listing.userId === user.id && new Date(listing.expiresAt) > new Date(),
            )

            setStats({
                totalListings: updatedListings.filter((l) => l.userId === user.id).length,
                activeListings: activeListings.length,
                totalViews: updatedListings
                    .filter((l) => l.userId === user.id)
                    .reduce((sum, listing) => sum + (listing.views || 0), 0),
                totalEarnings: updatedListings
                    .filter((l) => l.userId === user.id)
                    .reduce((sum, listing) => sum + (listing.earnings || 0), 0),
            })
        }
    }

    const formatPrice = (price, listingType) => {
        const numPrice = Number.parseInt(price.toString().replace(/[^\d]/g, ""))
        const formatted = new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(numPrice)

        if (listingType === "rent") return `${formatted}/year`
        if (listingType === "lease") return `${formatted}/year`
        return formatted
    }

    const getStatusBadge = (listing) => {
        const isExpired = new Date(listing.expiresAt) <= new Date()
        if (isExpired) {
            return (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-600 text-white">
                    Expired
                </span>
            )
        }
        return (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-600 text-white">
                Active
            </span>
        )
    }

    const getListingTypeBadge = (type) => {
        const colors = {
            sale: "bg-green-600",
            rent: "bg-emerald-600",
            lease: "bg-teal-600",
        }
        return (
            <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colors[type]} text-white`}
            >
                For {type.charAt(0).toUpperCase() + type.slice(1)}
            </span>
        )
    }

    if (!user) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>
    }

    return (
        <div className="dashboard">
            {/* Header */}
            <header className="dashboard-header">
                <div className="container">
                    <div className="header-content">
                        <div className="header-left">
                            <Link href="/" className="brand">
                                <video src="/logoTest.mp4" autoPlay loop muted></video>
                            </Link>
                        </div>

                        <div className="header-right">
                            <Link href="/dashboard/profile">
                                <button className="btn btn-outline">
                                    <User className="icon-sm" />
                                    Edit Profile
                                </button>
                            </Link>
                            <button className="btn btn-outline" onClick={handleLogout}>
                                <LogOut className="icon-sm" />
                                Logout
                            </button>
                        </div>
                        <div className="hamurger">
                            <svg onClick={() => setShowNav(true)} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" /></svg>
                        </div>
                    </div>
                </div>
            </header>
            <div className={`hiddenNav ${showNav ? 'display-flex' : 'display-none'}`}>
                <div className="close" onClick={() => {setShowNav(false)}}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" /></svg>
                </div>
                <Link href="/dashboard/profile">
                    <button className="btn btn-outline">
                        <User className="icon-sm" />
                        Edit Profile
                    </button>
                </Link>
                <button className="btn btn-outline" onClick={handleLogout}>
                    <LogOut className="icon-sm" />
                    Logout
                </button>
            </div>

            <div className="container page-content">
                {/* Welcome Section */}
                <div className="welcome">
                    <h1>Welcome back, {user.firstName || user.email}!</h1>
                    <p>Manage your property listings and track your performance.</p>
                </div>

                {/* Stats */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-header">
                            <h2>Total Listings</h2>
                            <Home className="icon-sm" />
                        </div>
                        <div className="stat-value">{stats.totalListings}</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-header">
                            <h2>Active Listings</h2>
                            <TrendingUp className="icon-sm" />
                        </div>
                        <div className="stat-value text-green">{stats.activeListings}</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-header">
                            <h2>Total Views</h2>
                            <Eye className="icon-sm" />
                        </div>
                        <div className="stat-value">{stats.totalViews}</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-header">
                            <h2>Total Spent</h2>
                            <DollarSign className="icon-sm" />
                        </div>
                        <div className="stat-value">₦{stats.totalEarnings.toLocaleString()}</div>
                    </div>
                </div>

                {/* Actions */}
                <div className="actions">
                    <Link href="/dashboard/create-listing">
                        <button className="btn btn-primary">
                            <Plus className="icon-sm" />
                            Create New Listing
                        </button>
                    </Link>
                    <Link href="/properties">
                        <button className="btn btn-outline">
                            <Eye className="icon-sm" />
                            View All Properties
                        </button>
                    </Link>
                </div>

                {/* Listings */}
                <div className="listings-card">
                    <div className="card-header">
                        <h2>Your Listings</h2>
                    </div>
                    <div className="card-body">
                        {listings.length === 0 ? (
                            <div className="empty-list">
                                <Home className="icon-xl text-gray" />
                                <h3>No listings yet</h3>
                                <p>Create your first property listing to get started.</p>
                                <Link href="/dashboard/create-listing">
                                    <button className="btn btn-primary">
                                        <Plus className="icon-sm" />
                                        Create Listing
                                    </button>
                                </Link>
                            </div>
                        ) : (
                            listings.map((listing) => (
                                <div key={listing.id} className="listing-item">
                                    <div className="listing-details">
                                        <div className="listing-header">
                                            <h3>{listing.title}</h3>
                                            {getListingTypeBadge(listing.listingType)}
                                            {getStatusBadge(listing)}
                                        </div>

                                        <div className="listing-location">
                                            <MapPin className="icon-sm" />
                                            <span>{listing.location}</span>
                                        </div>

                                        <div className="listing-info">
                                            <div><Bed className="icon-sm" /> {listing.bedrooms} beds</div>
                                            <div><Bath className="icon-sm" /> {listing.bathrooms} baths</div>
                                            <div><Square className="icon-sm" /> {listing.area} sqft</div>
                                        </div>

                                        <div className="listing-footer">
                                            <span className="price">{formatPrice(listing.price, listing.listingType)}</span>
                                            <div className="expires">
                                                <Calendar className="icon-sm" />
                                                Expires: {new Date(listing.expiresAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="listing-actions">
                                        <Link href={`/properties/${listing.id}`}>
                                            <button className="btn btn-outline">
                                                <Eye className="icon-sm" /> View
                                            </button>
                                        </Link>
                                        <Link href={`/dashboard/edit-listing/${listing.id}`}>
                                            <button className="btn btn-outline">
                                                <Edit className="icon-sm" /> Edit
                                            </button>
                                        </Link>
                                        <button onClick={() => handleDeleteListing(listing.id)} className="btn btn-danger">
                                            <Trash2 className="icon-sm" /> Delete
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

