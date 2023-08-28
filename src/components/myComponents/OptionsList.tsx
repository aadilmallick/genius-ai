import React from "react";

const OptionsList = ({
  options,
}: {
  options: {
    label: string;
    value: any;
  }[];
}) => {
  return options.map((option, i) => (
    <option key={option.label} value={option.value}>
      {option.label}
    </option>
  ));
};

export default OptionsList;
