import styled from 'styled-components';

export const Wrapper = styled.div`
  /* System font stack */
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
`;

export function generateOptions(length: number, excludedOptions: number[]) {
  const arr = [];
  for (let value = 0; value < length; value += 1) {
    if (excludedOptions.indexOf(value) < 0) {
      arr.push(value);
    }
  }
  return arr;
}

export function onChange(value: Date) {
  console.log(value.toString());
}

export function disabledHours() {
  return [0, 1, 2, 3, 4, 5, 6, 7, 8, 22, 23];
}

export function disabledMinutes(h: number | null) {
  if (!h) return [];

  switch (h) {
    case 9:
      return generateOptions(60, [30]);
    case 21:
      return generateOptions(60, [0]);
    default:
      return generateOptions(60, [0, 30]);
  }
}

export function disabledSeconds(h: number | null, m: number | null) {
  if (!h || !m) return [];

  return [h + (m % 60)];
}
