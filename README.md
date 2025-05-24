# React Samay

[![npm](https://img.shields.io/npm/v/react-samay)](https://npmjs.com/package/react-samay)
[![Node.js CI](https://github.com/sushantdhiman/react-samay/actions/workflows/ci.js.yml/badge.svg)](https://github.com/sushantdhiman/react-samay/actions/workflows/ci.js.yml)

Time picker for React.js

> This is a fork from [rc-time-picker](https://github.com/react-component/time-picker/),
> which is no longer maintained. I have also mixed styling
> support from [time-picker-io](https://github.com/codercodingthecode/time-picker-io).

## Features

- Uses native date object
- Dropdown based hours, minutes, seconds & meridiem selection.
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
import { createRoot } from 'react-dom/client';

// import css file
import 'react-samay/index.css';

const container = document.getElementById('app');
const root = createRoot(container);

root.render(
  <TimePicker
    value={new Date()}
    onChange={(date) => {
      console.log(date);
    }}
  />
);
```

## Storybook Examples

You can find storybook examples [here](https://sushantdhiman.com/projects/react-samay).

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
