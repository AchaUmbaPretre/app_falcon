import { Avatar, Space, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";

const { Text } = Typography;

const stringToColor = (str = "") => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue}, 65%, 55%)`;
};

const UserAvatarProfile = ({
  nom,
  prenom,
  email,
  size = 35,
  showEmail = true
}) => {
  const initials =
    `${nom?.[0] ?? ""}${prenom?.[0] ?? ""}`.toUpperCase();

  const color = stringToColor(email || nom);

  return (
    <Space>
      <Avatar
        size={size}
        style={{
          backgroundColor: color,
          fontSize: size * 0.4,
          fontWeight: 600
        }}
        icon={!initials && <UserOutlined />}
      >
        {initials}
      </Avatar>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <Text strong>{`${nom} - ${prenom}`}</Text>
        {showEmail && (
          <Text type="secondary" style={{ fontSize: 12 }}>
            {email ?? "N/A"}
          </Text>
        )}
      </div>
    </Space>
  );
};

export default UserAvatarProfile;
