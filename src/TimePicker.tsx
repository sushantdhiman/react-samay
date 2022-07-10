import React, { Component, KeyboardEvent, RefObject } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { format } from 'date-fns';

import { noop } from './helpers';
import Panel from './Panel';

const Wrapper = styled.div`
  display: flex;
  position: relative;
`;

type Props = {
  prefixCls: string;
  value: Date;
  defaultOpenValue: Date;
  inputReadOnly: boolean;
  allowEmpty: boolean;
  defaultValue: Date;
  open: boolean;
  id: string;
  disabled?: boolean;
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
  ariaLabelFunc: (value: string) => string;
  style: React.CSSProperties;
};

type PickerProps = typeof Picker.defaultProps & Props;

export default class Picker extends Component<
  PickerProps,
  { value: Date; open: boolean }
> {
  static defaultProps: Partial<Props> = {
    id: '',
    disabled: false,
    prefixCls: 'react-samay',
    defaultOpen: false,
    inputReadOnly: false,
    className: '',
    popupClassName: '',
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
    if ([13, 32, 40].indexOf(e.keyCode) >= 0) {
      this.setOpen(true);
    }
  }

  onClick() {
    if (this.props.onFocus) this.props.onFocus();
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

  getPanelElement() {
    const {
      name,
      className,
      prefixCls,
      placeholder,
      disabledHours,
      disabledMinutes,
      disabledSeconds,
      hideDisabledOptions,
      inputReadOnly,
      disabled,
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
        name={name}
        className={className}
        prefixCls={`${prefixCls}-panel`}
        ref={this.savePanelRef}
        value={this.state.value}
        inputReadOnly={inputReadOnly}
        disabled={disabled}
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

  render() {
    const {
      prefixCls,
      id,
      name,
      disabled,
      placeholder,
      use12Hours,
      inputReadOnly,
      className,
      ariaLabelFunc,
      onFocus,
      onBlur,
      style,
    } = this.props;

    const { open, value } = this.state;
    const strValue = (value && format(value, this.getFormat(use12Hours))) || '';

    return (
      <Wrapper
        id={id}
        style={style}
        className={classNames(`${prefixCls}-wrapper`, className)}
      >
        {open ? (
          this.getPanelElement()
        ) : (
          <input
            type="text"
            name={name}
            className={`${prefixCls}-input`}
            ref={this.saveInputRef}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={!!inputReadOnly}
            aria-label={ariaLabelFunc(strValue)}
            defaultValue={strValue}
            onFocus={onFocus}
            onBlur={onBlur}
            onClick={this.onClick}
            onKeyDown={this.onKeyDown}
          />
        )}
      </Wrapper>
    );
  }
}
