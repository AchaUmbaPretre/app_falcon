import { fetchAddress } from "./fetchAddress";
import { useEffect, useState, memo } from "react";
import { Space, Tooltip } from "antd";
import { WifiOutlined } from "@ant-design/icons"; // Icône signal coupé

export const VehicleAddress = memo(({ record }) => {
  const getInitialAddress = () => {
    if (record?.capteurInfo?.address && record.capteurInfo.address !== "-") {
      return record.capteurInfo.address;
    }
    if (record?.lat !== undefined && record?.lng !== undefined) {
      return `${record.lat}, ${record.lng}`;
    }
    return "-";
  };

  const [displayAddress, setDisplayAddress] = useState(getInitialAddress);

  useEffect(() => {
    let mounted = true;
    const fetchAddr = async () => {
      try {
        const addr = await fetchAddress(record.capteurInfo || record);
        if (mounted && addr && addr !== "undefined, undefined") {
          setDisplayAddress(addr);
        }
      } catch (e) {
        console.warn("Erreur fetchAddress:", e);
      }
    };
    fetchAddr();
    return () => {
      mounted = false;
    };
  }, [record]);

  // --- Parser date format DD-MM-YYYY HH:mm:ss ---
  const parseDateTime = (str) => {
    if (!str) return null;
    const [datePart, timePart] = str.split(" ");
    const [day, month, year] = datePart.split("-").map(Number);
    const [hours, minutes, seconds] = timePart.split(":").map(Number);
    return new Date(year, month - 1, day, hours, minutes, seconds);
  };

  const lastUpdate = record.capteurInfo?.time;
  const lastUpdateDate = parseDateTime(lastUpdate);
  const hoursSinceUpdate = lastUpdateDate
    ? (Date.now() - lastUpdateDate.getTime()) / (1000 * 60 * 60)
    : null;

  const isSignalLost = hoursSinceUpdate !== null && hoursSinceUpdate > 2;

  const tooltipText = lastUpdate
    ? `Dernière mise à jour : ${lastUpdate}`
    : "Aucune donnée";

  return (
    <Tooltip title={tooltipText}>
      <Space>
        <span>{displayAddress}</span>
        {isSignalLost && (
          <WifiOutlined
            style={{
              color: "#ff4d4f",
            }}
          />
        )}
      </Space>
    </Tooltip>
  );
});
