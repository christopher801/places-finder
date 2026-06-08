// src/components/home/SearchBar.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';

export default function SearchBar({ placeholder = 'Search places…', initialValue = '', onSearch }) {
  const [value, setValue] = useState(initialValue);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) {
      if (onSearch) onSearch(value.trim());
      else navigate(`/search?q=${encodeURIComponent(value.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ position: 'relative', width: '100%' }}>
      <FiSearch style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 18, pointerEvents: 'none' }} />
      <input
        className="pf-input"
        style={{ paddingLeft: 46, paddingRight: 110 }}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={e => setValue(e.target.value)}
      />
      <button
        type="submit"
        className="btn-primary-pf"
        style={{ position: 'absolute', right: 5, top: '50%', transform: 'translateY(-50%)', padding: '8px 18px', fontSize: 13 }}
      >
        Search
      </button>
    </form>
  );
}
