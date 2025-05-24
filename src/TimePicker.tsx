import React, {
  useState,
  useRef,
  useEffect,
  KeyboardEvent,
  CSSProperties,
} from 'react';
import cx from 'classnames';
import { lightFormat } from 'date-fns/lightFormat';

import { noop, noopDisabled } from './helpers';
import Panel from './Panel';

type Props = {
  className?: string;
  defaultOpen?: boolean;
  defaultOpenValue?: Date;
  defaultValue?: Date;
  disabled?: boolean;
  disabledHours?: () => number[];
  disabledMinutes?: (hour: number | null) => number[];
  disabledSeconds?: (hour: number | null, minute: number | null) => number[];
  format?: string;
  getAriaLabel?: (value: string) => string;
  hideDisabledOptions?: boolean;
  hourStep?: number;
  id?: string;
  inputClassName?: string;
  minuteStep?: number;
  name?: string;
  onAmPmChange?: (ampm: string) => void;
  onBlur?: () => void;
  onChange?: (value: Date) => void;
  onClose?: (value: { open: false }) => void;
  onFocus?: () => void;
  onOpen?: (value: { open: true }) => void;
  open?: boolean;
  placeholder?: string;
  prefixCls?: string;
  secondStep?: number;
  showHour?: boolean;
  showMinute?: boolean;
  showSecond?: boolean;
  style?: CSSProperties;
  use12Hours?: boolean;
  value?: Date;
};

const defaultProps: Partial<Props> = {
  id: '',
  disabled: false,
  prefixCls: 'react-samay',
  defaultOpen: false,
  className: '',
  inputClassName: '',
  placeholder: '',
  defaultOpenValue: new Date(),
  use12Hours: false,
  showHour: true,
  showMinute: true,
  showSecond: true,
  hourStep: 1,
  minuteStep: 1,
  secondStep: 1,
  disabledHours: noopDisabled,
  disabledMinutes: noopDisabled,
  disabledSeconds: noopDisabled,
  hideDisabledOptions: false,
  onChange: noop,
  onAmPmChange: noop,
  onOpen: noop,
  onClose: noop,
  onFocus: noop,
  onBlur: noop,
  getAriaLabel: () => 'react-samay-input-time',
};

type WithDefaultProps<T, D extends Partial<T>> = Omit<T, keyof D> &
  Required<Pick<T, Extract<keyof T, keyof D>>>;

function TimePicker(props: Props) {
  const {
    id,
    name,
    disabled,
    placeholder,
    style,
    prefixCls,
    className,
    inputClassName,
    getAriaLabel,
    disabledHours,
    disabledMinutes,
    disabledSeconds,
    hideDisabledOptions,
    showHour,
    showMinute,
    showSecond,
    defaultOpenValue,
    use12Hours,
    onFocus,
    onBlur,
    hourStep,
    minuteStep,
    secondStep,
    format,
    onChange,
    onOpen,
    onClose,
    onAmPmChange,
  } = { ...defaultProps, ...props } as WithDefaultProps<
    Props,
    typeof defaultProps
  >;

  const controlledValue = props.value;
  const controlledOpen = props.open;

  const [value, setValue] = useState<Date>(props.defaultValue ?? new Date());
  const [open, setOpen] = useState<boolean>(props.defaultOpen ?? false);

  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<typeof Panel>(null);

  // Sync controlled value and open state
  useEffect(() => {
    if (controlledValue !== undefined) setValue(controlledValue);
  }, [controlledValue]);

  useEffect(() => {
    if (controlledOpen !== undefined) setOpen(controlledOpen);
  }, [controlledOpen]);

  const setValueInternal = (val: Date) => {
    if (controlledValue === undefined) setValue(val);
    if (onChange) onChange(val);
  };

  const setOpenInternal = (o: boolean) => {
    if (open !== o) {
      if (controlledOpen === undefined) {
        setOpen(o);
      }

      if (o) {
        if (onOpen) onOpen({ open: true });
      } else {
        if (onClose) onClose({ open: false });
      }
    }
  };

  const getFormat = (includeAMPM = true) => {
    if (format) return format;
    if (use12Hours) {
      const fmtString = [
        showHour ? 'h' : '',
        showMinute ? 'mm' : '',
        showSecond ? 'ss' : '',
      ]
        .filter(Boolean)
        .join(':');
      return includeAMPM ? fmtString.concat(' a') : fmtString;
    }
    return [
      showHour ? 'HH' : '',
      showMinute ? 'mm' : '',
      showSecond ? 'ss' : '',
    ]
      .filter(Boolean)
      .join(':');
  };

  const handlePanelChange = (val: Date) => setValueInternal(val);
  const handleAmPmChange = (ampm: string) => onAmPmChange && onAmPmChange(ampm);
  const closePanel = () => {
    setOpenInternal(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if ([8, 13, 32, 40].indexOf(e.keyCode) >= 0) setOpenInternal(true);
  };

  const handleClick = () => setOpenInternal(true);

  const strValue = value ? lightFormat(value, getFormat(use12Hours)) : '';

  return (
    <div
      id={id}
      style={style}
      className={cx(`${prefixCls}-wrapper`, className)}
    >
      <input
        type="text"
        name={name}
        className={cx(`${prefixCls}-input`, inputClassName)}
        ref={inputRef}
        placeholder={placeholder}
        disabled={disabled}
        aria-label={getAriaLabel ? getAriaLabel(strValue) : ''}
        value={strValue}
        onChange={noop}
        onFocus={onFocus}
        onBlur={onBlur}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      />
      {open && (
        <Panel
          prefixCls={`${prefixCls}-panel`}
          ref={panelRef}
          value={value}
          defaultOpenValue={defaultOpenValue}
          showHour={showHour}
          showMinute={showMinute}
          showSecond={showSecond}
          closePanel={closePanel}
          format={getFormat()}
          disabledHours={disabledHours}
          disabledMinutes={disabledMinutes}
          disabledSeconds={disabledSeconds}
          hideDisabledOptions={hideDisabledOptions}
          use12Hours={use12Hours}
          hourStep={hourStep}
          minuteStep={minuteStep}
          secondStep={secondStep}
          onChange={handlePanelChange}
          onAmPmChange={handleAmPmChange}
        />
      )}
    </div>
  );
}

export default TimePicker;
