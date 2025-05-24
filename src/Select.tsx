import React, { useRef, useEffect, useCallback } from 'react';
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

function Select({
  prefixCls,
  options,
  selectedIndex,
  type,
  label,
  onSelect,
  onKeyDown,
  focused,
}: Props) {
  const selectRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Scroll to selected option on mount and when selectedIndex changes
  useEffect(() => {
    scrollToSelected(0);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    scrollToSelected(120);
    // eslint-disable-next-line
  }, [selectedIndex]);

  useEffect(() => {
    if (focused) {
      changeFocusBy(0);
    }
    // eslint-disable-next-line
  }, [focused]);

  const getOptionLabel = useCallback((value: string) => {
    const number = parseInt(value, 10);
    if (isNaN(number)) {
      return value.toUpperCase();
    }
    return number.toString();
  }, []);

  const handleSelect = useCallback(
    (value: string) => {
      onSelect(type, value);
    },
    [onSelect, type],
  );

  const changeFocusBy = useCallback(
    (offset: number) => {
      let index = selectedIndex + offset;
      if (index < 0) {
        index = options.length - 1;
      } else if (index >= options.length) {
        index = 0;
      }
      const selectedOption = options[index];
      if (selectedOption.disabled) return;
      handleSelect(selectedOption.value);

      const list = listRef.current;
      if (!list) return;
      const optionRef = list.children[index] as HTMLLIElement;
      optionRef.focus();
    },
    [options, selectedIndex, handleSelect],
  );

  const scrollToSelected = useCallback(
    (duration: number) => {
      let index = selectedIndex;
      if (index < 0) index = 0;
      const list = listRef.current;
      if (!list) return;
      const topOption = list.children[index] as HTMLLIElement;
      const to = topOption.offsetTop;
      if (selectRef.current) {
        scrollTo(selectRef.current, to, duration);
      }
    },
    [selectedIndex],
  );

  const handleComponentKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.keyCode === 40) {
        // down arrow
        changeFocusBy(1);
        e.preventDefault();
        e.stopPropagation();
      } else if (e.keyCode === 38) {
        // up arrow
        changeFocusBy(-1);
        e.preventDefault();
        e.stopPropagation();
      }
      onKeyDown(e);
    },
    [changeFocusBy, onKeyDown],
  );

  const getOptions = useCallback(() => {
    return options.map((item, index) => {
      const selected = selectedIndex === index;
      const cls = cx({
        [`${prefixCls}-select-option-selected`]: selected,
        [`${prefixCls}-select-option-disabled`]: item.disabled,
      });

      const onClick = item.disabled ? noop : () => handleSelect(item.value);

      const onOptionKeyDown = (e: React.KeyboardEvent<HTMLLIElement>) => {
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
          onKeyDown={onOptionKeyDown}
          aria-checked={selected}
          aria-label={getOptionLabel(item.value)}
        >
          {item.value}
        </li>
      );
    });
  }, [options, selectedIndex, prefixCls, handleSelect, getOptionLabel]);

  if (options.length === 0) {
    return null;
  }

  return (
    <div
      className={`${prefixCls}-select`}
      onKeyDown={handleComponentKeyDown}
      ref={selectRef}
    >
      <ul role="radiogroup" aria-label={`Select ${label}`} ref={listRef}>
        {getOptions()}
      </ul>
    </div>
  );
}

export default Select;
