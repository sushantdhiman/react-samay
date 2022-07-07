import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import classNames from 'classnames';
import raf from 'raf';

const scrollTo = (element, to, duration) => {
  // jump to target if duration zero
  if (duration <= 0) {
    raf(() => {
      element.scrollTop = to;
    });
    return;
  }
  const difference = to - element.scrollTop;
  const perTick = (difference / duration) * 10;

  raf(() => {
    element.scrollTop += perTick;
    if (element.scrollTop === to) return;
    scrollTo(element, to, duration - 10);
  });
};

const Column = styled.div`
  flex: 1;

  /* Pos rel needed to make offsetTop work
  used in scrolling to selected option */
  position: relative;
  overflow-y: auto;
  max-height: 12em;

  ul {
    list-style: none;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    width: 100%;
  }

  li {
    list-style: none;
    margin: 0;
    padding: 0;
    /* padding: 0 0 0 16px; */
    /* width: 100%; */
    height: 24px;
    line-height: 24px;
    text-align: left;
    cursor: pointer;
    user-select: none;

    &:hover {
      background: #edfaff;
    }
  }
`;

class Select extends Component {
  static propTypes = {
    prefixCls: PropTypes.string,
    options: PropTypes.array,
    selectedIndex: PropTypes.number,
    type: PropTypes.string,
    label: PropTypes.string,
    onSelect: PropTypes.func,
    onMouseEnter: PropTypes.func,
    focused: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.selectRef = React.createRef();
    this.listRef = React.createRef();
  }

  componentDidMount() {
    // jump to selected option
    this.scrollToSelected(0);
  }

  componentDidUpdate(prevProps) {
    const { selectedIndex, focused } = this.props;
    // smooth scroll to selected option
    if (prevProps.selectedIndex !== selectedIndex) {
      this.scrollToSelected(120);
    }
    if (prevProps.focused !== focused && focused) {
      // focus on selectedIndex
      this.changeFocusBy(0);
    }
  }

  onSelect = value => {
    const { onSelect, type } = this.props;
    onSelect(type, value);
  };

  getOptionLabel(value) {
    // 01 -> 1
    // 30 -> 30
    const number = parseInt(value, 10);

    if (isNaN(number)) {
      // am -> AM
      return value.toUpperCase();
    }

    return number;
  }

  getOptions() {
    const { options, selectedIndex, prefixCls } = this.props;
    return options.map((item, index) => {
      const selected = selectedIndex === index;
      const cls = classNames({
        [`${prefixCls}-select-option-selected`]: selected,
        [`${prefixCls}-select-option-disabled`]: item.disabled
      });
      const onClick = item.disabled
        ? undefined
        : () => {
            this.onSelect(item.value);
          };
      const onKeyDown = e => {
        if (e.keyCode === 13 || e.keyCode === 32) {
          // enter or space
          onClick();
          e.preventDefault();
          e.stopPropagation();
        }
      };

      return (
        <li
          role="radio"
          onClick={onClick}
          className={cls}
          key={index}
          disabled={item.disabled}
          tabIndex={0}
          onKeyDown={onKeyDown}
          aria-checked={selected}
          aria-label={this.getOptionLabel(item.value)}
        >
          {item.value}
        </li>
      );
    });
  }

  handleKeyDown = e => {
    if (e.keyCode === 40) {
      // down arrow
      this.changeFocusBy(1);
      e.preventDefault();
      e.stopPropagation();
    } else if (e.keyCode === 38) {
      // up arrow
      this.changeFocusBy(-1);
      e.preventDefault();
      e.stopPropagation();
    }
    // pass keydown to parent
    this.props.onKeyDown(e);
  };

  changeFocusBy(offset) {
    const { options, selectedIndex } = this.props;

    // get new element index
    let index = selectedIndex + offset;
    if (index < 0) {
      index = options.length - 1;
    } else if (index >= options.length) {
      index = 0;
    }

    // get new value
    const selectedOption = options[index];
    this.onSelect(selectedOption.value);

    // get new ref
    const list = this.listRef.current;
    if (!list) {
      return;
    }
    const optionRef = list.children[index];
    optionRef.focus();
  }

  scrollToSelected(duration) {
    // move to selected item
    const { selectedIndex } = this.props;
    const list = this.listRef.current;
    if (!list) {
      return;
    }
    let index = selectedIndex;
    if (index < 0) {
      index = 0;
    }
    const topOption = list.children[index];
    const to = topOption.offsetTop;
    scrollTo(this.selectRef.current, to, duration);
  }

  render() {
    const { prefixCls, options, label } = this.props;
    if (options.length === 0) {
      return null;
    }
    return (
      <Column
        className={`${prefixCls}-select`}
        onKeyDown={this.handleKeyDown}
        ref={this.selectRef}
      >
        <ul role="radiogroup" aria-label={`Select ${label}`} ref={this.listRef}>
          {this.getOptions()}
        </ul>
      </Column>
    );
  }
}

export default Select;
