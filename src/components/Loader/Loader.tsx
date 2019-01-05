import * as React from 'react';
import styled from 'styled-components';
import CircularProgress from '@material-ui/core/CircularProgress';

export const Loader = (props: {} = {}) => {
  return (
    <Wrapper>
      <CircularProgress />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1 1 auto;
`
