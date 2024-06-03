import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

const TraceurTrie = ({ start_date, end_date }) => {
    
  const handleStartDateChange = useCallback((e) => {
    const startDate = e.target.value;
    start_date(startDate);
  }, [start_date]);

  const handleEndDateChange = useCallback((e) => {
    const endDate = e.target.value;
    end_date(endDate);
  }, [end_date]);

  return (
    <div className="productSelects">
      <div className="productSelects-container">
        <input
          type="date"
          className="product-input-select"
          name="start_date"
          style={{ border: '1px solid #c7c7c7', cursor: 'pointer' }}
          onChange={handleStartDateChange}
        />
        <input
          type="date"
          className="product-input-select"
          name="end_date"
          style={{ border: '1px solid #c7c7c7', cursor: 'pointer' }}
          onChange={handleEndDateChange}
        />
      </div>
    </div>
  );
};

TraceurTrie.propTypes = {
  start_date: PropTypes.func.isRequired,
  end_date: PropTypes.func.isRequired,
};

export default TraceurTrie;
