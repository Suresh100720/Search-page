import React from 'react';
import { Tag, Typography, Space, Avatar } from 'antd';
import { EnvironmentOutlined, MailOutlined, RocketOutlined, UserOutlined } from '@ant-design/icons';
import HighlightText from './HighlightText';

const { Text } = Typography;

const CandidateCard = ({ candidate, searchTerm }) => {
  const getStatusClasses = (status) => {
    switch (status.toLowerCase()) {
      case 'hired': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'rejected': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'shortlisted': return 'bg-amber-50 text-amber-600 border-amber-100';
      default: return 'bg-blue-50 text-blue-600 border-blue-100';
    }
  };
  const getCardBg = (status) => {
    switch (status?.toLowerCase()) {
      case 'hired': return 'bg-emerald-50 border-emerald-100';
      case 'rejected': return 'bg-rose-50 border-rose-100';
      case 'interviewing': return 'bg-amber-50 border-amber-100';
      default: return 'bg-slate-50 border-slate-200/60';
    }
  };

  return (
    <div className={`${getCardBg(candidate.status)} rounded-3xl p-6 border transition-all duration-300 hover:shadow-lg hover:border-primary/40 animate-in`}>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-shrink-0">
          <Avatar
            size={72}
            icon={<UserOutlined />}
            className="bg-slate-50 text-primary border border-slate-100 shadow-inner"
          />
        </div>

        <div className="flex-grow">
          <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
            <div>
              <h4 className="text-xl font-bold text-slate-800 m-0">
                <HighlightText text={candidate.name} highlight={searchTerm} />
              </h4>
              <p className="text-slate-500 font-medium m-0">
                <HighlightText text={candidate.role} highlight={searchTerm} />
              </p>
            </div>
            <div className={`px-3 py-1 rounded-lg border text-xs font-bold uppercase tracking-wider ${getStatusClasses(candidate.status)}`}>
              {candidate.status}
            </div>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 mb-6">
            <span className="flex items-center text-sm text-slate-500">
              <MailOutlined className="mr-2 text-slate-300" />
              {candidate.email}
            </span>
            <span className="flex items-center text-sm text-slate-500">
              <EnvironmentOutlined className="mr-2 text-slate-300" />
              <HighlightText text={candidate.location} highlight={searchTerm} />
            </span>
            <span className="flex items-center text-sm text-slate-500">
              <RocketOutlined className="mr-2 text-slate-300" />
              {candidate.experience} Years Exp.
            </span>
          </div>

          <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-50">
            {candidate.skills?.map(skill => (
              <span
                key={skill}
                className="bg-indigo-50 text-indigo-600 text-xs font-semibold px-3 py-1.5 rounded-lg border border-indigo-100/50"
              >
                <HighlightText text={skill} highlight={searchTerm} />
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateCard;
