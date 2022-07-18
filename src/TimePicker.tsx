import React, { Component, KeyboardEvent, RefObject } from 'react';
import styled from 'styled-components';
import cx from 'classnames';
import format from 'date-fns/format';

import { noop } from './helpers';
import Panel from './Panel';

const Wrapper = styled.div`
  position: relative;
  display: inline-block;
`;

type Props = {
  className: string;
  defaultOpen: boolean;
  defaultOpenValue: Date;
  defaultValue: Date;
  disabled?: boolean;
  disabledHours: () => number[];
  disabledMinutes: (hour: number | null) => number[];
  disabledSeconds: (hour: number | null, minute: number | null) => number[];
  format: string;
  getAriaLabel: (value: string) => string;
  hideDisabledOptions: boolean;
  hourStep: number;
  id: string;
  inputClassName: string;
  minuteStep: number;
  name: string;
  onAmPmChange: (ampm: string) => void;
  onBlur: () => void;
  onChange: (value: Date) => void;
  onClose: (value: { open: false }) => void;
  onFocus: () => void;
  onOpen: (value: { open: true }) => void;
  open: boolean;
  placeholder: string;
  prefixCls: string;
  secondStep: number;
  showHour: boolean;
  showMinute: boolean;
  showSecond: boolean;
  style: React.CSSProperties;
  use12Hours: boolean;
  value: Date;
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
  disabledHours: () => [],
  disabledMinutes: () => [],
  disabledSeconds: () => [],
  hideDisabledOptions: false,
  onChange: noop,
  onAmPmChange: noop,
  onOpen: noop,
  onClose: noop,
  onFocus: noop,
  onBlur: noop,
  getAriaLabel: () => 'react-samay-input-time',
};

type PickerProps = typeof defaultProps & Props;

export default class Picker extends Component<
  PickerProps,
  { value: Date; open: boolean }
> {
  static defaultProps: Partial<Props> = defaultProps;

  private saveInputRef: RefObject<HTMLInputElement>;
  private savePanelRef: RefObject<Panel>;

  constructor(props: PickerProps) {
    super(props);
    this.saveInputRef = React.createRef();
    this.savePanelRef = React.createRef();

    const {
      defaultOpen,
      defaultValue,
      open = defaultOpen,
      value = defaultValue,
    } = props;

    this.state = {
      open,
      value,
    };

    this.onPanelChange = this.onPanelChange.bind(this);
    this.onAmPmChange = this.onAmPmChange.bind(this);
    this.onVisibleChange = this.onVisibleChange.bind(this);
    this.closePanel = this.closePanel.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps: PickerProps) {
    const { value, open } = nextProps;

    if ('value' in nextProps) {
      this.setState({
        value,
      });
    }

    if (open !== undefined) {
      this.setState({ open });
    }
  }

  onPanelChange(value: Date) {
    this.setValue(value);
  }

  onAmPmChange(ampm: string) {
    const { onAmPmChange } = this.props;
    onAmPmChange(ampm);
  }

  onVisibleChange(open: boolean) {
    this.setOpen(open);
  }

  closePanel() {
    this.setOpen(false);
    this.focus();
  }

  onKeyDown(e: KeyboardEvent) {
    if ([8, 13, 32, 40].indexOf(e.keyCode) >= 0) {
      this.setOpen(true);
    }
  }

  onClick() {
    this.setOpen(true);
  }

  setValue(value: Date) {
    const { onChange } = this.props;

    if (!('value' in this.props)) {
      this.setState({
        value,
      });
    }

    onChange(value);
  }

  getFormat(includeAMPM = true) {
    const { format, showHour, showMinute, showSecond, use12Hours } = this.props;

    if (format) return format;

    if (use12Hours) {
      const fmtString = [
        showHour ? 'h' : '',
        showMinute ? 'mm' : '',
        showSecond ? 'ss' : '',
      ]
        .filter((item) => !!item)
        .join(':');

      return includeAMPM ? fmtString.concat(' a') : fmtString;
    }

    return [
      showHour ? 'HH' : '',
      showMinute ? 'mm' : '',
      showSecond ? 'ss' : '',
    ]
      .filter((item) => !!item)
      .join(':');
  }

  setOpen(open: boolean) {
    const { onOpen, onClose } = this.props;
    const { open: currentOpen } = this.state;

    if (currentOpen !== open) {
      if (!('open' in this.props)) {
        this.setState({ open });
      }

      if (open) {
        onOpen({ open });
      } else {
        onClose({ open });
      }
    }
  }

  focus() {
    const el = this.saveInputRef.current;
    if (el) el.focus();
  }

  render() {
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
    } = this.props;

    const { open, value } = this.state;
    const strValue = (value && format(value, this.getFormat(use12Hours))) || '';

    return (
      <Wrapper
        id={id}
        style={style}
        className={cx(`${prefixCls}-wrapper`, className)}
      >
        <input
          type="text"
          name={name}
          className={cx(`${prefixCls}-input`, inputClassName)}
          ref={this.saveInputRef}
          placeholder={placeholder}
          disabled={disabled}
          aria-label={getAriaLabel(strValue)}
          value={strValue}
          onChange={noop}
          onFocus={onFocus}
          onBlur={onBlur}
          onClick={this.onClick}
          onKeyDown={this.onKeyDown}
        />
        {open && (
          <Panel
            prefixCls={`${prefixCls}-panel`}
            ref={this.savePanelRef}
            value={this.state.value}
            defaultOpenValue={defaultOpenValue}
            showHour={showHour}
            showMinute={showMinute}
            showSecond={showSecond}
            closePanel={this.closePanel}
            format={this.getFormat()}
            disabledHours={disabledHours}
            disabledMinutes={disabledMinutes}
            disabledSeconds={disabledSeconds}
            hideDisabledOptions={hideDisabledOptions}
            use12Hours={use12Hours}
            hourStep={hourStep}
            minuteStep={minuteStep}
            secondStep={secondStep}
            onChange={this.onPanelChange}
            onAmPmChange={this.onAmPmChange}
          />
        )}
      </Wrapper>
    );
  }
}
