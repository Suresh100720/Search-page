import React, { useState, useMemo } from 'react';
import { Checkbox, Typography } from 'antd';
import { EnvironmentOutlined, UserOutlined, RocketOutlined, DownOutlined, TagOutlined } from '@ant-design/icons';
import { ROLES, LOCATIONS, SKILLS, STATUSES } from '../constants';

const { Text } = Typography;

const FacetSection = ({ title, icon, options, selected, onChange, allOptions }) => {
  const [expanded, setExpanded] = useState(false);

  // Merge counts from backend facets with the master list from constants
  const displayOptions = useMemo(() => {
    return allOptions.map(opt => ({
      _id: opt,
      count: options?.find(o => o._id === opt)?.count || 0
    })).sort((a, b) => b.count - a.count);
  }, [options, allOptions]);

  return (
    <div className="mb-6 last:mb-0">
      <div 
        className="flex justify-between items-center cursor-pointer p-2 hover:bg-slate-50 rounded-xl transition-all"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <span className="text-primary flex items-center">{icon}</span>
          <span className="font-bold text-slate-700">{title}</span>
        </div>
        <DownOutlined className={`text-slate-400 text-xs transition-transform duration-300 ${expanded ? '' : '-rotate-90'}`} />
      </div>

      <div className={`overflow-hidden transition-all duration-300 ${expanded ? 'max-h-[300px] opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
        <div className="flex flex-col gap-1 pl-2 pr-2 custom-scrollbar overflow-y-auto max-h-[280px]">
          {displayOptions.map((option) => (
            <div 
              key={option._id}
              className={`flex justify-between items-center p-2 rounded-xl cursor-pointer transition-all ${
                selected.includes(option._id) 
                  ? 'bg-primary/10 text-primary border border-primary/20' 
                  : 'hover:bg-slate-50 text-slate-600 border border-transparent'
              }`}
              onClick={() => {
                const newSelected = selected.includes(option._id)
                  ? selected.filter((s) => s !== option._id)
                  : [...selected, option._id];
                onChange(newSelected);
              }}
            >
              <div className="flex items-center gap-3">
                <Checkbox 
                  checked={selected.includes(option._id)} 
                  className="pointer-events-none"
                />
                <span className="text-sm font-medium">{option._id}</span>
              </div>
              {option.count > 0 && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  selected.includes(option._id) ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {option.count}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const FacetFilters = ({ facets, filters, onFilterChange, onClearAll }) => {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800">Filters</h2>
        {(filters.skills?.length > 0 || filters.roles?.length > 0 || filters.locations?.length > 0 || filters.statuses?.length > 0) && (
          <Text 
            className="text-primary text-xs font-bold cursor-pointer hover:underline"
            onClick={onClearAll}
          >
            Clear All
          </Text>
        )}
      </div>
      
      <div className="max-h-[calc(100vh-200px)] overflow-y-auto pr-1 custom-scrollbar">
        <FacetSection
          title="Skills"
          icon={<RocketOutlined />}
          options={facets?.skills}
          selected={filters.skills}
          onChange={(val) => onFilterChange('skills', val)}
          allOptions={SKILLS}
        />
        
        <div className="h-px bg-slate-100 my-4" />

        <FacetSection
          title="Status"
          icon={<TagOutlined />}
          options={facets?.statuses}
          selected={filters.statuses}
          onChange={(val) => onFilterChange('statuses', val)}
          allOptions={STATUSES}
        />
        
        <div className="h-px bg-slate-100 my-4" />

        <FacetSection
          title="Roles"
          icon={<UserOutlined />}
          options={facets?.roles}
          selected={filters.roles}
          onChange={(val) => onFilterChange('roles', val)}
          allOptions={ROLES}
        />
        
        <div className="h-px bg-slate-100 my-4" />

        <FacetSection
          title="Locations"
          icon={<EnvironmentOutlined />}
          options={facets?.locations}
          selected={filters.locations}
          onChange={(val) => onFilterChange('locations', val)}
          allOptions={LOCATIONS}
        />
      </div>
    </div>
  );
};

export default FacetFilters;
