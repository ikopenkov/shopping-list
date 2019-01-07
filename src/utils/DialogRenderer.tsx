import * as React from 'react';
import * as ReactDom from 'react-dom';
import { ReduxProvider } from 'src/core/ReduxProvider';
import { MaterialProvider } from 'src/core/MaterialProvider';

export interface IDialogProps {
  isOpened: boolean;
  onClose: () => any;
}

class Dialog<T> extends React.PureComponent<{
  dialogId: number;
  dialogComponentProps: T;
  DialogComponent: React.ComponentType<T & IDialogProps>;
}> {
  state = {
    isOpened: true,
  };

  private handleClose = () => {
    this.close();
  };

  private close = () => {
    // need this to avoid Warning: Can't call setState (or forceUpdate) on an unmounted component
    this.setState(
      {
        isOpened: false,
      },
      () => {
        // delay to finish animations before removing from DOM
        setTimeout(() => {
          _removeDialog(this.props.dialogId);
        }, 3000);
      },
    );
  };

  render() {
    const { dialogComponentProps = {}, DialogComponent } = this.props;
    return (
      // @ts-ignore
      <DialogComponent
        isOpened={this.state.isOpened}
        onClose={this.handleClose}
        {...dialogComponentProps}
      />
    );

    // React.createElement(DialogComponent, {
    //   // isOpened: this.state.isOpened,
    //   // onClose: this.handleClose,
    //   ...dialogComponentProps,
    // });
  }
}

const _removeDialog = (id: number) => {
  const target = document.getElementById(`dialog-as-method-renderer-${id}`);
  ReactDom.unmountComponentAtNode(target);
  target.parentNode.removeChild(target);
};

let idCounter = 0;

export const DialogRenderer = {
  renderDialog: <T extends {}>({
    DialogComponent,
    dialogComponentProps,
  }: {
    DialogComponent: React.ComponentType<T & IDialogProps>;
    dialogComponentProps: T;
  }) => {
    const divTarget = document.createElement('div');
    const id = idCounter++;
    divTarget.id = `dialog-as-method-renderer-${id}`;
    document.body.appendChild(divTarget);
    ReactDom.render(
      <ReduxProvider>
        <MaterialProvider>
          <Dialog<T & IDialogProps>
            DialogComponent={DialogComponent}
            dialogId={id}
            // @ts-ignore
            dialogComponentProps={dialogComponentProps}
          />
        </MaterialProvider>
      </ReduxProvider>,
      divTarget,
    );

    return () => _removeDialog(id);
  },
};
