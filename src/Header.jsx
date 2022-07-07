import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import classNames from 'classnames';

class Header extends Component {
  static propTypes = {
    format: PropTypes.string,
    prefixCls: PropTypes.string,
    disabledDate: PropTypes.func,
    placeholder: PropTypes.string,
    value: PropTypes.object,
    inputReadOnly: PropTypes.bool,
    hourOptions: PropTypes.array,
    minuteOptions: PropTypes.array,
    secondOptions: PropTypes.array,
    disabledHours: PropTypes.func,
    disabledMinutes: PropTypes.func,
    disabledSeconds: PropTypes.func,
    onChange: PropTypes.func,
    defaultOpenValue: PropTypes.object,
    onKeyDown: PropTypes.func
  };

  static defaultProps = {
    inputReadOnly: false
  };

  constructor(props) {
    super(props);
    const { value, format } = props;
    this.state = {
      str: (value && value.format(format)) || '',
      invalid: false
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { value, format } = nextProps;
    this.setState({
      str: (value && value.format(format)) || '',
      invalid: false
    });
  }

  onInputChange = event => {
    const str = event.target.value;
    this.setState({
      str
    });
    const {
      format,
      hourOptions,
      minuteOptions,
      secondOptions,
      disabledHours,
      disabledMinutes,
      disabledSeconds,
      onChange
    } = this.props;

    if (str) {
      const { value: originalValue } = this.props;
      const value = this.getProtoValue();
      const parsed = moment(str, format, true);
      if (!parsed.isValid()) {
        this.setState({
          invalid: true
        });
        return;
      }
      value
        .hour(parsed.hour())
        .minute(parsed.minute())
        .second(parsed.second());

      // if time value not allowed, response warning.
      if (
        hourOptions.indexOf(value.hour()) < 0 ||
        minuteOptions.indexOf(value.minute()) < 0 ||
        secondOptions.indexOf(value.second()) < 0
      ) {
        this.setState({
          invalid: true
        });
        return;
      }

      // if time value is disabled, response warning.
      const disabledHourOptions = disabledHours();
      const disabledMinuteOptions = disabledMinutes(value.hour());
      const disabledSecondOptions = disabledSeconds(
        value.hour(),
        value.minute()
      );
      if (
        (disabledHourOptions &&
          disabledHourOptions.indexOf(value.hour()) >= 0) ||
        (disabledMinuteOptions &&
          disabledMinuteOptions.indexOf(value.minute()) >= 0) ||
        (disabledSecondOptions &&
          disabledSecondOptions.indexOf(value.second()) >= 0)
      ) {
        this.setState({
          invalid: true
        });
        return;
      }

      if (originalValue) {
        if (
          originalValue.hour() !== value.hour() ||
          originalValue.minute() !== value.minute() ||
          originalValue.second() !== value.second()
        ) {
          // keep other fields for rc-calendar
          const changedValue = originalValue;
          changedValue.hour(value.hour());
          changedValue.minute(value.minute());
          changedValue.second(value.second());
          onChange(changedValue);
        }
      } else if (originalValue !== value) {
        onChange(value);
      }
    } else {
      onChange(null);
    }

    this.setState({
      invalid: false
    });
  };

  getProtoValue() {
    const { value, defaultOpenValue } = this.props;
    return value || defaultOpenValue;
  }

  getInput() {
    const { prefixCls, placeholder, inputReadOnly } = this.props;
    const { invalid, str } = this.state;
    const invalidClass = invalid ? `${prefixCls}-input-invalid` : '';
    return (
      <input
        className={classNames(`${prefixCls}-input`, invalidClass)}
        ref={ref => {
          this.refInput = ref;
        }}
        onKeyDown={this.onKeyDown}
        value={str}
        placeholder={placeholder}
        onChange={this.onInputChange}
        readOnly={!!inputReadOnly}
        aria-live="polite"
        aria-invalid={invalid}
      />
    );
  }

  render() {
    const { prefixCls } = this.props;
    return <div className={`${prefixCls}-input-wrap`}>{this.getInput()}</div>;
  }
}

export default Header;
