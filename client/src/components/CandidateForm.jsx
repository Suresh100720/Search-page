import React, { useEffect, useState } from 'react';
import { Form, Input, Select, InputNumber, Button, message, Modal } from 'antd';
import { ROLES, LOCATIONS, SKILLS } from '../constants';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { Option } = Select;
const { confirm } = Modal;

const CandidateForm = ({ onFinish, loading, initialValues, onCancel }) => {
  const [form] = Form.useForm();
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
      setIsDirty(false);
    } else {
      form.resetFields();
      setIsDirty(false);
    }
  }, [initialValues, form]);

  const handleSubmit = (values) => {
    onFinish(values, () => {
      form.resetFields();
      setIsDirty(false);
    });
  };

  const handleCancel = () => {
    if (isDirty) {
      confirm({
        title: 'Discard changes?',
        icon: <ExclamationCircleOutlined />,
        content: 'You have unsaved changes. Are you sure you want to close the form?',
        okText: 'Discard',
        cancelText: 'Keep Editing',
        centered: true,
        onOk() {
          onCancel();
        },
      });
    } else {
      onCancel();
    }
  };

  return (
    <div className={`bg-white rounded-3xl p-8 ${!initialValues ? 'shadow-sm border border-slate-100' : ''} max-w-4xl mx-auto`}>
      {!initialValues && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Add Candidate</h2>
          <p className="text-slate-500">Enter the details of the new candidate to add them to the tracker.</p>
        </div>
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        onValuesChange={() => setIsDirty(true)}
        initialValues={initialValues || { status: 'Applied' }}
        className="premium-form"
      >
        <div className="row">
          <div className="col-md-6 mb-3">
            <Form.Item
              name="name"
              label={<span className="text-slate-600 font-semibold">Full Name</span>}
              rules={[{ required: true, message: 'Please enter name' }]}
            >
              <Input placeholder="John Doe" size="large" className="rounded-xl border-slate-200" />
            </Form.Item>
          </div>

          <div className="col-md-6 mb-3">
            <Form.Item
              name="email"
              label={<span className="text-slate-600 font-semibold">Email Address</span>}
              rules={[{ required: true, type: 'email', message: 'Please enter valid email' }]}
            >
              <Input placeholder="john@example.com" size="large" className="rounded-xl border-slate-200" />
            </Form.Item>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <Form.Item
              name="role"
              label={<span className="text-slate-600 font-semibold">Target Role</span>}
              required={false}
              rules={[{ required: false }]}
            >
              <Select placeholder="Select Role" size="large" className="rounded-xl">
                {ROLES.map(role => <Option key={role} value={role}>{role}</Option>)}
              </Select>
            </Form.Item>
          </div>

          <div className="col-md-6 mb-3">
            <Form.Item
              name="location"
              label={<span className="text-slate-600 font-semibold">Location</span>}
              required={false}
              rules={[{ required: false }]}
            >
              <Select placeholder="Select Location" size="large" className="rounded-xl">
                {LOCATIONS.map(loc => <Option key={loc} value={loc}>{loc}</Option>)}
              </Select>
            </Form.Item>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <Form.Item
              name="experience"
              label={<span className="text-slate-600 font-semibold">Years of Experience</span>}
              required={false}
              rules={[{ required: false }]}
            >
              <InputNumber min={0} style={{ width: '100%' }} size="large" className="rounded-xl border-slate-200" />
            </Form.Item>
          </div>

          <div className="col-md-6 mb-3">
            <Form.Item
              name="status"
              label={<span className="text-slate-600 font-semibold">Application Status</span>}
            >
              <Select size="large" className="rounded-xl">
                <Option value="Applied">Applied</Option>
                <Option value="Interviewing">Interviewing</Option>
                <Option value="Hired">Hired</Option>
                <Option value="Rejected">Rejected</Option>
              </Select>
            </Form.Item>
          </div>
        </div>

        <Form.Item
          name="skills"
          label={<span className="text-slate-600 font-semibold">Skills & Expertise</span>}
          required={false}
          rules={[{ required: false }]}
        >
          <Select
            mode="multiple"
            placeholder="Select skills..."
            style={{ width: '100%' }}
            size="large"
            className="rounded-xl"
          >
            {SKILLS.map(skill => (
              <Option key={skill} value={skill}>{skill}</Option>
            ))}
          </Select>
        </Form.Item>

        <div className="mt-8 flex gap-4">
          {initialValues && (
            <Button
              size="large"
              onClick={handleCancel}
              className="h-14 rounded-xl text-lg font-bold flex-1"
            >
              Cancel
            </Button>
          )}
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            size="large"
            className={`h-14 rounded-xl text-lg font-bold shadow-md hover:shadow-lg transition-all ${initialValues ? 'flex-1' : 'w-full'}`}
          >
            {initialValues ? 'Update Candidate' : 'Add Candidate'}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default CandidateForm;
