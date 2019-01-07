import * as React from 'react';
import { GlobalState } from 'reducers/rootReducer';
import { ListActions } from 'modules/ListModule/ListActions';
import { connect, Dispatch } from 'react-redux';
import { Action, bindActionCreators } from 'redux';
import { TypeOfConnect } from 'utils/ReduxUtils';
import styled from 'styled-components';
import { RouteComponentProps } from 'react-router-dom';
import { AppBar } from 'containers/AppBar/AppBar';
import { Loader } from 'components/Loader/Loader';
import { Purchase } from 'containers/ListPage/Components/Purchase';
import { ListSelectors } from 'modules/ListModule/ListSelectors';
import { PurchaseAddingForm } from 'containers/PurchaseAddingForm/PurchaseAddingForm';
import { renderPurchaseEditingDialog } from 'containers/PurchaseEditingDialog/PurchaseEditingDialog';
// import { PurchaseEditingDialog } from 'containers/PurchaseEditingDialog/PurchaseEditingDialog';

type OwnProps = RouteComponentProps<{ id: string }> & {};

const connector = connect(
  (state: GlobalState, ownProps: OwnProps) => ({
    ...ListSelectors.getModuleState(state),
    item: ListSelectors.getItemExtended(state, ownProps.match.params.id),
  }),
  (dispatch: Dispatch<Action>) =>
    bindActionCreators(
      {
        loadItems: ListActions.loadItemsSavingState,
        deletePurchase: ListActions.deletePurchase,
        updatePurchase: ListActions.updatePurchase,
      },
      dispatch,
    ),
);

type Props = {} & OwnProps & TypeOfConnect<typeof connector>;

class Component extends React.PureComponent<Props> {
  componentDidMount() {
    this.props.loadItems();
  }

  private getTitle = () => {
    if (!this.props.isLoaded) {
      return 'Loading...';
    } else if (this.props.hasError) {
      return 'Error';
    } else if (!this.props.item) {
      return 'Not Found';
    } else {
      return this.props.item.name || 'Shopping List';
    }
  };

  private renderComponentBody = () => {
    if (this.props.hasError) {
      return <div>Error</div>;
    }
    if (this.props.isLoading || !this.props.isLoaded) {
      return <Loader />;
    }
    if (!this.props.item) {
      return (
        <div>Shopping list with id {this.props.match.params.id} not found</div>
      );
    }
    return (
      <React.Fragment>
        <PurchaseAddingForm listId={this.props.item._id} />
        {this.renderPurchases()}
      </React.Fragment>
    );
  };

  private renderPurchases = () =>
    this.props.item.purchases.map(purchase => (
      <Purchase
        purchase={purchase}
        key={purchase._id}
        deletePurchase={() =>
          this.props.deletePurchase(this.props.item._id, purchase._id)
        }
        markBought={() =>
          this.props.updatePurchase(this.props.item._id, purchase._id, {
            bought: true,
          })
        }
        unmarkBought={() =>
          this.props.updatePurchase(this.props.item._id, purchase._id, {
            bought: false,
          })
        }
        onClick={() => this.handlePurchaseClick(purchase._id)}
      />
    ));

  private handlePurchaseClick = (purchaseId: string) => {
    renderPurchaseEditingDialog({
      listId: this.props.item._id,
      purchaseId,
    });
  };

  render() {
    return (
      <Page>
        <AppBar title={this.getTitle()} />
        {this.renderComponentBody()}
      </Page>
    );
  }
}
export const ListPage = connector(Component);

const Page = styled.div`
  min-height: 100%;
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
`;
