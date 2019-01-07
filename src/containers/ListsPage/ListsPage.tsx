import * as React from 'react';
import { GlobalState } from 'reducers/rootReducer';
import { ListExtended, ListSelectors } from 'modules/ListModule/ListSelectors';
import { ListActions } from 'modules/ListModule/ListActions';
import { connect, Dispatch } from 'react-redux';
import { Action, bindActionCreators } from 'redux';
import { TypeOfConnect } from 'utils/ReduxUtils';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { ListRow } from 'components/StyledComponents/ListRow';

const connector = connect(
  (state: GlobalState) => ({
    ...ListSelectors.getModuleState(state),
    items: ListSelectors.getItemsExtendedSorted(state),
  }),
  (dispatch: Dispatch<Action>) =>
    bindActionCreators(
      {
        loadItems: ListActions.loadItemsSavingState,
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
      <StyledLink key={item._id} to={`/lists/${item._id}`}>
        <ListRow as="button">
          <ItemName value={item.name} disabled={!this.state.editMode} />
          <AttributesContainer>
            <Attribute>{item.purchases.length} items</Attribute>
            <Attribute>
              {item.customFields.createdAtMoment.format('DD.MM.YYYY HH:mm')}
            </Attribute>
          </AttributesContainer>
        </ListRow>
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

const AttributesContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
const Attribute = styled.div`
  font-size: 12px;
  line-height: 14px;
  color: dimgray;
  text-align: right;
`;

const ItemsList = styled.div`
  border-top: 1px solid lightgray;
`;
