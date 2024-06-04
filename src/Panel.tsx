import React, { Component } from 'react';
import FocusTrap from 'focus-trap-react';
import { getHours } from 'date-fns/getHours';
import { getMinutes } from 'date-fns/getMinutes';

import Combobox from './Combobox';
import { generateOptions, toNearestValidTime, noop } from './helpers';

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

class Panel extends Component<Props, { value: Date }> {
  static defaultProps = {
    onChange: noop,
    disabledHours: noop,
    disabledMinutes: noop,
    disabledSeconds: noop,
    defaultOpenValue: new Date(),
    use12Hours: false,
    onAmPmChange: noop,
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      value: props.value,
    };

    this.onChange = this.onChange.bind(this);
    this.onAmPmChange = this.onAmPmChange.bind(this);
    this.disabledHours = this.disabledHours.bind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    const value = nextProps.value;
    if (value) {
      this.setState({
        value,
      });
    }
  }

  onChange(newValue: Date) {
    const { onChange } = this.props;
    this.setState({ value: newValue });
    onChange(newValue);
  }

  onAmPmChange(ampm: string) {
    const { onAmPmChange } = this.props;
    onAmPmChange(ampm);
  }

  disabledHours() {
    const { use12Hours, disabledHours } = this.props;
    let disabledOptions = disabledHours();

    if (use12Hours && Array.isArray(disabledOptions)) {
      if (this.isAM()) {
        disabledOptions = disabledOptions
          .filter((h) => h < 12)
          .map((h) => (h === 0 ? 12 : h));
      } else {
        disabledOptions = disabledOptions.map((h) => (h === 12 ? 12 : h - 12));
      }
    }
    return disabledOptions;
  }

  isAM() {
    const realValue = this.state.value || this.props.defaultOpenValue;
    const hours = getHours(realValue);

    return hours >= 0 && hours < 12;
  }

  render() {
    const {
      prefixCls,
      disabledMinutes,
      disabledSeconds,
      hideDisabledOptions,
      showHour,
      showMinute,
      showSecond,
      format,
      defaultOpenValue,
      closePanel,
      use12Hours,
      hourStep,
      minuteStep,
      secondStep,
    } = this.props;
    const { value } = this.state;
    const disabledHourOptions = this.disabledHours();
    const disabledMinuteOptions = disabledMinutes(
      value ? getHours(value) : null,
    );
    const disabledSecondOptions = disabledSeconds(
      value ? getHours(value) : null,
      value ? getMinutes(value) : null,
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
            value={value}
            defaultOpenValue={validDefaultOpenValue}
            format={format}
            onChange={this.onChange}
            onAmPmChange={this.onAmPmChange}
            showHour={showHour}
            showMinute={showMinute}
            showSecond={showSecond}
            hourOptions={hourOptions}
            minuteOptions={minuteOptions}
            secondOptions={secondOptions}
            disabledHours={this.disabledHours}
            disabledMinutes={disabledMinutes}
            disabledSeconds={disabledSeconds}
            use12Hours={use12Hours}
            isAM={this.isAM()}
          />
        </div>
      </FocusTrap>
    );
  }
}

export default Panel;
