import * as React from 'react';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';

export const PurchaseNameField: React.FunctionComponent<TextFieldProps> = ({
  inputProps = {},
  ...props
}) => {
  const outlinedToFixTypeBug: any = 'outlined';
  return (
    <TextField
      multiline
      rowsMax="5"
      fullWidth={true}
      inputProps={{
        maxLength: 100,
        ...inputProps,
      }}
      variant={outlinedToFixTypeBug}
      {...props}
    />
  );
};

export type PurchaseNameFieldProps = TextFieldProps;
