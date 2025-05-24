import React, { useState, useCallback } from 'react';
import { set } from 'date-fns/set';
import { getHours } from 'date-fns/getHours';
import { getMinutes } from 'date-fns/getMinutes';
import { getSeconds } from 'date-fns/getSeconds';

import Select from './Select';
import { formatOption } from './helpers';

import type { Selector } from './interface';

type Props = {
  format: string;
  defaultOpenValue: Date;
  prefixCls: string;
  value: Date;
  use12Hours: boolean;
  isAM: boolean;
  onChange: (value: Date) => void;
  onAmPmChange: (ampm: string) => void;
  showHour: boolean;
  showMinute: boolean;
  showSecond: boolean;
  hourOptions: number[];
  minuteOptions: number[];
  secondOptions: number[];
  disabledHours: () => number[];
  disabledMinutes: (hour: number | null) => number[];
  disabledSeconds: (hour: number | null, minute: number | null) => number[];
};

function Combobox(props: Props) {
  const [selectFocusOn, setSelectFocusOn] = useState<null | Selector>(null);

  const onItemChange = useCallback(
    (type: Selector, itemValue: string) => {
      const { onChange, defaultOpenValue, use12Hours, isAM, onAmPmChange } =
        props;
      const value = props.value || defaultOpenValue;

      let hour = getHours(value);
      let minute = getMinutes(value);
      let second = getSeconds(value);

      if (type === 'hour') {
        if (use12Hours) {
          if (isAM) {
            hour = +itemValue % 12;
          } else {
            hour = (+itemValue % 12) + 12;
          }
        } else {
          hour = +itemValue;
        }
      } else if (type === 'minute') {
        minute = +itemValue;
      } else if (type === 'ampm') {
        const ampm = itemValue.toUpperCase();
        if (use12Hours) {
          if (ampm === 'PM' && hour < 12) {
            hour = (hour % 12) + 12;
          }
          if (ampm === 'AM') {
            if (hour >= 12) {
              hour = hour - 12;
            }
          }
        }
        onAmPmChange(ampm);
      } else {
        second = +itemValue;
      }

      onChange(
        set(value, {
          hours: hour,
          minutes: minute,
          seconds: second,
        }),
      );
    },
    [
      props.onChange,
      props.defaultOpenValue,
      props.use12Hours,
      props.isAM,
      props.onAmPmChange,
      props.value,
    ],
  );

  const getColumns = useCallback(() => {
    const { showHour, showMinute, showSecond, use12Hours } = props;
    return [
      ['hour', showHour],
      ['minute', showMinute],
      ['second', showSecond],
      ['ampm', use12Hours],
    ]
      .filter(([, enabled]) => enabled)
      .map(([val]) => val as Selector);
  }, [props.showHour, props.showMinute, props.showSecond, props.use12Hours]);

  const changeFocusTo = useCallback(
    (currentSelectType: Selector, offset: number) => {
      const columns = getColumns();
      const currentIndex = columns.indexOf(currentSelectType);
      let newIndex = currentIndex + offset;

      if (newIndex < 0) {
        newIndex = columns.length - 1;
      } else if (newIndex >= columns.length) {
        newIndex = 0;
      }

      const newFocusOn = columns[newIndex];
      setSelectFocusOn(newFocusOn);
    },
    [getColumns],
  );

  const handleKeyDown = useCallback(
    (currentType: Selector, e: React.KeyboardEvent<HTMLElement>) => {
      if (e.keyCode === 39) {
        changeFocusTo(currentType, 1);
        e.preventDefault();
        e.stopPropagation();
      } else if (e.keyCode === 37) {
        changeFocusTo(currentType, -1);
        e.preventDefault();
        e.stopPropagation();
      }
    },
    [changeFocusTo],
  );

  const getHourSelect = (hour: number) => {
    const { prefixCls, hourOptions, disabledHours, showHour, use12Hours } =
      props;
    if (!showHour) return null;

    const disabledOptions = disabledHours();

    let hourOptionsAdj;
    let hourAdj;

    if (use12Hours) {
      hourOptionsAdj = [12].concat(hourOptions.filter((h) => h < 12 && h > 0));
      hourAdj = hour % 12 || 12;
    } else {
      hourOptionsAdj = hourOptions;
      hourAdj = hour;
    }

    return (
      <Select
        prefixCls={prefixCls}
        options={hourOptionsAdj.map((option) =>
          formatOption(option, disabledOptions),
        )}
        selectedIndex={hourOptionsAdj.indexOf(hourAdj)}
        type="hour"
        label="hour"
        onSelect={onItemChange}
        onKeyDown={(e) => handleKeyDown('hour', e)}
        focused={selectFocusOn === 'hour'}
      />
    );
  };

  const getMinuteSelect = (minute: number) => {
    const {
      prefixCls,
      minuteOptions,
      disabledMinutes,
      defaultOpenValue,
      showMinute,
      value: propValue,
    } = props;
    if (!showMinute) return null;
    const value = propValue || defaultOpenValue;
    const disabledOptions = disabledMinutes(getHours(value));

    return (
      <Select
        prefixCls={prefixCls}
        options={minuteOptions.map((option) =>
          formatOption(option, disabledOptions),
        )}
        selectedIndex={minuteOptions.indexOf(minute)}
        type="minute"
        label="minute"
        onSelect={onItemChange}
        onKeyDown={(e) => handleKeyDown('minute', e)}
        focused={selectFocusOn === 'minute'}
      />
    );
  };

  const getSecondSelect = (second: number) => {
    const {
      prefixCls,
      secondOptions,
      disabledSeconds,
      showSecond,
      defaultOpenValue,
      value: propValue,
    } = props;
    if (!showSecond) return null;
    const value = propValue || defaultOpenValue;
    const disabledOptions = disabledSeconds(getHours(value), getMinutes(value));

    return (
      <Select
        prefixCls={prefixCls}
        options={secondOptions.map((option) =>
          formatOption(option, disabledOptions),
        )}
        selectedIndex={secondOptions.indexOf(second)}
        type="second"
        label="second"
        onSelect={onItemChange}
        onKeyDown={(e) => handleKeyDown('second', e)}
        focused={selectFocusOn === 'second'}
      />
    );
  };

  const getAMPMSelect = () => {
    const { prefixCls, use12Hours, format, isAM } = props;
    if (!use12Hours) return null;

    const AMPMOptions = ['am', 'pm']
      .map((c) => (format.match(/\sA/) ? c.toUpperCase() : c))
      .map((c) => ({ value: c, disabled: false }));

    const selected = isAM ? 0 : 1;

    return (
      <Select
        prefixCls={prefixCls}
        options={AMPMOptions}
        selectedIndex={selected}
        type="ampm"
        label="AM or PM"
        onSelect={onItemChange}
        onKeyDown={(e) => handleKeyDown('ampm', e)}
        focused={selectFocusOn === 'ampm'}
      />
    );
  };

  const { prefixCls, defaultOpenValue, value: propValue } = props;
  const value = propValue || defaultOpenValue;

  return (
    <div className={`${prefixCls}-combobox`}>
      {getHourSelect(getHours(value))}
      {getMinuteSelect(getMinutes(value))}
      {getSecondSelect(getSeconds(value))}
      {getAMPMSelect()}
    </div>
  );
}

export default Combobox;
