import { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";

function ProfileMenu({ user, onLogout, onProfile }) {
  const [open, setOpen] = useState(false);
  const handleMenu = () => setOpen(o => !o);
  const handleProfile = () => {
    setOpen(false);
    onProfile();
  };
  const handleLogout = () => {
    setOpen(false);
    onLogout();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (open && !event.target.closest('.profile-menu-container')) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={handleMenu}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          margin: 0,
          outline: 'none',
        }}
        aria-label="Profile menu"
      >
        <FaUserCircle size={38} color=" #4a4e69" />
      </button>
      {open && (
        <div style={{
          position: 'absolute',
          top: 44,
          right: 0,
          background: '#fff',
          borderRadius: 12,
          boxShadow: '0 4px 16px rgba(60,60,120,0.13)',
          minWidth: 180,
          padding: '0.5rem 0',
          zIndex: 100,
          border: '1px solid #e3e6f0',
        }} className="profile-menu-container">
          <div style={{ padding: '0.75rem 1.25rem', color: '#3f3d56', fontWeight: 600, borderBottom: '1px solid #f0f0f0' }}>
            {user.name || 'User'}
          </div>
          <button
            onClick={handleProfile}
            style={{
              width: '100%',
              background: 'none',
              border: 'none',
              color: '#4a4e69',
              fontWeight: 500,
              fontSize: '1rem',
              textAlign: 'left',
              padding: '0.75rem 1.25rem',
              cursor: 'pointer',
              borderBottom: '1px solid #f0f0f0',
              transition: 'background 0.15s',
            }}
          >
            👤 Profile
          </button>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              background: 'none',
              border: 'none',
              color: '#c0392b',
              fontWeight: 500,
              fontSize: '1rem',
              textAlign: 'left',
              padding: '0.75rem 1.25rem',
              cursor: 'pointer',
              transition: 'background 0.15s',
            }}
          >
            🚪 Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default ProfileMenu;