import { Tag, Typography, Tooltip } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";

const { Text } = Typography
// Tooltip pour texte tronqué
export const renderTextWithTooltip = (text, color = 'secondary', maxWidth = 160) => (
  <Tooltip title={text}>
    <div style={{ maxWidth, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
      <Text type={color}>{text}</Text>
    </div>
  </Tooltip>
);

// Date formatée dans un tag
export const renderDateTag = (dateStr, color = 'blue') => {
  if (!dateStr) return <Tag color="red">Aucune date</Tag>;
  const date = moment(dateStr);
  return <Tag color={color}>{date.format('DD-MM-YYYY HH:mm')}</Tag>;
};

// Formatage des minutes en j h m
export const formatDuration = (minutes) => {
  if (minutes == null) return "-";
  const totalMinutes = Math.floor(minutes);
  const days = Math.floor(totalMinutes / (24 * 60));
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
  const mins = totalMinutes % 60;

  let result = "";
  if (days > 0) result += `${days}j `;
  if (hours > 0) result += `${hours}h `;
  result += `${mins}m`;
  return result.trim();
};

// Détermination de la couleur en fonction du retard
export const getDurationColor = (elapsedMinutes) => {
  if (elapsedMinutes <= 0) return "green";       // gain de temps ou à l'heure
  if (elapsedMinutes > 25 && elapsedMinutes <= 60) return "orange"; // retard léger >25min
  if (elapsedMinutes > 60) return "red";         // retard important >1h
  return "green";                                // 0-25min reste vert
};

// Hook pour le compteur dynamique
export const useElapsedTime = (startTime) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!startTime) return;

    const interval = setInterval(() => {
      const diffMinutes = Math.floor(moment().diff(moment(startTime), "minutes", true));
      setElapsed(diffMinutes);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  return elapsed;
};

// Chrono dynamique pour la course en cours
export const ChronoTag = ({ sortie_time }) => {
  const elapsedMinutes = useElapsedTime(sortie_time);
  const color = getDurationColor(elapsedMinutes);

  return (
    <Tag color={color} style={{ fontWeight: 600 }}>
      {formatDuration(elapsedMinutes)}
    </Tag>
  );
};

// Affichage de la durée moyenne (statique)
export const MoyenneTag = ({ duree_moyenne_min }) => (
  <Tag color="purple">{formatDuration(duree_moyenne_min)}</Tag>
);

// Ecart dynamique entre durée réelle et moyenne
export const EcartTag = ({ duree_reelle_min, duree_moyenne_min }) => {
  const [diff, setDiff] = useState(duree_moyenne_min != null ? duree_moyenne_min - duree_reelle_min : 0);

  useEffect(() => {
    if (duree_moyenne_min == null) return;
    const interval = setInterval(() => {
      setDiff(duree_moyenne_min - duree_reelle_min);
    }, 1000);

    return () => clearInterval(interval);
  }, [duree_reelle_min, duree_moyenne_min]);

  if (duree_moyenne_min == null) {
    return (
      <Tag color="default" style={{ fontWeight: 600 }}>
        Aucune moyenne
      </Tag>
    );
  }

  let color = "green";
  if (diff > 0) color = "green";
  else if (diff <= 0 && diff > -60) color = "orange";
  else color = "red";

  const text =
    diff > 0
      ? `${formatDuration(diff)} de gain`
      : `${formatDuration(Math.abs(diff))} de retard`;

  return <Tag color={color}>{text}</Tag>;
};

export const formatStopDuration = (duration) => {
  if (!duration || duration === "-") return null;

  let totalHours = 0;
  let minutes = 0;
  let seconds = 0;

  // Cas 1 : format "267h 12min 12s"
  if (duration.includes("h")) {
    const regex = /(\d+)h\s*(\d+)min\s*(\d+)s/;
    const match = duration.match(regex);
    if (match) {
      totalHours = parseInt(match[1], 10);
      minutes = parseInt(match[2], 10);
      seconds = parseInt(match[3], 10);
    }
  }

  // Cas 2 : format "HH:mm:ss"
  else if (duration.includes(":")) {
    const [h, m, s] = duration.split(":").map(Number);
    totalHours = h;
    minutes = m;
    seconds = s;
  } else {
    return duration; // fallback si format inconnu
  }

  // Conversion en mois / jours / heures
  const months = Math.floor(totalHours / (24 * 30));
  const days = Math.floor((totalHours % (24 * 30)) / 24);
  const hours = totalHours % 24;

  let result = "";  
  if (months > 0) result += `${months}mois `;
  if (days > 0) result += `${days}j `;
  if (hours > 0) result += `${hours}h `;
  if (minutes > 0) result += `${minutes}m `;
  if (seconds > 0) result += `${seconds}s`;

  return result.trim();
};

export const computeDowntimeMinutes = (lastConnection) => {
  if (!lastConnection) return 0;
  const now = moment();
  const last = moment(lastConnection);
  const diffMinutes = now.diff(last, "minutes");
  return diffMinutes;
};

export const formatDurations = (minutes) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} h`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} j`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} mois`;
    const years = Math.floor(months / 12);
    return `${years} an${years > 1 ? 's' : ''}`;
  };