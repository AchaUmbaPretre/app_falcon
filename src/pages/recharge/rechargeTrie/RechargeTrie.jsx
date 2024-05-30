import React from 'react';

const RechargeTrie = ({start_date,end_date}) => {
    

    const handleStartDateChange = (e) => {
      const startDate = e.target.value;
      start_date(startDate)
    };
  
    const handleEndDateChange = (e) => {
      const endDate = e.target.value;
      end_date(endDate)
    };

  return (
    <>
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

    </>
  )
}

export default RechargeTrie