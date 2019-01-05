import { styled } from 'components/StyledComponents/StyledComponents';
import { Colors } from 'src/constants/Colors';

export const ListRow = styled('div')`
  padding: 5px 10px;
  outline: none;
  border: 0;
  display: flex;
  align-items: center;
  min-height: 48px;
  width: 100%;
  background-color: ${Colors.white};
`;
