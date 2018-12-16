import * as React from 'react';

import {
    connect,
    MapDispatchToPropsFunction,
    MapStateToProps,
    Dispatch,
} from 'react-redux';
import { GlobalState } from 'reducers/rootReducer';
import {Link} from "react-router-dom";

interface OwnProps {}

interface StateProps {}

interface DispatchProps {}

const mapStateToProps: MapStateToProps<
    StateProps,
    OwnProps,
    GlobalState
> = state => ({});

const mapDispatchToProps: MapDispatchToPropsFunction<
    DispatchProps,
    OwnProps
> = dispatch => ({});

interface Props extends OwnProps, DispatchProps, StateProps {}

class MainPageComponent extends React.Component<Props, {}> {
    componentDidMount() {}

    render() {
        const {} = this.props;
        return (
            <div>
                Shopping lists
                <Link to={'/lists/new'}>
                    <button>
                        Create list
                    </button>
                </Link>
            </div>
        );
    }
}

export const MainPage = connect(mapStateToProps, mapDispatchToProps)(
    MainPageComponent,
);
