import React, { useState, useEffect } from 'react';
import { Table, Switch, message, Tag, Input, Typography } from 'antd';
import { EyeOutlined, EditOutlined, PlusCircleOutlined, UnlockOutlined, DeleteOutlined } from '@ant-design/icons';
import { getMenus, getMenusOne } from '../../../../services/menus.service';
import { putPermission } from '../../../../services/permission.service';

const { Text } = Typography;

const PermissionOptionsForm = ({ userId }) => {
  const [options, setOptions] = useState([]);
  const [permissions, setPermissions] = useState({});
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(true);
  const scroll = { x: 'max-content' };
  
  useEffect(() => {
    const fetchOptionsAndPermissions = async () => {
      setLoading(true);
      try {
        const [optionsRes, permissionsRes] = await Promise.all([
          getMenusOne(),
          getMenus(userId)
        ]);

        setOptions(optionsRes.data);
        setLoading(false);

        const perms = {};
        permissionsRes.data.forEach(p => {
          const key = p.submenu_id ? `${p.menus_id}-${p.submenu_id}` : `${p.menus_id}`;
          perms[key] = {
            can_read: p.can_read,
            can_edit: p.can_edit,
            can_delete: p.can_delete,
            can_comment: p.can_comment
          };
        });
        setPermissions(perms);
      } catch (error) {
        message.error('Échec de la récupération des données');
        setLoading(false);
      }
    };

    fetchOptionsAndPermissions();
  }, [userId]);

 const handlePermissionChange = (menuId, submenuId, permType, value) => {

  const key = submenuId ? `${menuId}-${submenuId}` : `${menuId}`;

  // Mettez à jour les permissions pour l'élément en question
  const updatedPermissions = {
    ...permissions,
    [key]: {
      ...permissions[key],
      [permType]: value
    }
  };

  setPermissions(updatedPermissions);

  const finalPermissions = {
    can_read: updatedPermissions[key]?.can_read ?? 0,
    can_edit: updatedPermissions[key]?.can_edit ?? 0,
    can_delete: updatedPermissions[key]?.can_delete ?? 0,
    can_comment: updatedPermissions[key]?.can_comment ?? 0,
  };

  putPermission(userId, menuId, submenuId || null, finalPermissions) // Passer NULL si pas de sous-menu
    .then(() => {
      message.success('Autorisations mises à jour avec succès');
    })
    .catch(() => {
      message.error('Échec de la mise à jour des autorisations');
    });
};

  const columns = [
    { title: "#", dataIndex: "id", key: "id", render: (_, __, index) => index + 1 },
    { title: "Option", dataIndex: "menu_title", key: "menu_title", render: (text) => <Text>{text}</Text> },
    { title: <span style={{ color: '#52c41a' }}>Voir <EyeOutlined /></span>, dataIndex: "can_read", key: "can_read", render: (_, record) => (
      <Switch
        checked={permissions[record.menu_id]?.can_read || false}
        onChange={(value) => handlePermissionChange(record.menu_id, null, "can_read", value ? 1 : 0)}
      />
    )},
    { title: <span style={{ color: '#1890ff' }}>Modifier <EditOutlined /></span>, dataIndex: "can_edit", key: "can_edit", render: (_, record) => (
      <Switch
        checked={permissions[record.menu_id]?.can_edit || false}
        onChange={(value) => handlePermissionChange(record.menu_id, null, "can_edit", value ? 1 : 0)}
      />
    )},
    {
      title: <span style={{ color: '#000' }}>Ajouter <PlusCircleOutlined /></span>,
      dataIndex: 'can_comment',
      key: 'can_comment',
      align: 'center',
      render: (text, record) => (
          <Switch
            checked={permissions[record.menu_id]?.can_comment || false}
            onChange={(value) => handlePermissionChange(record.menu_id, null, 'can_comment', value ? 1 : 0)}
          />
      ),
    },
    { title: <span style={{ color: 'red' }}>Supprimer <DeleteOutlined /></span>, dataIndex: "can_delete", key: "can_delete", render: (_, record) => (
      <Switch
        checked={permissions[record.menu_id]?.can_delete || false}
        onChange={(value) => handlePermissionChange(record.menu_id, null, "can_delete", value ? 1 : 0)}
      />
    )}
  ];

  const expandedRowRender = (menu) => (
    <Table
      columns={[
        { title: "Sous-menu", dataIndex: "submenu_title", key: "submenu_title", render: (text) => <Text>{text}</Text> },
        { title: <span style={{ color: '#52c41a' }}><EyeOutlined /></span>, key: "can_read", render: (_, subRecord) => (
          <Switch
            checked={permissions[`${menu.menu_id}-${subRecord.submenu_id}`]?.can_read || false}
            onChange={(value) => handlePermissionChange(menu.menu_id, subRecord.submenu_id, "can_read", value ? 1 : 0)}
          />
        )},
        { title: <span style={{ color: '#1890ff' }}><EditOutlined /></span>, key: "can_edit", render: (_, subRecord) => (
          <Switch
            checked={permissions[`${menu.menu_id}-${subRecord.submenu_id}`]?.can_edit || false}
            onChange={(value) => handlePermissionChange(menu.menu_id, subRecord.submenu_id, "can_edit", value ? 1 : 0)}
          />
        )},
        {
          title: <span style={{ color: '#000' }}><PlusCircleOutlined /></span>,
          dataIndex: 'can_comment',
          key: 'can_comment',
          align: 'center',
          render: (_, subRecord) => (
              <Switch
              checked={permissions[`${menu.menu_id}-${subRecord.submenu_id}`]?.can_comment || false}
              onChange={(value) => handlePermissionChange(menu.menu_id, subRecord.submenu_id, "can_comment", value ? 1 : 0)}
              />
          ),
        },
        { title: <span style={{ color: 'red' }}><DeleteOutlined /></span>, key: "can_delete", render: (_, subRecord) => (
          <Switch
            checked={permissions[`${menu.menu_id}-${subRecord.submenu_id}`]?.can_delete || false}
            onChange={(value) => handlePermissionChange(menu.menu_id, subRecord.submenu_id, "can_delete", value ? 1 : 0)}
          />
        )}
      ]}
      dataSource={menu.subMenus.filter(sub => sub.submenu_id)}
      rowKey="submenu_id"
      pagination={false}
    />
  );

  const filteredData = options.filter(item =>
    item.menu_title?.toLowerCase().includes(searchValue.toLowerCase())
  );

  const hasSubMenus = (record) => {
    return record.subMenus?.some(sub => sub.submenu_id !== null);
  };

  return (
    <>
        <Table
          dataSource={loading ? [] : filteredData}
          columns={columns}
          rowKey="menu_id"
          expandable={{
            expandedRowRender,
            rowExpandable: record => hasSubMenus(record),
          }}
          scroll={scroll}
          bordered
          pagination={false}
          loading={loading}
          className='table_permission'
        />
    </>
  );
};

export default PermissionOptionsForm;
