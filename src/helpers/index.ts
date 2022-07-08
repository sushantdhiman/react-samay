import raf from 'raf';
import moment, { Moment } from 'moment';

export function noop(): void {
  /* empty noop function */
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

  if (disabledOptions && disabledOptions.indexOf(option) >= 0) {
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
  step = 1
) {
  const arr = [];
  for (let value = 0; value < length; value += step) {
    if (
      !disabledOptions ||
      disabledOptions.indexOf(value) < 0 ||
      !hideDisabledOptions
    ) {
      arr.push(value);
    }
  }
  return arr;
}

export function toNearestValidTime(
  time: Moment,
  hourOptions: number[],
  minuteOptions: number[],
  secondOptions: number[]
) {
  const hour = hourOptions
    .slice()
    .sort((a, b) => Math.abs(time.hour() - a) - Math.abs(time.hour() - b))[0];
  const minute = minuteOptions
    .slice()
    .sort(
      (a, b) => Math.abs(time.minute() - a) - Math.abs(time.minute() - b)
    )[0];
  const second = secondOptions
    .slice()
    .sort(
      (a, b) => Math.abs(time.second() - a) - Math.abs(time.second() - b)
    )[0];
  return moment(`${hour}:${minute}:${second}`, 'HH:mm:ss');
}
