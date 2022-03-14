import {Route, Redirect, RouteProps} from 'react-router';
import {useSelector} from 'react-redux';
import _ from 'lodash';
import {IStateType} from '../../store/models/root.interface';
import {IOnboardWizard} from '../../store/models/onBoardingWizard.interface';

export function OnBoardingWizardRoute({ children, ...res} : RouteProps): JSX.Element{
    const onBoarding : IOnboardWizard = useSelector((state: IStateType) => state.onboardingWizard);
    return(
        <Route
            render={() =>
                    <Redirect 
                    to={{pathname : "/signup"}} />
            }
        />
    )}