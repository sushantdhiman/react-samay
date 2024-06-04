import React, { Component } from 'react';
import cx from 'classnames';

import type { Selector } from './interface';
import { scrollTo, noop } from './helpers';

type Props = {
  prefixCls: string;
  options: Array<{ value: string; disabled: boolean }>;
  selectedIndex: number;
  type: Selector;
  label: string;
  onSelect: (type: Selector, itemValue: string) => void;
  onKeyDown: React.KeyboardEventHandler<HTMLElement>;
  focused: boolean;
};

class Select extends Component<Props> {
  private selectRef: React.RefObject<HTMLDivElement>;
  private listRef: React.RefObject<HTMLUListElement>;

  constructor(props: Props) {
    super(props);

    this.selectRef = React.createRef();
    this.listRef = React.createRef();

    this.onSelect = this.onSelect.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidMount() {
    // jump to selected option
    this.scrollToSelected(0);
  }

  componentDidUpdate(prevProps: Props) {
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

  onSelect(value: string) {
    const { onSelect, type } = this.props;
    onSelect(type, value);
  }

  getOptionLabel(value: string) {
    // 01 -> 1
    // 30 -> 30
    const number = parseInt(value, 10);

    if (isNaN(number)) {
      // am -> AM
      return value.toUpperCase();
    }

    return number.toString();
  }

  getOptions() {
    const { options, selectedIndex, prefixCls } = this.props;

    return options.map((item, index) => {
      const selected = selectedIndex === index;
      const cls = cx({
        [`${prefixCls}-select-option-selected`]: selected,
        [`${prefixCls}-select-option-disabled`]: item.disabled,
      });

      const onClick = item.disabled
        ? noop
        : () => {
            this.onSelect(item.value);
          };

      const onKeyDown = (e: React.KeyboardEvent<HTMLLIElement>) => {
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

  handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
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
  }

  changeFocusBy(offset: number) {
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

    if (selectedOption.disabled) return;

    this.onSelect(selectedOption.value);

    // get new ref
    const list = this.listRef.current;
    if (!list) return;

    const optionRef = list.children[index] as HTMLLIElement;
    optionRef.focus();
  }

  scrollToSelected(duration: number) {
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

    const topOption = list.children[index] as HTMLLIElement;
    const to = topOption.offsetTop;

    if (this.selectRef.current) {
      scrollTo(this.selectRef.current, to, duration);
    }
  }

  render() {
    const { prefixCls, options, label } = this.props;

    if (options.length === 0) {
      return null;
    }

    return (
      <div
        className={`${prefixCls}-select`}
        onKeyDown={this.handleKeyDown}
        ref={this.selectRef}
      >
        <ul role="radiogroup" aria-label={`Select ${label}`} ref={this.listRef}>
          {this.getOptions()}
        </ul>
      </div>
    );
  }
}

export default Select;
