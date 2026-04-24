import React from 'react';
import { Input, Typography } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Search } = Input;

const SearchHeader = ({ searchTerm, onSearchChange, onSearch, loading }) => {
  return (
    <header className="py-12 mb-8 bg-white border-b border-slate-200 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />

      <div className="container text-center relative z-10 animate-in">
        <h1 className="text-5xl font-extrabold mb-4 premium-gradient-text tracking-tight">
          Talent Tracker
        </h1>
        <p className="text-slate-500 text-lg mb-8 max-w-2xl mx-auto font-medium">
          Streamline your recruitment process with intelligent search and real-time filtering.
        </p>
        <div className="max-w-3xl mx-auto px-4 relative">
          <Search
            placeholder="Search by name, role, or email..."
            allowClear
            enterButton={
              <span className="px-4 font-bold">Find Candidates</span>
            }
            size="large"
            value={searchTerm}
            onChange={onSearchChange}
            onSearch={onSearch}
            loading={loading}
            className="shadow-2xl rounded-2xl overflow-hidden premium-search"
            prefix={<SearchOutlined className="text-primary text-xl mr-2" />}
          />
          
          {searchTerm && (
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 animate-pulse">
              <div className={`w-2 h-2 rounded-full ${loading ? 'bg-amber-400' : 'bg-green-500'}`} />
              {loading ? 'Searching live...' : 'Live Results Ready'}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default SearchHeader;
