import React, { useMemo } from "react";
import { Table, Skeleton, Empty } from "antd";
import { getPermVehiculeTableColumns } from "./PermVehiculeTableColumns";

export const PermVehiculeTable = ({ 
  clients, 
  loading, 
  onViewUser,
  handleCopy = (text) => navigator.clipboard.writeText(text),
  currentPage = 1,
  pageSize = 10,
  total = 0,
  onPageChange,
  onShowSizeChange
}) => {
  const columns = useMemo(
    () => getPermVehiculeTableColumns({ 
      onViewUser, 
      handleCopy
    }),
    [onViewUser, handleCopy]
  );

  if (loading) {
    return <Skeleton active paragraph={{ rows: 5 }} />;
  }

  return (
    <Table 
      dataSource={clients}
      columns={columns}
      rowKey="id_client"
      bordered
      locale={{ emptyText: <Empty description="Aucun utilisateur trouvé" /> }}
    />
  );
};