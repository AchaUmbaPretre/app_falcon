import React from 'react';
import { Typography } from 'antd';
import './scrollText.css';

const { Text } = Typography;

const ScrollText = ({username}) => {
  return (
    <div className="scrolling-container">
      <div className="scrolling-text">
        <Text className="scrolling-text-content">BIENVENUE A L'APPLICATION FALCON MR {username.toUpperCase()} </Text>
      </div>
    </div>
  );
};

export default ScrollText;
