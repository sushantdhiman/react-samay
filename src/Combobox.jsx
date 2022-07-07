import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Select from './Select'

const formatOption = (option, disabledOptions) => {
  let value = `${option}`
  if (option < 10) {
    value = `0${option}`
  }

  let disabled = false
  if (disabledOptions && disabledOptions.indexOf(option) >= 0) {
    disabled = true
  }

  return {
    value,
    disabled
  }
}

const Columns = styled.div`
  display: flex;
  flex-direction: row;
`

class Combobox extends Component {
  static propTypes = {
    format: PropTypes.string,
    defaultOpenValue: PropTypes.object,
    prefixCls: PropTypes.string,
    value: PropTypes.object,
    onChange: PropTypes.func,
    onAmPmChange: PropTypes.func,
    showHour: PropTypes.bool,
    showMinute: PropTypes.bool,
    showSecond: PropTypes.bool,
    hourOptions: PropTypes.array,
    minuteOptions: PropTypes.array,
    secondOptions: PropTypes.array,
    disabledHours: PropTypes.func,
    disabledMinutes: PropTypes.func,
    disabledSeconds: PropTypes.func,
    use12Hours: PropTypes.bool,
    isAM: PropTypes.bool
  }

  state = {
    selectFocusOn: null
  }

  onItemChange = (type, itemValue) => {
    const {
      onChange,
      defaultOpenValue,
      use12Hours,
      isAM,
      onAmPmChange
    } = this.props
    const value = this.props.value || defaultOpenValue
    let hour = value.hour()
    let minute = value.minute()
    let second = value.second()

    if (type === 'hour') {
      if (use12Hours) {
        if (isAM) {
          hour = +itemValue % 12
        } else {
          hour = (+itemValue % 12) + 12
        }
      } else {
        hour = +itemValue
      }
    } else if (type === 'minute') {
      minute = +itemValue
    } else if (type === 'ampm') {
      const ampm = itemValue.toUpperCase()
      if (use12Hours) {
        if (ampm === 'PM' && hour < 12) {
          hour = (hour % 12) + 12
        }

        if (ampm === 'AM') {
          if (hour >= 12) {
            hour = hour - 12
          }
        }
      }
      onAmPmChange(ampm)
    } else {
      second = +itemValue
    }
    const newValue = value.set({ hour, minute, second })
    onChange(newValue)
  }

  getHourSelect(hour) {
    const {
      prefixCls,
      hourOptions,
      disabledHours,
      showHour,
      use12Hours
    } = this.props
    if (!showHour) {
      return null
    }
    const disabledOptions = disabledHours()
    let hourOptionsAdj
    let hourAdj
    if (use12Hours) {
      hourOptionsAdj = [12].concat(hourOptions.filter(h => h < 12 && h > 0))
      hourAdj = hour % 12 || 12
    } else {
      hourOptionsAdj = hourOptions
      hourAdj = hour
    }

    return (
      <Select
        prefixCls={prefixCls}
        options={hourOptionsAdj.map(option =>
          formatOption(option, disabledOptions)
        )}
        selectedIndex={hourOptionsAdj.indexOf(hourAdj)}
        type="hour"
        label="hour"
        onSelect={this.onItemChange}
        onKeyDown={e => this.handleKeyDown('hour', e)}
        focused={this.state.selectFocusOn === 'hour'}
      />
    )
  }

  getMinuteSelect(minute) {
    const {
      prefixCls,
      minuteOptions,
      disabledMinutes,
      defaultOpenValue,
      showMinute,
      value: propValue
    } = this.props
    if (!showMinute) {
      return null
    }
    const value = propValue || defaultOpenValue
    const disabledOptions = disabledMinutes(value.hour())

    return (
      <Select
        prefixCls={prefixCls}
        options={minuteOptions.map(option =>
          formatOption(option, disabledOptions)
        )}
        selectedIndex={minuteOptions.indexOf(minute)}
        type="minute"
        label="minute"
        onSelect={this.onItemChange}
        onKeyDown={e => this.handleKeyDown('minute', e)}
        focused={this.state.selectFocusOn === 'minute'}
      />
    )
  }

  getSecondSelect(second) {
    const {
      prefixCls,
      secondOptions,
      disabledSeconds,
      showSecond,
      defaultOpenValue,
      value: propValue
    } = this.props
    if (!showSecond) {
      return null
    }
    const value = propValue || defaultOpenValue
    const disabledOptions = disabledSeconds(value.hour(), value.minute())

    return (
      <Select
        prefixCls={prefixCls}
        options={secondOptions.map(option =>
          formatOption(option, disabledOptions)
        )}
        selectedIndex={secondOptions.indexOf(second)}
        type="second"
        label="second"
        onSelect={this.onItemChange}
        onKeyDown={e => this.handleKeyDown('second', e)}
        focused={this.state.selectFocusOn === 'second'}
      />
    )
  }

  getAMPMSelect() {
    const { prefixCls, use12Hours, format, isAM } = this.props
    if (!use12Hours) {
      return null
    }

    const AMPMOptions = ['am', 'pm'] // If format has A char, then we should uppercase AM/PM
      .map(c => (format.match(/\sA/) ? c.toUpperCase() : c))
      .map(c => ({ value: c }))

    const selected = isAM ? 0 : 1

    return (
      <Select
        prefixCls={prefixCls}
        options={AMPMOptions}
        selectedIndex={selected}
        type="ampm"
        label="AM or PM"
        onSelect={this.onItemChange}
        onKeyDown={e => this.handleKeyDown('ampm', e)}
        focused={this.state.selectFocusOn === 'ampm'}
      />
    )
  }

  handleKeyDown = (currentType, e) => {
    if (e.keyCode === 39) {
      // right arrow
      this.changeFocusTo(currentType, 1)
      e.preventDefault()
      e.stopPropagation()
    } else if (e.keyCode === 37) {
      // left arrow
      this.changeFocusTo(currentType, -1)
      e.preventDefault()
      e.stopPropagation()
    }
  }

  getColumns = () => {
    // get list of enabled columns (e.g. ['hour', 'minute', 'ampm'])
    const { showHour, showMinute, showSecond, use12Hours } = this.props

    return [
      ['hour', showHour],
      ['minute', showMinute],
      ['second', showSecond],
      ['ampm', use12Hours]
    ]
      .filter(([val, enabled]) => enabled)
      .map(([val, enabled]) => val)
  }

  changeFocusTo(currentSelectType, offset) {
    const columns = this.getColumns()

    const currentIndex = columns.indexOf(currentSelectType)
    let newIndex = currentIndex + offset

    // bounds + wrap
    if (newIndex < 0) {
      newIndex = columns.length - 1
    } else if (newIndex >= columns.length) {
      newIndex = 0
    }

    const newFocusOn = columns[newIndex]
    this.setState({ selectFocusOn: newFocusOn })
  }

  render() {
    const { prefixCls, defaultOpenValue, value: propValue } = this.props
    const value = propValue || defaultOpenValue
    return (
      <Columns className={`${prefixCls}-combobox`}>
        {this.getHourSelect(value.hour())}
        {this.getMinuteSelect(value.minute())}
        {this.getSecondSelect(value.second())}
        {this.getAMPMSelect(value.hour())}
      </Columns>
    )
  }
}

export default Combobox
