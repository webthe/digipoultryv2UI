import React, { useEffect, useRef } from 'react';
import { Controller } from 'react-hook-form';
import $ from 'jquery';
import 'select2/dist/js/select2.min.js';
import 'select2/dist/css/select2.min.css';

function SelectWithSelect2({ control, name }) {
  const selectRef = useRef();

  useEffect(() => {
    $(selectRef.current)
      .select2({ placeholder: 'Select an option', width: '100%' })
      .on('change', function () {
        this.dispatchEvent(new Event('change', { bubbles: true }));
      });

    return () => {
      $(selectRef.current).select2('destroy');
    };
  }, []);

  const options = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];

  return (
    <Controller
      as={
        <select ref={selectRef} multiple>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      }
      control={control}
      name={name}
      rules={{ required: "This field is required." }}
      defaultValue={[]}
    />
  );
}

export default SelectWithSelect2;
