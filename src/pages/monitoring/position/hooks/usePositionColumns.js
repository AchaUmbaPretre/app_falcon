import { useMemo, useRef, useState } from "react"
import {  Tooltip, Tag, Typography } from 'antd';
import {
  CarOutlined,
} from "@ant-design/icons";
import getColumnSearchProps from "../../../../utils/columnSearchUtils";
import { VehicleAddress } from "../../../../utils/vehicleAddress";
import { getDirection, getEngineStatus, getEngineTag, getOdometer, statusDeviceMap } from "../../../../utils/getOdometer";
import { formatStopDuration } from "../../../../utils/formatDuration";
import moment from "moment";

const { Text } = Typography;


export const usePositionColumns = ({columnsVisibility, pagination}) => {
    const searchInput = useRef(null);
    const [searchText, setSearchText] = useState('');

    return useMemo(() => 
        [
            { title: '#', dataIndex: 'id', key: 'id', render: (text, record, index) => {
            const pageSize = pagination.pageSize || 10;
            const pageIndex = pagination.current || 1;
            return (pageIndex - 1) * pageSize + index + 1;
          }, width: "4%",
        },
        { title: 'Immatriculation', 
          dataIndex: 'name', 
          ...getColumnSearchProps(
            'name',
            searchText,
            setSearchText,
            '',
            searchInput
          ),
          render: (text) => (
            <div className="vehicule-matricule">
              <CarOutlined style={{ color: '#1890ff', marginRight: 6 }} />
              <Text strong>{text}</Text>
            </div>
          ),
          ...(columnsVisibility['Immatriculation'] ? {} : { className: 'hidden-column' }),
        },
        { title: 'MAJ', dataIndex: 'time', render: (text) =>
            <Text>{moment(text, "DD-MM-YYYY HH:mm:ss").format("DD/MM/YYYY HH:mm")}</Text>,
            sorter: (a, b) =>
            moment(a.time, "DD-MM-YYYY HH:mm:ss").unix() - moment(b.time, "DD-MM-YYYY HH:mm:ss").unix(),
            ...(columnsVisibility['MAJ'] ? {} : { className: 'hidden-column' }),
        },
        { title: 'Position / Zone', 
          dataIndex: 'address', 
          render: (_, record) => <VehicleAddress record={record} />,
          ...(columnsVisibility['Position'] ? {} : { className: 'hidden-column' })
        },
        { title: 'Vitesse', 
          dataIndex: 'speed', 
          render: (speed) => {
            let color = "red";
            if (speed > 5) color = "green";
            else if (speed > 0) color = "orange";
            return <Tag color={color}>{speed} km/h</Tag>
          },
          ...(columnsVisibility['Vitesse'] ? {} : { className: 'hidden-column' })
        },
        {
          title: 'Clé de contact',
          key: 'statusAndEngine',
          render: (_, record) => {
            const { online, sensors } = record;
            const engineStatus = getEngineStatus(sensors);

            return (
              <div style={{ display: "flex", gap: 1 }}>
                {statusDeviceMap(online)}
                {getEngineTag(engineStatus)}
              </div>
            );
          },
          ...(columnsVisibility['Clé de contact'] ? {} : { className: 'hidden-column' })
        },
        {
          title: 'Km Total',
          dataIndex: 'sensors',
          sorter: (a, b) => {
            const kmA = getOdometer(a.sensors) || 0;
            const kmB = getOdometer(b.sensors) || 0;
            return kmA - kmB;
          },
          render: (sensors) => {
            const km = getOdometer(sensors);
            if (!km) return <Tag color="default">N/A</Tag>;
            return <Text>{km.toLocaleString('fr-FR')} km</Text>;
          },
          ellipsis: false,
          ...(columnsVisibility['Km Total'] ? {} : { className: 'hidden-column' })
        },
        { title: 'Durée arrêt', 
          dataIndex: 'stop_duration', 
          sorter: (a, b) => {
            const dt1 = formatStopDuration(a.stop_duration) || 0;
            const dt2 = formatStopDuration(b.stop_duration) || 0;
            return dt1 - dt2;
          },
          render: (text) => {
            const formatted = formatStopDuration(text);
            return formatted ? <Text>{formatted}</Text> : <Tag color="default">N/A</Tag>;
          },
          ellipsis: false
        },
        {
          title: "Direction",
          dataIndex: "course",
          key: "course",
          align: "center",
          render: (course) => {
            const { label, icon, angle } = getDirection(course);
            return (
              <Tooltip title={`Angle exact: ${angle}°`}>
                <Tag
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 600,
                    fontSize: 13,
                    padding: "4px 8px",
                    borderRadius: 12,
                    cursor: "default",
                    color: "#fff",
                    backgroundColor: "#1E40AF",
                  }}
                >
                  <span style={{ marginRight: 6, display: "flex" }}>{icon}</span>
                  {label}
                </Tag>
              </Tooltip>
            );
          },
        },
        ], [columnsVisibility, pagination, searchText])
}