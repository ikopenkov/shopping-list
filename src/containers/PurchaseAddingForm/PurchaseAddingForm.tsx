import * as React from 'react';
import { GlobalState } from 'reducers/rootReducer';
import { ListActions } from 'modules/ListModule/ListActions';
import { connect, Dispatch } from 'react-redux';
import { Action, bindActionCreators } from 'redux';
import { TypeOfConnect } from 'utils/ReduxUtils';
import { styled } from 'components/StyledComponents/StyledComponents';
import Button, { ButtonProps } from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
  PurchaseNameField,
  PurchaseNameFieldProps,
} from 'components/PurchaseNameField/PurchaseNameField';
import InputAdornment from '@material-ui/core/InputAdornment';
import { StyleConstants } from 'src/constants/StyleConstants';

type OwnProps = {
  listId: string;
};

const connector = connect(
  (state: GlobalState, ownProps: OwnProps) => ({}),
  (dispatch: Dispatch<Action>) =>
    bindActionCreators(
      {
        createPurchase: ListActions.createPurchase,
      },
      dispatch,
    ),
);

type Props = {} & OwnProps & TypeOfConnect<typeof connector>;

type State = {
  purchaseName: string;
  isRequesting: boolean;
  isTextareaActive: boolean;
};

class Component extends React.PureComponent<Props, State> {
  state: State = {
    purchaseName: '',
    isRequesting: false,
    isTextareaActive: false,
  };

  private handlePurchaseNameChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const value = event.currentTarget.value;
    this.setState({ purchaseName: value });
  };

  private handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    this.submit();
  };

  private submit = async () => {
    if (this.state.purchaseName.length) {
      this.setState({ isRequesting: true });

      await this.props.createPurchase(this.props.listId, {
        name: this.state.purchaseName,
      });

      this.setState({ isRequesting: false, purchaseName: '' });
    }
  };

  private renderButton = () => (
    <StyledButton
      type="submit"
      disabled={!this.state.purchaseName.length || this.state.isRequesting}
      color="primary"
      variant="outlined"
    >
      {this.state.isRequesting ? <CircularProgress size={30} /> : <AddIcon />}
    </StyledButton>
  );

  private handleTextareaKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (event.keyCode == 13 && event.shiftKey == false) {
      event.preventDefault();

      this.submit();
    }
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <StyledPurchaseNameField
          inputProps={{
            onKeyDown: this.handleTextareaKeyDown,
          }}
          placeholder="Add purchase"
          value={this.state.purchaseName}
          onChange={this.handlePurchaseNameChange}
          variant="standard"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {this.renderButton()}
              </InputAdornment>
            ),
          }}
        />
      </form>
    );
  }
}
export const PurchaseAddingForm = connector(Component);

const StyledButton = styled(Button as React.FunctionComponent<ButtonProps>)`
  && {
    min-width: 48px;
    padding: 0;
  }
`;

const StyledPurchaseNameField = styled(
  ({ InputProps = {}, ...props }: PurchaseNameFieldProps) => (
    <PurchaseNameField
      InputProps={{ ...InputProps, classes: { root: 'input' } }}
      {...props}
    />
  ),
// any instead of PurchaseNameFieldProps becuase there is no working solutions
// here https://www.styled-components.com/docs/api#typescript
// and here https://github.com/styled-components/styled-components/issues/630
)<any>`
  & .input {
    padding: ${StyleConstants.rowPadding};
    min-height: ${StyleConstants.rowHeight};
  }
`;
