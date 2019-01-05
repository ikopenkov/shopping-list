import * as React from 'react';
import { ReactNode } from 'react';
import { styled } from 'components/StyledComponents/StyledComponents';
import { ListRow } from 'components/StyledComponents/ListRow';
import { withSize } from 'react-sizeme';
import { TypeOfConnect } from 'utils/ReduxUtils';

type ButtonProps = {
  color: string;
  backgroundColor: string;
  content: string | ReactNode;
  action: () => Promise<any>;
};

type OwnProps = {
  children: ReactNode;
  rightButtonProps?: ButtonProps;
  leftButtonProps?: ButtonProps;
};

type State = {
  x: number;
  isSwiping: boolean;
  isActionPerforming: boolean;
};

type PointerEventHandler<T = void> = (
  event: React.PointerEvent<HTMLDivElement>,
) => T;

const sizeConnector = withSize<OwnProps>({ monitorHeight: true });
type Props = TypeOfConnect<typeof sizeConnector>;

class Component extends React.PureComponent<Props, State> {
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

  render() {
    return (
      <Wrapper>
        <Trigger
          onPointerDown={this.handlePointerDown}
          onPointerUp={this.handlePointerUp}
          onPointerCancel={this.handlePointerUp}
          onPointerMove={this.handlePointerMove}
          x={this.state.x}
          isSwiping={this.state.isSwiping}
        >
          {this.props.children}
        </Trigger>

        {this.props.leftButtonProps && this.state.x > 0 && (
          <Button {...this.props.leftButtonProps} align={'left'}>
            {this.state.isActionPerforming
              ? 'Loading...'
              : this.props.leftButtonProps.content}
          </Button>
        )}

        {this.props.rightButtonProps && this.state.x < 0 && (
          <Button {...this.props.rightButtonProps} align={'right'}>
            {this.state.isActionPerforming
              ? 'Loading...'
              : this.props.rightButtonProps.content}
          </Button>
        )}
      </Wrapper>
    );
  }
}

export const SwipeActions = sizeConnector(Component);

const Wrapper = styled('div')`
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
`;

const Trigger = styled('div').attrs({
  style: (props: any) => ({
    transform: `translateX(${props.x}px)`,
  }),
})<{ x: number; isSwiping: boolean }>`
  touch-action: none;
  transition: ${props => (props.isSwiping ? 'none' : '0.1s')};
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 2;
  background-color: #fff;
`;

const Button = styled(ListRow)<
  ButtonProps & { align: 'left' | 'right' }
>`
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
`;
