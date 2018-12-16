import * as React from 'react';
import { GlobalState } from 'reducers/rootReducer';
import { ListModuleState } from 'modules/ListModule/ListModuleTypes';
import { ListExtended, ListSelectors } from 'modules/ListModule/ListSelectors';
import { ListActions } from 'modules/ListModule/ListActions';
import { Types } from 'utils/Types';
import { connect, Dispatch, MapStateToProps } from 'react-redux';
import * as R from 'ramda';
import { Action, bindActionCreators } from 'redux';
import { TypeOfConnect, unboxThunk } from 'utils/ReduxUtils';
import { ListEntry } from 'api/ListApi/ListApiTypes';
import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';

const connector = connect(
  (state: GlobalState) => ({
    ...ListSelectors.getModuleState(state),
    items: ListSelectors.getItemsExtendedSorted(state),
  }),
  (dispatch: Dispatch<Action>) =>
    bindActionCreators(
      {
        loadItems: ListActions.loadItems,
      },
      dispatch,
    ),
);

type Props = {} & TypeOfConnect<typeof connector>;

class Component extends React.PureComponent<Props> {
  state = {
    editMode: false,
  };

  componentDidMount(): void {
    this.props.loadItems();
  }

  private renderItems() {
    return <ItemsList>{this.props.items.map(this.renderItem)}</ItemsList>;
  }

  private renderItem = (item: ListExtended) => {
    return (
      <StyledLink to={`/lists/${item._id}`}>
        <Item key={item._id}>
          <ItemName value={item.name} disabled={!this.state.editMode} />
          <AttributesContainer>
            <Attribute>{item.purchases.length} items</Attribute>
            <Attribute>
              {item.customFields.createdAtMoment.format('DD.MM.YYYY HH:mm')}
            </Attribute>
          </AttributesContainer>
        </Item>
      </StyledLink>
    );
  };

  render() {
    if (this.props.hasError) {
      return <div>Error</div>;
    }
    if (this.props.isLoading || !this.props.isLoaded) {
      return <div>loading...</div>;
    }
    return this.renderItems();
  }
}
export const ListsPage = connector(Component);

const StyledLink = styled(Link)`
  text-decoration: none;
`;

const Item = styled.button`
  border: 0;
  outline: none;
  border-bottom: 1px solid lightgray;
  padding: 5px 10px;
  display: flex;
  align-items: stretch;
  width: 100%;
  background-color: transparent;
`;

const ItemName = styled.input`
  border: 0;
  font-size: 14px;
  flex: 1 1 auto;
  outline: none;
  margin-right: 10px;
  

  :disabled {
    color: #000;
  }

  :focus {
  }
`;

const AttributesContainer = styled.div``;
const Attribute = styled.div`
  font-size: 12px;
  color: dimgray;
  text-align:right;
`;

const ItemsList = styled.div`
  border-top: 1px solid lightgray;
`;
