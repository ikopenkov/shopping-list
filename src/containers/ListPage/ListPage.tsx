import * as React from 'react';
import { GlobalState } from 'reducers/rootReducer';
import { ListActions } from 'modules/ListModule/ListActions';
import { connect, Dispatch } from 'react-redux';
import { Action, bindActionCreators } from 'redux';
import { TypeOfConnect, unboxThunk } from 'utils/ReduxUtils';
import styled from 'styled-components';
import { RouteComponentProps } from 'react-router-dom';
import { AppBar } from 'containers/AppBar/AppBar';
import { Loader } from 'components/Loader/Loader';
import { Purchase } from 'containers/ListPage/Components/Purchase';
import { ListRow } from 'components/StyledComponents/ListRow';
import { ListSelectors } from 'modules/ListModule/ListSelectors';
// import { Types } from 'utils/Types';
// import * as R from 'ramda';
// import { ListEntry } from 'api/ListApi/ListApiTypes';
// import { ListModuleState } from 'modules/ListModule/ListModuleTypes';

type OwnProps = RouteComponentProps<{ id: string }> & {};

const connector = connect(
  (state: GlobalState, ownProps: OwnProps) => ({
    ...ListSelectors.getModuleState(state),
    item: ListSelectors.getItemExtended(state, ownProps.match.params.id),
  }),
  (dispatch: Dispatch<Action>) =>
    bindActionCreators(
      {
        loadItems: ListActions.loadItems,
        deletePurchase: ListActions.deletePurchase,
        updatePurchase: ListActions.updatePurchase,
      },
      dispatch,
    ),
);

type Props = {} & OwnProps & TypeOfConnect<typeof connector>;

class Component extends React.PureComponent<Props> {
  componentDidMount(): void {
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
        <ListRow>
        
        </ListRow>
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
      />
    ));

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

// const ListName = styled.h2`
//   font-size: 16px;
//   font-weight: bold;
//   padding: 10px;
//   background-color: #eee;
// `;
//
// const Item = styled.button`
//   border: 0;
//   outline: none;
//   border-bottom: 1px solid lightgray;
//   padding: 5px 10px;
//   display: flex;
//   align-items: stretch;
//   width: 100%;
//   background-color: transparent;
// `;
//
// const ItemName = styled.input`
//   border: 0;
//   font-size: 14px;
//   flex: 1 1 auto;
//   outline: none;
//   margin-right: 10px;
//
//   :disabled {
//     color: #000;
//   }
//
//   :focus {
//   }
// `;
//
// const AttributesContainer = styled.div``;
// const Attribute = styled.div`
//   font-size: 12px;
//   color: dimgray;
//   text-align: right;
// `;
//
// const ItemsList = styled.div`
//   border-top: 1px solid lightgray;
// `;
