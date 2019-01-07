import * as React from 'react';
import Dialog, { DialogProps } from '@material-ui/core/Dialog';
import DialogActions, {
  DialogActionsProps,
} from '@material-ui/core/DialogActions';
import DialogContent, {
  DialogContentProps,
} from '@material-ui/core/DialogContent';
import { connect, Dispatch } from 'react-redux';
import { GlobalState } from 'reducers/rootReducer';
import { Action, bindActionCreators } from 'redux';
import { ListActions } from 'modules/ListModule/ListActions';
import { TypeOfConnect } from 'utils/ReduxUtils';
import CircularProgress from '@material-ui/core/CircularProgress';
import AddIcon from '@material-ui/icons/Add';
import Button, { ButtonProps } from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { ListSelectors } from 'modules/ListModule/ListSelectors';
import DeleteIcon from '@material-ui/icons/DeleteOutline';
import { styled } from 'components/StyledComponents/StyledComponents';
import Switch from '@material-ui/core/Switch';
import FormControlLabel, {
  FormControlLabelProps,
} from '@material-ui/core/FormControlLabel';
import RemoveIcon from '@material-ui/icons/Remove';
import { DialogRenderer, IDialogProps } from 'utils/DialogRenderer';

/**
 *
 * TODO: use formik or final-form or redux-form for validation
 *
 */

type NeedProps = {
  listId: string;
  purchaseId: string;
};

type OwnProps = IDialogProps & NeedProps;

const connector = connect(
  (state: GlobalState, ownProps: OwnProps) => ({
    purchase: ListSelectors.getPurchase(
      state,
      ownProps.listId,
      ownProps.purchaseId,
    ),
  }),
  (dispatch: Dispatch<Action>) =>
    bindActionCreators(
      {
        updatePurchase: ListActions.updatePurchase,
        deletePurchase: ListActions.deletePurchase,
      },
      dispatch,
    ),
);

type Props = {} & OwnProps & TypeOfConnect<typeof connector>;

type State = {
  purchaseName: string;
  purchaseNumber: string;
  bought: boolean;
  isRequesting: boolean;
  numberError: string;
};

class Component extends React.PureComponent<Props, State> {
  state: State = {
    purchaseName: this.props.purchase.name,
    purchaseNumber: String(this.props.purchase.number),
    bought: this.props.purchase.bought,
    isRequesting: false,
    numberError: '',
  };

  private handlePurchaseNameChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const value = event.currentTarget.value;
    this.setState({ purchaseName: value });
  };

  private handleTextareaKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (event.keyCode == 13 && event.shiftKey == false) {
      event.preventDefault();

      this.submit();
    }
  };

  private handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    this.submit();
  };

  private submit = async () => {
    if (
      !this.state.isRequesting &&
      !this.state.numberError &&
      this.state.purchaseName.length
    ) {
      this.setState({ isRequesting: true });

      await this.props.updatePurchase(
        this.props.listId,
        this.props.purchaseId,
        {
          name: this.state.purchaseName,
          bought: this.state.bought,
          number: +this.state.purchaseNumber,
        },
      );

      this.setState({ isRequesting: false });
      this.close();
    }
  };

  private handleBoughtSwitched = (
    event: React.ChangeEvent<HTMLInputElement>,
    value: boolean,
  ) => {
    this.setState({
      bought: value,
    });
  };

  private handleNumberChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const purchaseNumber = event.currentTarget.value;
    this.setState({
      purchaseNumber,
      numberError: this.validatePurchaseNumber(purchaseNumber),
    });
  };

  private validatePurchaseNumber = (purchaseNumber: string) => {
    if (purchaseNumber === '' || +purchaseNumber < 1 || +purchaseNumber > 100) {
      return 'Enter number between 1 and 100';
    } else {
      return '';
    }
  };

  private handleNumberAdd = () => {
    this.setState(({ purchaseNumber }) => {
      purchaseNumber = String(+purchaseNumber + 1);
      return {
        purchaseNumber,
        numberError: this.validatePurchaseNumber(purchaseNumber),
      };
    });
  };

  private handleNumberSubtract = () => {
    this.setState(({ purchaseNumber }) => {
      purchaseNumber = String(+purchaseNumber - 1);
      return {
        purchaseNumber,
        numberError: this.validatePurchaseNumber(purchaseNumber),
      };
    });
  };

  private handleDeleteClick = async () => {
    this.setState({
      isRequesting: true,
    });

    await this.props.deletePurchase(this.props.listId, this.props.purchaseId);

    this.setState({
      isRequesting: false,
    });
    this.close();
  };

  private close = () => {
    this.props.onClose();
  };

  render() {
    return (
      <StyledDialog
        classes={{
          paper: 'paper',
        }}
        open={this.props.isOpened}
        onClose={this.close}
        onEscapeKeyDown={this.close}
      >
        <form onSubmit={this.handleSubmit}>
          <StyledDialogContent>
            <TextField
              multiline
              rowsMax="5"
              value={this.state.purchaseName}
              onChange={this.handlePurchaseNameChange}
              variant="outlined"
              fullWidth={true}
              inputProps={{
                onKeyDown: this.handleTextareaKeyDown,
                maxLength: 100,
              }}
              error={!this.state.purchaseName.length}
              helperText={
                this.state.purchaseName.length ? undefined : 'Enter name'
              }
            />

            <BougthSwitcherWrapper
              control={
                <Switch
                  checked={this.state.bought}
                  onChange={this.handleBoughtSwitched}
                  value="isBought"
                  color="primary"
                />
              }
              label="Bought"
            />

            <NumberFieldWrapper>
              <Button
                onClick={this.handleNumberSubtract}
                disabled={+this.state.purchaseNumber <= 1}
              >
                <RemoveIcon />
              </Button>
              <NumberField
                error={!!this.state.numberError}
                value={this.state.purchaseNumber}
                onChange={this.handleNumberChange}
                type="number"
                helperText={this.state.numberError || 'Number'}
                InputProps={{
                  classes: {
                    input: 'input',
                  },
                  inputProps: {
                    min: 1,
                    max: 100,
                  },
                }}
                FormHelperTextProps={{
                  classes: {
                    root: 'formHelper',
                  },
                }}
              />
              <Button
                onClick={this.handleNumberAdd}
                disabled={+this.state.purchaseNumber >= 100}
              >
                <AddIcon />
              </Button>
            </NumberFieldWrapper>
          </StyledDialogContent>
          <StyledDialogActions>
            {this.state.isRequesting ? (
              <CircularProgress />
            ) : (
              <React.Fragment>
                <StyledDeleteButton
                  color="primary"
                  onClick={this.handleDeleteClick}
                >
                  <DeleteIcon />
                </StyledDeleteButton>

                <Button
                  disabled={
                    !!this.state.numberError || !this.state.purchaseName.length
                  }
                  color="primary"
                  onClick={this.close}
                >
                  Cancel
                </Button>
                <Button
                  disabled={
                    !!this.state.numberError || !this.state.purchaseName.length
                  }
                  color="primary"
                  type="submit"
                >
                  Save
                </Button>
              </React.Fragment>
            )}
          </StyledDialogActions>
        </form>
      </StyledDialog>
    );
  }
}

const PurchaseEditingDialog = connector(Component);

const StyledDialog = styled(Dialog as React.FunctionComponent<DialogProps>)`
  & .paper {
    margin: 20px;
  }
`;

const StyledDialogContent = styled(DialogContent as React.FunctionComponent<
  DialogContentProps
>)`
  && {
    padding-bottom: 10px;
  }
`;

const BougthSwitcherWrapper = styled(
  FormControlLabel as React.FunctionComponent<FormControlLabelProps>,
)`
  margin-top: 10px;
`;

const StyledDeleteButton = styled(Button as React.FunctionComponent<
  ButtonProps
>)`
  && {
    margin-right: auto;
  }
`;

const StyledDialogActions = styled(DialogActions as React.FunctionComponent<
  DialogActionsProps
>)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NumberFieldWrapper = styled('div')`
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

const NumberField = styled(TextField as React.FunctionComponent<any>)`
  width: 50px;

  & .input {
    text-align: center;
  }

  & .formHelper {
    text-align: center;
    margin: 8px -35px 0;
  }
`;

export const renderPurchaseEditingDialog = (dialogComponentProps: NeedProps) =>
  DialogRenderer.renderDialog({
    DialogComponent: PurchaseEditingDialog,
    dialogComponentProps,
  });
