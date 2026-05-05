import React from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAuth } from '../../auth/hooks/useAuth';
import '../layout.scss';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { handleLogout, user } = useAuth();

    const onLogout = async () => {
        await handleLogout();
        navigate('/login');
    };

    const navItems = [
        { name: 'Home', path: '/feed', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={location.pathname === '/feed' ? "currentColor" : "none"} stroke="currentColor" strokeWidth={location.pathname === '/feed' ? "0" : "2"} strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
        )},
        { name: 'People', path: '/people', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={location.pathname === '/people' ? "currentColor" : "none"} stroke="currentColor" strokeWidth={location.pathname === '/people' ? "0" : "2"} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="7" r="4"></circle><path d="M5.5 21v-2a4 4 0 0 1 4-4h5a4 4 0 0 1 4 4v2"></path></svg>
        )},
        { name: 'Requests', path: '/follow-requests', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={location.pathname === '/follow-requests' ? "currentColor" : "none"} stroke="currentColor" strokeWidth={location.pathname === '/follow-requests' ? "0" : "2"} strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
        )},
        { name: 'Create', path: '/create-post', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={location.pathname === '/create-post' ? "currentColor" : "none"} stroke="currentColor" strokeWidth={location.pathname === '/create-post' ? "0" : "2"} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
        )},
        { name: 'Profile', path: '/profile', icon: user?.profileImage ? (
            <img src={user.profileImage} alt="Profile" className={`sidebar-profile-img ${location.pathname === '/profile' ? 'active' : ''}`} />
        ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={location.pathname === '/profile' ? "currentColor" : "none"} stroke="currentColor" strokeWidth={location.pathname === '/profile' ? "0" : "2"} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
        )}
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-logo" onClick={() => navigate('/feed')}>
                <span className="logo-text">Insta</span>
                <span className="logo-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </span>
            </div>

            <nav className="sidebar-nav">
                {navItems.map((item) => (
                    <div 
                        key={item.name} 
                        className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                        onClick={() => navigate(item.path)}
                    >
                        <div className="nav-icon">{item.icon}</div>
                        <span className="nav-label">{item.name}</span>
                    </div>
                ))}
            </nav>

            <div className="sidebar-bottom">
                <div className="nav-item" onClick={onLogout}>
                    <div className="nav-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                    </div>
                    <span className="nav-label">Log out</span>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
