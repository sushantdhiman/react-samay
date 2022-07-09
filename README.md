# React Samay

![npm](https://img.shields.io/npm/v/react-samay)

Time picker library for React.js

> This is mainly a fork from [rc-time-picker](https://github.com/react-component/time-picker/),
> which is no longer maintained. I have also mixed styling
> support from [time-picker-io](https://github.com/codercodingthecode/time-picker-io).

## Beta Release

This migrated package is still not ready for production, as there might be some
bugs related to code refactor. I'll welcome any PR(s) or issues so this package
can be improved.

## Features

- Uses native date object
- Dropdown based hour, minutes, seconds & meridiem. Better for desktop users
  with keyboard / mouse.
- Keyboard navigation
- Styled component
- Similar API as `rc-time-picker`
- Written with Typescript
- In-built typings

## Install

```bash
npm i --save react-samay
```

## Usage

```js
import TimePicker from 'react-samay';
import ReactDOM from 'react-dom';

ReactDOM.render(<TimePicker />, container);
```

## Examples

Storybook examples are available [here](https://sushantdhiman.com/projects/react-samay).
