import { styled } from 'components/StyledComponents/StyledComponents';
import { Colors } from 'src/constants/Colors';
import { StyleConstants } from 'src/constants/StyleConstants';

export const ListRow = styled('div')`
  padding: ${StyleConstants.rowPaddingTop} ${StyleConstants.rowPaddingLeft};
  min-height: ${StyleConstants.rowHeight};
  outline: none;
  border: 0;
  display: flex;
  align-items: center;
  width: 100%;
  background-color: ${Colors.white};
`;
