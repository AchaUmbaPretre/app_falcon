
 export const getTabStyle = (key, activeKey) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    color: activeKey === key ? '#1677ff' : 'rgba(0,0,0,0.65)',
    fontWeight: activeKey === key ? 600 : 400,
    transition: 'color 0.3s ease',
  });

export const iconStyle = (key, activeKey) => ({
    fontSize: 18,
    color: activeKey === key ? '#1677ff' : 'rgba(0,0,0,0.45)',
    transform: activeKey === key ? 'scale(1.15)' : 'scale(1)',
    transition: 'transform 0.3s ease, color 0.3s ease',
  });