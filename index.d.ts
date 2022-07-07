declare module 'react-samay' {
  import React from 'react'
  import { Moment } from 'moment'
  const TimePicker: React.ComponentClass<Partial<TimePickerProps>>
  export default TimePicker
  export interface TimePickerProps {
    prefixCls: string | 'rc-time-picker'
    clearText: string
    value: Moment
    defaultOpenValue: Moment
    inputReadOnly: boolean
    disabled: boolean
    allowEmpty: boolean
    defaultValue: Moment
    open: boolean
    defaultOpen: boolean
    align: unknown
    placement: string
    transitionName: string
    getPopupContainer: unknown
    placeholder: string
    format: string
    showHour: boolean
    showMinute: boolean
    showSecond: boolean
    style: unknown
    className: string
    popupClassName: string
    disabledHours: boolean
    disabledMinutes: boolean
    disabledSeconds: boolean
    hideDisabledOptions: boolean
    onChange: (value: Moment) => null
    onOpen: () => null
    onClose: () => null
    onFocus: () => null
    onBlur: () => null
    addon: () => null
    name: string
    autoComplete: string
    use12Hours: boolean
    hourStep: number
    minuteStep: number
    secondStep: number
    focusOnOpen: boolean
    onKeyDown: () => unknown
    autoFocus: boolean
    id: string
    inputIcon?: React.ReactNode
    clearIcon?: React.ReactNode
  }
}
