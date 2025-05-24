import raf from 'raf';
import { getHours } from 'date-fns/getHours';
import { getMinutes } from 'date-fns/getMinutes';
import { getSeconds } from 'date-fns/getSeconds';
import { parse } from 'date-fns/parse';

export function noop(): void {
  /* empty noop function */
}

export function noopDisabled(): number[] {
  return [];
}

export function scrollTo(element: HTMLElement, to: number, duration: number) {
  // jump to target if duration zero
  if (duration <= 0) {
    raf(() => {
      element.scrollTop = to;
    });
    return;
  }

  const difference = to - element.scrollTop;
  const perTick = (difference / duration) * 10;

  raf(() => {
    element.scrollTop += perTick;
    if (element.scrollTop === to) return;
    scrollTo(element, to, duration - 10);
  });
}

export function formatOption(option: number, disabledOptions: number[]) {
  let value = `${option}`;
  let disabled = false;

  if (option < 10) {
    value = `0${option}`;
  }

  if (disabledOptions.indexOf(option) >= 0) {
    disabled = true;
  }

  return {
    value,
    disabled,
  };
}

export function generateOptions(
  length: number,
  disabledOptions: number[],
  hideDisabledOptions: boolean,
  step = 1,
) {
  const arr = [];
  for (let value = 0; value < length; value += step) {
    if (disabledOptions.indexOf(value) < 0 || !hideDisabledOptions) {
      arr.push(value);
    }
  }
  return arr;
}

export function toNearestValidTime(
  time: Date,
  hourOptions: number[],
  minuteOptions: number[],
  secondOptions: number[],
): Date {
  const hour = hourOptions
    .slice()
    .sort(
      (a, b) => Math.abs(getHours(time) - a) - Math.abs(getHours(time) - b),
    )[0];
  const minute = minuteOptions
    .slice()
    .sort(
      (a, b) => Math.abs(getMinutes(time) - a) - Math.abs(getMinutes(time) - b),
    )[0];
  const second = secondOptions
    .slice()
    .sort(
      (a, b) => Math.abs(getSeconds(time) - a) - Math.abs(getSeconds(time) - b),
    )[0];

  return parse(`${hour}:${minute}:${second}`, 'HH:mm:ss', new Date());
}
