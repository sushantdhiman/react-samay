import React, { Component } from 'react';
import styled from 'styled-components';
import { set, getHours, getMinutes, getSeconds } from 'date-fns';

import Select from './Select';
import { formatOption } from './helpers';

import type { Selector } from './interface';

const Columns = styled.div`
  display: flex;
  flex-direction: row;
  position: absolute;
  z-index: 100;
  width: 100%;
  background-color: inherit;
`;

type Props = {
  format: string;
  defaultOpenValue: Date;
  prefixCls: string;
  value: Date;
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
  use12Hours: boolean;
  isAM: boolean;
};

class Combobox extends Component<Props, { selectFocusOn: null | Selector }> {
  constructor(props: Props) {
    super(props);

    this.state = {
      selectFocusOn: null,
    };

    this.onItemChange = this.onItemChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.getColumns = this.getColumns.bind(this);
  }

  onItemChange(type: Selector, itemValue: string) {
    const { onChange, defaultOpenValue, use12Hours, isAM, onAmPmChange } =
      this.props;
    const value = this.props.value || defaultOpenValue;

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
      })
    );
  }

  getHourSelect(hour: number) {
    const { prefixCls, hourOptions, disabledHours, showHour, use12Hours } =
      this.props;

    if (!showHour) {
      return null;
    }

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
          formatOption(option, disabledOptions)
        )}
        selectedIndex={hourOptionsAdj.indexOf(hourAdj)}
        type="hour"
        label="hour"
        onSelect={this.onItemChange}
        onKeyDown={(e) => this.handleKeyDown('hour', e)}
        focused={this.state.selectFocusOn === 'hour'}
      />
    );
  }

  getMinuteSelect(minute: number) {
    const {
      prefixCls,
      minuteOptions,
      disabledMinutes,
      defaultOpenValue,
      showMinute,
      value: propValue,
    } = this.props;
    if (!showMinute) {
      return null;
    }
    const value = propValue || defaultOpenValue;
    const disabledOptions = disabledMinutes(getHours(value));

    return (
      <Select
        prefixCls={prefixCls}
        options={minuteOptions.map((option) =>
          formatOption(option, disabledOptions)
        )}
        selectedIndex={minuteOptions.indexOf(minute)}
        type="minute"
        label="minute"
        onSelect={this.onItemChange}
        onKeyDown={(e) => this.handleKeyDown('minute', e)}
        focused={this.state.selectFocusOn === 'minute'}
      />
    );
  }

  getSecondSelect(second: number) {
    const {
      prefixCls,
      secondOptions,
      disabledSeconds,
      showSecond,
      defaultOpenValue,
      value: propValue,
    } = this.props;
    if (!showSecond) {
      return null;
    }
    const value = propValue || defaultOpenValue;
    const disabledOptions = disabledSeconds(getHours(value), getMinutes(value));

    return (
      <Select
        prefixCls={prefixCls}
        options={secondOptions.map((option) =>
          formatOption(option, disabledOptions)
        )}
        selectedIndex={secondOptions.indexOf(second)}
        type="second"
        label="second"
        onSelect={this.onItemChange}
        onKeyDown={(e) => this.handleKeyDown('second', e)}
        focused={this.state.selectFocusOn === 'second'}
      />
    );
  }

  getAMPMSelect() {
    const { prefixCls, use12Hours, format, isAM } = this.props;

    if (!use12Hours) {
      return null;
    }

    const AMPMOptions = ['am', 'pm'] // If format has A char, then we should uppercase AM/PM
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
        onSelect={this.onItemChange}
        onKeyDown={(e) => this.handleKeyDown('ampm', e)}
        focused={this.state.selectFocusOn === 'ampm'}
      />
    );
  }

  handleKeyDown(currentType: Selector, e: React.KeyboardEvent<HTMLElement>) {
    if (e.keyCode === 39) {
      // right arrow
      this.changeFocusTo(currentType, 1);
      e.preventDefault();
      e.stopPropagation();
    } else if (e.keyCode === 37) {
      // left arrow
      this.changeFocusTo(currentType, -1);
      e.preventDefault();
      e.stopPropagation();
    }
  }

  getColumns() {
    // get list of enabled columns (e.g. ['hour', 'minute', 'ampm'])
    const { showHour, showMinute, showSecond, use12Hours } = this.props;

    return [
      ['hour', showHour],
      ['minute', showMinute],
      ['second', showSecond],
      ['ampm', use12Hours],
    ]
      .filter(([, enabled]) => enabled)
      .map(([val]) => val as Selector);
  }

  changeFocusTo(currentSelectType: Selector, offset: number) {
    const columns = this.getColumns();

    const currentIndex = columns.indexOf(currentSelectType);
    let newIndex = currentIndex + offset;

    // bounds + wrap
    if (newIndex < 0) {
      newIndex = columns.length - 1;
    } else if (newIndex >= columns.length) {
      newIndex = 0;
    }

    const newFocusOn = columns[newIndex];

    this.setState({ selectFocusOn: newFocusOn });
  }

  render() {
    const { prefixCls, defaultOpenValue, value: propValue } = this.props;
    const value = propValue || defaultOpenValue;
    return (
      <Columns className={`${prefixCls}-combobox`}>
        {this.getHourSelect(getHours(value))}
        {this.getMinuteSelect(getMinutes(value))}
        {this.getSecondSelect(getSeconds(value))}
        {this.getAMPMSelect()}
      </Columns>
    );
  }
}

export default Combobox;
