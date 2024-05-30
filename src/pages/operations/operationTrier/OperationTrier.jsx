import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { DatePicker } from 'antd';
import './operationTrier.scss';

const { RangePicker } = DatePicker;

const OperationTrier = ({ start_date, end_date }) => {
  const [dates, setDates] = useState([null, null]);

  const handleDateChange = useCallback((dates) => {
    const [startDate, endDate] = dates;
    setDates([startDate, endDate]);
    start_date(startDate ? startDate.format('YYYY-MM-DD') : '');
    end_date(endDate ? endDate.format('YYYY-MM-DD') : '');
  }, [start_date, end_date]);

  return (
    <div className="productSelects">
      <div className="productSelects-container">
        <RangePicker
          className="product-input-select"
          style={{ border: '1px solid #c7c7c7', cursor: 'pointer' }}
          onChange={handleDateChange}
          value={dates}
          format="DD-MM-YYYY"
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
