import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import './operationTrier.scss';

const OperationTrier = ({ start_date, end_date }) => {
  const [dates, setDates] = useState({ start_date: '', end_date: '' });

  const handleStartDateChange = useCallback((e) => {
    const startDate = e.target.value;
    setDates((prev) => ({ ...prev, start_date: startDate }));
    start_date(startDate);
  }, [start_date]);

  const handleEndDateChange = useCallback((e) => {
    const endDate = e.target.value;
    setDates((prev) => ({ ...prev, end_date: endDate }));
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
          value={dates.start_date}
        />
        <input
          type="date"
          className="product-input-select"
          name="end_date"
          style={{ border: '1px solid #c7c7c7', cursor: 'pointer' }}
          onChange={handleEndDateChange}
          value={dates.end_date}
        />
      </div>
    </div>
  );
};

OperationTrier.propTypes = {
  start_date: PropTypes.func.isRequired,
  end_date: PropTypes.func.isRequired,
};

export default OperationTrier;
