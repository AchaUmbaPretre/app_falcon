import React, { useMemo } from 'react';
import { Table, Skeleton, Empty } from 'antd';
import { getUserTableColumns } from './UserTableColumns';

export const UserTable = ({ users, loading, onViewUser }) => {
    const columns = useMemo(
        () => getUserTableColumns({ onViewUser }),
        [onViewUser]
    );
    
    if (loading) {
        return <Skeleton active paragraph={{ rows: 5 }} />;
    }
    
    return (
        <Table 
            dataSource={users}
            columns={columns}
            rowKey="id"
            pagination={{ 
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} utilisateurs`
            }}
            locale={{ emptyText: <Empty description="Aucun utilisateur trouvé" /> }}
        />
    );
};