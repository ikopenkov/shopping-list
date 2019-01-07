import * as React from 'react';
import { PurchaseEntry } from 'api/PurchaseApi/PurchaseApiTypes';
import styled, { css } from 'styled-components';
import { ListRow } from 'components/StyledComponents/ListRow';
import { SwipeActions } from 'components/SwipeActions/SwipeActions';
import { Colors } from 'src/constants/Colors';
import { Truncated } from 'components/StyledComponents/Truncated';
import DeleteIcon from '@material-ui/icons/DeleteOutline';
import DoneIcon from '@material-ui/icons/Done';
import UndoIcon from '@material-ui/icons/Undo';

export const Purchase = ({
  purchase,
  markBought,
  deletePurchase,
  unmarkBought,
  onClick,
}: {
  purchase: PurchaseEntry;
  markBought: () => Promise<any>;
  deletePurchase: () => Promise<any>;
  unmarkBought: () => Promise<any>;
  onClick: () => any;
}) => {
  return (
    <PurchaseWrapper>
      <SwipeActions
        rightButtonProps={{
          color: Colors.white,
          backgroundColor: Colors.dangerBg,
          content: <DeleteIcon />,
          action: deletePurchase,
        }}
        leftButtonProps={{
          color: Colors.white,
          backgroundColor: purchase.bought
            ? Colors.warningBg
            : Colors.successBg,
          content: purchase.bought ? <UndoIcon /> : <DoneIcon />,
          action: purchase.bought ? unmarkBought : markBought,
        }}
        onClick={onClick}
      >
        <PurchaseContent bought={purchase.bought}>
          <Name>{purchase.name}</Name>
          {purchase.number > 1 && <Number>{purchase.number}</Number>}
        </PurchaseContent>
      </SwipeActions>
    </PurchaseWrapper>
  );
};

const PurchaseWrapper = styled(ListRow)`
  padding: 0;
`;

const PurchaseContent = styled(ListRow)`
  border: 0;
  ${(props: { bought: boolean }) =>
    props.bought &&
    css`
      text-decoration: line-through;
      color: #ccc;
    `}
`;

const Name = styled(Truncated)`
  flex: 1 1 auto;
`;

const Number = styled.div`
  flex: 0 0 auto;
  margin-left: auto;
  padding-left: 10px;
`;
