import React, { useMemo } from "react";
import { Table, Skeleton, Empty } from "antd";
import { getPermVehiculeTableColumns } from "./PermVehiculeTableColumns";

export const PermVehiculeTable = ({ 
  clients, 
  loading, 
  onViewUser, 
  handleCopy,
  pagination,
  onChange 
}) => {
  const columns = useMemo(
    () => getPermVehiculeTableColumns({ 
      onViewUser, 
      handleCopy, 
      pagination 
    }),
    [onViewUser, handleCopy, pagination]
  );

  if (loading) {
    return <Skeleton active paragraph={{ rows: 5 }} />;
  }

  return (
    <Table 
      dataSource={clients}
      columns={columns}
      rowKey="id"
      bordered
      pagination={{ 
        pageSize: 10,
        current: pagination?.current || 1,
        showSizeChanger: true,
        showTotal: (total) => `Total ${total} utilisateurs`,
        onChange: onChange
      }}
      locale={{ emptyText: <Empty description="Aucun utilisateur trouvé" /> }}
    />
  );
};