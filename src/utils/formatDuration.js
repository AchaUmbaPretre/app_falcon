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