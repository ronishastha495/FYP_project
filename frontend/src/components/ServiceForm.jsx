import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addService } from '../redux/features/serviceSlice';

const ServiceForm = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addService({ ...formData, price: parseFloat(formData.price) }))
      .unwrap()
      .then(() => {
        setFormData({ title: '', description: '', price: '' });
        alert('Service added successfully!');
      })
      .catch((error) => alert('Error adding service: ' + error.message));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-gray-700 mb-1">Service Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
          required
        />
      </div>
      <div>
        <label className="block text-gray-700 mb-1">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
          required
        />
      </div>
      <div>
        <label className="block text-gray-700 mb-1">Price (NPR)</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
          required
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
      >
        Add Service
      </button>
    </form>
  );
};

export default ServiceForm;