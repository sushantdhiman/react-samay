import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import moment from 'moment'
import Panel from './Panel'

function noop() {}

const TimeDisplay = styled.div`
  display: flex;
  align-items: center;
`

const TimeText = styled.div`
  font-size: 16px;
`

const AMPMText = styled.div`
  font-size: 12px;
  text-transform: uppercase;
`

export default class Picker extends Component {
  static propTypes = {
    prefixCls: PropTypes.string,
    value: PropTypes.object,
    defaultOpenValue: PropTypes.object,
    inputReadOnly: PropTypes.bool,
    disabled: PropTypes.bool,
    allowEmpty: PropTypes.bool,
    defaultValue: PropTypes.object,
    open: PropTypes.bool,
    defaultOpen: PropTypes.bool,
    placeholder: PropTypes.string,
    format: PropTypes.string,
    showHour: PropTypes.bool,
    showMinute: PropTypes.bool,
    showSecond: PropTypes.bool,
    className: PropTypes.string,
    popupClassName: PropTypes.string,
    disabledHours: PropTypes.func,
    disabledMinutes: PropTypes.func,
    disabledSeconds: PropTypes.func,
    hideDisabledOptions: PropTypes.bool,
    onChange: PropTypes.func,
    onAmPmChange: PropTypes.func,
    onOpen: PropTypes.func,
    onClose: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    addon: PropTypes.func,
    name: PropTypes.string,
    use12Hours: PropTypes.bool,
    hourStep: PropTypes.number,
    minuteStep: PropTypes.number,
    secondStep: PropTypes.number,
    onKeyDown: PropTypes.func,
    id: PropTypes.string,
    ariaLabelFunc: PropTypes.func
  }

  static defaultProps = {
    prefixCls: 'rc-time-picker',
    defaultOpen: false,
    inputReadOnly: false,
    className: '',
    popupClassName: '',
    id: '',
    defaultOpenValue: moment(),
    allowEmpty: true,
    showHour: true,
    showMinute: true,
    showSecond: true,
    disabledHours: noop,
    disabledMinutes: noop,
    disabledSeconds: noop,
    hideDisabledOptions: false,
    onChange: noop,
    onAmPmChange: noop,
    onOpen: noop,
    onClose: noop,
    onFocus: noop,
    onBlur: noop,
    addon: noop,
    use12Hours: false,
    onKeyDown: noop,
    ariaLabelFunc: noop
  }

  constructor(props) {
    super(props)
    this.saveInputRef = React.createRef()
    this.savePanelRef = React.createRef()
    const {
      defaultOpen,
      defaultValue,
      open = defaultOpen,
      value = defaultValue
    } = props
    this.state = {
      open,
      value
    }
  }

  componentWillReceiveProps(nextProps) {
    const { value, open } = nextProps
    if ('value' in nextProps) {
      this.setState({
        value
      })
    }
    if (open !== undefined) {
      this.setState({ open })
    }
  }

  onPanelChange = value => {
    this.setValue(value)
  }

  onAmPmChange = ampm => {
    const { onAmPmChange } = this.props
    onAmPmChange(ampm)
  }

  // onClear = event => {
  //   event.stopPropagation()
  //   this.setValue(null)
  //   this.setOpen(false)
  // }

  onVisibleChange = open => {
    this.setOpen(open)
  }

  closePanel = () => {
    this.setOpen(false)
    this.focus()
  }

  onKeyDown = e => {
    if (e.keyCode === 40) {
      this.setOpen(true)
    }
  }

  setValue(value) {
    const { onChange } = this.props
    if (!('value' in this.props)) {
      this.setState({
        value
      })
    }
    onChange(value)
  }

  getFormat(includeAMPM = true) {
    const { format, showHour, showMinute, showSecond, use12Hours } = this.props
    if (format) {
      return format
    }

    if (use12Hours) {
      const fmtString = [
        showHour ? 'h' : '',
        showMinute ? 'mm' : '',
        showSecond ? 'ss' : ''
      ]
        .filter(item => !!item)
        .join(':')

      return includeAMPM ? fmtString.concat(' a') : fmtString
    }

    return [
      showHour ? 'HH' : '',
      showMinute ? 'mm' : '',
      showSecond ? 'ss' : ''
    ]
      .filter(item => !!item)
      .join(':')
  }

  getPanelElement() {
    const {
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
      addon,
      use12Hours,
      onKeyDown,
      hourStep,
      minuteStep,
      secondStep
    } = this.props
    return (
      <Panel
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
        addon={addon}
        onKeyDown={onKeyDown}
      />
    )
  }

  setOpen(open) {
    const { onOpen, onClose } = this.props
    const { open: currentOpen } = this.state
    if (currentOpen !== open) {
      if (!('open' in this.props)) {
        this.setState({ open })
      }
      if (open) {
        onOpen({ open })
      } else {
        onClose({ open })
      }
    }
  }

  focus() {
    const el = this.saveInputRef.current
    if (el) el.focus()
  }

  blur() {
    const el = this.saveInputRef.current
    if (el) el.blur()
  }

  render() {
    const {
      prefixCls,
      placeholder,
      id,
      disabled,
      className,
      name,
      inputReadOnly,
      ariaLabelFunc,
      autoComplete,
      onFocus,
      onBlur,
      autoFocus,
      inputIcon
    } = this.props
    const { open, value } = this.state
    return (
      <div className={`${prefixCls}-wrapper ${className}`}>
        {open ? (
          this.getPanelElement()
        ) : (
          <span>
            <TimeDisplay
              tabIndex={0}
              className={`${prefixCls}-input`}
              onClick={() => {
                if (onFocus) {
                  onFocus()
                }
                this.setOpen(true)
              }}
              onKeyDown={e => {
                if (e.keyCode === 13 || e.keyCode === 32) {
                  // enter or space
                  this.setOpen(true)
                  if (onFocus) {
                    onFocus()
                  }
                  e.preventDefault()
                  e.stopPropagation()
                }
              }}
              disabled={disabled}
              ref={this.saveInputRef}
              role="button"
              aria-label={
                value && ariaLabelFunc(value.format(this.getFormat()))
              }
              name={name}
            >
              <TimeText className={`${prefixCls}-input-time`}>
                {value ? value.format(this.getFormat(false)) : placeholder}
              </TimeText>
              <AMPMText className={`${prefixCls}-input-ampm`}>
                &nbsp;{value ? value.format('a') : ''}
              </AMPMText>
              {inputIcon || <span className={`${prefixCls}-icon`} />}
            </TimeDisplay>
          </span>
        )}
      </div>
    )
  }
}
