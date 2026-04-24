import React from 'react';
import { Spin, Typography, Select, Tag, Empty } from 'antd';
import { SortAscendingOutlined } from '@ant-design/icons';
import CandidateCard from './CandidateCard';

const { Text } = Typography;
const { Option } = Select;

const CandidateCardsView = ({ 
  candidates, 
  loading, 
  searchTerm, 
  sortBy, 
  onSortChange, 
  filters, 
  onFilterRemove 
}) => {
  return (
    <Spin spinning={loading} description="Fetching candidates...">
      <div className="mt-4">
        <div className="flex justify-between items-center mb-4">
          <Text className="text-slate-500">{candidates.length} candidates found</Text>
          <div className="flex items-center gap-3">
            <Text className="text-slate-400 text-sm font-medium">Sort By:</Text>
            <Select
              defaultValue="new"
              value={sortBy}
              onChange={onSortChange}
              style={{ width: 160 }}
              className="premium-select"
              suffixIcon={<SortAscendingOutlined className="text-primary" />}
            >
              <Option value="new">Recent</Option>
              <Option value="old">Oldest</Option>
              <Option value="a-z">A - Z</Option>
              <Option value="z-a">Z - A</Option>
              <Option value="created">Created At</Option>
            </Select>
          </div>
        </div>

        {/* Active Filters Section */}
        {(filters.skills.length > 0 || filters.roles.length > 0 || filters.locations.length > 0 || filters.statuses.length > 0) && (
          <div className="flex flex-wrap gap-2 mb-6 p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2 self-center">Active Filters:</span>
            {filters.statuses.map(status => (
              <Tag
                key={status}
                closable
                onClose={() => onFilterRemove('statuses', status)}
                className="bg-white border-emerald-200 text-emerald-600 px-3 py-1 rounded-full font-medium"
              >
                {status}
              </Tag>
            ))}
            {filters.skills.map(skill => (
              <Tag
                key={skill}
                closable
                onClose={() => onFilterRemove('skills', skill)}
                className="bg-white border-primary/20 text-primary px-3 py-1 rounded-full font-medium"
              >
                {skill}
              </Tag>
            ))}
            {filters.roles.map(role => (
              <Tag
                key={role}
                closable
                onClose={() => onFilterRemove('roles', role)}
                className="bg-white border-secondary/20 text-secondary px-3 py-1 rounded-full font-medium"
              >
                {role}
              </Tag>
            ))}
            {filters.locations.map(loc => (
              <Tag
                key={loc}
                closable
                onClose={() => onFilterRemove('locations', loc)}
                className="bg-white border-accent/20 text-accent px-3 py-1 rounded-full font-medium"
              >
                {loc}
              </Tag>
            ))}
          </div>
        )}

        <div className="space-y-4">
          {candidates.length > 0 ? (
            candidates.filter(c => c && c._id).map(candidate => (
              <CandidateCard
                key={candidate._id}
                candidate={candidate}
                searchTerm={searchTerm}
              />
            ))
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No matches found"
              className="py-20"
            />
          )}
        </div>
      </div>
    </Spin>
  );
};

export default CandidateCardsView;
