import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';
import {
    ArrowRight, CheckCircle, Shield, Globe, FileSearch, Building2, Star,
    Server
} from 'lucide-react';

const HomePage = () => {
    return (
        <div className="home-container">

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-bg-effects">
                    <div className="hero-blob blob-left"></div>
                    <div className="hero-blob blob-right"></div>
                </div>

                <div className="container">
                    <div className="badge">
                        <span className="badge-dot"></span>
                        The Future of Professional Identity & HRMS
                    </div>

                    <h1 className="hero-title">
                        One Identity.<br />
                        <span>Infinite Possibilities.</span>
                    </h1>

                    <p className="hero-subtitle">
                        <strong>SMARTHR-360</strong> unifies <strong>HRMS</strong>, <strong>Professional Networking</strong>, and <strong>Paperless Vaults</strong> into a single ecosystem.
                        Managing people, building careers, and ensuring trust—all in one place.
                    </p>

                    <div className="flex justify-center gap-6">
                        <Link to="/auth/register">
                            <button className="btn btn-primary">
                                Get Started <ArrowRight size={20} style={{ marginLeft: '10px' }} />
                            </button>
                        </Link>
                        <Link to="/auth/login">
                            <button className="btn btn-outline">
                                Login to Dashboard
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Grid Section */}
            <section className="grid-section">
                <div className="container text-center">
                    <h2 className="section-title" style={{ fontSize: '2.5rem' }}>Why SMARTHR-360?</h2>
                    <p style={{ color: '#a1a1aa', marginBottom: '3rem' }}>
                        Fragmented tools create chaos. We bring everything together.
                    </p>

                    <div className="grid-cols-3">
                        <div className="feature-card">
                            <div className="card-icon"><Building2 /></div>
                            <h3 className="card-title">SaaS HRMS</h3>
                            <p className="card-desc">Complete organization management: Payroll, Recruitment (ATS), Attendance, and Role-based access control.</p>
                        </div>
                        <div className="feature-card">
                            <div className="card-icon" style={{ color: '#22d3ee' }}><Globe /></div>
                            <h3 className="card-title">Professional Network</h3>
                            <p className="card-desc">A LinkedIn-style ecosystem where your work history is verified. Connect, post, and build your reputation.</p>
                        </div>
                        <div className="feature-card">
                            <div className="card-icon" style={{ color: '#e879f9' }}><FileSearch /></div>
                            <h3 className="card-title">Paperless Vault</h3>
                            <p className="card-desc">Digitally signed contracts, salary slips, and experience letters stored forever in your personal vault.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Governance Section */}
            <section className="governance-section">
                <div className="container">
                    <div className="two-col">
                        <div className="col-half">
                            <div className="section-label">
                                <Shield size={16} style={{ marginRight: '8px' }} /> Platform Governance
                            </div>
                            <h2 className="section-title">
                                Enterprise-Grade Control <br />
                                <span style={{ color: '#71717a' }}>for Modern Organizations.</span>
                            </h2>
                            <p style={{ color: '#a1a1aa', fontSize: '1.125rem', marginBottom: '2rem' }}>
                                Our SuperAdmin panel ensures compliance, security, and smooth operations across thousands of organizations.
                            </p>
                            <div className="stat-grid">
                                <div className="stat-box">
                                    <Server size={24} color="#4ade80" style={{ marginBottom: '1rem' }} />
                                    <h4 style={{ fontWeight: 'bold' }}>System Health</h4>
                                    <p style={{ fontSize: '0.875rem', color: '#71717a' }}>Real-time monitoring of API & Database.</p>
                                </div>
                                <div className="stat-box">
                                    <Shield size={24} color="#60a5fa" style={{ marginBottom: '1rem' }} />
                                    <h4 style={{ fontWeight: 'bold' }}>Compliance</h4>
                                    <p style={{ fontSize: '0.875rem', color: '#71717a' }}>KYC verification and automated audit logs.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-half">
                            {/* Mock Dashboard UI via CSS */}
                            <div style={{ background: '#18181b', padding: '2rem', borderRadius: '1rem', border: '1px solid #27272a' }}>
                                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
                                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }}></div>
                                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#eab308' }}></div>
                                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#22c55e' }}></div>
                                </div>
                                <div style={{ height: '200px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '0.5rem', border: '1px dashed #3f3f46', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#71717a' }}>
                                    Analytics Dashboard View
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Reputation Section */}
            <section className="reputation-section">
                <div className="container">
                    <div className="two-col" style={{ flexDirection: 'row-reverse' }}>
                        <div className="col-half">
                            <div className="section-label" style={{ color: '#facc15', borderColor: 'rgba(250, 204, 21, 0.3)', background: 'rgba(250, 204, 21, 0.1)' }}>
                                <Star size={16} fill="#facc15" style={{ marginRight: '8px' }} /> Reputation Engine
                            </div>
                            <h2 className="section-title">Trust is the New Currency.</h2>
                            <p style={{ color: '#a1a1aa', fontSize: '1.125rem', marginBottom: '2rem' }}>
                                Your <strong>SMARTHR-360 Score</strong> is verified proof of your career.
                                Based on Skill Validation, Work Duration, and Peer Reviews.
                            </p>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {['Verified Employment History', 'Skill Validation by Peers', 'Platform Activity Score', 'Endorsements from Managers'].map((item, i) => (
                                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', color: '#d4d4d8' }}>
                                        <CheckCircle size={20} color="#facc15" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="col-half">
                            <div className="reputation-card">
                                <div className="profile-header">
                                    <div className="avatar">
                                        <div className="avatar-inner">JD</div>
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>John Doe</h3>
                                        <p style={{ color: '#a1a1aa' }}>Senior Software Engineer</p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                                            <span style={{ padding: '2px 8px', borderRadius: '4px', background: 'rgba(250, 204, 21, 0.2)', color: '#facc15', fontSize: '12px', fontWeight: 'bold' }}>TOP RATED</span>
                                            <span style={{ color: '#facc15' }}>★★★★★</span>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                    <span style={{ color: '#a1a1aa' }}>Reputation Score</span>
                                    <span style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>850<span style={{ fontSize: '1rem', color: '#52525b' }}>/1000</span></span>
                                </div>
                                <div className="score-bar">
                                    <div className="score-fill"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="pricing-section">
                <div className="container">
                    <div className="text-center" style={{ marginBottom: '4rem' }}>
                        <h2 className="section-title">Transparent Pricing</h2>
                        <p style={{ color: '#a1a1aa' }}>Start free, upgrade as you grow.</p>
                    </div>

                    <div className="grid-cols-3">
                        <PricingCard
                            title="Free Plan"
                            price="$0"
                            features={['Up to 5 Employees', 'Basic Profiles', 'Manual Payroll', 'Community Access']}
                        />
                        <PricingCard
                            title="Pro Plan"
                            price="$49"
                            featured
                            features={['Up to 50 Employees', 'Automated Payroll', 'AI Recruitment (Basic)', 'Verified Badges', 'Priority Support']}
                        />
                        <PricingCard
                            title="Enterprise"
                            price="Custom"
                            features={['Unlimited Employees', 'Full AI Suite', 'Dedicated Account Manager', 'Custom Contracts', 'API Access']}
                        />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer>
                <div className="container">
                    <div className="footer-grid">
                        <div className="footer-col" style={{ gridColumn: 'span 2' }}>
                            <h3>SMARTHR-360</h3>
                            <p>The ultimate platform for modern work. Managing people, building careers, and ensuring trust in one place.</p>
                        </div>
                        <div className="footer-col">
                            <h4>Platform</h4>
                            <ul>
                                <li>Features</li>
                                <li>Pricing</li>
                                <li>Security</li>
                            </ul>
                        </div>
                        <div className="footer-col">
                            <h4>Company</h4>
                            <ul>
                                <li>About Us</li>
                                <li>Careers</li>
                                <li>Contact</li>
                            </ul>
                        </div>
                    </div>
                    <div className="text-center" style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #27272a' }}>
                        &copy; 2026 SMARTHR-360. All rights reserved. Secured by AES-256 Encryption.
                    </div>
                </div>
            </footer>
        </div>
    );
};

const PricingCard = ({ title, price, features, featured }) => (
    <div className={`pricing-card ${featured ? 'featured' : ''}`}>
        {featured && <div style={{ alignSelf: 'flex-end', background: '#8b5cf6', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', marginBottom: '1rem' }}>POPULAR</div>}
        <h3 style={{ fontSize: '1.25rem', color: '#a1a1aa' }}>{title}</h3>
        <div className="price">{price}<span>/mo</span></div>
        <ul className="check-list">
            {features.map((f, i) => (
                <li key={i}>
                    <CheckCircle size={16} color={featured ? "#a78bfa" : "#52525b"} />
                    {f}
                </li>
            ))}
        </ul>
        <Link to="/auth/register" style={{ width: '100%' }}>
            <button className="btn-full">
                {featured ? 'Start Free Trial' : 'Get Started'}
            </button>
        </Link>
    </div>
);

export default HomePage;
