import * as React from 'react';
import { ReactNode } from 'react';
import { styled } from 'components/StyledComponents/StyledComponents';
import { ListRow } from 'components/StyledComponents/ListRow';
// import { withSize } from 'react-sizeme';
// import { TypeOfConnect } from 'utils/ReduxUtils';
import Button, { ButtonProps } from '@material-ui/core/Button';
import { CircularProgress } from '@material-ui/core';
import { CircularProgressProps } from '@material-ui/core/CircularProgress';

type ActionButtonProps = {
  color: string;
  backgroundColor: string;
  content: string | ReactNode;
  action: () => Promise<any>;
};

type OwnProps = {
  children: ReactNode;
  rightButtonProps?: ActionButtonProps;
  leftButtonProps?: ActionButtonProps;
  onClick: <T = any>() => T;
};

type State = {
  x: number;
  isSwiping: boolean;
  isActionPerforming: boolean;
};

type PointerEventHandler<T = void> = (
  event: React.PointerEvent<HTMLDivElement>,
) => T;

// const sizeConnector = withSize<OwnProps>({ monitorHeight: true });
// type Props = TypeOfConnect<typeof sizeConnector>;

class Component extends React.PureComponent<OwnProps, State> {
  state: State = {
    x: 0,
    isSwiping: false,
    isActionPerforming: false,
  };

  private isPointerDown = false;
  private previousX = 0;

  private handlePointerDown: PointerEventHandler = event => {
    this.isPointerDown = true;
    this.extractDeltaX(event);
    this.setState({
      isSwiping: true,
    });
  };

  private handlePointerUp: PointerEventHandler = event => {
    this.isPointerDown = false;

    const width = event.currentTarget.offsetWidth;

    let finalX = 0;

    if (this.state.x <= -width) {
      finalX = -width;
      this.performAction(this.props.rightButtonProps.action);
    } else if (this.state.x >= width) {
      finalX = width;
      this.performAction(this.props.leftButtonProps.action);
    }

    this.setState({
      x: finalX,
      isSwiping: false,
    });
  };

  private performAction = async (action: () => Promise<any>) => {
    this.setState({
      isActionPerforming: true,
    });

    await action();

    this.setState({ isActionPerforming: false, x: 0 });
  };

  private handlePointerMove: PointerEventHandler = event => {
    if (this.isPointerDown) {
      const deltaX = this.extractDeltaX(event);
      this.setState(({ x }) => ({
        x: x + deltaX,
      }));
    }
  };

  private extractDeltaX: PointerEventHandler<number> = event => {
    const x = event.pageX;
    const deltaX = x - this.previousX;
    this.previousX = x;
    return deltaX;
  };

  private renderActionButton = (
    props: ActionButtonProps,
    position: 'left' | 'right',
  ) => {
    const shouldRender =
      position === 'left' ? this.state.x > 0 : this.state.x < 0;

    if (shouldRender) {
      return (
        <ActionButton
          backgroundColor={props.backgroundColor}
          color={props.color}
          align={position}
        >
          {this.state.isActionPerforming ? (
            <StyledCircularProgress colorStyle={props.color} />
          ) : (
            props.content
          )}
        </ActionButton>
      );
    }
  };

  render() {
    return (
      <Wrapper>
        <Trigger
          onClick={this.props.onClick}
          onPointerDown={this.handlePointerDown}
          onPointerUp={this.handlePointerUp}
          onPointerCancel={this.handlePointerUp}
          onPointerMove={this.handlePointerMove}
          x={this.state.x}
          isSwiping={this.state.isSwiping}
        >
          <TriggerButton>{this.props.children}</TriggerButton>
        </Trigger>

        {this.props.leftButtonProps &&
          this.renderActionButton(this.props.leftButtonProps, 'left')}
        {this.props.rightButtonProps &&
          this.renderActionButton(this.props.rightButtonProps, 'right')}
      </Wrapper>
    );
  }
}

// export const SwipeActions = sizeConnector(Component);
export const SwipeActions = Component;

const Wrapper = styled('div')`
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
`;

type TriggerStyleProps = { x: number; isSwiping: boolean };

const Trigger = styled('div').attrs<TriggerStyleProps>(props => ({
  style: {
    transform: `translateX(${props.x}px)`,
  },
}))<TriggerStyleProps>`
  touch-action: pan-y;
  transition: ${props => (props.isSwiping ? 'none' : '0.1s')};
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 2;
  background-color: #fff;
`;

const TriggerButton = styled(Button as React.FunctionComponent<ButtonProps>)`
  && {
    border-radius: 0;
    width: 100%;
    text-align: left;
    text-transform: none;
    padding: 0;
  }
`;

type StyledActionButtonProps = Pick<
  ActionButtonProps,
  'color' | 'backgroundColor'
> & {
  align: 'left' | 'right';
};

const ActionButton = styled(ListRow)<StyledActionButtonProps>`
  ${(props: StyledActionButtonProps) => ``};
  background-color: ${props => props.backgroundColor};
  color: ${props => props.color};
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 1;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  box-shadow: inset 0 8px 6px -8px rgba(0, 0, 0, 0.2);
  justify-content: ${props =>
    props.align === 'left' ? 'flex-start' : 'flex-end'};
` as React.FunctionComponent<StyledActionButtonProps>;

type StyledCircularProgressProps = CircularProgressProps & {
  colorStyle: string;
};
const StyledCircularProgress = styled(CircularProgress).attrs({})<
  StyledCircularProgressProps
>`
  && {
    color: ${props => props.colorStyle};
    width: 30px !important;
    height: 30px !important;
  }
` as React.FunctionComponent<StyledCircularProgressProps>;
