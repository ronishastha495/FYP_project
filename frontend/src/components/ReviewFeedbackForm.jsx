import React, { useState } from 'react';

const ReviewFeedbackForm = ({ reviewId, onSubmit }) => {
  const [feedback, setFeedback] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(feedback);
    setFeedback('');
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2">
      <label className="block text-gray-700 mb-1">Your Feedback</label>
      <textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        className="w-full p-2 border rounded-lg"
        placeholder="Write your feedback..."
        required
      />
      <button
        type="submit"
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
      >
        Submit Feedback
      </button>
    </form>
  );
};

export default ReviewFeedbackForm;