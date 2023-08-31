import React from "react";

interface IFormErrorProp {
  errorMessage: string;
}

export const FormError: React.FC<IFormErrorProp> = ({ errorMessage }) => (
  <span className=" font-semibold text-red-500">{errorMessage}</span>
);
