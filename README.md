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

| Name                | Type               | Default       |
| ------------------- | ------------------ | ------------- |
| prefixCls           | String             | 'react-samay' |
| disabled            | Boolean            | false         |
| open                | Boolean            | false         |
| defaultValue        | Date               | null          |
| defaultOpenValue    | Date               | new Date()    |
| value               | Date               | null          |
| placeholder         | String             | ''            |
| className           | String             | ''            |
| inputClassName      | String             | ''            |
| name                | String             | -             |
| id                  | String             | ''            |
| showHour            | Boolean            | true          |
| showMinute          | Boolean            | true          |
| showSecond          | Boolean            | true          |
| format              | String             | -             |
| disabledHours       | Function           | -             |
| disabledMinutes     | Function           | -             |
| disabledSeconds     | Function           | -             |
| use12Hours          | Boolean            | false         |
| hideDisabledOptions | Boolean            | false         |
| onChange            | Function           | null          |
| onAmPmChange        | Function           | null          |
| onOpen              | Function({ open }) |               |
| onClose             | Function({ open }) |               |
| hourStep            | Number             | 1             |
| minuteStep          | Number             | 1             |
| secondStep          | Number             | 1             |
| inputReadOnly       | Boolean            | false         |
