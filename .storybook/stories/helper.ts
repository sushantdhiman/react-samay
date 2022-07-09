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

export function disabledMinutes(h: number) {
  switch (h) {
    case 9:
      return generateOptions(60, [30]);
    case 21:
      return generateOptions(60, [0]);
    default:
      return generateOptions(60, [0, 30]);
  }
}

export function disabledSeconds(h: number, m: number) {
  return [h + (m % 60)];
}
