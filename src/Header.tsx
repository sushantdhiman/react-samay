import React, { Component } from 'react';
import cx from 'classnames';
import {
  set,
  format as formatDate,
  parse,
  getHours,
  getMinutes,
  getSeconds,
} from 'date-fns';

type Props = {
  name: string;
  format: string;
  prefixCls: string;
  inputClassName: string;
  placeholder: string;
  value: Date;
  inputReadOnly: boolean;
  disabled?: boolean;
  hourOptions: number[];
  minuteOptions: number[];
  secondOptions: number[];
  disabledHours: () => number[];
  disabledMinutes: (hour: number | null) => number[];
  disabledSeconds: (hour: number | null, minute: number | null) => number[];
  onChange: (newValue: Date) => void;
  defaultOpenValue: Date;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
};

class Header extends Component<Props, { str: string; invalid: boolean }> {
  static defaultProps = {
    inputReadOnly: false,
  };

  private refInput: React.RefObject<HTMLInputElement>;

  constructor(props: Props) {
    super(props);
    const { value, format } = props;
    this.state = {
      str: (value && formatDate(value, format)) || '',
      invalid: false,
    };

    this.refInput = React.createRef();
    this.onInputChange = this.onInputChange.bind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    const { value, format } = nextProps;
    this.setState({
      str: (value && formatDate(value, format)) || '',
      invalid: false,
    });
  }

  onInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const str = event.target.value;

    this.setState({ str });

    const {
      format,
      hourOptions,
      minuteOptions,
      secondOptions,
      disabledHours,
      disabledMinutes,
      disabledSeconds,
      onChange,
    } = this.props;

    if (str) {
      const { value: originalValue } = this.props;
      let value = this.getProtoValue();

      try {
        const parsed = parse(str, format, new Date());

        value = set(value, {
          hours: getHours(parsed),
          minutes: getMinutes(parsed),
          seconds: getSeconds(parsed),
        });
      } catch (error) {
        this.setState({
          invalid: true,
        });
        return;
      }

      // if time value not allowed, response warning.
      if (
        hourOptions.indexOf(getHours(value)) < 0 ||
        minuteOptions.indexOf(getMinutes(value)) < 0 ||
        secondOptions.indexOf(getSeconds(value)) < 0
      ) {
        this.setState({
          invalid: true,
        });
        return;
      }

      // if time value is disabled, response warning.
      const disabledHourOptions = disabledHours();
      const disabledMinuteOptions = disabledMinutes(getHours(value));
      const disabledSecondOptions = disabledSeconds(
        getHours(value),
        getMinutes(value)
      );
      if (
        (disabledHourOptions &&
          disabledHourOptions.indexOf(getHours(value)) >= 0) ||
        (disabledMinuteOptions &&
          disabledMinuteOptions.indexOf(getMinutes(value)) >= 0) ||
        (disabledSecondOptions &&
          disabledSecondOptions.indexOf(getSeconds(value)) >= 0)
      ) {
        this.setState({
          invalid: true,
        });
        return;
      }

      if (originalValue) {
        if (
          getHours(originalValue) !== getHours(value) ||
          getMinutes(originalValue) !== getMinutes(value) ||
          getSeconds(originalValue) !== getSeconds(value)
        ) {
          // keep other fields for rc-calendar
          const changedValue = originalValue;

          onChange(
            set(changedValue, {
              hours: getHours(value),
              minutes: getMinutes(value),
              seconds: getSeconds(value),
            })
          );
        }
      } else if (originalValue !== value) {
        onChange(value);
      }
    } else {
      onChange(new Date());
    }

    this.setState({
      invalid: false,
    });
  }

  getProtoValue() {
    const { value, defaultOpenValue } = this.props;
    return value || defaultOpenValue;
  }

  getInput() {
    const {
      name,
      prefixCls,
      inputClassName,
      disabled,
      placeholder,
      inputReadOnly,
      onKeyDown,
    } = this.props;

    const { invalid, str } = this.state;

    return (
      <input
        className={cx(`${prefixCls}-input`, inputClassName, {
          [`${prefixCls}-input-invalid`]: invalid,
        })}
        ref={this.refInput}
        onKeyDown={onKeyDown}
        value={str}
        name={name}
        disabled={disabled}
        placeholder={placeholder}
        onChange={this.onInputChange}
        readOnly={!!inputReadOnly}
        aria-live="polite"
        aria-invalid={invalid}
      />
    );
  }

  render() {
    return (
      <div className={`${this.props.prefixCls}-input-wrap`}>
        {this.getInput()}
      </div>
    );
  }
}

export default Header;
