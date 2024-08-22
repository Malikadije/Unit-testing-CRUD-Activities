import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const ActivitySchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required'),
});

function Dashboard() {
  const [activities, setActivities] = useState([]);
  const [newActivity, setNewActivity] = useState({ name: '' });
  const [editingActivity, setEditingActivity] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    const response = await axios.get('http://localhost:5000/api/activities');
    setActivities(response?.data ?? []);
  };

  const handleAdd = async () => {
    const time = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
    await axios.post('http://localhost:5000/api/activities', { ...newActivity, time });
    setNewActivity({ name: '' });
    fetchActivities();
  };

  const handleUpdate = async (values) => {
    const time = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
    values.time = time;
    await axios.put(`http://localhost:5000/api/activities/${editingActivity.id}`, values);
    setEditingActivity(null);
    setIsModalOpen(false);
    fetchActivities();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/activities/${id}`);
    fetchActivities();
  };

  const handleLogout = () => {
    localStorage.removeItem('auth');
    window.location.href = '/login';
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        <button
          onClick={handleLogout}
          className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 flex items-center"
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
          Logout
        </button>
      </div>

      <div className="mb-6">
        <div className="mb-4 flex gap-4">
          <input
            type="text"
            placeholder="Activity Name"
            value={newActivity.name}
            onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })}
            className="p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAdd}
            className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-400 flex items-center"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Add Activity
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg border border-gray-200">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Kegiatan</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Waktu</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {activities.map((activity) => (
                <tr key={activity.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{activity.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{activity.time}</td>
                  <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                    <button
                      onClick={() => {
                        setEditingActivity(activity);
                        setIsModalOpen(true);
                      }}
                      className="bg-yellow-500 text-white px-4 py-2 rounded shadow hover:bg-yellow-400 flex items-center"
                    >
                      <FontAwesomeIcon icon={faEdit} className="mr-2" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(activity.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-400 flex items-center"
                    >
                      <FontAwesomeIcon icon={faTrash} className="mr-2" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {activities.length === 0 && (
          <p className="text-gray-500 text-center" style={{padding:'20px'}}>No activities found.</p>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50"
          style={{
            padding:'20px',
            alignItems:'flex-start',
            background:'#0000004f'
          }}
        >
          <div className="bg-white p-6 rounded shadow-lg w-80">
            <h3 className="text-lg font-semibold mb-4">Edit Activity</h3>
            <Formik
              initialValues={{ name: editingActivity.name }}
              validationSchema={ActivitySchema}
              onSubmit={(values) => handleUpdate({ ...values, id: editingActivity.id})}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Kegiatan</label>
                    <Field
                      type="text"
                      name="name"
                      className="p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                    />
                    <ErrorMessage name="name" component="div" className="text-red-600 text-sm mt-1" />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="bg-gray-500 text-white px-4 py-2 rounded shadow hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-yellow-500 text-white px-4 py-2 rounded shadow hover:bg-yellow-400"
                    >
                      Update
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
