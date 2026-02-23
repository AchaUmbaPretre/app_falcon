import { useMemo } from "react";

const extractGroup = (name) => {
  if (!name) return null;

  const firstPart = name.split("_")[0];
  const match = firstPart.match(/^[A-Za-z]+/);

  return match ? match[0] : firstPart;
};

export const useGroupedData = (data) => {
  return useMemo(() => {
    return data.reduce((acc, item) => {
      const group = extractGroup(item.name ?? item?.device_name);

      if (!group) return acc;

      if (!acc[group]) {
        acc[group] = [];
      }

      acc[group].push(item);

      return acc;
    }, {});
  }, [data]);
};
