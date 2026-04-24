import React, { useState, useEffect } from 'react';
import { App as AntdApp, Tabs, ConfigProvider, Modal } from 'antd';
import { TableOutlined, IdcardOutlined, UserAddOutlined } from '@ant-design/icons';
import { useCandidates } from './hooks/useCandidates';

// Components
import FacetFilters from './components/FacetFilters';
import CandidateGrid from './components/CandidateGrid';
import CandidateForm from './components/CandidateForm';
import SearchHeader from './components/SearchHeader';
import CandidateCardsView from './components/CandidateCardsView';

const App = () => {
  const {
    candidates,
    facets,
    loading,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    sortBy,
    setSortBy,
    fetchCandidates,
    debouncedSearchTerm,
    addCandidate,
    updateCandidate,
    deleteCandidate,
    deleteMultipleCandidates
  } = useCandidates();

  const [activeTab, setActiveTab] = useState('cards');
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);



  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  const handleFilterChange = (type, values) => {
    const newFilters = { ...filters, [type]: values };
    setFilters(newFilters);
  };

  const handleFilterRemove = (type, value) => {
    const newValues = filters[type].filter(v => v !== value);
    handleFilterChange(type, newValues);
  };

  const clearAllFilters = () => {
    const resetFilters = { skills: [], roles: [], locations: [], statuses: [] };
    setFilters(resetFilters);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
  };

  const handleEdit = (candidate) => {
    setEditingCandidate(candidate);
    setIsEditModalVisible(true);
  };

  const handleUpdateCandidate = async (values) => {
    if (!editingCandidate?._id) return;
    const success = await updateCandidate(editingCandidate._id, values);
    if (success) {
      setIsEditModalVisible(false);
      setEditingCandidate(null);
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#6366f1',
          borderRadius: 8,
        },
      }}
    >
      <AntdApp>
        <div className="min-h-screen pb-12">
          {/* Edit Modal */}
          <Modal
            title={<span className="text-xl font-bold">Edit Candidate</span>}
            open={isEditModalVisible}
            onCancel={() => setIsEditModalVisible(false)}
            footer={null}
            width={800}
            centered
            className="premium-modal"
            destroyOnHidden
          >
            <div className="pt-4">
              <CandidateForm
                initialValues={editingCandidate}
                onFinish={handleUpdateCandidate}
                onCancel={() => setIsEditModalVisible(false)}
                loading={loading}
              />
            </div>
          </Modal>

          <SearchHeader 
            searchTerm={searchTerm} 
            onSearchChange={handleSearchChange}
            onSearch={(val) => fetchCandidates(val, filters, sortBy)}
            loading={loading}
          />

          <main className="container">
            <div className="row g-4">
              <aside className="col-12 col-lg-3">
                <div className="sticky-top-fixed">
                  <FacetFilters
                    facets={facets}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onClearAll={clearAllFilters}
                  />
                </div>
              </aside>

              <section className="col-12 col-lg-9">
                <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
                  <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    className="premium-tabs"
                    items={[
                      {
                        key: 'cards',
                        label: <span className="flex items-center gap-2"><IdcardOutlined /> Results</span>,
                        children: (
                          <CandidateCardsView 
                            candidates={candidates}
                            loading={loading}
                            searchTerm={searchTerm}
                            sortBy={sortBy}
                            onSortChange={handleSortChange}
                            filters={filters}
                            onFilterRemove={handleFilterRemove}
                          />
                        )
                      },
                      {
                        key: 'grid',
                        label: <span className="flex items-center gap-2"><TableOutlined /> Data Table</span>,
                        children: (
                          <div className="mt-4">
                            <CandidateGrid
                              candidates={candidates}
                              searchTerm={searchTerm}
                              onEdit={handleEdit}
                              onDelete={deleteCandidate}
                              onDeleteMultiple={deleteMultipleCandidates}
                            />
                          </div>
                        )
                      },
                      {
                        key: 'add',
                        label: <span className="flex items-center gap-2"><UserAddOutlined /> Add Candidate</span>,
                        children: (
                          <div className="mt-4">
                            <CandidateForm
                              onFinish={addCandidate}
                              loading={loading}
                            />
                          </div>
                        )
                      }
                    ]}
                  />
                </div>
              </section>
            </div>
          </main>
        </div>
      </AntdApp>
    </ConfigProvider>
  );
};

export default App;
