import React, { Component, KeyboardEvent, RefObject } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { format } from 'date-fns';

import { noop } from './helpers';
import Panel from './Panel';

const TimeDisplay = styled.div`
  display: flex;
  align-items: center;
`;

const TimeText = styled.div`
  font-size: 16px;
`;

const AMPMText = styled.div`
  font-size: 12px;
  text-transform: uppercase;
`;

type Props = {
  prefixCls: string;
  value: Date;
  defaultOpenValue: Date;
  inputReadOnly: boolean;
  allowEmpty: boolean;
  defaultValue: Date;
  open: boolean;
  defaultOpen: boolean;
  placeholder: string;
  format: string;
  showHour: boolean;
  showMinute: boolean;
  showSecond: boolean;
  className: string;
  popupClassName: string;
  disabledHours: () => number[];
  disabledMinutes: (hour: number | null) => number[];
  disabledSeconds: (hour: number | null, minute: number | null) => number[];
  hideDisabledOptions: boolean;
  onChange: (value: Date) => void;
  onAmPmChange: (ampm: string) => void;
  onOpen: (value: { open: true }) => void;
  onClose: (value: { open: false }) => void;
  onFocus: () => void;
  onBlur: () => void;
  name: string;
  use12Hours: boolean;
  hourStep: number;
  minuteStep: number;
  secondStep: number;
  onKeyDown: () => void;
  id: string;
  ariaLabelFunc: (value: string) => string;
  inputIcon: React.ReactElement;
  style: React.CSSProperties;
};

type PickerProps = typeof Picker.defaultProps & Props;

export default class Picker extends Component<
  PickerProps,
  { value: Date; open: boolean }
> {
  static defaultProps: Partial<Props> = {
    prefixCls: 'react-samay',
    defaultOpen: false,
    inputReadOnly: false,
    className: '',
    popupClassName: '',
    id: '',
    defaultOpenValue: new Date(),
    allowEmpty: true,
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
    use12Hours: false,
    onKeyDown: noop,
    ariaLabelFunc: () => 'react-samay-input-time',
  };

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

  // onClear = event => {
  //   event.stopPropagation()
  //   this.setValue(null)
  //   this.setOpen(false)
  // }

  onVisibleChange(open: boolean) {
    this.setOpen(open);
  }

  closePanel() {
    this.setOpen(false);
    this.focus();
  }

  onKeyDown(e: KeyboardEvent) {
    if (e.keyCode === 40) {
      this.setOpen(true);
    }
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

  getPanelElement() {
    const {
      className,
      prefixCls,
      placeholder,
      disabledHours,
      disabledMinutes,
      disabledSeconds,
      hideDisabledOptions,
      inputReadOnly,
      showHour,
      showMinute,
      showSecond,
      defaultOpenValue,
      use12Hours,
      onKeyDown,
      hourStep,
      minuteStep,
      secondStep,
    } = this.props;
    return (
      <Panel
        className={className}
        prefixCls={`${prefixCls}-panel`}
        ref={this.savePanelRef}
        value={this.state.value}
        inputReadOnly={inputReadOnly}
        onChange={this.onPanelChange}
        onAmPmChange={this.onAmPmChange}
        defaultOpenValue={defaultOpenValue}
        showHour={showHour}
        showMinute={showMinute}
        showSecond={showSecond}
        closePanel={this.closePanel}
        format={this.getFormat()}
        placeholder={placeholder}
        disabledHours={disabledHours}
        disabledMinutes={disabledMinutes}
        disabledSeconds={disabledSeconds}
        hideDisabledOptions={hideDisabledOptions}
        use12Hours={use12Hours}
        hourStep={hourStep}
        minuteStep={minuteStep}
        secondStep={secondStep}
        onKeyDown={onKeyDown}
      />
    );
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

  blur() {
    const el = this.saveInputRef.current;
    if (el) el.blur();
  }

  render() {
    const {
      prefixCls,
      placeholder,
      id,
      className,
      ariaLabelFunc,
      onFocus,
      inputIcon,
      style,
    } = this.props;

    const { open, value } = this.state;

    return (
      <div
        className={classNames(`${prefixCls}-wrapper`, className)}
        style={style}
      >
        {open ? (
          this.getPanelElement()
        ) : (
          <span>
            <TimeDisplay
              id={id}
              ref={this.saveInputRef}
              role="button"
              tabIndex={0}
              className={`${prefixCls}-input`}
              onClick={() => {
                if (onFocus) onFocus();
                this.setOpen(true);
              }}
              onKeyDown={(e) => {
                if (e.keyCode === 13 || e.keyCode === 32) {
                  // enter or space
                  this.setOpen(true);

                  if (onFocus) onFocus();

                  e.preventDefault();
                  e.stopPropagation();
                }
              }}
              aria-label={
                value && ariaLabelFunc(format(value, this.getFormat()))
              }
            >
              <TimeText className={`${prefixCls}-input-time`}>
                {value ? format(value, this.getFormat(false)) : placeholder}
              </TimeText>
              <AMPMText className={`${prefixCls}-input-ampm`}>
                &nbsp;{value ? format(value, 'a') : ''}
              </AMPMText>
              {inputIcon || <span className={`${prefixCls}-icon`} />}
            </TimeDisplay>
          </span>
        )}
      </div>
    );
  }
}
