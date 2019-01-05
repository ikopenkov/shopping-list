import * as React from 'react';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Typography, { TypographyProps } from '@material-ui/core/Typography';
// import Button from '@material-ui/core/Button';
import MaterialAppBar, { AppBarProps } from '@material-ui/core/AppBar';
import styled from 'styled-components';

type OwnProps = {
  title: string;
};

export class AppBar extends React.PureComponent<OwnProps> {
  render() {
    return (
      <StyledMaterialAppBar elevation={1}>
        <IconButton color="inherit" aria-label="Menu">
          <MenuIcon />
        </IconButton>
        <Title variant="h6" color="inherit">
          {this.props.title}
        </Title>
        {/*<Button color="inherit">Login</Button>*/}
      </StyledMaterialAppBar>
    );
  }
}

const StyledMaterialAppBar = styled(MaterialAppBar as React.FunctionComponent<
  AppBarProps
>)`
  && {
    display: flex;
    flex-direction: row;
    position: static;
  }
`;

const Title = styled(Typography as React.FunctionComponent<TypographyProps>)`
  && {
    flex: 1 1 auto;
    display: flex;
    align-items: center;
  }
`;
