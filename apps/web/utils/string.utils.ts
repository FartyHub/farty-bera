/* eslint-disable no-magic-numbers */
export function truncateMiddle(str: string, maxLength = 10) {
  if (str.length <= maxLength) {
    return str;
  }
  const leftHalf = str.slice(0, maxLength / 2);
  const rightHalf = str.slice(str.length - maxLength / 2);

  return `${leftHalf}...${rightHalf}`;
}
