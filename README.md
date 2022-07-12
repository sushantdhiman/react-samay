# React Samay

[![npm](https://img.shields.io/npm/v/react-samay)](https://npmjs.com/package/react-samay)

Time picker for React.js

> This is a fork from [rc-time-picker](https://github.com/react-component/time-picker/),
> which is no longer maintained. I have also mixed styling
> support from [time-picker-io](https://github.com/codercodingthecode/time-picker-io).

## Beta Release

This migrated package is still not ready for production, as there might be some
bugs related to code refactor. I'll welcome any PR(s) or bug reports so this package
can be improved.

## Features

- Uses native date object
- Dropdown based hours, minutes, seconds & meridiem selection, better for desktop
  users with keyboard / mouse.
- Keyboard navigation
- Similar API as `rc-time-picker`
- Written with Typescript, with built-in typings

## Install

```bash
npm i --save react-samay
```

## Usage

```js
import { TimePicker } from 'react-samay';
import ReactDOM from 'react-dom';

ReactDOM.render(
  <TimePicker
    value={new Date()}
    onChange={(date) => {
      console.log(date);
    }}
  />,
  <div id="app" />
);
```

You can find more storybook examples [here](https://sushantdhiman.com/projects/react-samay).

## API

### TimePicker

| Name                | Type               | Default       | Description                                                                         |
| ------------------- | ------------------ | ------------- | ----------------------------------------------------------------------------------- | --- |
| prefixCls           | String             | 'react-samay' | prefixCls of this component                                                         |
| disabled            | Boolean            | false         | whether picker is disabled                                                          |
| open                | Boolean            | false         | current open state of picker. controlled prop                                       |
| defaultValue        | Date               | null          | default initial value                                                               |
| defaultOpenValue    | Date               | new Date()    | default open panel value, used to set utcOffset,locale if value/defaultValue absent |
| value               | Date               | null          | current value                                                                       |
| placeholder         | String             | ''            | time input's placeholder                                                            |
| className           | String             | ''            | time picker className                                                               |
| inputClassName      | String             | ''            | time picker input element className                                                 |
| name                | String             | -             | name of input element                                                               |
| id                  | String             | ''            | id to set on time picker                                                            |
| showHour            | Boolean            | true          | whether show hour                                                                   |     |
| showMinute          | Boolean            | true          | whether show minute                                                                 |
| showSecond          | Boolean            | true          | whether show second                                                                 |
| format              | String             | -             | date-fns supported format                                                           |
| disabledHours       | Function           | -             | disabled hour options                                                               |
| disabledMinutes     | Function           | -             | disabled minute options                                                             |
| disabledSeconds     | Function           | -             | disabled second options                                                             |
| use12Hours          | Boolean            | false         | 12 hours display mode                                                               |
| hideDisabledOptions | Boolean            | false         | whether hide disabled options                                                       |
| onChange            | Function           | null          | called when time-picker value changes                                               |
| onAmPmChange        | Function           | null          | called when time-picker meridiem changes                                            |
| onOpen              | Function({ open }) |               | called when time picker panel is opened                                             |
| onClose             | Function({ open }) |               | called when time picker panel is closed                                             |
| hourStep            | Number             | 1             | interval between hours in picker                                                    |
| minuteStep          | Number             | 1             | interval between minutes in picker                                                  |
| secondStep          | Number             | 1             | interval between seconds in picker                                                  |
| inputReadOnly       | Boolean            | false         | set input to read only                                                              |
