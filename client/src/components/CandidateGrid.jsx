import React, { useMemo, useState } from 'react';
import AgGridTable from './AgGridTable';
import HighlightText from './HighlightText';
import { MoreOutlined, DeleteOutlined, DownloadOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, Button, Modal, Space, Typography } from 'antd';

const { Text } = Typography;
const { confirm } = Modal;

const CandidateGrid = ({ candidates, searchTerm, onEdit, onDelete, onDeleteMultiple }) => {
  const [selectedRows, setSelectedRows] = useState([]);

  const showDeleteConfirm = (candidate) => {
    confirm({
      title: 'Are you sure you want to delete this candidate?',
      icon: <ExclamationCircleOutlined className="text-rose-500" />,
      content: `This will permanently remove ${candidate.name} from the tracker.`,
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'No',
      centered: true,
      onOk() {
        onDelete(candidate._id);
      },
    });
  };

  const showDeleteMultipleConfirm = () => {
    confirm({
      title: `Are you sure you want to delete ${selectedRows.length} candidates?`,
      icon: <ExclamationCircleOutlined className="text-rose-500" />,
      content: 'This action cannot be undone.',
      okText: 'Yes, Delete All',
      okType: 'danger',
      cancelText: 'No',
      centered: true,
      onOk() {
        onDeleteMultiple(selectedRows.map(r => r._id));
        setSelectedRows([]);
      },
    });
  };

  const handleExport = () => {
    const dataToExport = selectedRows.length > 0 ? selectedRows : candidates;
    const csvContent = "data:text/csv;charset=utf-8,"
      + ["Name,Email,Role,Status,Experience,Location"].join(",") + "\n"
      + dataToExport.map(c => [c.name, c.email, c.role, c.status, c.experience, c.location].join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `candidates_export_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columnDefs = useMemo(() => [
    {
      headerName: 'Name',
      field: 'name',
      cellRenderer: (params) => (
        <div className="flex items-center gap-3 h-full">
          <Avatar
            size={32}
            className="bg-primary/10 text-primary font-bold text-xs"
          >
            {params.value?.charAt(0).toUpperCase()}
          </Avatar>
          <span className="font-semibold text-slate-700">
            <HighlightText text={params.value} highlight={searchTerm} />
          </span>
        </div>
      ),
      flex: 1.2,
      minWidth: 200
    },
    {
      headerName: 'Email',
      field: 'email',
      cellRenderer: (params) => (
        <span className="text-slate-500 font-medium">
          {params.value}
        </span>
      ),
      flex: 1.5,
      minWidth: 250
    },
    {
      headerName: 'Role',
      field: 'role',
      cellRenderer: (params) => (
        <span className="text-slate-600">
          <HighlightText text={params.value} highlight={searchTerm} />
        </span>
      ),
      flex: 1.2,
      minWidth: 180
    },
    {
      headerName: 'Status',
      field: 'status',
      cellRenderer: (params) => {
        const status = params.value?.toLowerCase();
        let color = 'text-blue-500';
        if (status === 'hired') color = 'text-emerald-500';
        else if (status === 'rejected') color = 'text-rose-500';
        else if (status === 'interviewing') color = 'text-amber-500';

        return <span className={`font-bold ${color}`}>{params.value}</span>;
      },
      width: 130
    },
    {
      headerName: 'Experience',
      field: 'experience',
      cellRenderer: (params) => (
        <span className="text-slate-500">
          {params.value} {params.value === 1 ? 'Year' : 'Years'}
        </span>
      ),
      width: 140
    },
    {
      headerName: 'Skills',
      field: 'skills',
      cellRenderer: (params) => (
        <div className="flex flex-wrap gap-1 items-center h-full">
          {params.value?.map(skill => (
            <span key={skill} className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded leading-none">
              <HighlightText text={skill} highlight={searchTerm} />
            </span>
          ))}
        </div>
      ),
      flex: 1.5,
      minWidth: 200
    },
    {
      headerName: 'Location',
      field: 'location',
      cellRenderer: (params) => (
        <span className="text-slate-600">
          <HighlightText text={params.value} highlight={searchTerm} />
        </span>
      ),
      flex: 1,
      minWidth: 150
    },
    {
      headerName: 'Actions',
      field: 'actions',
      cellRenderer: (params) => (
        <div className="flex items-center justify-center h-full py-2">
          <Dropdown
            menu={{
              items: [
                { key: 'edit', label: 'Edit', icon: <EditOutlined />, onClick: () => onEdit(params.data) },
                { key: 'delete', label: 'Delete', icon: <DeleteOutlined />, danger: true, onClick: () => showDeleteConfirm(params.data) }
              ]
            }}
            trigger={['click']}
          >
            <MoreOutlined className="text-slate-400 cursor-pointer hover:text-primary text-xl" />
          </Dropdown>
        </div>
      ),
      width: 80,
      pinned: 'right',
      sortable: false,
      filter: false
    }
  ], [searchTerm, onEdit]);

  return (
    <div className="space-y-4">
      {selectedRows.length > 0 && (
        <div className="flex justify-between items-center bg-primary/5 p-4 rounded-2xl border border-primary/10 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center font-bold">
              {selectedRows.length}
            </div>
            <div>
              <Text className="font-bold block">Items Selected</Text>
              <Text className="text-xs text-slate-500">Perform bulk actions on selected candidates</Text>
            </div>
          </div>
          <Space>
            <Button
              icon={<DownloadOutlined />}
              onClick={handleExport}
              className="rounded-xl border-slate-200"
            >
              Export Selected
            </Button>
            <Button
              danger
              type="primary"
              icon={<DeleteOutlined />}
              onClick={showDeleteMultipleConfirm}
              className="rounded-xl shadow-md shadow-rose-200"
            >
              Delete Selected
            </Button>
          </Space>
        </div>
      )}

      <AgGridTable
        rowData={candidates}
        columnDefs={columnDefs}
        paginationPageSize={10}
        enableCheckboxes={true}
        onSelectionChanged={setSelectedRows}
      />
    </div>
  );
};

export default CandidateGrid;
