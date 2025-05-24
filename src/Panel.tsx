import React, { useState, useEffect, useCallback } from 'react';
import { FocusTrap } from 'focus-trap-react';
import { getHours } from 'date-fns/getHours';
import { getMinutes } from 'date-fns/getMinutes';

import Combobox from './Combobox';
import {
  generateOptions,
  toNearestValidTime,
  noop,
  noopDisabled,
} from './helpers';

type Props = {
  prefixCls: string;
  defaultOpenValue: Date;
  value: Date;
  format: string;
  disabledHours: () => number[];
  disabledMinutes: (hour: number | null) => number[];
  disabledSeconds: (hour: number | null, minute: number | null) => number[];
  hideDisabledOptions: boolean;
  onChange: (value: Date) => void;
  onAmPmChange: (ampm: string) => void;
  closePanel: () => void;
  showHour: boolean;
  showMinute: boolean;
  showSecond: boolean;
  use12Hours: boolean;
  hourStep: number;
  minuteStep: number;
  secondStep: number;
};

function Panel({
  prefixCls,
  defaultOpenValue = new Date(),
  value,
  format,
  disabledHours = noopDisabled,
  disabledMinutes = noopDisabled,
  disabledSeconds = noopDisabled,
  hideDisabledOptions,
  onChange = noop,
  onAmPmChange = noop,
  closePanel,
  showHour,
  showMinute,
  showSecond,
  use12Hours = false,
  hourStep,
  minuteStep,
  secondStep,
}: Props) {
  const [internalValue, setInternalValue] = useState<Date>(value);

  // Sync prop value to local state
  useEffect(() => {
    if (value) {
      setInternalValue(value);
    }
  }, [value]);

  const handleChange = useCallback(
    (newValue: Date) => {
      setInternalValue(newValue);
      onChange(newValue);
    },
    [onChange],
  );

  const handleAmPmChange = useCallback(
    (ampm: string) => {
      onAmPmChange(ampm);
    },
    [onAmPmChange],
  );

  const isAM = useCallback(() => {
    const realValue = internalValue || defaultOpenValue;
    const hours = getHours(realValue);
    return hours >= 0 && hours < 12;
  }, [internalValue, defaultOpenValue]);

  const getDisabledHours = useCallback(() => {
    let disabledOptions = disabledHours();
    if (use12Hours && Array.isArray(disabledOptions)) {
      if (isAM()) {
        disabledOptions = disabledOptions
          .filter((h) => h < 12)
          .map((h) => (h === 0 ? 12 : h));
      } else {
        disabledOptions = disabledOptions.map((h) => (h === 12 ? 12 : h - 12));
      }
    }
    return disabledOptions;
  }, [use12Hours, disabledHours, isAM]);

  const disabledHourOptions = getDisabledHours();
  const disabledMinuteOptions = disabledMinutes(
    internalValue ? getHours(internalValue) : null,
  );
  const disabledSecondOptions = disabledSeconds(
    internalValue ? getHours(internalValue) : null,
    internalValue ? getMinutes(internalValue) : null,
  );
  const hourOptions = generateOptions(
    24,
    disabledHourOptions,
    hideDisabledOptions,
    hourStep,
  );
  const minuteOptions = generateOptions(
    60,
    disabledMinuteOptions,
    hideDisabledOptions,
    minuteStep,
  );
  const secondOptions = generateOptions(
    60,
    disabledSecondOptions,
    hideDisabledOptions,
    secondStep,
  );

  const validDefaultOpenValue = toNearestValidTime(
    defaultOpenValue,
    hourOptions,
    minuteOptions,
    secondOptions,
  );

  return (
    <FocusTrap
      focusTrapOptions={{
        initialFocus: `.${prefixCls}-select-option-selected`,
        onDeactivate: () => closePanel(),
        clickOutsideDeactivates: true,
        escapeDeactivates: true,
      }}
    >
      <div className={`${prefixCls}-inner`}>
        <Combobox
          prefixCls={prefixCls}
          value={internalValue}
          defaultOpenValue={validDefaultOpenValue}
          format={format}
          onChange={handleChange}
          onAmPmChange={handleAmPmChange}
          showHour={showHour}
          showMinute={showMinute}
          showSecond={showSecond}
          hourOptions={hourOptions}
          minuteOptions={minuteOptions}
          secondOptions={secondOptions}
          disabledHours={getDisabledHours}
          disabledMinutes={disabledMinutes}
          disabledSeconds={disabledSeconds}
          use12Hours={use12Hours}
          isAM={isAM()}
        />
      </div>
    </FocusTrap>
  );
}

export default React.forwardRef(Panel);
