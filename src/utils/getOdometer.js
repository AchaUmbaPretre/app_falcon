import {
  KeyOutlined,
  ArrowUpOutlined,
  CheckCircleOutlined,
  PoweroffOutlined,
  CloseCircleOutlined
} from "@ant-design/icons";
import { Tag } from 'antd';


// --- Zone de geofencing (ex: Kinshasa) ---
export const zoneAutorisee = {
  latMin: -4.6,
  latMax: -4.3,
  lngMin: 15.1,
  lngMax: 15.5,
};

export const getOdometer = (sensors = []) => {
  const odo = sensors.find((s) => s.type === "odometer");
  if (!odo) return null;

  // retirer " km" et convertir en nombre
  const kmString = odo.value || odo.val || "";
  const kmNumber = parseFloat(kmString.replace(/\s?km/i, '').replace(/,/g, ''));
  
  return isNaN(kmNumber) ? null : kmNumber;
};


export const getEngineStatus = (sensors = []) => {
    const Contact = sensors.find((s) => s.type === "acc");
    return Contact?.value === "On" ? "ON" : "OFF";
  };

export const getBatteryLevel = (sensors = []) => {
  const battery = sensors.find((s) => s.type === "battery");
  return battery ? battery.value : null;
};

export const statusDeviceMap = (online) => {
  const key = online?.toLowerCase();

  const statusMap = {
    online: {
      color: "green",
      label: "Mouvement",
      icon: <CheckCircleOutlined />,
    },
    ack: {
      color: "red",
      label: "Immobile",
      icon: <PoweroffOutlined />,
    },
    offline: {
      color: "red",
      label: "Immobile",
      icon: <PoweroffOutlined />,
    },
    engine: {
      color: "red",
      label: "Immobile",
      icon: <PoweroffOutlined />,
    },
  };

  const status = statusMap[key] || {
    color: "red",
    label: online?.toUpperCase() || "Inconnu",
    icon: <CloseCircleOutlined />,
  };

  return (
    <Tag color={status.color} icon={status.icon}>
      {status.label}
    </Tag>
  );
};

const engineMap = {
  ON: { color: "green", label: "ON", icon: < KeyOutlined /> },
  OFF: { color: "red", label: "OFF", icon: <KeyOutlined /> },
};

export const getEngineTag = (engineStatus) => {
  const key = engineStatus?.toUpperCase();
  const engine = engineMap[key]

  return (
    <Tag color={engine.color} icon={engine.icon}>
      {engine.label}
    </Tag>
  );
};

export const getDirection = (course) => {
  if (course == null)
    return { label: "?", icon: null, angle: 0 };

  const dirs = ["N", "NE", "E", "SE", "S", "SO", "O", "NO"];
  const angle = ((course % 360) + 360) % 360;
  const i = Math.round(angle / 45) % dirs.length;

  return {
    label: dirs[i],
    icon: <ArrowUpOutlined style={{ transform: `rotate(${angle}deg)`, fontSize: 16 }} />,
    angle,
  };
};